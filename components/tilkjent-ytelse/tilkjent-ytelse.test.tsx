// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { TilkjentYtelse } from 'components/tilkjent-ytelse/tilkjent-ytelse';
import { SakDTO, TilkjentYtelseDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';

const lagSak = (): SakDTO =>
  ({
    sakId: '2024-1',
    opprettetAar: 2024,
    lopenr: 1,
    statuskode: 'AKTIV',
    statusnavn: 'Aktiv',
    registrertDato: '2024-01-01',
    avsluttetDato: null,
    vedtak: [],
    telleverkForPerson: null,
    kvoteHistorikk: [],
    maksdato: null,
    sisteUtbetalingDato: null,
    oppgaver: [],
    person: {
      personId: 1,
      fodselsnummer: '01010101010',
      fornavn: 'Test',
      etternavn: 'Testesen',
    },
  }) as SakDTO;

const tomTilkjentYtelse: TilkjentYtelseDTO = { sakId: 1, rader: [] };

describe('TilkjentYtelse', () => {
  it('viser melding når saken ikke har tilkjent ytelse', () => {
    render(<TilkjentYtelse sak={lagSak()} tilkjentYtelse={null} />);

    expect(screen.getByText('Det finnes ingen tilkjent ytelse for denne saken.')).toBeInTheDocument();
  });

  it('viser filtervalg når tilkjent ytelse er hentet', () => {
    render(<TilkjentYtelse sak={lagSak()} tilkjentYtelse={tomTilkjentYtelse} />);

    expect(screen.getByRole('button', { name: 'Vis meldekort' })).toBeInTheDocument();
  });
});
