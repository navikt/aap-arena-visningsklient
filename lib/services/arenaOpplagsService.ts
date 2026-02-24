import { apiFetch } from 'lib/services/api-fetch/apiFetch';
import { isError } from 'lib/utils/api';
import { isLocal } from 'lib/utils/environment';


const arenaOppslagsBaseUrl = process.env.OPPTAK_BASE_URL || 'integrasjon.aap.intern.api.url"';

const arenaOpplagsBaseScoop = `integrasjon.aap.intern.api.scope"`;


interface PersonEksistererIAAPArena  {
  eksisterer : boolean;
}



export const hentExistererPerson = async (fnr: string): Promise<boolean> => {
  const url = `${arenaOppslagsBaseUrl}/api/v1/person/${fnr}/eksisterer`;
  if (isLocal()) {
    return true
  }
  const response = await apiFetch<PersonEksistererIAAPArena>(url, arenaOpplagsBaseScoop, 'POST');

  if (isError(response)) {
    return false;
  }


  return response.data.eksisterer;
};