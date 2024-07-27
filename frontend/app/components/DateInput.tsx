import { ActionIcon, Input, InputProps, Popover } from '@mantine/core';
import { IconCalendar } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { DayPicker, Matcher } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { formatDate } from '~/utils';

type DateInputProps = {
  disabled?: Matcher | Matcher[];
  value?: Date;
  onChange?: (value?: Date) => void;
} & InputProps;

export function DateInput({ disabled, value, onChange, ...inputProps }: DateInputProps) {
  const [date, setDate] = useState<[string, Date | undefined]>([
    value ? formatDate(value) : '',
    value,
  ]);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    onChange?.(date[1]);
  }, [date]);

  return (
    <Input
      pos="relative"
      placeholder="2020-12-31"
      rightSectionPointerEvents="all"
      rightSection={
        <Popover position="bottom-start" withArrow shadow="md" opened={opened} onChange={setOpened}>
          <Popover.Target>
            <ActionIcon variant="light" onClick={() => setOpened(o => !o)}>
              <IconCalendar />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <DayPicker
              mode="single"
              selected={date[1]}
              defaultMonth={date[1]}
              disabled={disabled}
              onSelect={day => {
                if (day) {
                  setDate([formatDate(day), day]);
                  setOpened(false);
                }
              }}
            />
          </Popover.Dropdown>
        </Popover>
      }
      value={date[0]}
      onChange={e => {
        const [isValid, maybeDate] = validateDateInput(e.target.value);
        if (isValid) {
          setDate([e.target.value, maybeDate]);
        }
      }}
      {...inputProps}
    />
  );
}

const MIN_DATE = new Date(0);
const MIN_YEAR = MIN_DATE.getFullYear().toString();

function validateDateInput(s: string): [boolean, Date | undefined] {
  if (s == '') return [true, undefined];
  const notValid: [boolean, Date | undefined] = [false, undefined];
  if (s.length == 10) {
    const date = new Date(s);
    if (date.toString() != 'Invalid Date') {
      return [true, date];
    }
    return notValid;
  }
  if (s.length > 10) return notValid;
  if (s.length <= 4) {
    if (!['1', '2'].includes(s[0])) return notValid;
    const isValid = Number(MIN_YEAR.slice(0, s.length)) <= Number(s);
    return [isValid, undefined];
  }
  if (s.length >= 5 && s[4] != '-') return notValid;
  if (s.length >= 6 && Number(s[5]) > 1) return notValid;
  if (s.length >= 7 && Number(s[5]) * 10 + Number(s[6]) > 12) return notValid;
  if (s.length >= 8 && s[7] != '-') return notValid;
  if (s.length >= 9 && Number(s[8]) > 3) return notValid;
  return [true, undefined];
}
