// app/providers.tsx
"use client";

import { HeroUIProvider } from "@heroui/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProviderProps } from "next-themes";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";
interface ProvidersProps {
  children: React.ReactNode;
  themeProps: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemeProvider>
        <SessionProvider>{children}</SessionProvider>
      </NextThemeProvider>
    </HeroUIProvider>
  );
}
