import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import BlogDetailPageClient from './BlogDetailPageClient';

export default async function PostAsync({ slug }: { slug: string }) {
  const supabase = await createClient();
  const { data: post } = await supabase.from('posts').select('*').eq('id', slug).single();
  if (!post) notFound();
  return <BlogDetailPageClient post={post} />;
}
