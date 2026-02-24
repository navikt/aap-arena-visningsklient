'use client'

import { HStack, InternalHeader, Link } from '@navikt/ds-react';

export const ClientHeader = () => {
  return (
    <InternalHeader>
      <InternalHeader.Title href="/">Arena Visnings klient</InternalHeader.Title>

      <HStack>
        <Link href={'/sokOmPersonFinnes/'}>Søk om person finnes</Link>
      </HStack>

    </InternalHeader>
  );
}

