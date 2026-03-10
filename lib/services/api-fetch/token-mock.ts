import { getLogger } from 'lib/serverutlis/logger';

const logger = getLogger('lib.services.api-fetch.token-mock');

export function getOboTokenForAudienceFromEnvironmentVariable(audience: string): string | null {
  switch (audience) {
    case process.env.TILGANG_API_SCOPE:
      return process.env.TILGANG_MOCK_OBO_TOKEN ?? null;
    case process.env.ARENAOPPSLAG_API_SCOPE:
      return process.env.ARENAOPPSLAG_MOCK_OBO_TOKEN ?? null;
    default:
      return null;
  }
}

async function getOboTokenFromLocalApp(url: string): Promise<string | null> {
  const response = await fetch(url, {
    method: 'POST',
  });

  if (response.ok) {
    const { access_token } = await response.json();
    if (access_token != null) {
      return access_token;
    }
  }
  logger.warn('Noe feilet ved henting av access-token!');
  return null;
}

export async function getMockedOboToken(audience: string): Promise<string | null> {
  if (audience === process.env.TILGANG_API_SCOPE && process.env.TILGANG_MOCK_OBO_TOKEN_URL != null) {
    return getOboTokenFromLocalApp(process.env.TILGANG_MOCK_OBO_TOKEN_URL);
  }
  if (audience === process.env.ARENAOPPSLAG_API_SCOPE && process.env.ARENAOPPSLAG_MOCK_OBO_TOKEN_URL != null) {
    return getOboTokenFromLocalApp(process.env.ARENAOPPSLAG_MOCK_OBO_TOKEN_URL);
  }
  return 'dummy-obo-token';
}
