import { ReactNode } from 'react';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Providers } from './providers';

import 'app/styles/global.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Iron Blue · Equity Research Platform',
  description:
    'Iron Blue ingests the live STOXX 600 universe, screens it against your house rules, retrieves and parses 3-year annual reports, and populates your scoring template — flagging only the rows that need a human eye.',
};

type Props = {
  children: ReactNode;
};

const RootLayout = ({ children }: Props) => {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
