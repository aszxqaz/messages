import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './styles.css';

import {
  AppShell,
  Box,
  ColorSchemeScript,
  Group,
  MantineProvider,
  Space
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from '@remix-run/react';
import { ColorSchemeSwitcher } from '~/ColorSchemeSwitcher';
import { Logo } from '~/components/Logo';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}


export default function App() {

  return (
    <MantineProvider defaultColorScheme={'auto'}>
      <Notifications />
      <AppShell padding="md">
        <AppShell.Header pos="relative">
          <Group p="md" justify="space-between">
            <Group>
              <Box visibleFrom="sm">
                <Link to="/">
                  <Box c="blue" w="10rem">
                    <Logo />
                  </Box>
                </Link>
              </Box>
            </Group>
            <Group>
              <ColorSchemeSwitcher />
            </Group>
          </Group>
        </AppShell.Header>
        <AppShell.Main pt="xl">
          <Outlet />
          <Space h="3rem" />
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}
