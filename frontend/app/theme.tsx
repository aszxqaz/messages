"use client";

import { MantineColorScheme, MantineProvider } from "@mantine/core";
import { PropsWithChildren } from "react";
import useLocalStorageState from "use-local-storage-state";

export const COLOR_SCHEME_KEY = "color-scheme";

export function ThemeProvider({ children }: PropsWithChildren) {
  const [initialColorScheme] = useLocalStorageState<MantineColorScheme>(
    "color-scheme",
    {
      defaultValue: "light",
    }
  );

  return (
    <MantineProvider defaultColorScheme={initialColorScheme}>
      {children}
    </MantineProvider>
  );
}
