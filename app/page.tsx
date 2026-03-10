'use server';

import { BodyLong, Heading } from '@navikt/ds-react';
import Link from 'next/link';

type SaksData = {
  sakId: string;
  info: string;
};

export default async function Home() {
  const brukere: SaksData[] = [
    { sakId: '13721953', info: 'Ny sak med mange vedtak' },
    { sakId: '13725526', info: 'Ny sak med mange vedtak' },
    { sakId: '13322363', info: 'Medium gammel sak med mange vedtak' },
    { sakId: '13361135', info: 'Medium gammel sak med mange vedtak' },
    { sakId: '13397613', info: 'Gammel sak med mange vedtak' },
    { sakId: '13409999', info: 'Gammel sak med mange vedtak' },
    { sakId: '13697921', info: 'Gammel sak med gamle rettigheter' },
    { sakId: '13469475', info: 'Gammel sak med gamle rettigheter' },
    { sakId: '13335922', info: 'Sak uten vedtak' },
    { sakId: '13339857', info: 'Sak uten vedtak' },
  ];

  return (
    <>
      <Heading size="medium">Hello world, fra arena-visningsklient</Heading>
      <BodyLong size="medium">
        Her kommer en visningsklient som skal vise data fra Arena. Fokuset kommer til å være historiske data, og f.eks.
        vise hva som var lagt inn i en historisk sak i Arena etter brukeren er migrert til Kelvin.
      </BodyLong>
      <BodyLong size="medium">
        Under finner noen du noen testsaker. Ved å trykke på den åpnes en testside med data fra Arena for denne saken.
      </BodyLong>
      <ul>
        {brukere.map((sak) => (
          <li key={sak.sakId}>
            <Link href={`/sak/${sak.sakId}`}>
              {sak.sakId} — {sak.info}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
