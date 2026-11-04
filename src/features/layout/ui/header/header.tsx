'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import { LocaleSwitcher } from '../locale-switcher/locale-switcher';

export const Header = () => {
  const t = useTranslations('header.theme');
  const { resolvedTheme, setTheme } = useTheme();

  const handleToggle = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="flex justify-between p-2">
      <button type="button" onClick={handleToggle}>
        <span className="dark:hidden">{t('light')}</span>
        <span className="hidden dark:inline">{t('dark')}</span>
      </button>
      <LocaleSwitcher />
    </header>
  );
};
