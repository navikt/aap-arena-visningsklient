'use server';

import { hentExistererPerson } from 'lib/services/arenaOpplagsService';

export async function checkPersonExists(fnr: string): Promise<boolean> {
  return await hentExistererPerson(fnr);
}
