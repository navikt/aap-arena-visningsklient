import { compareAsc, compareDesc, format, parse, parseISO } from 'date-fns';
import { nb } from 'date-fns/locale';

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

export function norsktDatoformat(date: Date | string ): string {
  return format(date, 'dd.MM.yyyy', { locale: nb });
}

export function norsktDatoformatMedTid(dato: Date | string): string {
  return format(dato, 'dd.MM.yyyy HH:mm:ss', { locale: nb });
}

export function parseFaktaDato(dateString: string): Date;
export function parseFaktaDato(dateString: string | null | undefined): Date | null;
export function parseFaktaDato(dateString: string | null | undefined): Date | null {
  if (dateString == null) {
    return null;
  }
  return parse(dateString, 'dd-MM-yyyy', new Date());
}

export function formaterFaktaDato(dateString: string | null | undefined): string | null {
  const parsed = parseFaktaDato(dateString);
  return parsed != null ? norsktDatoformat(parsed) : null;
}
