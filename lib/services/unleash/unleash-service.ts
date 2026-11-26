'use server';

import { Unleash } from 'unleash-client';
import { getLogger } from 'lib/serverutlis/logger';

const logger = getLogger('lib.services.unleash');
let client: Unleash | undefined;
let loggedMockFallback = false;

export async function erFeatureFlaggAktivert(flaggNavn: string): Promise<boolean> {
  const url = process.env.UNLEASH_SERVER_API_URL;

  if (!url) {
    if (!loggedMockFallback) {
      logger.warn('Unleash-URL mangler; bruker mock med alle feature-flagg aktivert');
      loggedMockFallback = true;
    }
    return true;
  }

  if (!client) {
    const token = process.env.UNLEASH_SERVER_API_TOKEN;
    const environment = process.env.UNLEASH_SERVER_API_ENV;
    if (!token || !environment) {
      logger.error('Mangler Unleash-konfigurasjon');
      throw new Error('Mangler Unleash-konfigurasjon');
    }
    client = new Unleash({
      url: `${url.replace(/\/$/, '')}/api`,
      environment,
      appName: 'arenavisningsklient',
      customHeaders: { Authorization: token },
    });
    client.on('error', () => logger.error('Kunne ikke oppdatere Unleash-flagg'));
  }

  return client.isEnabled(flaggNavn);
}
