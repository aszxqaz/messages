import { Scheme } from '@prisma/client';
import { SerializeFrom } from '@remix-run/node';
import { useLocation } from '@remix-run/react';
import { ItemWithProperties } from '~/types';
import { parseItemValue } from '~/utils';
import { SortableTable, SortableTableProps } from './SortableTable';

type ItemsTableProps = {
  items: SerializeFrom<ItemWithProperties>[];
  schemes: SerializeFrom<Scheme>[];
  caption?: string;
  onRowClick?: SortableTableProps['onRowClick'];
};

export function ItemsTable({ caption, items, schemes, onRowClick }: ItemsTableProps) {
  const { pathname } = useLocation();

  const headLabels = [
    {
      key: 'head_id',
      node: 'Id',
    },
    {
      key: 'head_name',
      node: 'Name',
    },
    ...schemes.map(scheme => ({
      key: scheme.id,
      node: scheme.name,
    })),
  ];

  const head = [headLabels];

  const body = items.map((item, i) => {
    const href = `/${item.username}/${item.collSlug}/${item.slug}`;
    return {
      key: item.id,
      href: href == pathname ? undefined : href,
      elems: [
        {
          node: item.id,
          key: 'item_id',
          value: item.id,
        },
        {
          value: item.name,
          node: item.name,
          key: 'item_name',
        },
        ...item.properties.map((prop, i) => ({
          // @ts-ignore
          value: parseItemValue(prop.value, schemes[i].type),
          node: prop.value,
          key: prop.schemeId,
        })),
      ],
    };
  });
  return <SortableTable caption={caption} head={head} body={body} onRowClick={onRowClick} />;
}

// type InteractiveTableProps<T> = {
//   elements: T[];
//   headFn: (element: T, index?: number, elements?: T[]) => { key: Key; node: ReactNode }[];
//   bodyFn: (
//     element: T,
//     index?: number,
//     elements?: T[],
//   ) => { key: Key; node: ReactNode; value: any }[][];
//   caption?: string;
//   onRowClick: SortableTableProps['onRowClick'];
// };

// export function InteractiveTable<T>({
//   bodyFn,
//   elements,
//   headFn,
//   caption,
//   onRowClick,
// }: InteractiveTableProps<T>) {
//   const head = useMemo(() => elements.map((el, i, els) => headFn(el, i, els)), [elements]);
//   const body = useMemo(() => elements.map((el, i, els) => bodyFn(el, i, els)), [elements]);

//   return <SortableTable caption={caption} head={head} body={body} onRowClick={onRowClick} />;
// }
