// app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  // 处理 OAuth 错误
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(new URL(`/login?error=oauth_${error}`, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', request.url));
  }

  const supabase = await createClient();

  try {
    // 在服务端安全地交换code获取session
    // 自动设置正确的cookies
    // 建立完整的认证状态
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Code exchange error:', exchangeError);
      return NextResponse.redirect(new URL('/login?error=code_exchange_failed', request.url));
    }

    // 检查并创建用户资料（如果是首次登录）
    if (data.user) {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single();

      if (!existingProfile) {
        const { error: insertError } = await supabase.from('profiles').insert({
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name,
          avatar_url: data.user.user_metadata?.avatar_url,
          provider: 'github',
        });

        if (insertError) {
          console.error('Profile creation error:', insertError);
        }
      }
    }

    // 重定向
    const redirectTo = requestUrl.searchParams.get('redirectTo') || '/';
    return NextResponse.redirect(new URL(redirectTo, request.url));
  } catch (error) {
    console.error('Callback exception:', error);
    return NextResponse.redirect(new URL('/login?error=server_error', request.url));
  }
}
