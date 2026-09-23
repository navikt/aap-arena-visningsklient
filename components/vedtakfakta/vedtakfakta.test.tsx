// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { Vedtakfakta } from 'components/vedtakfakta/vedtakfakta';
import { ArenaVedtakfaktaDTO, ArenaVedtakMedFaktaDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';

const lagFakta = (kode: string, navn: string, verdi: string | null): ArenaVedtakfaktaDTO => ({
  kode,
  navn,
  verdi,
  registrertDato: '2024-01-01',
});

const lagVedtak = (overrides: Partial<ArenaVedtakMedFaktaDTO> = {}): ArenaVedtakMedFaktaDTO =>
  ({
    vedtakId: 42,
    lopenrvedtak: 3,
    rettighetkode: 'AAP',
    rettighetnavn: 'Arbeidsavklaringspenger',
    fakta: [lagFakta('INNVF', 'Innvilget fra', '07-01-2023')],
    vilkårsvurderinger: [],
    andreYtelser: [],
    institusjonOpphold: null,
    ...overrides,
  }) as ArenaVedtakMedFaktaDTO;

describe('Vedtakfakta', () => {
  it('viser vedtaksnummer og rettighet i overskriften', () => {
    render(<Vedtakfakta vedtak={lagVedtak()} />);

    expect(screen.getByRole('heading', { name: 'Vedtaksfakta' })).toBeInTheDocument();
    expect(screen.getByText('Vedtak nr. 3 – Arbeidsavklaringspenger')).toBeInTheDocument();
  });

  it('viser fakta i samme rekkefølge som de ligger på vedtaket', () => {
    const fakta = [lagFakta('TDATO', 'Til dato', '2024-12-31'), lagFakta('FDATO', 'Fra dato', '2024-01-01')];

    render(<Vedtakfakta vedtak={lagVedtak({ fakta })} />);

    const rader = screen.getAllByRole('row').slice(1);
    expect(rader).toHaveLength(2);
    expect(within(rader[0]).getByText('Til dato')).toBeInTheDocument();
    expect(within(rader[0]).getByText('2024-12-31')).toBeInTheDocument();
    expect(within(rader[1]).getByText('Fra dato')).toBeInTheDocument();
    expect(within(rader[1]).getByText('2024-01-01')).toBeInTheDocument();
  });

  it('viser tankestrek når verdi mangler', () => {
    render(<Vedtakfakta vedtak={lagVedtak({ fakta: [lagFakta('BARN', 'Antall barn', null)] })} />);

    const rad = screen.getAllByRole('row')[1];
    expect(within(rad).getByText('Antall barn')).toBeInTheDocument();
    expect(within(rad).getByText('—')).toBeInTheDocument();
  });

  it('viser melding når vedtaket ikke har fakta', () => {
    render(<Vedtakfakta vedtak={lagVedtak({ fakta: [] })} />);

    expect(screen.getByText('Det er ingen vedtaksfakta på vedtaket')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
