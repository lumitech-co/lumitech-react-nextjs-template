'use client';

import { useEffect } from 'react';

import { Themes, useThemeStore } from 'shared/store';

const themeBtnTitle: Record<Themes, string> = {
  [Themes.dark]: 'Dark',
  [Themes.light]: 'Light',
};

export const Header = () => {
  const { theme, toggleTheme } = useThemeStore(state => state);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === Themes.dark);
  }, [theme]);

  return (
    <header className="p-2">
      <button type="button" onClick={toggleTheme}>
        {themeBtnTitle[theme]}
      </button>
    </header>
  );
};
