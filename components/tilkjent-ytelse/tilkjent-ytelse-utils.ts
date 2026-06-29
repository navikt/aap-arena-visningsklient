import { TilkjentYtelseRadDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { dateComperator, norsktDatoformat, parseISOorNull } from 'lib/utils/date';
import { formaterTilNok } from 'lib/utils/string';

export const IKKE_FUNNET = 'Ikke funnet';

export const KILDE_MELDEKORT = 'Meldekort';
export const KILDE_SPESIALUTBETALING = 'Spesialutbetaling';

// Arena teller stønadsdager i 1/20-enheter, på samme måte som kvotevisningen.
const DAGER_PER_ENHET = 20;

export function tekstEllerIkkeFunnet(verdi: string | null | undefined): string {
  return verdi != null && verdi !== '' ? verdi : IKKE_FUNNET;
}

// Spesialutbetalinger har ikke ukedata, så feltet skal stå tomt fremfor å vise "Ikke funnet".
export function formaterUke(rad: TilkjentYtelseRadDTO): string {
  if (rad.kilde === KILDE_SPESIALUTBETALING) return '';
  return tekstEllerIkkeFunnet(rad.uke);
}

export function kronerEllerIkkeFunnet(verdi: number | null | undefined): string {
  return verdi != null ? formaterTilNok(verdi) : IKKE_FUNNET;
}

export function datoEllerIkkeFunnet(datostring: string | null | undefined): string {
  const parsed = parseISOorNull(datostring);
  return parsed != null ? norsktDatoformat(parsed) : IKKE_FUNNET;
}

export function jaNeiEllerIkkeFunnet(verdi: boolean | null | undefined): string {
  if (verdi == null) return IKKE_FUNNET;
  return verdi ? 'Ja' : 'Nei';
}

export function formaterTimer(timer: number | null | undefined): string {
  return timer != null ? timer.toLocaleString('nb-NO') : IKKE_FUNNET;
}

export function formaterGjenstaaendeDager(antallEnheter: number | null | undefined): string {
  if (antallEnheter == null) return IKKE_FUNNET;
  const dager = antallEnheter / DAGER_PER_ENHET;
  return `${dager.toLocaleString('nb-NO')} dager`;
}

export type RadFilter = {
  visMeldekort: boolean;
  visSpesialutbetaling: boolean;
};

export function filtrerRader(rader: TilkjentYtelseRadDTO[], filter: RadFilter): TilkjentYtelseRadDTO[] {
  return rader.filter((rad) => {
    if (rad.kilde === KILDE_SPESIALUTBETALING) return filter.visSpesialutbetaling;
    if (rad.kilde === KILDE_MELDEKORT) return filter.visMeldekort;
    return true;
  });
}

export function sorterRaderEtterTilOgMedDesc(rader: TilkjentYtelseRadDTO[]): TilkjentYtelseRadDTO[] {
  return [...rader].sort((a, b) =>
    dateComperator(parseISOorNull(a.tilOgMedDato), parseISOorNull(b.tilOgMedDato), 'DESC')
  );
}
