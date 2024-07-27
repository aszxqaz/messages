import { PropertyType } from '@prisma/client';
import { useMatches } from '@remix-run/react';
import { useMemo } from 'react';

type User = {
  username: string;
};

export function useMatchesData(id: string) {
  const matchingRoutes = useMatches();
  const route = useMemo(() => matchingRoutes.find(route => route.id === id), [matchingRoutes, id]);
  return route?.data as Record<string, unknown>;
}

function isUser(user: unknown): user is User {
  return (
    user != null &&
    typeof user === 'object' &&
    'username' in user &&
    typeof user.username === 'string'
  );
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData('root');
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      'No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.',
    );
  }
  return maybeUser;
}

export type JsPropertyType<T extends PropertyType> = T extends 'Int'
  ? number
  : T extends 'Line' | 'Multiline'
  ? string
  : T extends 'Bool'
  ? boolean
  : T extends 'Date'
  ? Date
  : never;

export function parseItemValue(value: string, type: 'Int'): number;
export function parseItemValue(value: string, type: 'Line'): string;
export function parseItemValue(value: string, type: 'Multiline'): string;
export function parseItemValue(value: string, type: 'Bool'): boolean;
export function parseItemValue(value: string, type: 'Date'): Date;
export function parseItemValue(value: string, type: PropertyType) {
  switch (type) {
    case 'Int':
      return Number(value);
    case 'Line':
      return value;
    case 'Multiline':
      return value;
    case 'Bool':
      return value == 'true' ? true : false;
    case 'Date':
      return new Date(value);
  }
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function joined<T>(arr: Array<T>, separator: ((index: number) => T) | T) {
  return arr.reduce(
    (acc, cur, i, arr) =>
      i != arr.length - 1
        ? // @ts-ignore
          [...acc, cur, typeof separator == 'function' ? separator(i) : separator]
        : [...acc, cur],
    [] as T[],
  );
}
