const TOKEN_KEY = 'access_token';

export const tokenStorage = {
  get: (): string | null => {
    if (typeof window === 'undefined') {
      return null;
    }

    return localStorage.getItem(TOKEN_KEY);
  },
  set: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clear: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },
};
