import { ArenaVedtakMedFaktaDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { NIL } from 'lib/utils/types';

const UNNTAK_AAP = 'UNNTAKAAP';

export function finnFaktaverdi(vedtak: ArenaVedtakMedFaktaDTO, kode: string): string | NIL {
  return vedtak.fakta.find((fakta) => fakta.kode === kode)?.verdi;
}

// Unntaksperioden etter §11-12 andre og tredje ledd finnes bare når minst ett vedtak har innvilget unntak.
export function harUnntakAAP(vedtak: ArenaVedtakMedFaktaDTO[]): boolean {
  return vedtak.some((enkeltvedtak) => finnFaktaverdi(enkeltvedtak, UNNTAK_AAP) === 'J');
}
