import { createClient } from '@/lib/supabase/server';
import PostList from './_components/PostList';
import Empty from './_components/Empty';
import { getTranslations } from 'next-intl/server';
export default async function HomeAsync() {
  const supabase = await createClient();
  const t = await getTranslations('homePage');
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return (
      <div>
        <Empty />
      </div>
    );

  const { data } = await supabase
    .from('posts')
    .select('*')
    .order('updated_at', { ascending: false });
  return <PostList posts={data ?? []} heading={t('header')} />;
}
