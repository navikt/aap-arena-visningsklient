import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiFetch, apiFetchNoMemoization } from './apiFetch';
import { getOboToken } from './token';

vi.mock('./token', () => ({ getOboToken: vi.fn() }));
vi.mock('lib/serverutlis/logger', () => ({
  getLogger: () => ({ warn: vi.fn(), error: vi.fn() }),
}));

describe('apiFetch permission denied', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getOboToken).mockResolvedValue('test-token');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 403 })));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it.each([apiFetch, apiFetchNoMemoization])('does not retry a 403 response for %s', async (hent) => {
    expect(await hent('http://localhost/test', 'test-scope')).toEqual({ type: 'ERROR', status: 403 });
    expect(fetch).toHaveBeenCalledOnce();
    expect(getOboToken).toHaveBeenCalledOnce();
  });
});
