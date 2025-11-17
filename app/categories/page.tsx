import { createClient } from '@/lib/supabase/server'; // 服务端客户端
import Link from 'next/link';
import Empty from '@/app/_components/Empty';
import { getTranslations } from 'next-intl/server';

import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
export default async function Categories() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return (
      <div>
        <Empty />
      </div>
    );

  const t = await getTranslations('categories');
  const { data: categories, error } = await supabase.rpc('get_category_stats');
  return (
    <div>
      <h3 className="text-1xl font-bold mb-4">{t('title')}</h3>
      <div className="grid grid-cols-4 gap-4">
        {categories?.map(
          ({ id, name, article_count }: { id: string; name: string; article_count: number }) => {
            return (
              <Item key={id} variant="outline" className="hover:shadow-xl cursor-pointer">
                <Link href={`/categories/${id}/${name}`}>
                  <ItemContent>
                    <ItemTitle>{name}</ItemTitle>
                    <ItemDescription>共{article_count}篇文章</ItemDescription>
                  </ItemContent>
                </Link>
              </Item>
            );
          }
        )}
      </div>
    </div>
  );
}
