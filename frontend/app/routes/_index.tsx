import {
  Container,
  Skeleton,
  SkeletonProps,
  Stack,
  StackProps,
} from "@mantine/core";
import { defer } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { apiClient } from "~/.server/client";
import { DefaultCard } from "~/components";

export function loader() {
  const messages = apiClient.getMessages();
  return defer({ messages });
}

export default function Index() {
  const { messages } = useLoaderData<typeof loader>();
  return (
    <Container>
      <Suspense
        fallback={
          <DefaultCard>
            <RepeatSkeleton count={3} />
          </DefaultCard>
        }
      >
        <Await resolve={messages}>
          {(messages) => {
            return messages.map((message) => (
              <div key={message.id}>{message.content}</div>
            ));
          }}
        </Await>
      </Suspense>
    </Container>
  );
}

type RepeatSkeleton = {
  count: number;
  skeletonProps?: SkeletonProps;
} & StackProps;

export function RepeatSkeleton({
  count,
  skeletonProps,
  ...stackProps
}: RepeatSkeleton) {
  return (
    <Stack {...stackProps}>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <DefaultSkeleton key={i} {...skeletonProps} />
        ))}
    </Stack>
  );
}

export function DefaultSkeleton({ ...skeletonProps }: SkeletonProps) {
  return (
    <Skeleton width="100%" height="1.356rem" radius="md" {...skeletonProps} />
  );
}
