import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import BlogEditor from '@/app/_components/BlogEditor';
import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';

// 创建异步认证组件
async function AuthWrapper({ authParams }: { authParams: string[] }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return <BlogEditor blogParams={authParams} />;
}

export default async function EditBlogPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const t = await getTranslations('settings');
  return (
    <Suspense fallback={<div>{t('loading')}...</div>}>
      <AuthWrapper authParams={slug} />
    </Suspense>
  );
}
