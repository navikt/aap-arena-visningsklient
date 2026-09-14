import { OppgaveDTO, SakDTO, TilkjentYtelseDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import allSaker from 'lib/services/arenaoppslag/mockdata/mockdata.json';
import allTilkjentYtelse from 'lib/services/arenaoppslag/mockdata/mockdata-tilkjent-ytelse.json';
import allOppgaver from 'lib/services/arenaoppslag/mockdata/mockdata-oppgaver.json';

export function getMockSakFraArena(saksId: string): SakDTO | null {
  return (allSaker as Record<string, SakDTO>)[saksId] ?? null;
}

export function getMockTilkjentYtelse(saksId: string): TilkjentYtelseDTO | null {
  return (allTilkjentYtelse as Record<string, TilkjentYtelseDTO | null>)[saksId] ?? null;
}

export function getMockOppgaver(saksId: string): OppgaveDTO[] | null {
  return (allOppgaver as Record<string, OppgaveDTO[] | null>)[saksId] ?? null;
}
