import { describe, expect, it } from 'vitest';

import { TilkjentYtelseAnmerkningDTO, TilkjentYtelseRadDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { formaterTilNok } from 'lib/utils/string';
import {
  beregnAntallDagerIPerioden,
  beregnArbeidProsent,
  beregnBelopAvPeriodegrunnlag,
  beregnPeriodegrunnlag,
  beregnTotaleTimerIPerioden,
  datoEllerIkkeFunnet,
  filtrerRader,
  filtrerRaderPaaSaksperiode,
  formaterAnmerkning,
  formaterAnvistProsent,
  formaterArbeid,
  formaterDager,
  formaterGjenstaaendeDager,
  formaterInstitusjon,
  formaterSamordning,
  formaterTimer,
  formaterTotalReduksjon,
  formaterUke,
  IKKE_FUNNET,
  jaNeiEllerIkkeFunnet,
  kronerEllerIkkeFunnet,
  prosentEllerIkkeFunnet,
  sorterRaderEtterTilOgMedDesc,
  tekstEllerIkkeFunnet,
} from 'components/tilkjent-ytelse/tilkjent-ytelse-utils';

const lagReduksjon = (
  overrides: Partial<NonNullable<TilkjentYtelseRadDTO['reduksjon']>> = {}
): NonNullable<TilkjentYtelseRadDTO['reduksjon']> => ({
  levertForSentDager: 0,
  timerArbeidetProsent: 0,
  samordningsProsent: 0,
  totalReduksjonProsent: 0,
  fravar: 0,
  sykedager: 0,
  institusjonsProsent: null,
  anvistProsent: null,
  ...overrides,
});

const lagRad = (overrides: Partial<TilkjentYtelseRadDTO> = {}): TilkjentYtelseRadDTO => ({
  fraOgMedDato: '2017-07-28',
  tilOgMedDato: '2017-08-06',
  uke: '30-31',
  kilde: 'Meldekort',
  dagsatsMedBarnetillegg: 1426,
  dagsats: 1426,
  beregnetBrutto: 8556,
  timerArbeidet: 0,
  reduksjon: null,
  meldekort: null,
  gjenstaaendeOrdinaerDager: null,
  gjenstaaendeUnntakDager: null,
  ...overrides,
});

describe('tekstEllerIkkeFunnet', () => {
  it('returnerer verdien når den finnes', () => {
    expect(tekstEllerIkkeFunnet('Meldekort')).toBe('Meldekort');
  });

  it('returnerer "Ikke funnet" for null, undefined og tom streng', () => {
    expect(tekstEllerIkkeFunnet(null)).toBe(IKKE_FUNNET);
    expect(tekstEllerIkkeFunnet(undefined)).toBe(IKKE_FUNNET);
    expect(tekstEllerIkkeFunnet('')).toBe(IKKE_FUNNET);
  });
});

describe('formaterUke', () => {
  it('returnerer uke for meldekortrader', () => {
    expect(formaterUke(lagRad({ kilde: 'Meldekort', uke: '30-31' }))).toBe('30-31');
  });

  it('returnerer "Ikke funnet" for meldekortrader uten uke', () => {
    expect(formaterUke(lagRad({ kilde: 'Meldekort', uke: null }))).toBe(IKKE_FUNNET);
  });

  it('returnerer tom streng for spesialutbetalinger', () => {
    expect(formaterUke(lagRad({ kilde: 'Spesialutbetaling', uke: null }))).toBe('');
  });
});

describe('kronerEllerIkkeFunnet', () => {
  it('formaterer tall til kroner', () => {
    expect(kronerEllerIkkeFunnet(8556)).toBe(formaterTilNok(8556));
  });

  it('returnerer "Ikke funnet" for null og undefined', () => {
    expect(kronerEllerIkkeFunnet(null)).toBe(IKKE_FUNNET);
    expect(kronerEllerIkkeFunnet(undefined)).toBe(IKKE_FUNNET);
  });
});

describe('datoEllerIkkeFunnet', () => {
  it('formaterer ISO-dato til norsk format', () => {
    expect(datoEllerIkkeFunnet('2017-07-28')).toBe('28.07.2017');
  });

  it('returnerer "Ikke funnet" for null og undefined', () => {
    expect(datoEllerIkkeFunnet(null)).toBe(IKKE_FUNNET);
    expect(datoEllerIkkeFunnet(undefined)).toBe(IKKE_FUNNET);
  });
});

describe('jaNeiEllerIkkeFunnet', () => {
  it('returnerer Ja/Nei for boolske verdier', () => {
    expect(jaNeiEllerIkkeFunnet(true)).toBe('Ja');
    expect(jaNeiEllerIkkeFunnet(false)).toBe('Nei');
  });

  it('returnerer "Ikke funnet" for null og undefined', () => {
    expect(jaNeiEllerIkkeFunnet(null)).toBe(IKKE_FUNNET);
    expect(jaNeiEllerIkkeFunnet(undefined)).toBe(IKKE_FUNNET);
  });
});

describe('formaterTimer', () => {
  it('formaterer timer med norsk desimaltegn', () => {
    expect(formaterTimer(7.5)).toBe('7,5');
    expect(formaterTimer(0)).toBe('0');
  });

  it('returnerer "Ikke funnet" for null og undefined', () => {
    expect(formaterTimer(null)).toBe(IKKE_FUNNET);
    expect(formaterTimer(undefined)).toBe(IKKE_FUNNET);
  });
});

describe('formaterGjenstaaendeDager', () => {
  it('regner om fra 1/20-enheter til dager', () => {
    expect(formaterGjenstaaendeDager(40)).toBe('2 dager');
    expect(formaterGjenstaaendeDager(10460)).toBe('523 dager');
  });

  it('returnerer "Ikke funnet" for null og undefined', () => {
    expect(formaterGjenstaaendeDager(null)).toBe(IKKE_FUNNET);
    expect(formaterGjenstaaendeDager(undefined)).toBe(IKKE_FUNNET);
  });
});

describe('prosentEllerIkkeFunnet', () => {
  it('formaterer heltall som prosent med norsk lokale', () => {
    expect(prosentEllerIkkeFunnet(50)).toBe('50\u00a0%');
    expect(prosentEllerIkkeFunnet(0)).toBe('0\u00a0%');
    expect(prosentEllerIkkeFunnet(100)).toBe('100\u00a0%');
  });

  it('formaterer desimaltall med norsk desimaltegn', () => {
    expect(prosentEllerIkkeFunnet(50.5)).toBe('50,5\u00a0%');
  });

  it('returnerer "Ikke funnet" for null og undefined', () => {
    expect(prosentEllerIkkeFunnet(null)).toBe(IKKE_FUNNET);
    expect(prosentEllerIkkeFunnet(undefined)).toBe(IKKE_FUNNET);
  });
});

describe('formaterDager', () => {
  it('bruker entall for én dag og flertall ellers', () => {
    expect(formaterDager(1)).toBe('1 dag');
    expect(formaterDager(2)).toBe('2 dager');
    expect(formaterDager(0)).toBe('0 dager');
  });

  it('returnerer "Ikke funnet" for null og undefined', () => {
    expect(formaterDager(null)).toBe(IKKE_FUNNET);
    expect(formaterDager(undefined)).toBe(IKKE_FUNNET);
  });
});

describe('beregnAntallDagerIPerioden', () => {
  it('teller begge endedatoene med', () => {
    expect(beregnAntallDagerIPerioden(lagRad({ fraOgMedDato: '2017-07-28', tilOgMedDato: '2017-08-10' }))).toBe(14);
    expect(beregnAntallDagerIPerioden(lagRad({ fraOgMedDato: '2017-07-28', tilOgMedDato: '2017-07-28' }))).toBe(1);
  });

  it('returnerer null når datoer mangler eller perioden er ugyldig', () => {
    expect(beregnAntallDagerIPerioden(lagRad({ fraOgMedDato: null }))).toBeNull();
    expect(beregnAntallDagerIPerioden(lagRad({ tilOgMedDato: null }))).toBeNull();
    expect(beregnAntallDagerIPerioden(lagRad({ fraOgMedDato: '2017-08-10', tilOgMedDato: '2017-07-28' }))).toBeNull();
  });
});

describe('beregnTotaleTimerIPerioden', () => {
  it('regner 7,5 timer per kalenderdag i perioden', () => {
    expect(beregnTotaleTimerIPerioden(lagRad({ fraOgMedDato: '2017-07-28', tilOgMedDato: '2017-08-10' }))).toBe(105);
  });

  it('returnerer null når perioden mangler datoer', () => {
    expect(beregnTotaleTimerIPerioden(lagRad({ fraOgMedDato: null, tilOgMedDato: null }))).toBeNull();
  });
});

describe('beregnArbeidProsent', () => {
  it('bruker prosenten Arena oppgir', () => {
    const rad = lagRad({ timerArbeidet: 27, reduksjon: lagReduksjon({ timerArbeidetProsent: 26 }) });
    expect(beregnArbeidProsent(rad)).toBe(26);
  });

  it('regner ut prosent av totalen for perioden når Arena ikke oppgir den', () => {
    const rad = lagRad({
      fraOgMedDato: '2017-07-28',
      tilOgMedDato: '2017-08-10',
      timerArbeidet: 27,
      reduksjon: null,
    });
    // 27 av 105 timer ≈ 25,7 % → 26 %
    expect(beregnArbeidProsent(rad)).toBe(26);
  });

  it('returnerer null når verken prosent eller timer finnes', () => {
    expect(beregnArbeidProsent(lagRad({ timerArbeidet: null, reduksjon: null }))).toBeNull();
  });
});

describe('formaterArbeid', () => {
  it('viser prosent med timer i parentes', () => {
    const rad = lagRad({ timerArbeidet: 15, reduksjon: lagReduksjon({ timerArbeidetProsent: 20 }) });
    expect(formaterArbeid(rad)).toBe('20\u00a0% (15\u00a0t)');
  });

  it('viser bare timer når prosent ikke kan beregnes', () => {
    const rad = lagRad({ fraOgMedDato: null, tilOgMedDato: null, timerArbeidet: 15, reduksjon: null });
    expect(formaterArbeid(rad)).toBe('15\u00a0t');
  });

  it('viser bare prosent når timer mangler', () => {
    const rad = lagRad({ timerArbeidet: null, reduksjon: lagReduksjon({ timerArbeidetProsent: 20 }) });
    expect(formaterArbeid(rad)).toBe('20\u00a0%');
  });

  it('returnerer "Ikke funnet" når både prosent og timer mangler', () => {
    const rad = lagRad({ fraOgMedDato: null, tilOgMedDato: null, timerArbeidet: null, reduksjon: null });
    expect(formaterArbeid(rad)).toBe(IKKE_FUNNET);
  });
});

describe('beregnPeriodegrunnlag', () => {
  it('ganger dagsats med barnetillegg med antall kalenderdager i perioden', () => {
    const rad = lagRad({ fraOgMedDato: '2017-07-28', tilOgMedDato: '2017-08-10', dagsatsMedBarnetillegg: 1426 });
    expect(beregnPeriodegrunnlag(rad)).toBe(1426 * 14);
  });

  it('returnerer null når dagsats eller periode mangler', () => {
    expect(beregnPeriodegrunnlag(lagRad({ dagsatsMedBarnetillegg: null }))).toBeNull();
    expect(beregnPeriodegrunnlag(lagRad({ fraOgMedDato: null }))).toBeNull();
  });
});

describe('beregnBelopAvPeriodegrunnlag', () => {
  const rad = lagRad({ fraOgMedDato: '2017-07-28', tilOgMedDato: '2017-08-10', dagsatsMedBarnetillegg: 1426 });

  it('regner ut prosentandelen av periodegrunnlaget og runder til hele kroner', () => {
    expect(beregnBelopAvPeriodegrunnlag(rad, 50)).toBe(9982);
    expect(beregnBelopAvPeriodegrunnlag(rad, 0)).toBe(0);
  });

  it('returnerer null når prosent eller grunnlag mangler', () => {
    expect(beregnBelopAvPeriodegrunnlag(rad, null)).toBeNull();
    expect(beregnBelopAvPeriodegrunnlag(lagRad({ dagsatsMedBarnetillegg: null }), 50)).toBeNull();
  });
});

describe('formaterTotalReduksjon', () => {
  const rad = lagRad({ fraOgMedDato: '2017-07-28', tilOgMedDato: '2017-08-10', dagsatsMedBarnetillegg: 1426 });

  it('viser prosent med kronebeløp for meldekortrader', () => {
    const medReduksjon = { ...rad, kilde: 'Meldekort', reduksjon: lagReduksjon({ totalReduksjonProsent: 50 }) };
    expect(formaterTotalReduksjon(medReduksjon)).toBe(`50\u00a0% (${formaterTilNok(9982)})`);
  });

  it('viser bare prosent når periodegrunnlaget ikke kan beregnes', () => {
    const utenGrunnlag = lagRad({
      kilde: 'Meldekort',
      dagsatsMedBarnetillegg: null,
      reduksjon: lagReduksjon({ totalReduksjonProsent: 50 }),
    });
    expect(formaterTotalReduksjon(utenGrunnlag)).toBe('50\u00a0%');
  });

  it('returnerer "Ikke funnet" for meldekortrader uten reduksjon', () => {
    expect(formaterTotalReduksjon(lagRad({ kilde: 'Meldekort', reduksjon: null }))).toBe(IKKE_FUNNET);
  });

  it('returnerer tom streng for spesialutbetalinger', () => {
    expect(formaterTotalReduksjon(lagRad({ kilde: 'Spesialutbetaling', reduksjon: null }))).toBe('');
  });
});

describe('formaterSamordning', () => {
  const rad = lagRad({ fraOgMedDato: '2017-07-28', tilOgMedDato: '2017-08-10', dagsatsMedBarnetillegg: 1426 });

  it('viser prosent med kronebeløp', () => {
    const medSamordning = { ...rad, reduksjon: lagReduksjon({ samordningsProsent: 50 }) };
    expect(formaterSamordning(medSamordning)).toBe(`50\u00a0% (${formaterTilNok(9982)})`);
  });

  it('returnerer "Ikke funnet" når samordningsprosent mangler', () => {
    expect(formaterSamordning(lagRad({ reduksjon: lagReduksjon({ samordningsProsent: null }) }))).toBe(IKKE_FUNNET);
    expect(formaterSamordning(lagRad({ reduksjon: null }))).toBe(IKKE_FUNNET);
  });
});

describe('formaterAnmerkning', () => {
  const lagAnmerkning = (overrides: Partial<TilkjentYtelseAnmerkningDTO> = {}): TilkjentYtelseAnmerkningDTO => ({
    kode: 'IFD',
    navn: 'Innvilget fra dato',
    beskrivelse: 'Innvilget fra dato er i perioden',
    beskrivelseFlettet: 'Innvilget fra dato er i perioden',
    verdi: null,
    verdi2: null,
    ...overrides,
  });

  it('foretrekker den flettede beskrivelsen, der &1 er byttet ut med verdien', () => {
    const anmerkning = lagAnmerkning({
      kode: 'FXNN',
      beskrivelse: 'Utbetalingen er redusert pga fravær av type X &1 dager',
      beskrivelseFlettet: 'Utbetalingen er redusert pga fravær av type X 2 dager',
      verdi: 2,
    });
    expect(formaterAnmerkning(anmerkning)).toBe('Utbetalingen er redusert pga fravær av type X 2 dager');
  });

  it('faller tilbake til beskrivelse, så navn, så kode', () => {
    expect(formaterAnmerkning(lagAnmerkning({ beskrivelseFlettet: null }))).toBe('Innvilget fra dato er i perioden');
    expect(formaterAnmerkning(lagAnmerkning({ beskrivelseFlettet: null, beskrivelse: null }))).toBe(
      'Innvilget fra dato'
    );
    expect(formaterAnmerkning(lagAnmerkning({ beskrivelseFlettet: '', beskrivelse: '', navn: '' }))).toBe('IFD');
  });
});

describe('formaterInstitusjon', () => {
  it('viser institusjonsprosenten når den finnes', () => {
    expect(formaterInstitusjon(lagRad({ reduksjon: lagReduksjon({ institusjonsProsent: 50 }) }))).toBe('50\u00a0%');
  });

  it('viser 0 % når institusjonsprosent mangler', () => {
    expect(formaterInstitusjon(lagRad({ reduksjon: lagReduksjon({ institusjonsProsent: null }) }))).toBe('0\u00a0%');
    expect(formaterInstitusjon(lagRad({ reduksjon: null }))).toBe('0\u00a0%');
  });
});

describe('filtrerRader', () => {
  const meldekortRad = lagRad({ kilde: 'Meldekort' });
  const spesialutbetalingRad = lagRad({ kilde: 'Spesialutbetaling', uke: null });

  it('viser alle rader når begge filtrene er på', () => {
    const resultat = filtrerRader([meldekortRad, spesialutbetalingRad], {
      visMeldekort: true,
      visSpesialutbetaling: true,
    });
    expect(resultat).toHaveLength(2);
  });

  it('skjuler spesialutbetalinger når filteret er av', () => {
    const resultat = filtrerRader([meldekortRad, spesialutbetalingRad], {
      visMeldekort: true,
      visSpesialutbetaling: false,
    });
    expect(resultat).toEqual([meldekortRad]);
  });

  it('skjuler meldekort når filteret er av', () => {
    const resultat = filtrerRader([meldekortRad, spesialutbetalingRad], {
      visMeldekort: false,
      visSpesialutbetaling: true,
    });
    expect(resultat).toEqual([spesialutbetalingRad]);
  });

  it('viser ingen rader når begge filtrene er av', () => {
    const resultat = filtrerRader([meldekortRad, spesialutbetalingRad], {
      visMeldekort: false,
      visSpesialutbetaling: false,
    });
    expect(resultat).toHaveLength(0);
  });
});

describe('filtrerRaderPaaSaksperiode', () => {
  const saksperiode = { startdato: new Date('2024-01-01'), sluttdato: new Date('2024-12-31') };
  const foerPerioden = lagRad({ fraOgMedDato: '2023-11-06', tilOgMedDato: '2023-11-19' });
  const iPerioden = lagRad({ fraOgMedDato: '2024-03-04', tilOgMedDato: '2024-03-17' });
  const etterPerioden = lagRad({ fraOgMedDato: '2025-01-06', tilOgMedDato: '2025-01-19' });
  const utenDatoer = lagRad({ fraOgMedDato: null, tilOgMedDato: null });

  it('beholder bare rader som overlapper saksperioden', () => {
    const resultat = filtrerRaderPaaSaksperiode([foerPerioden, iPerioden, etterPerioden], saksperiode);
    expect(resultat).toEqual([iPerioden]);
  });

  it('beholder rader som delvis overlapper saksperioden', () => {
    const overlapper = lagRad({ fraOgMedDato: '2023-12-25', tilOgMedDato: '2024-01-07' });
    expect(filtrerRaderPaaSaksperiode([overlapper], saksperiode)).toEqual([overlapper]);
  });

  it('beholder rader uten datoer', () => {
    expect(filtrerRaderPaaSaksperiode([utenDatoer], saksperiode)).toEqual([utenDatoer]);
  });

  it('returnerer alle rader når saksperioden mangler datoer', () => {
    const rader = [foerPerioden, iPerioden, etterPerioden];
    expect(filtrerRaderPaaSaksperiode(rader, { startdato: null, sluttdato: null })).toEqual(rader);
  });

  it('filtrerer bare på startdato når saken er løpende', () => {
    const resultat = filtrerRaderPaaSaksperiode([foerPerioden, iPerioden, etterPerioden], {
      startdato: new Date('2024-01-01'),
      sluttdato: null,
    });
    expect(resultat).toEqual([iPerioden, etterPerioden]);
  });
});

describe('sorterRaderEtterTilOgMedDesc', () => {
  const eldst = lagRad({ tilOgMedDato: '2017-08-06' });
  const midterst = lagRad({ tilOgMedDato: '2017-08-20' });
  const nyest = lagRad({ tilOgMedDato: '2017-09-03' });
  const utenDato = lagRad({ tilOgMedDato: null });

  it('sorterer rader synkende på til og med-dato', () => {
    const resultat = sorterRaderEtterTilOgMedDesc([eldst, nyest, midterst]);
    expect(resultat).toEqual([nyest, midterst, eldst]);
  });

  it('plasserer rader uten til og med-dato sist', () => {
    const resultat = sorterRaderEtterTilOgMedDesc([utenDato, eldst, nyest]);
    expect(resultat).toEqual([nyest, eldst, utenDato]);
  });

  it('muterer ikke den opprinnelige listen', () => {
    const original = [eldst, nyest, midterst];
    sorterRaderEtterTilOgMedDesc(original);
    expect(original).toEqual([eldst, nyest, midterst]);
  });
});

describe('formaterAnvistProsent', () => {
  it('formaterer anvist prosent fra backend', () => {
    expect(formaterAnvistProsent(lagRad({ reduksjon: lagReduksjon({ anvistProsent: 100 }) }))).toBe('100\u00a0%');
  });

  it('formaterer full 2-ukersperiode', () => {
    expect(formaterAnvistProsent(lagRad({ reduksjon: lagReduksjon({ anvistProsent: 200 }) }))).toBe('200\u00a0%');
  });

  it('returnerer tom streng for rad uten reduksjon', () => {
    expect(formaterAnvistProsent(lagRad({ reduksjon: null }))).toBe('');
  });

  it('returnerer tom streng når anvistProsent er null', () => {
    expect(formaterAnvistProsent(lagRad({ reduksjon: lagReduksjon({ anvistProsent: null }) }))).toBe('');
  });
});
