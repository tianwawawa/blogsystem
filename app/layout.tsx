import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import AppShell from '@/app/_components/AppShell';
import { useLocale, useTranslations } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import { NextIntlClientProvider } from 'next-intl';
import { Toaster } from '@/components/ui/sonner';
import NextTopLoader from 'nextjs-toploader';
import Header from '@/app/_components/Header';
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'BLOG',
  description: '',
};

const geistSans = Geist({
  variable: '--font-geist-sans',
  display: 'swap',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = useLocale();
  const t = useTranslations('navigation');
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <AppShell>
          <NextIntlClientProvider locale={locale}>
            <Toaster position="top-right" swipeDirections={['top']} />
            <NextTopLoader color="#508ff4ff" height={3} showSpinner={false} />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="flex flex-col px-10 pt-[78px] min-h-screen justify-between">
                <Header />
                {children}
                <footer className="border-t py-6">
                  <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} {t('reserved')}
                  </div>
                </footer>
              </div>
            </ThemeProvider>
          </NextIntlClientProvider>
        </AppShell>
      </body>
    </html>
  );
}
