import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiFetch } from 'lib/services/api-fetch/apiFetch';
import { harTilgangTilBruker } from 'lib/services/tilgang/tilgang-service';
import { erFeatureFlaggAktivert } from 'lib/services/unleash/unleash-service';
import { TilgangAvvist } from 'lib/utils/api';
import {
  hentKvotehistorikkHvisTilgang,
  hentOppgaverHvisTilgang,
  hentSak,
  hentSakHvisTilgang,
  hentTelleverkHvisTilgang,
  hentTilkjentYtelseHvisTilgang,
} from './arenaoppslag-service';

const logger = vi.hoisted(() => ({ error: vi.fn(), warn: vi.fn() }));

vi.mock('react', () => ({ cache: (fn: unknown) => fn }));
vi.mock('lib/services/api-fetch/apiFetch', () => ({ apiFetch: vi.fn() }));
vi.mock('lib/services/tilgang/tilgang-service', () => ({ harTilgangTilBruker: vi.fn() }));
vi.mock('lib/services/unleash/unleash-service', () => ({ erFeatureFlaggAktivert: vi.fn() }));
vi.mock('lib/utils/environment', () => ({ mocksEnabled: () => false }));
vi.mock('lib/serverutlis/logger', () => ({
  getLogger: () => logger,
}));

