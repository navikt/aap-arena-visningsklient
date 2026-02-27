'use server';

import { BodyLong, Heading } from '@navikt/ds-react';
import Link from 'next/link';

type SaksData = {
  saksnummer: string;
  info: string;
};

export default async function Home() {
  const brukere: SaksData[] = [{ saksnummer: '2021-0332162', info: 'Sak i Q2 arena' }];

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
          <li key={sak.saksnummer}>
            <Link href={`/sak/${sak.saksnummer}`}>
              {sak.saksnummer} — {sak.info}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
