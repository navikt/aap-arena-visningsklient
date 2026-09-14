// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Kvote } from 'components/kvote/kvote';
import { KvoteHistorikkDTO, SakDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';

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

const lagKvoteHistorikk = (): KvoteHistorikkDTO[] => [
  {
    id: 1,
    kvoteTypeKode: 'AAP',
    endringsGrunnlag: 'MKORT',
    antallBevegelse: -200,
    posteringTypeKode: 'OPPD',
    datoHendelse: '2024-03-04',
    resterende: 4000,
    modUser: 'Z999999',
    begrunnelse: null,
  },
];

describe('Kvote', () => {
  it('viser rader fra kvotehistorikken', () => {
    render(<Kvote sak={lagSak()} kvotehistorikk={lagKvoteHistorikk()} />);

    expect(screen.getByText('Historikk ordinær periode')).toBeInTheDocument();
    expect(screen.getByText('Meldekort')).toBeInTheDocument();
    expect(screen.getByText('– 10 dager')).toBeInTheDocument();
    expect(screen.getByText('200 dager')).toBeInTheDocument();
  });

  it('viser tom tabell når kvotehistorikk mangler', () => {
    render(<Kvote sak={lagSak()} kvotehistorikk={null} />);

    expect(screen.getByText('Historikk ordinær periode')).toBeInTheDocument();
    expect(screen.queryByText('Meldekort')).not.toBeInTheDocument();
  });
});
