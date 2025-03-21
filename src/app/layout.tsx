import { ReactNode } from 'react';

import type { Metadata } from 'next';
import { Urbanist } from 'next/font/google';

import { Header } from 'features';
import { cn } from 'shared/lib';
import { TanStackQueryProvider } from 'shared/providers';

import 'app/styles/global.css';

const urbanist = Urbanist({
  subsets: ['latin'],
  variable: '--font-urbanist',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Lumitech | Next.js Template',
  description:
    "This Next.js template provides a ready-to-use setup for building fast, scalable web apps. It's recommended for all web projects, even if SEO isn't a priority, as Next.js offers many valuable built-in tools.",
};

type Props = {
  children: ReactNode;
};

const RootLayout = ({ children }: Props) => {
  return (
    <html lang="en">
      <body
        className={cn(
          'bg-white text-gray-600 transition-all duration-1000 ease-in-out dark:bg-gray-600 dark:text-white',
          urbanist.className,
        )}
      >
        <TanStackQueryProvider>
          <Header />
          {children}
        </TanStackQueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
