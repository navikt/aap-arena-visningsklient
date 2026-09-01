import { describe, expect, it } from 'vitest';
import { ArenaVedtakMedFaktaDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { finnFaktaverdi, harUnntakAAP } from 'lib/utils/vedtaksfakta';

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

describe('finnFaktaverdi', () => {
  it('henter verdien til faktakoden', () => {
    expect(finnFaktaverdi(lagVedtak([lagFakta('UNNTAKAAP', 'J')]), 'UNNTAKAAP')).toBe('J');
  });

  it('returnerer undefined når faktakoden mangler', () => {
    expect(finnFaktaverdi(lagVedtak([]), 'UNNTAKAAP')).toBeUndefined();
  });
});

describe('harUnntakAAP', () => {
  it('er true når et vedtak har innvilget unntak', () => {
    expect(harUnntakAAP([lagVedtak([lagFakta('FDATO', '01-01-2024')]), lagVedtak([lagFakta('UNNTAKAAP', 'J')])])).toBe(
      true
    );
  });

  it('er false når unntaket ikke er innvilget', () => {
    expect(harUnntakAAP([lagVedtak([lagFakta('UNNTAKAAP', 'N')])])).toBe(false);
  });

  it('er false når faktakoden mangler', () => {
    expect(harUnntakAAP([lagVedtak([])])).toBe(false);
  });

  it('er false for tom vedtaksliste', () => {
    expect(harUnntakAAP([])).toBe(false);
  });
});
