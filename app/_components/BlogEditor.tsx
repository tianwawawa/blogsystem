'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CreatableSelect from 'react-select/creatable';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import TipTapEditor from './TipTapEditor';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

interface OptionType {
  value: string;
  label: string;
}
interface FormData {
  title: string;
  date: string;
  creator: string;
  minutes: number;
  tags: OptionType[];
  picture: File | null;
  githublink?: string;
  content: string;
}

export default function BlogEditor({ blogParams }: { blogParams: string[] }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations('newBlog');
  const tUser = useTranslations('user');
  const tMessage = useTranslations('message');
  const [content, setContent] = useState('<p>Hello World！</p>');
  const blogParam = blogParams?.[0] || null;
  const isEdit = blogParam !== 'create';
  const options: OptionType[] = [
    { value: 'Web3', label: 'Web3' },
    { value: 'Next.js', label: 'Next.js' },
    { value: 'Javascript', label: 'Javascript' },
  ];
  const { control, handleSubmit, register, setValue } = useForm<FormData>();
  const supabase = createClient();
  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      const { data, error } = await supabase.from('posts').select('*').eq('id', blogParam).single();
      if (error) {
        toast.error('加载失败');
        return;
      }

      // 回填表单
      setValue('title', data.title);
      setValue('creator', data.creator);
      setValue('minutes', data.minutes);
      setValue('date', data.date);
      setValue('githublink', data.githublink ?? '');
      setContent(data.content);
      // 标签：把 JSON 字符串转回 react-select 格式
      const tags: OptionType[] = data.tags ? JSON.parse(data.tags) : [];
      setValue('tags', tags);
    };
    load();
  }, [blogParam, isEdit, setValue]);

  const onSubmit = async (formData: FormData) => {
    setIsLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.replace('/auth/login');
      return;
    }
    console.log('提交的表单数据：', formData);
    try {
      let coverImageUrl = null;
      const contents = (formData.picture as any)[0];
      if (contents) {
        const contents = (formData.picture as any)[0];
        const fileExt = contents.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `blog-covers/${fileName}`;
        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(filePath, contents);
        if (!uploadError) {
          const {
            data: { publicUrl },
          } = supabase.storage.from('blog-images').getPublicUrl(filePath);
          coverImageUrl = publicUrl;
        }
      }
      // 2. 组装数据
      const payload = {
        title: formData.title,
        content,
        creator: formData.creator,
        minutes: formData.minutes,
        githublink: formData.githublink,
        picture: coverImageUrl,
        tags: JSON.stringify(formData.tags),
        user_id: user.id,
        date: formData.date,
        published: true,
      };
      if (isEdit) {
        // ======= 更新 =======
        const { error } = await supabase.from('posts').update(payload).eq('id', blogParam);
        if (error) throw error;
      } else {
        console.log('直接插入文章数据到 posts 表-');
        // 3. 直接插入文章数据到 posts 表
        var { data: post, error } = await supabase
          .from('posts')
          .insert([payload])
          .select()
          .single();
        if (error) throw error;
      }
      const tagNames = formData.tags.map((t: OptionType) => t.label); // ['Web3','Rust']
      const postId = post.id || blogParam;
      // 3. 把标签名 → 分类 id（不存在则自动创建）
      const { data: cats } = (await supabase
        .from('categories')
        .select('id,name')
        .in('name', tagNames)) as any;
      const existIds = cats.map((c: any) => c.id);
      const toCreate = tagNames.filter((n) => !cats.some((c: any) => c.name === n));
      for (const name of toCreate) {
        const { data: newCat } = (await supabase
          .from('categories')
          .insert({ name, slug: name.toLowerCase() })
          .select('id')
          .single()) as any;
        existIds.push(newCat.id);
      }

      // 4. 批量写入中间表
      const rows = existIds.map((cId: any) => ({ post_id: postId, category_id: cId }));

      await supabase.from('post_categories').insert(rows);
      toast.success(tMessage('success'));
      router.push('/categories');
    } catch (error) {
      toast.error(tMessage('fail'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* 标题 */}
          <Field>
            <FieldLabel htmlFor="title" className="text-sm font-medium">
              {t('title')}
            </FieldLabel>
            <Input id="title" type="text" placeholder={t('title')} {...register('title')} />
          </Field>

          {/* 日期 */}
          <Field>
            <FieldLabel htmlFor="date" className="text-sm font-medium">
              {t('date')}
            </FieldLabel>
            <Input type="date" id="date" {...register('date')} />
          </Field>

          {/* 作者 */}
          <Field>
            <FieldLabel htmlFor="creator">{t('author')}</FieldLabel>
            <Input id="creator" type="text" placeholder={t('author')} {...register('creator')} />
          </Field>

          {/* 预计阅读时间（分钟） */}
          <Field>
            <FieldLabel htmlFor="minutes">{t('time')}</FieldLabel>
            <Input id="minutes" type="number" placeholder={t('time')} {...register('minutes')} />
          </Field>
          {/* 标签 */}
          <Field>
            <FieldLabel htmlFor="tags">{t('tags')}</FieldLabel>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <div className="border rounded-lg">
                  <CreatableSelect<OptionType, true>
                    {...field}
                    isMulti
                    isClearable
                    options={options}
                    placeholder={t('inputTags')}
                    onChange={(selected) => field.onChange(selected)}
                    value={field.value}
                  />
                </div>
              )}
            />
            <FieldDescription>{t('tagDescription')}</FieldDescription>
          </Field>

          {/* github连接 */}
          <Field>
            <FieldLabel htmlFor="githublink">{t('link')}</FieldLabel>
            <Input
              id="githublink"
              type="text"
              placeholder={tUser('placeholder', { placeholder: t('link') })}
              {...register('githublink')}
            />
          </Field>
          {/* 上传图片 */}
          <Field>
            <FieldLabel htmlFor="picture">{t('upload')}</FieldLabel>
            <Input id="picture" type="file" {...register('picture')} />
          </Field>
        </div>

        <Field className="w-full">
          <FieldLabel htmlFor="blog">{t('contents')}</FieldLabel>
          <TipTapEditor value={content} onChange={setContent} />
        </Field>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              {isEdit ? t('updating') : t('saving')}
            </>
          ) : isEdit ? (
            t('updateBtn')
          ) : (
            t('saveBtn')
          )}
        </Button>
      </form>
    </div>
  );
}
