'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from './schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { useState } from 'react';
import { emailLogin, githubLogin } from './action';

export function LoginForm() {
  const router = useRouter();
  const tUser = useTranslations('user');
  const tSet = useTranslations('settings');
  const tMessage = useTranslations('message');
  const [isLoading, setIsLoading] = useState(false);
  /**
   * resolver: zodResolver(loginSchema) 的作用就是：
     使用 Zod 验证模式 (loginSchema) 自动验证表单数据
     当用户输入不符合规则时，会自动设置错误信息
     错误信息会显示在对应的表单字段中
   */
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    try {
      const result = await emailLogin(data);
      if (result.user) {
        console.log(tMessage('success'));
        router.replace('/');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.log('error');
      toast.error(tUser('loginFail'));
    } finally {
      setIsLoading(false);
    }
  }

  async function signInWithGithub() {
    const result = await githubLogin(location.origin);
    if (result.succes) {
      // 如果成功，重定向到 GitHub 授权页面
      router.replace(result.data.url);
    } else {
      toast.error(result.error || tUser('loginFail'));
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{tUser('admin')}</CardTitle>
        <CardDescription>{tUser('loginDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* 邮箱字段 */}
          <Field className="space-y-2">
            <FieldLabel htmlFor="email" className="text-sm font-medium">
              {tUser('email')}
            </FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder={tUser('placeholder', { placeholder: tUser('email') })}
              {...form.register('email')}
              disabled={isLoading}
              className={form.formState.errors.email ? 'border-red-500' : ''}
            />
            {form.formState.errors.email && (
              <FieldError className="text-red-500 text-xs">
                {form.formState.errors.email.message}
              </FieldError>
            )}
          </Field>

          {/* 密码字段 */}
          <Field className="space-y-2">
            <FieldLabel htmlFor="password" className="text-sm font-medium">
              {tUser('password')}
            </FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder={tUser('placeholder', { placeholder: tUser('password') })}
              {...form.register('password')}
              disabled={isLoading}
              className={form.formState.errors.password ? 'border-red-500' : ''}
            />
            {form.formState.errors.password && (
              <FieldError className="text-red-500 text-xs">
                {form.formState.errors.password.message}
              </FieldError>
            )}
          </Field>

          {/* 登录按钮 */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {tUser('loading')}
              </>
            ) : (
              tSet('logIn')
            )}
          </Button>
        </form>
        {/* GitHub 登录按钮 */}
        <Button
          onClick={signInWithGithub}
          variant="outline"
          className="w-full mt-3"
          disabled={isLoading}
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
              clipRule="evenodd"
            />
          </svg>
          {tUser('githubLogin')}
        </Button>
        {/* 提示信息 */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">{tUser('githubAuthorize')}</p>
        </div>
      </CardContent>
    </Card>
  );
}
