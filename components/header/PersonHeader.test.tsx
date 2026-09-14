// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { PersonHeader } from 'components/header/PersonHeader';
import { TelleverkVerdier } from 'components/header/telleverk-verdier';
import { TelleverkSkeleton } from 'components/header/telleverk-skeleton';
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
  it('viser personinfo uavhengig av innholdet som sendes inn', () => {
    render(
      <PersonHeader sak={lagSak()}>
        <TelleverkSkeleton />
      </PersonHeader>
    );

    expect(screen.getByText('Test Testesen')).toBeInTheDocument();
    expect(screen.getByText('Maksdato')).toBeInTheDocument();
  });

  it('viser telleverkverdiene når de er hentet', () => {
    render(
      <PersonHeader sak={lagSak()}>
        <TelleverkVerdier telleverk={telleverk} />
      </PersonHeader>
    );

    expect(screen.getByText('200 dager (Ordinær)')).toBeInTheDocument();
    expect(screen.getByText('01.05.2026')).toBeInTheDocument();
    expect(screen.getByText('24.11.2025')).toBeInTheDocument();
  });
});

describe('TelleverkVerdier', () => {
  it('viser tomme verdier når telleverk mangler', () => {
    render(<TelleverkVerdier telleverk={null} />);

    expect(screen.getAllByText('—')).toHaveLength(3);
  });

  it('viser utvidet kvote når ordinær kvote er brukt opp', () => {
    render(
      <TelleverkVerdier
        telleverk={{
          telleverk: { ordineerAAPKvote: 0, utvidetAAPKvote: 200 },
          maksdato: null,
          sisteUtbetalingDato: null,
        }}
      />
    );

    expect(screen.getByText('10 dager (Utvidet)')).toBeInTheDocument();
  });
});
