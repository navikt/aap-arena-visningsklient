import {
  KvoteHistorikkDTO,
  OppgaveDTO,
  SakDTO,
  TelleverkResponseDTO,
  TilkjentYtelseDTO,
  VedtakfaktaResponseDTO,
} from 'lib/services/arenaoppslag/arenaoppslag-types';
import allSaker from 'lib/services/arenaoppslag/mockdata/mockdata.json';
import allTilkjentYtelse from 'lib/services/arenaoppslag/mockdata/mockdata-tilkjent-ytelse.json';
import allOppgaver from 'lib/services/arenaoppslag/mockdata/mockdata-oppgaver.json';
import allKvotehistorikk from 'lib/services/arenaoppslag/mockdata/mockdata-kvotehistorikk.json';
import allTelleverk from 'lib/services/arenaoppslag/mockdata/mockdata-telleverk.json';
import allVedtakfakta from 'lib/services/arenaoppslag/mockdata/mockdata-vedtakfakta.json';

export function getMockSakFraArena(saksId: string): SakDTO | null {
  return (allSaker as Record<string, SakDTO>)[saksId] ?? null;
}

export function getMockTilkjentYtelse(saksId: string): TilkjentYtelseDTO | null {
  return (allTilkjentYtelse as Record<string, TilkjentYtelseDTO | null>)[saksId] ?? null;
}

export function getMockOppgaver(saksId: string): OppgaveDTO[] | null {
  return (allOppgaver as Record<string, OppgaveDTO[] | null>)[saksId] ?? null;
}

export function getMockKvotehistorikk(saksId: string): KvoteHistorikkDTO[] | null {
  return (allKvotehistorikk as Record<string, KvoteHistorikkDTO[] | null>)[saksId] ?? null;
}

export function getMockTelleverk(saksId: string): TelleverkResponseDTO | null {
  return (allTelleverk as Record<string, TelleverkResponseDTO | null>)[saksId] ?? null;
}

export function getMockVedtakfakta(vedtakId: string): VedtakfaktaResponseDTO | null {
  return (allVedtakfakta as Record<string, VedtakfaktaResponseDTO | null>)[vedtakId] ?? null;
}
