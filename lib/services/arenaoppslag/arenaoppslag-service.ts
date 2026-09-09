'use server';

import { cache } from 'react';
import { apiFetch } from 'lib/services/api-fetch/apiFetch';
import { isError } from 'lib/utils/api';
import { mocksEnabled } from 'lib/utils/environment';
import { SakDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { getLogger } from 'lib/serverutlis/logger';
import { getMockSakFraArena } from 'lib/services/arenaoppslag/arenaoppslag-mock';
import { harTilgangTilBruker } from 'lib/services/tilgang/tilgang-service';

const baseUrl = process.env.ARENAOPPSLAG_API_BASE_URL;
const scope = process.env.ARENAOPPSLAG_API_SCOPE || '';
const logger = getLogger('lib.services.arenaoppslag');

// Cachet per request slik at layout og sub-sidene under /sak/[saksId] kan hente samme sak
// uavhengig av hverandre uten å utløse flere kall mot arenaoppslag (eller mock-dataene).
export const hentSak = cache(async (saksId: string): Promise<SakDTO | null> => {
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
});

// Sider/komponenter som viser arenaoppslag-data for en sak skal bruke denne i stedet for hentSak
// direkte, slik at tilgangssjekken alltid følger med. Layouten under /sak/[saksId] kan ikke garantere
// at en nestet side lar være å rendres/sendes til klienten selv om layouten ikke viser {children} for
// en bruker uten tilgang - se https://nextjs.org/docs/app/guides/authentication#layouts-and-auth-checks.
// Returnerer null både når saken ikke finnes og når bruker mangler tilgang, slik at ingen sak-data
// noensinne lekkes til en klient uten tilgang. Cachet per request på samme måte som hentSak.
export const hentSakHvisTilgang = cache(async (saksId: string): Promise<SakDTO | null> => {
  const sak = await hentSak(saksId);
  if (sak == null) {
    return null;
  }

  const harTilgang = await harTilgangTilBruker(sak.person.fodselsnummer);
  if (!harTilgang) {
    return null;
  }

  return sak;
});

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
