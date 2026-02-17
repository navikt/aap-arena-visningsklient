'use server';

import { apiFetch } from 'lib/services/api-fetch/apiFetch';
import { isError } from 'lib/utils/api';
import { getLogger } from 'lib/serverutlis/logger';
import { useMocks } from 'lib/utils/environment';

const baseUrl = process.env.TILGANG_API_BASE_URL || 'https://tilgang.aap';
const scope = process.env.TILGANG_API_SCOPE || '';

const logger = getLogger('lib.services.tilgang.tilgang-service');

export type TilgangResponse = {
  tilgang: boolean;
  tilgangIKontekst?: Record<string, Boolean>;
};

export async function harTilgangTilBruker(brukerIdent: string): Promise<boolean> {
  if (useMocks()) {
    return true;
  }

  const response = await apiFetch<TilgangResponse>(`${baseUrl}/person`, scope, 'POST', { personIdent: brukerIdent });
  if (isError(response)) {
    return false;
  }

  return response.data.tilgang;
}
