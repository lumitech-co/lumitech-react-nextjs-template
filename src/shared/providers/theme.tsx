'use client';

import type { PropsWithChildren } from 'react';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

type Props = PropsWithChildren<{
  nonce?: string;
}>;

/**
 * next-themes stores the choice and sets the `dark` class from an inline script
 * before the first paint, so a reload does not flash the wrong theme. That
 * script is why it needs the CSP nonce.
 */
export const ThemeProvider = ({ children, nonce }: Props) => (
  <NextThemesProvider attribute="class" enableSystem nonce={nonce}>
    {children}
  </NextThemesProvider>
);
