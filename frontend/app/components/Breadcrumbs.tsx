import { Box, BoxProps, Flex, Skeleton, Text } from '@mantine/core';
import { Await, Link, useLocation } from '@remix-run/react';
import { IconChevronRight } from '@tabler/icons-react';
import { Suspense } from 'react';
import { joined } from '~/utils';

type BreadcrumbsProps = {
  promise?: Promise<unknown>;
} & BoxProps;

export function Breadcrumbs({ promise, ...boxProps }: BreadcrumbsProps) {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(s => s);
  const links = segments
    .reduce((acc, seg) => [...acc, `${acc[acc.length - 1] || ''}/${seg}`], [] as string[])
    .map((link, i, arr) =>
      i != arr.length - 1 ? (
        <Link key={link} to={link}>
          {segments[i]}
        </Link>
      ) : (
        <Text key={link}>{segments[i]}</Text>
      ),
    );
  return (
    <Box {...boxProps}>
      <Suspense fallback={<BreadcrumbsFallback count={links.length} />}>
        <Await resolve={promise}>
          {data => {
            if (!data) return null;
            return (
              <Flex wrap="wrap">
                {joined(links, i => (
                  <Box mx="sm" key={`sep-${i}`}>
                    <IconChevronRight />
                  </Box>
                ))}
              </Flex>
            );
          }}
        </Await>
      </Suspense>
    </Box>
  );
}

function BreadcrumbsFallback({ count }: { count: number }) {
  const skeletons = Array(count)
    .fill(0)
    .map((_, i) => <Skeleton key={i} mb="xs" width="4rem" height="1.356rem" radius="md" />);
  return (
    <Flex wrap="wrap">
      {joined(skeletons, i => (
        <Box mx="sm" key={`icon-${i}`}>
          <IconChevronRight />
        </Box>
      ))}
    </Flex>
  );
}
