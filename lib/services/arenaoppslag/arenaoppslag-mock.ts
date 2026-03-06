import { SakDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';

export function getMockSakFraArena(saksId: string): SakDTO {
  return {
    sakId: saksId,
    aar: 2026,
    lopenr: 123,
    statuskode: 'INAKT',
    registrertDato: '2022-01-01',
    avsluttetDato: null,
    vedtak: [],
  };
}
