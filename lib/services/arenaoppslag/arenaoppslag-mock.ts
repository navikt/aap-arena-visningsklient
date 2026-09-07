import { SakDTO, TilkjentYtelseDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import allSaker from 'lib/services/arenaoppslag/mockdata/mockdata.json';
import allTilkjentYtelse from 'lib/services/arenaoppslag/mockdata/mockdata-tilkjent-ytelse.json';

export function getMockSakFraArena(saksId: string): SakDTO | null {
  return (allSaker as Record<string, SakDTO>)[saksId] ?? null;
}

export function getMockTilkjentYtelse(saksId: string): TilkjentYtelseDTO | null {
  return (allTilkjentYtelse as Record<string, TilkjentYtelseDTO | null>)[saksId] ?? null;
}
