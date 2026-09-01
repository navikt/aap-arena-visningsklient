import { describe, expect, it } from 'vitest';
import { ArenaVedtakMedFaktaDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import {
  finnFradato,
  finnSaksperiode,
  finnTildato,
  formaterSaksperiode,
  harSaksperiode,
  overlapperSaksperiode,
} from 'lib/utils/saksperiode';
import { norsktDatoformat } from 'lib/utils/date';

const lagFakta = (kode: string, verdi: string) => ({ kode, navn: kode, verdi, registrertDato: '2024-01-01' });

const lagVedtak = (fakta: ReturnType<typeof lagFakta>[]): ArenaVedtakMedFaktaDTO =>
  ({
    vedtakId: 1,
    lopenrvedtak: 1,
    fakta,
    vilkårsvurderinger: [],
    andreYtelser: [],
    institusjonOpphold: null,
  }) as unknown as ArenaVedtakMedFaktaDTO;

describe('finnFradato', () => {
  it('bruker FDATO når justert fradato mangler', () => {
    expect(finnFradato(lagVedtak([lagFakta('FDATO', '01-01-2024')]))).toBe('01-01-2024');
  });

  it('bruker AAPJUSTFD fremfor FDATO', () => {
    expect(finnFradato(lagVedtak([lagFakta('FDATO', '01-01-2024'), lagFakta('AAPJUSTFD', '15-03-2024')]))).toBe(
      '15-03-2024'
    );
  });

  it('returnerer undefined når begge mangler', () => {
    expect(finnFradato(lagVedtak([]))).toBeUndefined();
  });
});

describe('finnTildato', () => {
  it('henter TDATO', () => {
    expect(finnTildato(lagVedtak([lagFakta('TDATO', '31-12-2024')]))).toBe('31-12-2024');
  });

  it('returnerer undefined når TDATO mangler', () => {
    expect(finnTildato(lagVedtak([]))).toBeUndefined();
  });
});

describe('finnSaksperiode', () => {
  it('returnerer tidligste fradato og seneste tildato', () => {
    const { startdato, sluttdato } = finnSaksperiode([
      lagVedtak([lagFakta('FDATO', '01-06-2023'), lagFakta('TDATO', '30-06-2024')]),
      lagVedtak([lagFakta('FDATO', '01-01-2023'), lagFakta('TDATO', '31-12-2024')]),
    ]);

    expect(norsktDatoformat(startdato!)).toBe('01.01.2023');
    expect(norsktDatoformat(sluttdato!)).toBe('31.12.2024');
  });

  it('returnerer null når vedtakene mangler datoer', () => {
    expect(finnSaksperiode([lagVedtak([])])).toEqual({ startdato: null, sluttdato: null });
  });

  it('returnerer null for tom vedtaksliste', () => {
    expect(finnSaksperiode([])).toEqual({ startdato: null, sluttdato: null });
  });

  it('håndterer løpende sak uten tildato', () => {
    const { startdato, sluttdato } = finnSaksperiode([lagVedtak([lagFakta('FDATO', '01-01-2024')])]);

    expect(norsktDatoformat(startdato!)).toBe('01.01.2024');
    expect(sluttdato).toBeNull();
  });
});

describe('harSaksperiode', () => {
  it('er false når begge datoene mangler', () => {
    expect(harSaksperiode({ startdato: null, sluttdato: null })).toBe(false);
  });

  it('er true når minst én dato finnes', () => {
    expect(harSaksperiode({ startdato: new Date('2024-01-01'), sluttdato: null })).toBe(true);
    expect(harSaksperiode({ startdato: null, sluttdato: new Date('2024-01-01') })).toBe(true);
  });
});

describe('formaterSaksperiode', () => {
  it('viser start- og sluttdato', () => {
    const tekst = formaterSaksperiode({ startdato: new Date('2024-01-01'), sluttdato: new Date('2024-12-31') });
    expect(tekst).toBe('01.01.2024\u00a0\u2013\u00a031.12.2024');
  });

  it('viser bare startdato når saken er løpende', () => {
    expect(formaterSaksperiode({ startdato: new Date('2024-01-01'), sluttdato: null })).toBe('Fra\u00a001.01.2024');
  });

  it('viser bare sluttdato når startdato mangler', () => {
    expect(formaterSaksperiode({ startdato: null, sluttdato: new Date('2024-12-31') })).toBe('Til\u00a031.12.2024');
  });

  it('returnerer null når begge datoene mangler', () => {
    expect(formaterSaksperiode({ startdato: null, sluttdato: null })).toBeNull();
  });
});

describe('overlapperSaksperiode', () => {
  const saksperiode = { startdato: new Date('2024-01-01'), sluttdato: new Date('2024-12-31') };

  it('godtar perioder inne i saksperioden', () => {
    expect(overlapperSaksperiode(new Date('2024-03-01'), new Date('2024-03-14'), saksperiode)).toBe(true);
  });

  it('godtar perioder som delvis overlapper', () => {
    expect(overlapperSaksperiode(new Date('2023-12-25'), new Date('2024-01-07'), saksperiode)).toBe(true);
    expect(overlapperSaksperiode(new Date('2024-12-25'), new Date('2025-01-07'), saksperiode)).toBe(true);
  });

  it('godtar perioder som tangerer ytterpunktene', () => {
    expect(overlapperSaksperiode(new Date('2023-12-01'), new Date('2024-01-01'), saksperiode)).toBe(true);
    expect(overlapperSaksperiode(new Date('2024-12-31'), new Date('2025-01-31'), saksperiode)).toBe(true);
  });

  it('avviser perioder helt før eller etter saksperioden', () => {
    expect(overlapperSaksperiode(new Date('2023-11-01'), new Date('2023-12-31'), saksperiode)).toBe(false);
    expect(overlapperSaksperiode(new Date('2025-01-01'), new Date('2025-01-14'), saksperiode)).toBe(false);
  });

  it('behandler manglende ytterpunkter som åpne', () => {
    expect(
      overlapperSaksperiode(new Date('2030-01-01'), new Date('2030-01-14'), { startdato: null, sluttdato: null })
    ).toBe(true);
    expect(
      overlapperSaksperiode(new Date('2030-01-01'), new Date('2030-01-14'), {
        startdato: new Date('2024-01-01'),
        sluttdato: null,
      })
    ).toBe(true);
  });

  it('behandler rader uten datoer som innenfor', () => {
    expect(overlapperSaksperiode(null, null, saksperiode)).toBe(true);
  });
});
