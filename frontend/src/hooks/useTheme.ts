import { useEffect, useState, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

type Theme = 'light' | 'dark' | 'system';

export const useTheme = () => {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Helper function to update the DOM and state
    const updateTheme = (t: 'light' | 'dark') => {
      setResolvedTheme(t);
      root.classList.remove('light', 'dark');
      root.classList.add(t);
      root.setAttribute('data-theme', t);
    };

    const resolveAndApply = () => {
      if (theme === 'system') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        updateTheme(systemTheme);
      } else {
        updateTheme(theme);
      }
    };

    // Initial run
    resolveAndApply();

    // Listener for system changes
    const handleChange = () => {
      if (theme === 'system') {
        resolveAndApply();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
    
    // Added setResolvedTheme to dependencies to satisfy the linter
  }, [theme, setResolvedTheme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  }, [setTheme]);

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };
};