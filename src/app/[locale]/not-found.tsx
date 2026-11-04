import { getTranslations } from 'next-intl/server';

import { Link } from 'shared/lib/i18n/navigation';

const NotFound = async () => {
  const t = await getTranslations('errors.notFound');

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-2xl font-semibold">{t('title')}</h1>
      <p>{t('description')}</p>
      <Link href="/" className="underline">
        {t('home')}
      </Link>
    </main>
  );
};

export default NotFound;
