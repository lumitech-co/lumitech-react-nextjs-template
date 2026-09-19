import { beforeEach, describe, expect, it } from 'vitest';

import { Themes, useThemeStore } from 'shared/store/theme';

describe('useThemeStore', () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: Themes.light });
  });

  it('starts light', () => {
    expect(useThemeStore.getState().theme).toBe(Themes.light);
  });

  it('toggles back and forth', () => {
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().theme).toBe(Themes.dark);

    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().theme).toBe(Themes.light);
  });
});
