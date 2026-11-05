'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => { },
  setTheme: () => { },
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');

  const applyTheme = (t: Theme) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (t === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('clothspace_theme') as Theme | null;
    let initial: Theme = 'light';
    if (saved === 'dark' || saved === 'light') {
      initial = saved;
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      initial = prefersDark ? 'dark' : 'light';
    }
    applyTheme(initial);
    queueMicrotask(() => {
      setThemeState(initial);
    });
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem('clothspace_theme', t);
    applyTheme(t);
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
