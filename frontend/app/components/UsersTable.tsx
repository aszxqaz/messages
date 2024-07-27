import { formatPrettyDate } from '~/time';
import { UserWithRights } from '~/types';
import { SortableTable, SortableTableProps } from './SortableTable';

type UsersTableProps = {
  users: UserWithRights[];
  caption?: string;
  onRowClick: SortableTableProps['onRowClick'];
};

export function UsersTable({ caption, users, onRowClick }: UsersTableProps) {
  const headLabels = [
    {
      key: 'username',
      node: 'Username',
    },
    {
      key: 'admin',
      node: 'Admin',
    },
    {
      key: 'blocked',
      node: 'Blocked',
    },
    {
      key: 'created',
      node: 'Created',
    },
  ];

  const head = [headLabels];

  const body = users.map(({ username, createdAt, rights }, i) => {
    console.log(typeof createdAt);
    return {
      key: username,
      elems: [
        {
          node: username,
          key: `username${username}`,
          value: username,
        },
        {
          value: rights!.isAdmin,
          node: `${rights!.isAdmin}`,
          key: `admin${username}`,
        },
        {
          value: rights!.isBlocked,
          node: `${rights!.isBlocked}`,
          key: `blocked${username}`,
        },
        {
          value: createdAt,
          node: formatPrettyDate(createdAt),
          key: `created${username}`,
        },
      ],
    };
  });
  return <SortableTable caption={caption} head={head} body={body} onRowClick={onRowClick} />;
}
