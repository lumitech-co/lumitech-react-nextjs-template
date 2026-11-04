import type { Locale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ locale: Locale }>;
};

/**
 * Next renders `[locale]/not-found.tsx` only for an explicit `notFound()`, so
 * an unknown path needs this catch-all to get the localized 404.
 */
const CatchAllPage = async ({ params }: Props) => {
  const { locale } = await params;

  setRequestLocale(locale);
  notFound();
};

export default CatchAllPage;
