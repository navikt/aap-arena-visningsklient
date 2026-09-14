// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { PersonHeader } from 'components/header/PersonHeader';
import { SakDTO, TelleverkResponseDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';

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
    person: {
      personId: 1,
      fodselsnummer: '01010101010',
      fornavn: 'Test',
      etternavn: 'Testesen',
    },
  }) as SakDTO;

const telleverk: TelleverkResponseDTO = {
  telleverk: { ordineerAAPKvote: 4000, utvidetAAPKvote: 0 },
  maksdato: '2026-05-01',
  sisteUtbetalingDato: '2025-11-24',
};

describe('PersonHeader', () => {
  it('viser verdier fra telleverk', () => {
    render(<PersonHeader sak={lagSak()} telleverk={telleverk} />);

    expect(screen.getByText('200 dager (Ordinær)')).toBeInTheDocument();
    expect(screen.getByText('01.05.2026')).toBeInTheDocument();
    expect(screen.getByText('24.11.2025')).toBeInTheDocument();
  });

  it('viser tomme verdier når telleverk mangler', () => {
    render(<PersonHeader sak={lagSak()} telleverk={null} />);

    expect(screen.getAllByText('—')).toHaveLength(3);
  });
});
