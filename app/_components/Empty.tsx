import { Bell } from 'lucide-react';
import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { getTranslations } from 'next-intl/server';
export default async function EmptyMuted() {
  const t = await getTranslations('message');
  return (
    <Empty className="from-muted/50 to-background h-full bg-gradient-to-b from-30%">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Bell />
        </EmptyMedia>
        <EmptyTitle>{t('unauthorized')}</EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        <a href="/auth/login" className="text-blue-800">
          {t('tologin')}
        </a>
      </EmptyContent>
    </Empty>
  );
}
