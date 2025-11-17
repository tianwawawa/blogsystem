import { getTranslations } from 'next-intl/server';

export default async function Loading() {
  const t = await getTranslations('settings');
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <span className="text-lg">{t('loading')}...</span>
    </div>
  );
}
