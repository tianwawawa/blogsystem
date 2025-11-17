'use client';
import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Menu, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from '@/app/auth/login/action';
import { createClient } from '@/lib/supabase/client';
import { Separator } from '@/components/ui/separator';
import NavLink from '@/app/_components/NavLink';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { setUserLocale } from '@/lib/locale';
import { Locale } from '@/i18n/config';
import { useTranslations, useLocale } from 'next-intl';

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const tNav = useTranslations('navigation');
  const tUser = useTranslations('user');
  const tSet = useTranslations('settings');
  const currentLocale = useLocale();

  function onChange(value: string) {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  }
  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setEmail(user?.email || '');
    };
    fetchUserData();
  }, []);

  async function handleLogout() {
    await logout();
    setEmail(null);
  }

  return (
    <nav className="flex items-center justify-between p-4 border-b bg-white fixed left-0 right-0 top-0 dark:bg-black z-50 shadow-md">
      <div className="flex items-center">
        <Avatar>
          <AvatarImage src="/avatar.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        {email && (
          <span className="text-gray-700 text-xs ml-4">
            {tUser('user')}:{email}
          </span>
        )}
      </div>
      {/* 桌面端导航 */}
      <div className="hidden md:flex items-center gap-6">
        <NavLink href="/">{tNav('home')}</NavLink>
        <NavLink href="/categories">{tNav('categories')}</NavLink>
        <NavLink href="/blog/edit/create">{tNav('newPost')}</NavLink>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Settings className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem className="flex justify-between">
              <p>{tSet('theme')}</p>
              <ThemeToggle />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Select defaultValue={currentLocale} onValueChange={(value) => onChange(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zh">中文</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </DropdownMenuItem>
            <Separator className="my-2" />
            {email ? (
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full font-medium text-black-400 text-center inline-block"
              >
                {tSet('logOut')}
              </Button>
            ) : (
              <Link
                href="/auth/login"
                className="w-full font-medium text-black-400 mx-2 text-center inline-block"
              >
                {tSet('logIn')}
              </Link>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col gap-4 mt-8" onClick={() => setOpen(false)}>
              <Link href="/" className="text-lg font-medium">
                {tNav('home')}
              </Link>
              <Link href="/categories" className="text-lg font-medium">
                {tNav('categories')}
              </Link>
              <Link href="/blog/edit/create" className="text-lg font-medium">
                {tNav('newPost')}
              </Link>
              {email ? (
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full font-medium text-black-400 text-center inline-block"
                >
                  {tSet('logOut')}
                </Button>
              ) : (
                <Link
                  href="/auth/login"
                  className="w-full font-medium text-black-400 mx-2 text-center inline-block"
                >
                  {tSet('logIn')}
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
