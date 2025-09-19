import { useEffect } from 'react';

import useAppStore from '~/stores/appStore.ts';
import { Theme } from './types/commonTypes.ts';

function ThemeSetter() {
  const { theme } = useAppStore((state) => state);

  const toggleBodyDarkTheme = (mode: Exclude<Theme, 'system'>) => {
    document.body.classList.toggle('dark', mode === 'dark');
  };

  useEffect(() => {
    // Apply the theme on mount or when the theme changes
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      toggleBodyDarkTheme(systemTheme);
    } else {
      toggleBodyDarkTheme(theme);
    }

    // Listen for changes in the theme preference
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        toggleBodyDarkTheme(e.matches ? 'dark' : 'light');
      };
      mediaQuery.addEventListener('change', handleChange);

      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [theme]);

  return null;
}

export default ThemeSetter;
