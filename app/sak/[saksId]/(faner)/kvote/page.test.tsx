// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { hentKvotehistorikkHvisTilgang, hentSakHvisTilgang } from 'lib/services/arenaoppslag/arenaoppslag-service';
import { SakDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { TilgangAvvist } from 'lib/utils/api';
import KvotePage from './page';

vi.mock('lib/services/arenaoppslag/arenaoppslag-service', () => ({
  hentKvotehistorikkHvisTilgang: vi.fn(),
  hentSakHvisTilgang: vi.fn(),
}));

const sak: SakDTO = {
  sakId: '2021-1',
  opprettetAar: 2021,
  lopenr: 1,
  person: {
    personId: 1,
    fodselsnummer: 'test-person',
    fornavn: 'Test',
    etternavn: 'Testesen',
  },
  statuskode: 'AKTIV',
  statusnavn: 'Aktiv',
  registrertDato: '2021-01-01',
  avsluttetDato: null,
  vedtak: [],
};

const props = () => ({ params: Promise.resolve({ saksId: sak.sakId }) });

describe('KvotePage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(hentSakHvisTilgang).mockResolvedValue(sak);
  });

  it('viser felles tilgangsmelding når bare kvotehistorikk avviser tilgang', async () => {
    vi.mocked(hentKvotehistorikkHvisTilgang).mockResolvedValue(TilgangAvvist);

    render(await KvotePage(props()));

    expect(screen.getByRole('heading', { name: 'Advarsel: Ikke tilgang til sak' })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Du har ikke tilgang til å se denne saken. Hvis du mener dette er feil, kan du ta kontakt med brukerstøtte.'
      )
    ).toBeInTheDocument();
    expect(screen.queryByText('Historikk ordinær periode')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Prøv igjen' })).not.toBeInTheDocument();
  });

  it('viser ingenting ved avvist tilgang til saken', async () => {
    vi.mocked(hentSakHvisTilgang).mockResolvedValue(TilgangAvvist);
    vi.mocked(hentKvotehistorikkHvisTilgang).mockResolvedValue([]);

    expect(await KvotePage(props())).toBeNull();
  });

  it.each([[], null])('beholder kvotetabellen når historikken er %s', async (kvotehistorikk) => {
    vi.mocked(hentKvotehistorikkHvisTilgang).mockResolvedValue(kvotehistorikk);

    render(await KvotePage(props()));

    expect(screen.getByText('Historikk ordinær periode')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Advarsel: Ikke tilgang til sak' })).not.toBeInTheDocument();
  });

  it('beholder uventede feil for feilgrensen', async () => {
    const feil = new Error('Uventet feil');
    vi.mocked(hentKvotehistorikkHvisTilgang).mockRejectedValue(feil);

    await expect(KvotePage(props())).rejects.toBe(feil);
  });

  it('viser ingenting når saken mangler', async () => {
    vi.mocked(hentSakHvisTilgang).mockResolvedValue(null);
    vi.mocked(hentKvotehistorikkHvisTilgang).mockResolvedValue(null);

    expect(await KvotePage(props())).toBeNull();
  });
});
