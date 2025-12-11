'use client';

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      themes={['light', 'dark', 'dark-ocean', 'dark-crimson']}
      storageKey="ou-global-theme"
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
