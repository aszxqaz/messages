import { Center, Stack, Title } from '@mantine/core';
import { Await } from '@remix-run/react';
import { Icon, IconMoodSadSquint, IconProps } from '@tabler/icons-react';
import {
  ForwardRefExoticComponent,
  PropsWithChildren,
  ReactNode,
  RefAttributes,
  Suspense,
} from 'react';

type ServerMessageProps = {
  icon?: ReactNode | ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
  message: Promise<string | null>;
};

function isComponent(
  icon: ReactNode | ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>,
): icon is ForwardRefExoticComponent<IconProps & RefAttributes<Icon>> {
  return typeof icon == 'function';
}

export function ServerMessage({
  icon = IconMoodSadSquint,
  message,
}: ServerMessageProps & PropsWithChildren) {
  // let IconComponent: ReactNode | ForwardRefExoticComponent<IconProps & RefAttributes<Icon>> | null;
  // if (isComponent) {
  //   IconComponent = icon as ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
  // }

  const IconComponent = icon;

  return (
    <Suspense>
      <Await resolve={message}>
        {message =>
          message && (
            <Center h="50vh">
              <Stack align="center">
                {isComponent(IconComponent) ? <IconComponent size={96} /> : (icon as ReactNode)}
                <Title fz="h3" style={{ textAlign: 'center' }}>
                  {message}
                </Title>
              </Stack>
            </Center>
          )
        }
      </Await>
    </Suspense>
  );
}
