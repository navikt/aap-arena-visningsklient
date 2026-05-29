import { SakDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import allSaker from 'lib/services/arenaoppslag/mockdata/mockdata.json';

export function getMockSakFraArena(saksId: string): SakDTO | null {
  return (allSaker as Record<string, SakDTO>)[saksId] ?? null;
}
