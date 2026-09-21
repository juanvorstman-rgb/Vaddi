// src/theme/ThemeProvider.tsx
// The only way screens get tokens is useTheme(). No screen imports raw colours.
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import {
  darkColors,
  fontFamily,
  fontSize,
  hitTarget,
  lightColors,
  radii,
  spacing,
  typography,
  type ThemeTokens,
} from './tokens';

const ThemeContext = createContext<ThemeTokens | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const value = useMemo<ThemeTokens>(
    () => ({
      colors: isDark ? darkColors : lightColors,
      typography,
      spacing,
      radii,
      fontFamily,
      fontSize,
      hitTarget,
      isDark,
    }),
    [isDark],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeTokens {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme() must be used inside <ThemeProvider>.');
  }
  return ctx;
}
