import dayjs from "dayjs";
import relative from "dayjs/plugin/relativeTime";

dayjs.extend(relative);

export function getDateFromNow(date: Date | string) {
  return dayjs(date).fromNow();
}

export function formatPrettyDate(date: Date) {
  return dayjs(date).format("MMM D, h:mm A");
}
