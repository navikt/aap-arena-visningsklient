'use client';

import { BodyLong, Heading, List, VStack } from '@navikt/ds-react';
import Link from 'next/link';

type SaksData = {
  sakId: string;
  info: string;
};

export function DevContent(): React.ReactElement {
  const brukere: SaksData[] = [
    { sakId: '2017-707799', info: 'AAP-sak med mange vedtak' },
    { sakId: '2021-331674', info: 'AAP-sak med mange vedtak' },
    { sakId: '2015-630813', info: 'Medium gammel AAP-sak med mange vedtak' },
    { sakId: '2015-631494', info: 'Medium gammel AAP-sak med mange vedtak' },
    { sakId: '2016-766458', info: 'Gammel AAP-sak med mange vedtak' },
    { sakId: '2015-635780', info: 'Gammel AAP-sak med mange vedtak' },
    { sakId: '2024-28531', info: 'AAP-sak med en del ulike vedtak' },
    { sakId: '2016-770618', info: 'Gammel AAP-sak hvor et vedtak fikk utfall NEI' },
    { sakId: '2021-143265', info: 'AAP-sak uten vedtak' },
    { sakId: '2021-147132', info: 'AAP-sak uten vedtak' },
    { sakId: '2023-15049', info: 'Sak med 11-5 vedtak' },
    { sakId: '2023-16217', info: 'Sak med 11-5 vedtak' },
    { sakId: '2021-112540', info: 'Klagesak' },
    { sakId: '2026-12639', info: 'Testsak med manuelt grunnlag' },
    { sakId: '2023-19822', info: 'Testsak1 hvor Asle har lagt inn litt vedtak' },
    { sakId: '2026-12663', info: 'Testsak2 hvor Asle har lagt inn litt vedtak' },
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
