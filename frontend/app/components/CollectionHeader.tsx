import { Badge, Group, Stack, Text } from '@mantine/core';
import { Collection } from '@prisma/client';
import { SerializeFrom } from '@remix-run/node';
import { Link, useLocation } from '@remix-run/react';
import { IconBook, IconUser } from '@tabler/icons-react';

type CollectionHeaderProps = {
  collection: SerializeFrom<Collection>;
};

export function CollectionHeader({ collection }: CollectionHeaderProps) {
  const userLink = `/${collection.username}`;
  const collectionLink = userLink + `/${collection.slug}`;
  const { pathname } = useLocation();
  const userGroup = (
    <Group>
      <IconUser />
      <Text fw="bold">{collection.username}</Text>
    </Group>
  );
  const collectionGroup = (
    <Group w="max-content">
      <IconBook />
      <Text fw={500}>{collection.name}</Text>
      <Badge>Public</Badge>
    </Group>
  );
  return (
    <Stack>
      {pathname != userLink ? (
        <Link to={userLink} style={{ width: 'max-content' }}>
          {userGroup}
        </Link>
      ) : (
        userGroup
      )}
      <CollectionName collection={collection} />
    </Stack>
  );
}

type CollectionNameProps = {
  collection: SerializeFrom<Collection>;
};

export function CollectionName({ collection }: CollectionNameProps) {
  const { pathname } = useLocation();
  const collectionLink = `/${collection.username}/${collection.slug}`;
  const collectionGroup = (
    <Group w="max-content">
      <IconBook />
      <Text fw={500}>{collection.name}</Text>
      <Badge>Public</Badge>
    </Group>
  );
  return pathname != collectionLink ? (
    <Link to={collectionLink} style={{ width: 'max-content' }}>
      {collectionGroup}
    </Link>
  ) : (
    collectionGroup
  );
}
