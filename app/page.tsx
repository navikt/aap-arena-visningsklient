'use server';

import { BodyLong, Heading } from '@navikt/ds-react';
import Link from 'next/link';
import { isLocal } from 'lib/utils/environment';

type BrukerData = {
  personIdent: string;
  info: string;
};

export default async function Home() {
  let brukere: BrukerData[] = [
    { personIdent: '03508331575', info: 'FNR strengt-fortrolig' },
    { personIdent: '24506504690', info: 'FNR Kode6' },
    { personIdent: '07518515297', info: 'FNR Bosatt Trondheim' },
    { personIdent: '2915150334208', info: 'AktørID Bosatt Trondheim' },
    { personIdent: '08466912299', info: 'FNR Bosatt Bergen' },
    { personIdent: '2904101399733', info: 'AktørID Bosatt Bergen' },
  ];

  if (isLocal()) {
    brukere = [
      { personIdent: '123', info: 'Ugyldig brukerident hvor tilgang-mock sier Nei' },
      { personIdent: '456', info: 'Ugyldig brukerident hvor tilgang-mock sier ja' },
      ...brukere,
    ];
  }

  return (
    <>
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
          <li key={bruker.personIdent}>
            <Link href={`/bruker/${bruker.personIdent}`}>
              {bruker.personIdent} — {bruker.info}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
