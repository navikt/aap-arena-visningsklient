import { compareAsc, compareDesc, format, parseISO } from 'date-fns';

export type SortOrder = 'ASC' | 'DESC';

export function dateComperator(
  date1: Date | null | undefined,
  date2: Date | null | undefined,
  sortOrder: SortOrder = 'ASC'
): number {
  if (date1 == null && date2 == null) {
    return 0;
  }

  if (date1 == null) {
    return 1;
  }

  if (date2 == null) {
    return -1;
  }

  return sortOrder === 'DESC' ? compareDesc(date1, date2) : compareAsc(date1, date2);
}

export function parseISOorNull(dateString: string | null | undefined): Date | null {
  if (dateString == null) {
    return null;
  }
  return parseISO(dateString);
}

export function norsktDatoformat(date: Date): string {
  return format(date, 'dd.MM.yyyy');
}
