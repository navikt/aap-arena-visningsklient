import { describe, expect, it } from 'vitest';

import { TilkjentYtelseRadDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { formaterTilNok } from 'lib/utils/string';
import {
  beregnAnvistProsent,
  datoEllerIkkeFunnet,
  filtrerRader,
  formaterAnvistProsent,
  formaterGjenstaaendeDager,
  formaterTimer,
  formaterUke,
  IKKE_FUNNET,
  jaNeiEllerIkkeFunnet,
  kronerEllerIkkeFunnet,
  prosentEllerIkkeFunnet,
  sorterRaderEtterTilOgMedDesc,
  tekstEllerIkkeFunnet,
} from 'components/tilkjent-ytelse/tilkjent-ytelse-utils';

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

describe('beregnAnvistProsent', () => {
  it('returnerer 200 ved 0 % reduksjon (full 2-ukersperiode)', () => {
    expect(beregnAnvistProsent(0)).toBe(200);
  });

  it('returnerer 100 ved 50 % reduksjon', () => {
    expect(beregnAnvistProsent(50)).toBe(100);
  });

  it('returnerer 0 ved 100 % reduksjon', () => {
    expect(beregnAnvistProsent(100)).toBe(0);
  });

  it('runder til nærmeste heltall', () => {
    // 33,33 % reduksjon → (1 - 0.3333) × 200 ≈ 133,33 → avrunder til 133
    expect(beregnAnvistProsent(33.33)).toBe(133);
  });

  it('returnerer null for null og undefined', () => {
    expect(beregnAnvistProsent(null)).toBeNull();
    expect(beregnAnvistProsent(undefined)).toBeNull();
  });
});

describe('formaterAnvistProsent', () => {
  it('formaterer prosent korrekt for rad med reduksjon', () => {
    expect(formaterAnvistProsent(lagRad({ reduksjon: { totalReduksjonProsent: 50, timerArbeidetProsent: null, samordningsProsent: null, fravar: null, sykedager: null, institusjonsProsent: null, levertForSentDager: null } }))).toBe('100\u00a0%');
  });

  it('returnerer tom streng for rad uten reduksjon', () => {
    expect(formaterAnvistProsent(lagRad({ reduksjon: null }))).toBe('');
  });

  it('returnerer tom streng når totalReduksjonProsent er null', () => {
    expect(formaterAnvistProsent(lagRad({ reduksjon: { totalReduksjonProsent: null, timerArbeidetProsent: null, samordningsProsent: null, fravar: null, sykedager: null, institusjonsProsent: null, levertForSentDager: null } }))).toBe('');
  });
});

