import type { ReactNode } from 'react';

import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Urbanist } from 'next/font/google';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { env } from 'env';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { Header } from 'features/layout/ui/header/header';
import { routing } from 'shared/lib/i18n/routing';
import { cn } from 'shared/lib/styles';
import { TanStackQueryProvider } from 'shared/providers/tanstack-query';
import { ThemeProvider } from 'shared/providers/theme';

import 'app/styles/global.css';

const urbanist = Urbanist({
  subsets: ['latin'],
  variable: '--font-urbanist',
  weight: ['400', '500', '600', '700'],
});

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export const generateMetadata = async ({
  params,
}: Omit<Props, 'children'>): Promise<Metadata> => {
  const { locale: requested } = await params;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  const t = await getTranslations({
    locale,
    namespace: 'metadata',
  });

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
    title: t('title'),
    description: t('description'),
    icons: '/icons/favicon.svg',
    openGraph: {
      type: 'website',
      locale,
      title: t('title'),
      description: t('description'),
    },
  };
};

const LocaleLayout = async ({ children, params }: Props) => {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const nonce = (await headers()).get('x-nonce') ?? undefined;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          'bg-white text-gray-600 transition-all duration-1000 ease-in-out dark:bg-gray-600 dark:text-white',
          urbanist.className,
        )}
      >
        <NextIntlClientProvider>
          <NuqsAdapter>
            <ThemeProvider nonce={nonce}>
              <TanStackQueryProvider>
                <Header />
                {children}
              </TanStackQueryProvider>
            </ThemeProvider>
          </NuqsAdapter>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default LocaleLayout;
