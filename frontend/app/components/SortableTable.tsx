import { Group, Table } from '@mantine/core';
import { useNavigate } from '@remix-run/react';
import { IconArrowsSort, IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import { orderBy } from 'lodash-es';
import { Key, ReactNode, useEffect, useState } from 'react';

type SortableTableBodyElem = {
  value: string | number | Date | boolean;
  node: ReactNode;
  key: Key;
};

type SortableTableRow = {
  elems: SortableTableBodyElem[];
  href?: string;
  key: Key;
};

type SortableTableHeadElem = {
  node: ReactNode;
  key: Key;
};

export type SortableTableProps = {
  head: SortableTableHeadElem[][];
  body: SortableTableRow[];
  caption?: ReactNode;
  onRowClick: (pos: [number, number], index: number) => void;
};

type CurrentSort = {
  isAsc: boolean;
  index: number;
};

export function SortableTable({ head, body, caption, onRowClick }: SortableTableProps) {
  const [curSort, setCurSort] = useState<CurrentSort | null>(null);
  const [sortedBody, setSortedBody] = useState<typeof body>(body);
  const navigate = useNavigate();

  useEffect(() => {
    if (curSort) {
      const { index, isAsc } = curSort;
      const sorted = orderBy(body, ({ elems }) => elems[index].value, isAsc ? 'asc' : 'desc');
      setSortedBody(sorted);
    } else {
      setSortedBody(body);
    }
  }, [body, curSort]);

  const toggleSortDir = (key: Key) => {
    setCurSort(prev => (!prev ? prev : { ...prev, isAsc: !prev.isAsc }));
  };

  return (
    <>
      <Table>
        {caption && <Table.Caption>{caption}</Table.Caption>}
        <Table.Thead>
          {head.map((headElems, rowIndex) => (
            <Table.Tr key={headElems.reduce((composite, { key }) => `${composite}${key}`, '')}>
              {headElems.map(({ key, node }, colIndex) => (
                <Table.Th key={key}>
                  <Group w="max-content">
                    {node}
                    {sortedBody.length > 1 &&
                      rowIndex == head.length - 1 &&
                      (!curSort || curSort?.index != colIndex ? (
                        <IconArrowsSort
                          cursor="pointer"
                          size={16}
                          onClick={() => setCurSort({ index: colIndex, isAsc: true })}
                        />
                      ) : curSort.isAsc ? (
                        <IconSortAscending
                          cursor="pointer"
                          size={16}
                          onClick={() => toggleSortDir(key)}
                        />
                      ) : (
                        <IconSortDescending
                          cursor="pointer"
                          size={16}
                          onClick={() => toggleSortDir(key)}
                        />
                      ))}
                  </Group>
                </Table.Th>
              ))}
            </Table.Tr>
          ))}
        </Table.Thead>
        <Table.Tbody>
          {sortedBody.map(({ elems, key, href }, index) => (
            <Table.Tr
              key={key}
              style={{ cursor: 'pointer' }}
              onPointerEnter={e => {
                (e.currentTarget as HTMLTableRowElement).style.background =
                  'var(--mantine-color-blue-light-hover)';
              }}
              onPointerLeave={e => {
                (e.currentTarget as HTMLTableRowElement).style.background = '';
              }}
              onClick={e => {
                if (onRowClick) {
                  onRowClick([e.clientX, document.documentElement.clientHeight - e.clientY], index);
                }
              }}
            >
              {elems.map(({ key, node: text }) => (
                <Table.Td key={key}>{text}</Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  );
}
