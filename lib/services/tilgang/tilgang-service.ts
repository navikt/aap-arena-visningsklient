'use server';

import { apiFetch } from 'lib/services/api-fetch/apiFetch';
import { isError } from 'lib/utils/api';
import { mocksEnabled } from 'lib/utils/environment';
import { getLogger } from 'lib/serverutlis/logger';
import { TilgangResponseDTO } from 'lib/services/tilgang/tilgang-types';
import { getMockTilgang } from 'lib/services/tilgang/tilgang-mock';

const baseUrl = process.env.TILGANG_API_BASE_URL || 'https://tilgang.aap';
const scope = process.env.TILGANG_API_SCOPE || '';
const logger = getLogger('lib.services.tilgang');

export async function harTilgangTilBruker(brukerIdent: string): Promise<boolean> {
  if (mocksEnabled()) {
    return getMockTilgang(brukerIdent);
  }

  const response = await apiFetch<TilgangResponseDTO>(`${baseUrl}/tilgang/person`, scope, 'POST', {
    personIdent: brukerIdent,
  });
  if (isError(response)) {
    logger.error('Noe gikk galt ved henting av tilgang', { response });
    return false;
  }

  return response.data.tilgang;
}
