import PostAsync from './PostAsync';
import { use } from 'react';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function BlogDetailPage({ params }: Props) {
  const { slug } = use(params);
  return <PostAsync slug={slug} />;
}
