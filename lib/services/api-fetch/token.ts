import { requestAzureOboToken, validateToken, getToken } from '@navikt/oasis';
import { getLogger } from 'lib/serverutlis/logger';
import { isLocal, useMocks } from 'lib/utils/environment';
import { JWTPayload } from 'jose';
import { headers } from 'next/headers';

const NUMBER_OF_RETRIES = 3;
const logger = getLogger('lib.services.api-fetch.token');

type NAVJWTPayload = { NAVIdent: string; preferred_username: string } & JWTPayload;

type TokenType = {
  token: string;
  payload: NAVJWTPayload;
};

export const getMockedOboToken = async (audience: string): Promise<string | null> => {
  if (audience === process.env.TILGANG_API_SCOPE && process.env.TILGANG_MOCK_OBO_TOKEN_URL != null) {
    const response = await fetch(process.env.TILGANG_MOCK_OBO_TOKEN_URL, { method: 'POST' });
    if (response.ok) {
      const token = await response.json();
      return token['access_token'];
    }
  }

  if (useMocks()) {
    return 'dummy-obo-token';
  }
  return null;
};

export const getOboToken = async (audience: string, retries: number = 3): Promise<string> => {
  const mockedOboToken = await getMockedOboToken(audience);
  if (mockedOboToken != null) {
    return mockedOboToken;
  }

  const validatedToken = await getValidatedToken();
  const onBehalfOf = await requestAzureOboToken(validatedToken.token, audience);

  logger.info('Hentet obo-token ok?', onBehalfOf.ok);

  if (onBehalfOf.ok) {
    return onBehalfOf.token;
  }

  logger.warning(`Henting av oboToken for ${audience} feilet`, onBehalfOf.error);

  if (retries === 0) {
    throw new Error(`Henting av oboToken for ${audience} feilet etter ${NUMBER_OF_RETRIES} forsøk`);
  }
  return await getOboToken(audience, retries - 1);
};

export const getValidatedToken = async (): Promise<TokenType> => {
  if (isLocal()) {
    return { token: 'dummy-token', payload: { NAVIdent: 'VEILEDER', preferred_username: 'Veileder Kontor' } };
  }

  const requestHeaders = await headers();

  const token = getToken(requestHeaders);

  logger.info('Hentet token:', token);

  if (!token) {
    throw new Error('Token mangler (undefined, null eller tom)');
  }

  const validation = await validateToken(token);
  if (!validation.ok) {
    logger.error(`Token validerte ikke`);
    throw new Error('Token validerte ikke');
  }

  return { token, payload: validation.payload as NAVJWTPayload };
};
