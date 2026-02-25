import { apiFetch } from 'lib/services/api-fetch/apiFetch';
import { isError } from 'lib/utils/api';
import { isLocal } from 'lib/utils/environment';


const arenaOppslagsBaseUrl = process.env.ARENAOPPSLAG_API_BASE_URL;

const arenaOpplagsBaseScope = process.env.ARENAOPPSLAG_API_SCOPE ? process.env.ARENAOPPSLAG_API_SCOPE : "null";


interface PersonEksistererIAAPArena  {
  eksisterer : boolean;
}



export const hentExistererPerson = async (fnr: string): Promise<boolean> => {
  const url = `${arenaOppslagsBaseUrl}/api/v1/person/eksisterer`;

  console.log(arenaOpplagsBaseScope)

  if (arenaOpplagsBaseScope) return false

  const body = {
     "personidentifikatorer":[fnr],
  };

  const response = await apiFetch<PersonEksistererIAAPArena>(url, arenaOpplagsBaseScope, 'POST' ,body);

  if (isError(response)) {
    return false;
  }


  return response.data.eksisterer;
};