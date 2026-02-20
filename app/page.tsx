'use server';

import styles from './page.module.css';
import { BodyLong, Heading } from '@navikt/ds-react';
import Link from 'next/link';

export default async function Home() {
  const brukere = ['123123123', '456456456'];

  return (
    <>
      <img className={styles.logo} src="/nav_logo.png" alt="NAV-logo" />
      <Heading size="medium">Hello world, fra arena-visningsklient</Heading>
      <BodyLong size="medium">
        Her kommer en visningsklient som skal vise data fra Arena. Fokuset kommer til å være historiske data, og f.eks.
        vise hva som var lagt inn i en historisk sak i Arena etter brukeren er migrert til Kelvin.
      </BodyLong>
      <BodyLong size="medium">
        Under finner noen du noen testbrukere. Ved å trykke på dem kan du sjekke om den innloggede saksbehandleren har
        tilgang til å få innsyk i denne brukeren sine arena saker, samt liste opp Arena-sakene for denne brukeren
      </BodyLong>
      <ul>
        {brukere.map((bruker) => (
          <li key={bruker}>
            <Link href={`/bruker/${bruker}`}>{bruker}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
