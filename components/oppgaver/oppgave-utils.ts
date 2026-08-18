import { OppgaveDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { norsktDatoformat, parseISOorNull } from 'lib/utils/date';

export const INGEN_VERDI = '–';

export function formaterFrist(fristDato: string | null | undefined): string {
  const parsedFrist = parseISOorNull(fristDato);
  return parsedFrist != null ? norsktDatoformat(parsedFrist) : INGEN_VERDI;
}

export function sorterPaaFristSynkende(oppgaver: OppgaveDTO[]): OppgaveDTO[] {
  return [...oppgaver].sort((a, b) => (b.fristDato ?? '').localeCompare(a.fristDato ?? ''));
}
