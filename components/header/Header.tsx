'use server';

import { getValidatedToken } from 'lib/services/api-fetch/token';
import { HeaderClient } from 'components/header/HeaderClient';

export async function Header(): Promise<React.ReactElement> {
  const token = await getValidatedToken();

  return <HeaderClient visningsnavn={token.payload.preferred_username} />;
}
