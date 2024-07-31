import {
  ActionIcon,
  Alert,
  Card,
  Container,
  Divider,
  Skeleton,
  SkeletonProps,
  Stack,
  StackProps,
  Table,
} from "@mantine/core";
import { Await, useFetcher, useRevalidator } from "@remix-run/react";
import { IconRefresh, IconX } from "@tabler/icons-react";
import { Suspense, useRef, useState } from "react";
import { typeddefer, useTypedLoaderData } from "remix-typedjson";
import { apiClient } from "~/.server/client";
import { Statistics } from "~/.server/domain";

export function loader() {
  const response = apiClient.getStatistics();
  return typeddefer({ response });
}

export default function StatisticsPage() {
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
            } else if (loaderData.statistics) {
              return <StatisticsWidget statistics={loaderData.statistics} />;
            }
          }}
        </Await>
      </Suspense>
    </Container>
  );
}

function StatisticsWidget({ statistics }: { statistics: Statistics }) {
  const [currentStatistics, setCurrentStatistics] = useState(statistics);
  const refreshFetcher = useFetcher<{ statistics: Statistics }>();
  const revalidator = useRevalidator();

  const contentRef = useRef<HTMLInputElement>(null);
  const delayRef = useRef<HTMLInputElement>(null);

  //   useEffect(() => {
  //     if (refreshFetcher.data?.messages) {
  //       // @ts-ignore
  //       setCurrentMessages(refreshFetcher.data.messages);
  //     }
  //   }, [refreshFetcher.data]);

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
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Total messages</Table.Th>
            <Table.Th>Processed messages</Table.Th>
            <Table.Th>Unprocessed messages</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>{statistics.totalMessages}</Table.Td>
            <Table.Td>{statistics.processedMessages}</Table.Td>
            <Table.Td>{statistics.unprocessedMessages}</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
      <Divider />
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
