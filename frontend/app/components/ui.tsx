import { Card, CardProps } from '@mantine/core';
import { PropsWithChildren } from 'react';

export function DefaultCard({ children, ...props }: CardProps & PropsWithChildren) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder {...props}>
      {children}
    </Card>
  );
}
