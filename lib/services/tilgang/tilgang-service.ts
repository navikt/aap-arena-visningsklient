'use server';

import { apiFetch } from 'lib/services/api-fetch/apiFetch';
import { isError } from 'lib/utils/api';
import { mocksEnabled } from 'lib/utils/environment';

const baseUrl = process.env.TILGANG_API_BASE_URL || 'https://tilgang.aap';
const scope = process.env.TILGANG_API_SCOPE || '';

export type TilgangResponse = {
  tilgang: boolean;
  tilgangIKontekst?: Record<string, boolean>;
};

export async function harTilgangTilBruker(brukerIdent: string): Promise<boolean> {
  if (mocksEnabled()) {
    return true;
  }

  const response = await apiFetch<TilgangResponse>(`${baseUrl}/tilgang/person`, scope, 'POST', {
    personIdent: brukerIdent,
  });
  if (isError(response)) {
    return false;
  }

  return response.data.tilgang;
}
