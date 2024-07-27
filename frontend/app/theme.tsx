'use client';

import { MantineColorScheme, MantineProvider } from '@mantine/core';
import React, { PropsWithChildren } from 'react';
import useLocalStorageState from 'use-local-storage-state';

export const COLOR_SCHEME_KEY = 'color-scheme';

// export function useColorTheme() {
//   const [storageVal, setStorageVal] = useLocalStorage<MantineColorScheme>({
//     key: 'color-scheme',
//     defaultValue: 'auto',
//   });
//   const { colorScheme: _colorScheme, setColorScheme: _setColorScheme } = useMantineColorScheme();

//   const setColorScheme = (scheme: MantineColorScheme) => {
//     setStorageVal(scheme);
//     _setColorScheme();
//   };
// }

export function ThemeProvider({ children }: PropsWithChildren) {
  const [initialColorScheme] = useLocalStorageState<MantineColorScheme>('color-scheme', {
    defaultValue: 'light',
  });

  return <MantineProvider defaultColorScheme={initialColorScheme}>{children}</MantineProvider>;
}
