import { requestAzureOboToken, validateToken, getToken } from '@navikt/oasis';
import { getLogger } from 'lib/serverutlis/logger';
import { loginMocked, usesLocalWonderwall } from 'lib/utils/environment';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getMockedOboToken, getOboTokenForAudienceFromEnvironmentVariable } from 'lib/services/api-fetch/token-mock';
import { NAVJWTPayload, TokenType } from 'lib/services/api-fetch/token-types';

const NUMBER_OF_RETRIES = 3;
const logger = getLogger('lib.services.api-fetch.token');

export const getOboToken = async (audience: string, retries: number = 3): Promise<string> => {
  if (usesLocalWonderwall()) {
    const oboToken = getOboTokenForAudienceFromEnvironmentVariable(audience);
    if (oboToken == null) {
      throw new Error(
        'Klarte ikke hente OBO-token fra miljøvariabel, miljøvariabel må være satt når man kjører med lokal winderwall'
      );
    }
    return oboToken;
  }

  if (loginMocked()) {
    const oboToken = await getMockedOboToken(audience);
    if (oboToken == null) {
      throw new Error('Klarte ikke hente mocket OBO-token fra lokal backend app.');
    }
    return oboToken;
  }

  const validatedToken = await getValidatedToken();
  const onBehalfOf = await requestAzureOboToken(validatedToken.token, audience);

  if (onBehalfOf.ok) {
    return onBehalfOf.token;
  }

  logger.warn(`Henting av oboToken for ${audience} feilet`, { response: onBehalfOf });

  if (retries === 0) {
    throw new Error(`Henting av oboToken for ${audience} feilet etter ${NUMBER_OF_RETRIES} forsøk`);
  }
  return await getOboToken(audience, retries - 1);
};

export const getValidatedToken = async (): Promise<TokenType> => {
  if (loginMocked()) {
    return { token: 'dummy-token', payload: { NAVident: 'VEILEDER', preferred_username: 'Veileder Kontor' } };
  }

  const requestHeaders = await headers();
  const redirectPath = requestHeaders.get('x-path');

  const token = getToken(requestHeaders);

  if (!token) {
    redirect(`/oauth2/login?redirect=${redirectPath}`);
  }

  const validation = await validateToken(token);
  if (!validation.ok) {
    redirect(`/oauth2/login?redirect=${redirectPath}`);
  }

  return { token, payload: validation.payload as NAVJWTPayload };
};