describe('arenaoppslag resource endpoints', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(erFeatureFlaggAktivert).mockResolvedValue(true);
    vi.mocked(harTilgangTilBruker).mockResolvedValue(true);
    vi.mocked(apiFetch)
      .mockResolvedValueOnce({ type: 'SUCCESS', data: { person: { fodselsnummer: 'test-person' } } })
      .mockResolvedValueOnce({ type: 'SUCCESS', data: [] });
  });

  it.each([
    [hentKvotehistorikkHvisTilgang, '/api/intern/autorisert/sak/test-sak/kvotehistorikk'],
    [hentOppgaverHvisTilgang, '/api/intern/sak/test-sak/oppgaver'],
    [hentTelleverkHvisTilgang, '/api/intern/sak/test-sak/telleverk'],
    [hentTilkjentYtelseHvisTilgang, '/api/intern/sak/test-sak/tilkjent-ytelse'],
  ])('uses the correct resource endpoint for %s', async (hentRessurs, sti) => {
    await hentRessurs('test-sak');

    expect(apiFetch).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('/api/intern/sak/test-sak/detaljert'),
      expect.any(String),
      'GET'
    );
    expect(apiFetch).toHaveBeenNthCalledWith(2, expect.stringContaining(sti), expect.any(String), 'GET');
    expect(harTilgangTilBruker).toHaveBeenCalledWith('test-person');
    expect(erFeatureFlaggAktivert).toHaveBeenCalledTimes(hentRessurs === hentKvotehistorikkHvisTilgang ? 1 : 0);
    if (hentRessurs === hentKvotehistorikkHvisTilgang) {
      expect(erFeatureFlaggAktivert).toHaveBeenCalledWith('AutoriserteEndepunkterHosArenaoppslag');
    }
  });

  it('forces the authorized kvotehistorikk endpoint when the flag is disabled', async () => {
    vi.mocked(erFeatureFlaggAktivert).mockResolvedValue(false);

    await hentKvotehistorikkHvisTilgang('test-sak');

    expect(apiFetch).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('/api/intern/autorisert/sak/test-sak/kvotehistorikk'),
      expect.any(String),
      'GET'
    );
  });

  it('handles kvotehistorikk permission denied gracefully when the flag is disabled', async () => {
    vi.mocked(erFeatureFlaggAktivert).mockResolvedValue(false);
    vi.mocked(apiFetch)
      .mockReset()
      .mockResolvedValueOnce({ type: 'SUCCESS', data: { person: { fodselsnummer: 'test-person' } } })
      .mockResolvedValueOnce({ type: 'ERROR', status: 403 });

    expect(await hentKvotehistorikkHvisTilgang('test-sak')).toBe(TilgangAvvist);
    expect(logger.error).not.toHaveBeenCalled();
    expect(apiFetch).toHaveBeenCalledTimes(2);
  });

  it.each([
    [hentOppgaverHvisTilgang, '/api/intern/sak/test-sak/oppgaver'],
    [hentTelleverkHvisTilgang, '/api/intern/sak/test-sak/telleverk'],
    [hentTilkjentYtelseHvisTilgang, '/api/intern/sak/test-sak/tilkjent-ytelse'],
  ])('does not force authorization for %s when the flag is disabled', async (hentRessurs, sti) => {
    vi.mocked(erFeatureFlaggAktivert).mockResolvedValue(false);

    await hentRessurs('test-sak');

    expect(apiFetch).toHaveBeenNthCalledWith(2, expect.stringContaining(sti), expect.any(String), 'GET');
    expect(erFeatureFlaggAktivert).not.toHaveBeenCalled();
  });

  it('preserves missing kvotehistorikk on 404', async () => {
    vi.mocked(apiFetch)
      .mockReset()
      .mockResolvedValueOnce({ type: 'SUCCESS', data: { person: { fodselsnummer: 'test-person' } } })
      .mockResolvedValueOnce({ type: 'ERROR', status: 404 });

    expect(await hentKvotehistorikkHvisTilgang('test-sak')).toBeNull();
  });

  it('still throws for unexpected kvotehistorikk errors', async () => {
    vi.mocked(apiFetch)
      .mockReset()
      .mockResolvedValueOnce({ type: 'SUCCESS', data: { person: { fodselsnummer: 'test-person' } } })
      .mockResolvedValueOnce({ type: 'ERROR', status: 500 });

    await expect(hentKvotehistorikkHvisTilgang('test-sak')).rejects.toThrow(
      'Noe gikk galt ved henting av kvotehistorikk fra arenaoppslag'
    );
    expect(logger.error).toHaveBeenCalled();
  });

  describe.each([
    hentKvotehistorikkHvisTilgang,
    hentOppgaverHvisTilgang,
    hentTelleverkHvisTilgang,
    hentTilkjentYtelseHvisTilgang,
  ])('%s', (hentRessurs) => {
    it('returns permission denied when the resource returns 403', async () => {
      vi.mocked(apiFetch)
        .mockReset()
        .mockResolvedValueOnce({ type: 'SUCCESS', data: { person: { fodselsnummer: 'test-person' } } })
        .mockResolvedValueOnce({ type: 'ERROR', status: 403 });

      expect(await hentRessurs('test-sak')).toBe(TilgangAvvist);
      expect(logger.warn).toHaveBeenCalled();
      expect(logger.error).not.toHaveBeenCalled();
    });

    it('does not fetch the resource when the case returns 403', async () => {
      vi.mocked(apiFetch).mockReset().mockResolvedValueOnce({ type: 'ERROR', status: 403 });

      expect(await hentRessurs('test-sak')).toBe(TilgangAvvist);
      expect(apiFetch).toHaveBeenCalledTimes(1);
      expect(harTilgangTilBruker).not.toHaveBeenCalled();
    });

    it('does not fetch the resource when local access is denied', async () => {
      vi.mocked(harTilgangTilBruker).mockResolvedValue(false);

      expect(await hentRessurs('test-sak')).toBe(TilgangAvvist);
      expect(apiFetch).toHaveBeenCalledTimes(1);
    });

    it('returns null when the resource returns 404', async () => {
      vi.mocked(apiFetch)
        .mockReset()
        .mockResolvedValueOnce({ type: 'SUCCESS', data: { person: { fodselsnummer: 'test-person' } } })
        .mockResolvedValueOnce({ type: 'ERROR', status: 404 });

      expect(await hentRessurs('test-sak')).toBeNull();
    });

    it('throws for unexpected resource errors', async () => {
      vi.mocked(apiFetch)
        .mockReset()
        .mockResolvedValueOnce({ type: 'SUCCESS', data: { person: { fodselsnummer: 'test-person' } } })
        .mockResolvedValueOnce({ type: 'ERROR', status: 500 });

      await expect(hentRessurs('test-sak')).rejects.toThrow();
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe.each([hentSak, hentSakHvisTilgang])('%s', (hent) => {
    it('returns permission denied for a backend 403', async () => {
      vi.mocked(apiFetch).mockReset().mockResolvedValueOnce({ type: 'ERROR', status: 403 });

      expect(await hent('test-sak')).toBe(TilgangAvvist);
      expect(harTilgangTilBruker).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
      expect(logger.error).not.toHaveBeenCalled();
    });

    it('returns null for a missing case', async () => {
      vi.mocked(apiFetch).mockReset().mockResolvedValueOnce({ type: 'ERROR', status: 404 });

      expect(await hent('test-sak')).toBeNull();
    });

    it('throws for unexpected case errors', async () => {
      vi.mocked(apiFetch).mockReset().mockResolvedValueOnce({ type: 'ERROR', status: 500 });

      await expect(hent('test-sak')).rejects.toThrow('Noe gikk galt ved henting av sak fra arenaoppslag');
      expect(logger.error).toHaveBeenCalled();
    });
  });

  it('returns permission denied when the local case access check fails', async () => {
    vi.mocked(harTilgangTilBruker).mockResolvedValue(false);

    expect(await hentSakHvisTilgang('test-sak')).toBe(TilgangAvvist);
  });

  it('preserves missing case handling', async () => {
    vi.mocked(apiFetch).mockReset().mockResolvedValueOnce({ type: 'ERROR', status: 404 });

    expect(await hentKvotehistorikkHvisTilgang('test-sak')).toBeNull();
    expect(apiFetch).toHaveBeenCalledTimes(1);
    expect(harTilgangTilBruker).not.toHaveBeenCalled();
  });
});
