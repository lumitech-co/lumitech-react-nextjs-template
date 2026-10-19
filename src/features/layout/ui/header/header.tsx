'use client';

import { useEffect } from 'react';

import { useTranslations } from 'next-intl';

import { Themes, useThemeStore } from 'shared/store/theme';

import { LocaleSwitcher } from '../locale-switcher/locale-switcher';

export const Header = () => {
  const t = useTranslations('header.theme');
  const { theme, toggleTheme } = useThemeStore(state => state);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === Themes.dark);
  }, [theme]);

  return (
    <header className="flex justify-between p-2">
      <button type="button" onClick={toggleTheme}>
        {t(theme)}
      </button>
      <LocaleSwitcher />
    </header>
  );
};
