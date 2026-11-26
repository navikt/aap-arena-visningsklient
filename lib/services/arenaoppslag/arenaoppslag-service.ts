'use server';

import { cache } from 'react';
import { apiFetch } from 'lib/services/api-fetch/apiFetch';
import { TilgangAvvist, isError } from 'lib/utils/api';
import { mocksEnabled } from 'lib/utils/environment';
import {
  KvoteHistorikkDTO,
  OppgaveDTO,
  SakDTO,
  TelleverkResponseDTO,
  TilkjentYtelseDTO,
} from 'lib/services/arenaoppslag/arenaoppslag-types';
import { getLogger } from 'lib/serverutlis/logger';
import {
  getMockKvotehistorikk,
  getMockOppgaver,
  getMockSakFraArena,
  getMockTelleverk,
  getMockTilkjentYtelse,
} from 'lib/services/arenaoppslag/arenaoppslag-mock';
import { harTilgangTilBruker } from 'lib/services/tilgang/tilgang-service';
import { erFeatureFlaggAktivert } from 'lib/services/unleash/unleash-service';

const baseUrl = process.env.ARENAOPPSLAG_API_BASE_URL;
const scope = process.env.ARENAOPPSLAG_API_SCOPE || '';
const logger = getLogger('lib.services.arenaoppslag');

export const hentSak = cache(async (saksId: string): Promise<SakDTO | typeof TilgangAvvist | null> => {
  if (mocksEnabled()) {
    return getMockSakFraArena(saksId);
  }

  const response = await apiFetch<SakDTO>(`${baseUrl}/api/intern/sak/${saksId}/detaljert`, scope, 'GET');
  if (isError(response)) {
    if (response.status === 403) {
      logger.warn('Bruker har ikke tilgang til sak', { saksId });
      return TilgangAvvist;
    }
    if (response.status === 404) {
      return null;
    }
    logger.error('Noe gikk galt ved henting av sak fra arenaoppslag', { response });
    throw Error('Noe gikk galt ved henting av sak fra arenaoppslag', { cause: response });
  }

  return response.data;
});

export const hentSakHvisTilgang = cache(async (saksId: string): Promise<SakDTO | typeof TilgangAvvist | null> => {
  const sak = await hentSak(saksId);
  if (sak == null || sak === TilgangAvvist) {
    return sak;
  }

  const harTilgang = await harTilgangTilBruker(sak.person.fodselsnummer);
  if (!harTilgang) {
    return TilgangAvvist;
  }

  return sak;
});

type Sakressurs<T> = {
  // Brukes i logg- og feilmeldinger, f.eks. "tilkjent ytelse".
  navn: string;
  sti: string;
  autorisert?: boolean;
  hentMock: (saksId: string) => T | null;
};

async function hentSakressursHvisTilgang<T>(
  saksId: string,
  ressurs: Sakressurs<T>
): Promise<T | typeof TilgangAvvist | null> {
  // Audit-logging for saken gjøres én gang i app/sak/[saksId]/layout.tsx, og gjentas derfor ikke her.
  // Fødselsnummeret hentes på serveren og ikke fra klienten, slik at tilgangssjekken ikke kan omgås.
  const sak = await hentSakHvisTilgang(saksId);
  if (sak == null || sak === TilgangAvvist) {
    return sak;
  }

  let autorisert = ressurs.autorisert ?? false;
  if (ressurs.autorisert !== undefined) {
    const flaggAktivert = await erFeatureFlaggAktivert('AutoriserteEndepunkterHosArenaoppslag');
    autorisert = flaggAktivert ? autorisert : true;
  }
  if (mocksEnabled()) {
    return ressurs.hentMock(saksId);
  }

  const apiSti = autorisert ? '/api/intern/autorisert' : '/api/intern';
  const response = await apiFetch<T>(`${baseUrl}${apiSti}/sak/${saksId}/${ressurs.sti}`, scope, 'GET');
  if (isError(response)) {
    if (response.status === 403) {
      logger.warn('Bruker har ikke tilgang til ressurs for sak', { saksId, ressurs: ressurs.navn });
      return TilgangAvvist;
    }
    if (response.status === 404) {
      return null;
    }
    logger.error('Noe gikk galt ved henting av ressurs fra arenaoppslag', { response, ressurs: ressurs.navn });
    throw Error(`Noe gikk galt ved henting av ${ressurs.navn} fra arenaoppslag`, { cause: response });
  }

  return response.data;
}

// Cachet per request på samme måte som hentSak, slik at flere kall i samme rendering
// ikke gir flere kall mot arenaoppslag.
export const hentTilkjentYtelseHvisTilgang = cache(
  async (saksId: string): Promise<TilkjentYtelseDTO | typeof TilgangAvvist | null> =>
    hentSakressursHvisTilgang<TilkjentYtelseDTO>(saksId, {
      navn: 'tilkjent ytelse',
      sti: 'tilkjent-ytelse',
      hentMock: getMockTilkjentYtelse,
    })
);

export const hentOppgaverHvisTilgang = cache(
  async (saksId: string): Promise<OppgaveDTO[] | typeof TilgangAvvist | null> =>
    hentSakressursHvisTilgang<OppgaveDTO[]>(saksId, {
      navn: 'oppgaver',
      sti: 'oppgaver',
      hentMock: getMockOppgaver,
    })
);

export const hentKvotehistorikkHvisTilgang = cache(
  async (saksId: string): Promise<KvoteHistorikkDTO[] | typeof TilgangAvvist | null> =>
    hentSakressursHvisTilgang<KvoteHistorikkDTO[]>(saksId, {
      navn: 'kvotehistorikk',
      sti: 'kvotehistorikk',
      autorisert: true,
      hentMock: getMockKvotehistorikk,
    })
);

export const hentTelleverkHvisTilgang = cache(
  async (saksId: string): Promise<TelleverkResponseDTO | typeof TilgangAvvist | null> =>
    hentSakressursHvisTilgang<TelleverkResponseDTO>(saksId, {
      navn: 'telleverk',
      sti: 'telleverk',
      hentMock: getMockTelleverk,
    })
);
