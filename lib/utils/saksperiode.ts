import { compareAsc, compareDesc, isAfter, isBefore } from 'date-fns';
import { ArenaVedtakMedFaktaDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { norsktDatoformat, parseFaktaDato } from 'lib/utils/date';
import { NIL } from 'lib/utils/types';
import { finnFaktaverdi } from 'lib/utils/vedtaksfakta';

export type Saksperiode = {
  startdato: Date | null;
  sluttdato: Date | null;
};

const FRADATO = 'FDATO';
const JUSTERT_FRADATO = 'AAPJUSTFD';
const TILDATO = 'TDATO';

// Justert fradato (AAPJUSTFD) gjelder foran opprinnelig fradato (FDATO) når den finnes.
export function finnFradato(vedtak: ArenaVedtakMedFaktaDTO): string | NIL {
  return finnFaktaverdi(vedtak, JUSTERT_FRADATO) ?? finnFaktaverdi(vedtak, FRADATO);
}

export function finnTildato(vedtak: ArenaVedtakMedFaktaDTO): string | NIL {
  return finnFaktaverdi(vedtak, TILDATO);
}

function velgYtterpunkt(datostrenger: (string | NIL)[], retning: 'asc' | 'desc'): Date | null {
  return (
    datostrenger
      .filter((datostreng) => datostreng != null)
      .map((datostreng) => parseFaktaDato(datostreng))
      .sort((a, b) => (retning === 'asc' ? compareAsc(a, b) : compareDesc(a, b)))[0] ?? null
  );
}

// Saksperioden er ytterpunktene til vedtakene: tidligste fradato og seneste tildato.
export function finnSaksperiode(vedtak: ArenaVedtakMedFaktaDTO[]): Saksperiode {
  return {
    startdato: velgYtterpunkt(vedtak.map(finnFradato), 'asc'),
    sluttdato: velgYtterpunkt(vedtak.map(finnTildato), 'desc'),
  };
}

export function harSaksperiode(saksperiode: Saksperiode): boolean {
  return saksperiode.startdato != null || saksperiode.sluttdato != null;
}

export function formaterSaksperiode(saksperiode: Saksperiode): string | null {
  const { startdato, sluttdato } = saksperiode;

  if (startdato != null && sluttdato != null) {
    return `${norsktDatoformat(startdato)}\u00a0\u2013\u00a0${norsktDatoformat(sluttdato)}`;
  }
  if (startdato != null) {
    return `Fra\u00a0${norsktDatoformat(startdato)}`;
  }
  if (sluttdato != null) {
    return `Til\u00a0${norsktDatoformat(sluttdato)}`;
  }
  return null;
}

// Manglende datoer gir et åpent ytterpunkt, slik at løpende perioder ikke filtreres bort.
export function overlapperSaksperiode(fraOgMed: Date | null, tilOgMed: Date | null, saksperiode: Saksperiode): boolean {
  const { startdato, sluttdato } = saksperiode;

  const slutterFoerPerioden = startdato != null && tilOgMed != null && isBefore(tilOgMed, startdato);
  const starterEtterPerioden = sluttdato != null && fraOgMed != null && isAfter(fraOgMed, sluttdato);

  return !slutterFoerPerioden && !starterEtterPerioden;
}
