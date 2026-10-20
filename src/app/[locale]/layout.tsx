import type { ReactNode } from 'react';

import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Urbanist } from 'next/font/google';
import { notFound } from 'next/navigation';

import { Header } from 'features/layout/ui/header/header';
import { routing } from 'shared/lib/i18n/routing';
import { cn } from 'shared/lib/styles';
import { TanStackQueryProvider } from 'shared/providers/tanstack-query';

import 'app/styles/global.css';

const urbanist = Urbanist({
  subsets: ['latin'],
  variable: '--font-urbanist',
  weight: ['400', '500', '600', '700'],
});

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export const generateStaticParams = () =>
  routing.locales.map(locale => ({ locale }));

export const generateMetadata = async ({
  params,
}: Omit<Props, 'children'>): Promise<Metadata> => {
  const t = await getTranslations({
    locale: hasLocale(routing.locales, params.locale)
      ? params.locale
      : routing.defaultLocale,
    namespace: 'metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
  };
};

const LocaleLayout = ({ children, params }: Props) => {
  if (!hasLocale(routing.locales, params.locale)) {
    notFound();
  }

  setRequestLocale(params.locale);

  return (
    <html lang={params.locale}>
      <body
        className={cn(
          'bg-white text-gray-600 transition-all duration-1000 ease-in-out dark:bg-gray-600 dark:text-white',
          urbanist.className,
        )}
      >
        <NextIntlClientProvider>
          <TanStackQueryProvider>
            <Header />
            {children}
          </TanStackQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default LocaleLayout;
