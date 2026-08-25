import { differenceInCalendarDays } from 'date-fns';
import { TilkjentYtelseRadDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { dateComperator, norsktDatoformat, parseISOorNull } from 'lib/utils/date';
import { formaterTilNok } from 'lib/utils/string';

export const IKKE_FUNNET = 'Ikke funnet';

export const KILDE_MELDEKORT = 'Meldekort';
export const KILDE_SPESIALUTBETALING = 'Spesialutbetaling';

// Arena teller stønadsdager i 1/20-enheter, på samme måte som kvotevisningen.
const DAGER_PER_ENHET = 20;

// Full stilling tilsvarer 7,5 timer per kalenderdag i meldekortperioden (14 dager = 105 timer).
const TIMER_PER_DAG = 7.5;

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

export function formaterDager(antallDager: number | null | undefined): string {
  if (antallDager == null) return IKKE_FUNNET;
  return `${antallDager.toLocaleString('nb-NO')} ${antallDager === 1 ? 'dag' : 'dager'}`;
}

// Antall kalenderdager fra og med fraOgMedDato til og med tilOgMedDato.
export function beregnAntallDagerIPerioden(rad: TilkjentYtelseRadDTO): number | null {
  const fraOgMed = parseISOorNull(rad.fraOgMedDato);
  const tilOgMed = parseISOorNull(rad.tilOgMedDato);
  if (fraOgMed == null || tilOgMed == null) return null;

  const antallDager = differenceInCalendarDays(tilOgMed, fraOgMed) + 1;
  return antallDager > 0 ? antallDager : null;
}

// Grunnlaget arbeidsprosenten måles mot: full stilling i hele perioden.
export function beregnTotaleTimerIPerioden(rad: TilkjentYtelseRadDTO): number | null {
  const antallDager = beregnAntallDagerIPerioden(rad);
  return antallDager != null ? antallDager * TIMER_PER_DAG : null;
}

// Arena oppgir arbeidsprosenten selv, men vi regner den ut fra periodegrunnlaget hvis den mangler.
export function beregnArbeidProsent(rad: TilkjentYtelseRadDTO): number | null {
  const prosentFraArena = rad.reduksjon?.timerArbeidetProsent;
  if (prosentFraArena != null) return prosentFraArena;

  const totaleTimer = beregnTotaleTimerIPerioden(rad);
  if (totaleTimer == null || totaleTimer === 0 || rad.timerArbeidet == null) return null;

  return Math.round((rad.timerArbeidet / totaleTimer) * 100);
}

export function formaterArbeid(rad: TilkjentYtelseRadDTO): string {
  const prosent = beregnArbeidProsent(rad);
  const timer = rad.timerArbeidet;

  if (prosent == null && timer == null) return IKKE_FUNNET;
  if (prosent == null) return `${formaterTimer(timer)}\u00a0t`;
  if (timer == null) return prosentEllerIkkeFunnet(prosent);

  return `${prosentEllerIkkeFunnet(prosent)} (${formaterTimer(timer)}\u00a0t)`;
}

export function prosentEllerIkkeFunnet(verdi: number | null | undefined): string {
  return verdi != null ? `${verdi.toLocaleString('nb-NO')}\u00a0%` : IKKE_FUNNET;
}

// Fullt beløp for perioden før reduksjon: dagsats med barnetillegg for hver kalenderdag i perioden.
export function beregnPeriodegrunnlag(rad: TilkjentYtelseRadDTO): number | null {
  const antallDager = beregnAntallDagerIPerioden(rad);
  if (antallDager == null || rad.dagsatsMedBarnetillegg == null) return null;

  return rad.dagsatsMedBarnetillegg * antallDager;
}

export function beregnBelopAvPeriodegrunnlag(
  rad: TilkjentYtelseRadDTO,
  prosent: number | null | undefined
): number | null {
  const grunnlag = beregnPeriodegrunnlag(rad);
  if (grunnlag == null || prosent == null) return null;

  return Math.round((grunnlag * prosent) / 100);
}

// Viser prosenten med tilhørende kronebeløp, for eksempel "70 % (3 450 kr)".
export function formaterProsentMedBelop(rad: TilkjentYtelseRadDTO, prosent: number | null | undefined): string {
  if (prosent == null) return IKKE_FUNNET;

  const belop = beregnBelopAvPeriodegrunnlag(rad, prosent);
  if (belop == null) return prosentEllerIkkeFunnet(prosent);

  return `${prosentEllerIkkeFunnet(prosent)} (${formaterTilNok(belop)})`;
}

// Spesialutbetalinger har ikke reduksjonsdata, så feltet skal stå tomt fremfor å vise "Ikke funnet".
export function formaterTotalReduksjon(rad: TilkjentYtelseRadDTO): string {
  if (rad.kilde === KILDE_SPESIALUTBETALING) return '';
  return formaterProsentMedBelop(rad, rad.reduksjon?.totalReduksjonProsent);
}

export function formaterSamordning(rad: TilkjentYtelseRadDTO): string {
  return formaterProsentMedBelop(rad, rad.reduksjon?.samordningsProsent);
}

// Arena setter institusjonsProsent til null når det ikke er institusjonsopphold, som i praksis betyr 0 %.
export function formaterInstitusjon(rad: TilkjentYtelseRadDTO): string {
  return prosentEllerIkkeFunnet(rad.reduksjon?.institusjonsProsent ?? 0);
}

// 200 % tilsvarer full 2-ukersperiode (10 dager × 7,5 timer).
// Anvist prosent er det inverse av totalReduksjonProsent skalert til 200-base.
export function beregnAnvistProsent(totalReduksjonProsent: number | null | undefined): number | null {
  if (totalReduksjonProsent == null) return null;
  return Math.round((1 - totalReduksjonProsent / 100) * 200);
}

export function formaterAnvistProsent(rad: TilkjentYtelseRadDTO): string {
  const prosent = beregnAnvistProsent(rad.reduksjon?.totalReduksjonProsent);
  if (prosent == null) return '';
  return `${prosent.toLocaleString('nb-NO')}\u00a0%`;
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
