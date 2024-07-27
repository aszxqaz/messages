import { ActionIcon, MantineColorScheme, useMantineColorScheme } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconMoon, IconSun } from '@tabler/icons-react';

export function ColorSchemeSwitcher() {
  const [storageValue, setStorageValue] = useLocalStorage<MantineColorScheme>({
    key: 'color-scheme',
    defaultValue: 'light',
  });
  const { setColorScheme } = useMantineColorScheme();

  const toggleColorScheme = () => {
    let theme: MantineColorScheme = 'light';
    if (storageValue == 'light') theme = 'dark';
    setStorageValue(theme);
    setColorScheme(theme);
  };

  return (
    <ActionIcon size="lg" variant="outline" onClick={toggleColorScheme}>
      {storageValue == 'dark' ? <IconSun /> : <IconMoon />}
    </ActionIcon>
  );
}
