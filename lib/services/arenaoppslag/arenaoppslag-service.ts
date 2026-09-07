'use server';

import { apiFetch } from 'lib/services/api-fetch/apiFetch';
import { isError } from 'lib/utils/api';
import { mocksEnabled } from 'lib/utils/environment';
import { SakDTO, TilkjentYtelseDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { getLogger, logAudit } from 'lib/serverutlis/logger';
import { getMockSakFraArena, getMockTilkjentYtelse } from 'lib/services/arenaoppslag/arenaoppslag-mock';
import { harTilgangTilBruker } from 'lib/services/tilgang/tilgang-service';

const baseUrl = process.env.ARENAOPPSLAG_API_BASE_URL;
const scope = process.env.ARENAOPPSLAG_API_SCOPE || '';
const logger = getLogger('lib.services.arenaoppslag');

export async function hentSak(saksId: string): Promise<SakDTO | null> {
  if (mocksEnabled()) {
    return getMockSakFraArena(saksId);
  }

  const response = await apiFetch<SakDTO>(`${baseUrl}/api/intern/sak/${saksId}/detaljert`, scope, 'GET');
  if (isError(response)) {
    if (response.status === 404) {
      return null;
    }
    logger.error('Noe gikk galt ved henting av sak fra arenaoppslag', { response });
    throw Error('Noe gikk galt ved henting av sak fra arenaoppslag', { cause: response });
  }

  return response.data;
}

export async function hentTilkjentYtelse(saksId: string): Promise<TilkjentYtelseDTO | null> {
  // Fødselsnummeret hentes på serveren og ikke fra klienten, slik at tilgangssjekken ikke kan omgås.
  const sak = await hentSak(saksId);
  if (sak == null) {
    return null;
  }

  const harTilgang = await harTilgangTilBruker(sak.person.fodselsnummer);
  if (!harTilgang) {
    logger.warn('Bruker har ikke tilgang til tilkjent ytelse for sak', { saksId });
    throw Error('Ingen tilgang til tilkjent ytelse for sak');
  }

  logAudit(`Åpnet tilkjent ytelse for arenasak ${sak.sakId}`, 'audit:access', sak.person.fodselsnummer);

  if (mocksEnabled()) {
    return getMockTilkjentYtelse(saksId);
  }

  const response = await apiFetch<TilkjentYtelseDTO>(
    `${baseUrl}/api/intern/sak/${saksId}/tilkjent-ytelse`,
    scope,
    'GET'
  );
  if (isError(response)) {
    if (response.status === 404) {
      return null;
    }
    logger.error('Noe gikk galt ved henting av tilkjent ytelse fra arenaoppslag', { response });
    throw Error('Noe gikk galt ved henting av tilkjent ytelse fra arenaoppslag', { cause: response });
  }

  return response.data;
}
