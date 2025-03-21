import { create } from 'zustand';

export enum Themes {
  light = 'light',
  dark = 'dark',
}

const nextTheme: Record<Themes, Themes> = {
  [Themes.light]: Themes.dark,
  [Themes.dark]: Themes.light,
};

interface IThemeStore {
  theme: Themes;
  toggleTheme: () => void;
}

export const useThemeStore = create<IThemeStore>(set => ({
  theme: Themes.light,
  toggleTheme: () =>
    set(state => ({ ...state, theme: nextTheme[state.theme] })),
}));
