import { SakDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import Sak13721953Mockdata from 'lib/services/arenaoppslag/mockdata/sak-13721953-mockdata.json';

export function getMockSakFraArena(saksId: string): SakDTO {
  return Sak13721953Mockdata;
}
