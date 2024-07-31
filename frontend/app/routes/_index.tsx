import {
  ActionIcon,
  Alert,
  Button,
  Card,
  Container,
  Divider,
  Select,
  Skeleton,
  SkeletonProps,
  Stack,
  StackProps,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { ActionFunctionArgs } from "@remix-run/node";
import { Await, useRevalidator } from "@remix-run/react";
import { IconRefresh, IconX } from "@tabler/icons-react";
import { Suspense, useEffect, useRef } from "react";
import {
  typeddefer,
  typedjson,
  useTypedFetcher,
  useTypedLoaderData,
} from "remix-typedjson";
import { apiClient } from "~/.server/client";
import { Message } from "~/.server/domain";
import { formatPrettyDate } from "~/time";

export function loader() {
  const response = apiClient.getMessages();
  return typeddefer({ response });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const content = String(formData.get("content"));
  const delay = Number(formData.get("delay"));
  const res = await apiClient.postMessage(content, delay);
  return typedjson(res);
}

export default function Index() {
  const { response } = useTypedLoaderData<typeof loader>();

  return (
    <Container size="sm">
      <Suspense
        fallback={
          <Card>
            <RepeatSkeleton count={3} />
          </Card>
        }
      >
        <Await resolve={response}>
          {(loaderData) => {
            if (loaderData.error) {
              return <ErrorWidget message={loaderData.error} />;
            } else if (loaderData.messages) {
              return <MessagesWidget messages={loaderData.messages} />;
            }
          }}
        </Await>
      </Suspense>
    </Container>
  );
}

function MessagesWidget({ messages }: { messages: Message[] }) {
  const actionFetcher = useTypedFetcher<typeof action>();
  const revalidator = useRevalidator();

  const contentRef = useRef<HTMLInputElement>(null);
  const delayRef = useRef<HTMLInputElement>(null);

  const isLoading = actionFetcher.state != "idle";

  useEffect(() => {
    if (actionFetcher.data?.message) {
      revalidator.revalidate;
      if (contentRef.current) {
        contentRef.current.value = "";
      }
      if (delayRef.current) {
        delayRef.current.value = "";
      }
    }
  }, [actionFetcher.data]);

  return (
    <Stack>
      <ActionIcon
        ml="auto"
        variant="transparent"
        aria-label="Settings"
        loading={revalidator.state != "idle"}
        onClick={() => {
          revalidator.revalidate();
        }}
      >
        <IconRefresh size="48" />
      </ActionIcon>
      {messages.length == 0 ? (
        <Text fs="italic">No messages yet.</Text>
      ) : (
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Content</Table.Th>
              <Table.Th>Processing delay (ms)</Table.Th>
              <Table.Th>Processed</Table.Th>
              <Table.Th>Created</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {messages.map((m) => (
              <Table.Tr key={m.id}>
                <Table.Td>{m.id}</Table.Td>
                <Table.Td>{m.content}</Table.Td>
                <Table.Td>{m.processingDelayMs}</Table.Td>
                <Table.Td>{m.processed.toString()}</Table.Td>
                <Table.Td>{formatPrettyDate(m.createdAt)}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
      <Divider />
      <actionFetcher.Form method="post">
        <Stack gap="md">
          <TextInput
            ref={contentRef}
            label="Message content"
            name="content"
            disabled={isLoading}
          />
          <Select
            ref={delayRef}
            name="delay"
            label="Processing delay (ms)"
            defaultValue="2000"
            data={["0", "1000", "2000", "5000", "10000"]}
            disabled={isLoading}
          />
          {actionFetcher.data?.error && (
            <Text c="red">{actionFetcher.data?.error}</Text>
          )}
          <Button type="submit" loading={isLoading}>
            Send
          </Button>
        </Stack>
      </actionFetcher.Form>
    </Stack>
  );
}

function ErrorWidget({ message }: { message: string }) {
  const icon = <IconX />;
  return (
    <Alert variant="light" color="red" title="Error" icon={icon}>
      {message}
    </Alert>
  );
}

type RepeatSkeletonProps = {
  count: number;
  skeletonProps?: SkeletonProps;
} & StackProps;

export function RepeatSkeleton({
  count,
  skeletonProps,
  ...stackProps
}: RepeatSkeletonProps) {
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
