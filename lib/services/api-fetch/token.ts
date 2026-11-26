import { requestAzureOboToken, validateToken, getToken } from '@navikt/oasis';
import { getLogger } from 'lib/serverutlis/logger';
import { loginMocked } from 'lib/utils/environment';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getMockedOboToken } from 'lib/services/api-fetch/token-mock';
import { NAVJWTPayload, TokenType } from 'lib/services/api-fetch/token-types';

const logger = getLogger('lib.services.api-fetch.token');

export const getOboToken = async (audience: string): Promise<string> => {
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

  logger.error(`Henting av oboToken for ${audience} feilet`, { error: onBehalfOf.error.message });
  throw new Error(`Henting av oboToken for ${audience} feilet.`);
};

export const getValidatedToken = async (): Promise<TokenType> => {
  if (loginMocked()) {
    return { token: 'dummy-token', payload: { NAVident: 'VEILEDER', preferred_username: 'Veileder Kontor' } };
  }

  const requestHeaders = await headers();
  const redirectPath = requestHeaders.get('x-path');

  const token = getToken(requestHeaders);

  if (!token) {
    logger.warn('Fant ikke token i request, sender til innlogging');
    redirect(`/oauth2/login?redirect=${redirectPath}`);
  }

  const validation = await validateToken(token);
  if (!validation.ok) {
    logger.warn('Validering av token feilet, sender til innlogging', {
      errorType: validation.errorType,
      error: validation.error.message,
    });
    redirect(`/oauth2/login?redirect=${redirectPath}`);
  }

  return { token, payload: validation.payload as NAVJWTPayload };
};
