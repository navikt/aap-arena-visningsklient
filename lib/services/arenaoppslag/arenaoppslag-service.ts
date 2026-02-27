'use server';

import { apiFetch } from 'lib/services/api-fetch/apiFetch';
import { isError } from 'lib/utils/api';
import { mocksEnabled } from 'lib/utils/environment';
import { SakDTO, VedtakDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { getLogger } from 'lib/serverutlis/logger';
import { getMockSakFraArena } from 'lib/services/arenaoppslag/arenaoppslag-mock';

const baseUrl = process.env.ARENAOPPSLAG_API_BASE_URL;
const scope = process.env.ARENAOPPSLAG_API_SCOPE || '';
const logger = getLogger('lib.services.arenaoppslag');

export async function hentSak(saksId: string): Promise<VedtakDTO | null> {
  if (mocksEnabled()) {
    return getMockSakFraArena(saksId);
  }

  const response = await apiFetch<VedtakDTO>(`${baseUrl}/api/v1/sak/${saksId}`, scope, 'GET');
  if (isError(response)) {
    if (response.status === 404) {
      return null;
    }
    logger.error('Noe gikk galt ved henting av sak fra arenaoppslag', { response });
    throw Error('Noe gikk galt ved henting av sak fra arenaoppslag', { cause: response.apiException });
  }

  return response.data;
}
