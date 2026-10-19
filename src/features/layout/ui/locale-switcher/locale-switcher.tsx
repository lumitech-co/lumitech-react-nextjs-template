'use client';

import { useTransition } from 'react';

import { Locale, useLocale, useTranslations } from 'next-intl';

import { usePathname, useRouter } from 'shared/lib/i18n/navigation';
import { routing } from 'shared/lib/i18n/routing';
import { cn } from 'shared/lib/styles';

const localeLabels: Record<Locale, string> = {
  en: 'EN',
  uk: 'UA',
};

export const LocaleSwitcher = () => {
  const t = useTranslations('header');
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleSwitch = (locale: Locale) => {
    startTransition(() => {
      router.replace(pathname, { locale });
    });
  };

  return (
    <div role="group" aria-label={t('language')} className="flex gap-1">
      {routing.locales.map(locale => (
        <button
          key={locale}
          type="button"
          lang={locale}
          aria-pressed={locale === currentLocale}
          disabled={isPending || locale === currentLocale}
          onClick={() => handleSwitch(locale)}
          className={cn(
            'rounded px-2 py-1 text-sm',
            locale === currentLocale && 'bg-blue-600 text-white',
          )}
        >
          {localeLabels[locale]}
        </button>
      ))}
    </div>
  );
};
