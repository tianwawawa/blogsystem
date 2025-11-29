import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils'; // tailwind 合并类名工具

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/'); // 支持 /categories/[slug] 也高亮
  return (
    <Link
      href={href}
      className={cn(
        'font-medium transition-colors',
        isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600 dark:text-white'
      )}
    >
      {children}
    </Link>
  );
}
