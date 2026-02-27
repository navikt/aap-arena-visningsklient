import { VedtakDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';

export function getMockSakFraArena(saksId: string): VedtakDTO {
  return [
    {
      sakId: saksId,
      statusKode: 'status',
      vedtaktypeKode: null,
      fraOgMed: null,
      tilDato: null,
      rettighetkode: 'rettighetskode',
      utfallkode: null,
      fodselsnr: '12345654321',
    },
  ];
}
