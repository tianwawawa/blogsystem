// app/categories/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import PostList from '@/app/_components/PostList';

interface Props {
  params: { slug: string; name: string };
}
async function Detail({ params }: Props) {
  const param = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { data: posts, error } = await supabase.rpc('get_posts_by_category', {
    cat_id: param.slug,
    uid: user.id,
  });

  if (error || !posts) notFound();
  return <PostList posts={posts} heading={decodeURIComponent(param.name)} />;
}
export default function CategoryDetail({ params }: Props) {
  return <Detail params={params} />;
}
