// app/auth/login/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { type LoginFormData } from './schema';

export async function emailLogin(formData: LoginFormData) {
  const supabase = await createClient();

  try {
    // 使用 Supabase 进行认证
    const { data } = await supabase.auth.signInWithPassword(formData);
    if (!data.user) {
      return { message: '登录失败' };
    }
    // 返回成功，客户端会自动处理重定向
    return {
      success: true,
      message: '登录成功',
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    };
  } catch (error) {
    console.error('Login exception:', error);
    return { error: '登录失败，请重试' };
  }
}

// app/auth/login/actions.ts
export async function githubLogin() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });

    if (error) {
      console.error('GitHub OAuth error:', error);
      return { error: 'GitHub 登录初始化失败' };
    }

    return {
      succes: true,
      data,
    };
  } catch (error) {
    console.error('GitHub login exception:', error);
    return { error: 'GitHub 登录失败' };
  }
}

export async function logout() {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error);
    }
  } catch (error) {
    console.error('Logout exception:', error);
  } finally {
    // 总是重定向到登录页
    redirect('/auth/login');
  }
}
