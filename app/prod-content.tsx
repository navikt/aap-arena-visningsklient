'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BodyLong, Button, Heading, HStack, TextField, VStack } from '@navikt/ds-react';

export function ProdContent(): React.ReactElement {
  const router = useRouter();
  const [sakId, setSakId] = useState('');

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!sakId) {
      return;
    }

    router.push(`/sak/${sakId.replace(' ', '-')}`);
  };

  return (
    <VStack gap="space-16">
      <Heading as="h2" size="medium">
        Visningsklient for AAP-arenasaker
      </Heading>
      <BodyLong size="medium">
        Her kan man slå opp saker som ligger i arena. Ved å skrive inn et saksnummer under så vil du bli navigert til en
        ny side for denne saken. Dette er ikke et søk, så man kan fint skrive inn ugyldige saksnummer og så vil den gå
        til ny side hvor den prøver å vise en sak som da ikke eksisterer (og dermed gir feilmelding).
      </BodyLong>
      <form onSubmit={handleSubmit}>
        <HStack gap="space-8" align="end">
          <TextField
            label="Skriv inn saksnummer på arenasak"
            size="small"
            placeholder="XXXX-XXXXXXX"
            value={sakId}
            onChange={(event) => setSakId(event.target.value)}
            inputMode="text"
            pattern="[0-9]{4}\-[0-9]+"
            autoComplete="off"
          />
          <Button type="submit" size="small" style={{ alignSelf: 'flex-end' }}>
            Åpne sak
          </Button>
        </HStack>
      </form>
    </VStack>
  );
}
