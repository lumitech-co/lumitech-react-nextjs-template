'use client';

import { useTranslations } from 'next-intl';

type Props = {
  retry: () => void;
};

export const RouteError = ({ retry }: Props) => {
  const t = useTranslations('errors.route');

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-2xl font-semibold">{t('title')}</h1>
      <p>{t('description')}</p>
      <button
        type="button"
        onClick={retry}
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        {t('retry')}
      </button>
    </main>
  );
};
