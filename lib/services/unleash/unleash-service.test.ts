import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { createClient, isEnabled, on, logger } = vi.hoisted(() => ({
  createClient: vi.fn(),
  isEnabled: vi.fn(),
  on: vi.fn(),
  logger: { warn: vi.fn(), error: vi.fn() },
}));

vi.mock('unleash-client', () => ({
  Unleash: class {
    constructor(options: unknown) {
      createClient(options);
    }
    isEnabled = isEnabled;
    on = on;
  },
}));
vi.mock('lib/serverutlis/logger', () => ({ getLogger: () => logger }));

describe('erFeatureFlaggAktivert', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
    vi.stubEnv('NEXT_PUBLIC_ENVIRONMENT', 'dev');
    vi.stubEnv('UNLEASH_SERVER_API_URL', 'https://unleash.example/');
    vi.stubEnv('UNLEASH_SERVER_API_ENV', 'development');
    vi.stubEnv('UNLEASH_SERVER_API_TOKEN', 'test-token');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('evaluates arbitrary flags using one server-side client', async () => {
    isEnabled.mockReturnValueOnce(true).mockReturnValueOnce(false);
    const { erFeatureFlaggAktivert } = await import('./unleash-service');

    expect(await erFeatureFlaggAktivert('test-flag-a')).toBe(true);
    expect(await erFeatureFlaggAktivert('test-flag-b')).toBe(false);
    expect(createClient).toHaveBeenCalledExactlyOnceWith({
      url: 'https://unleash.example/api',
      environment: 'development',
      appName: 'arenavisningsklient',
      customHeaders: { Authorization: 'test-token' },
    });
    expect(isEnabled).toHaveBeenNthCalledWith(1, 'test-flag-a');
    expect(isEnabled).toHaveBeenNthCalledWith(2, 'test-flag-b');
  });

  it.each([undefined, 'localhost', 'dev', 'prod'])(
    'enables all mock flags without a URL when NEXT_PUBLIC_ENVIRONMENT is %s',
    async (environment) => {
      vi.stubEnv('NEXT_PUBLIC_ENVIRONMENT', environment);
      vi.stubEnv('UNLEASH_SERVER_API_URL', undefined);
      vi.stubEnv('UNLEASH_SERVER_API_ENV', undefined);
      vi.stubEnv('UNLEASH_SERVER_API_TOKEN', undefined);
      const { erFeatureFlaggAktivert } = await import('./unleash-service');

      expect(await erFeatureFlaggAktivert('test-flag-a')).toBe(true);
      expect(await erFeatureFlaggAktivert('test-flag-b')).toBe(true);
      expect(createClient).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledOnce();
      expect(logger.error).not.toHaveBeenCalled();
    }
  );

  it('uses the mock when the URL is empty', async () => {
    vi.stubEnv('UNLEASH_SERVER_API_URL', '');
    const { erFeatureFlaggAktivert } = await import('./unleash-service');

    expect(await erFeatureFlaggAktivert('test-flag')).toBe(true);
    expect(createClient).not.toHaveBeenCalled();
  });

  it('uses real Unleash locally when a URL is configured', async () => {
    vi.stubEnv('NEXT_PUBLIC_ENVIRONMENT', 'localhost');
    isEnabled.mockReturnValue(true);
    const { erFeatureFlaggAktivert } = await import('./unleash-service');

    expect(await erFeatureFlaggAktivert('test-flag')).toBe(true);
    expect(createClient).toHaveBeenCalledOnce();
  });

  it.each(['UNLEASH_SERVER_API_ENV', 'UNLEASH_SERVER_API_TOKEN'])(
    'rejects missing %s when real Unleash is configured',
    async (variable) => {
      vi.stubEnv(variable, undefined);
      const { erFeatureFlaggAktivert } = await import('./unleash-service');

      await expect(erFeatureFlaggAktivert('test-flag')).rejects.toThrow('Mangler Unleash-konfigurasjon');
      expect(createClient).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledOnce();
    }
  );

  it('logs SDK update failures without exposing the token', async () => {
    isEnabled.mockReturnValue(false);
    const { erFeatureFlaggAktivert } = await import('./unleash-service');
    await erFeatureFlaggAktivert('test-flag');

    expect(on).toHaveBeenCalledWith('error', expect.any(Function));
    on.mock.calls[0][1]();
    expect(logger.error).toHaveBeenCalledExactlyOnceWith('Kunne ikke oppdatere Unleash-flagg');
  });
});
