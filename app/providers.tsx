// app/providers.tsx
"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProviderProps } from "next-themes";
import { ThemeProvider as NextThemeProvider } from "next-themes";
interface ProvidersProps {
  children: React.ReactNode;
  themeProps: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <HeroUIProvider>
      <NextThemeProvider>{children}</NextThemeProvider>
    </HeroUIProvider>
  );
}
