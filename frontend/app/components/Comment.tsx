import { Avatar, Box, Group, Paper, Text } from '@mantine/core';
import { Comment, User } from '@prisma/client';
import { SerializeFrom } from '@remix-run/node';
import { getDateFromNow } from '~/time';
import { DefaultCard } from './ui';

type ItemCommentProps = {
  comment: SerializeFrom<Comment>;
  user: SerializeFrom<User>;
};

export function ItemComment({ comment, user }: ItemCommentProps) {
  return (
    <Group align="start">
      <Avatar mt="sm" src={null} />
      <DefaultCard flex={1} pos="relative" p={0}>
        <Paper py="sm" px="md" style={{ borderRadius: '8px 8px 0 0' }}>
          <Group>
            <Text span fw={600}>
              {user.username}
            </Text>
            <Text c="dimmed"> commented {getDateFromNow(comment.createdAt)}</Text>
          </Group>
        </Paper>
        <Box p="md">{comment.content}</Box>
      </DefaultCard>
    </Group>
  );
}
