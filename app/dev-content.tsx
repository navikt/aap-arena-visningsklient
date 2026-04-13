'use client';

import { BodyLong, Heading, List, VStack } from '@navikt/ds-react';
import Link from 'next/link';

type SaksData = {
  sakId: string;
  info: string;
};

export function DevContent(): React.ReactElement {
  const brukere: SaksData[] = [
    { sakId: '13721953', info: 'Ny AAP-sak med mange vedtak' },
    { sakId: '13725526', info: 'Ny AAP-sak med mange vedtak' },
    { sakId: '13322363', info: 'Medium gammel AAP-sak med mange vedtak' },
    { sakId: '13361135', info: 'Medium gammel AAP-sak med mange vedtak' },
    { sakId: '13397613', info: 'Gammel AAP-sak med mange vedtak' },
    { sakId: '13409999', info: 'Gammel AAP-sak med mange vedtak' },
    { sakId: '13697921', info: 'Gammel AAP-sak med gamle rettigheter' },
    { sakId: '13469475', info: 'Gammel sAAP-ak med gamle rettigheter' },
    { sakId: '13335922', info: 'AAP-sak uten vedtak' },
    { sakId: '13339857', info: 'AAP-sak uten vedtak' },
    { sakId: '13676545', info: 'Sak med 11-5 vedtak' },
    { sakId: '13691130', info: 'Sak med 11-5 vedtak' },
    { sakId: '13304506', info: 'Klagesak' },
  ];

  return (
    <VStack gap="space-8">
      <Heading size="medium">Eksempelsaker for testing</Heading>
      <BodyLong size="medium">
        Under finner noen du noen testsaker med litt ulik data som er fra Q2-databasen til Arena.
      </BodyLong>
      <List size="small">
        {brukere.map((sak) => (
          <List.Item key={sak.sakId}>
            <Link href={`/sak/${sak.sakId}`}>
              {sak.sakId} — {sak.info}
            </Link>
          </List.Item>
        ))}
      </List>
    </VStack>
  );
}
