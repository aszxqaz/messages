import { Center, CenterProps, Text } from '@mantine/core';
import { PropsWithChildren } from 'react';

export function TextNoContent({ children, ...centerProps }: PropsWithChildren & CenterProps) {
  return (
    <Center {...centerProps}>
      <Text fs="italic" c="dimmed">
        {children}
      </Text>
    </Center>
  );
}
