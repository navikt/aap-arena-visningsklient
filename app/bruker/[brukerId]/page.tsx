'use server';

import { BodyLong, Heading } from '@navikt/ds-react';
import { harTilgangTilBruker } from 'lib/services/tilgang/tilgang-service';
import { IkkeTilgang } from 'app/bruker/[brukerId]/ikke-tilgang';
import { logAudit } from 'lib/serverutlis/logger';

export default async function BrukerPage(props: { params: Promise<{ brukerId: string }> }) {
  const { brukerId } = await props.params;
  const harTilgang = await harTilgangTilBruker(brukerId);

  if (!harTilgang) {
    return <IkkeTilgang brukerId={brukerId} />;
  }

  // Denne audit-loggen burde gjøres når man vet 100% at man viser denne dataen til bruker. Typisk etter man har hentet
  // data om en bestemt bruker. Viktig at man sørger for at den ikke logged mange ganger.
  logAudit('Hentet oversikt over AAP-saker i Arena for bruker', 'audit:access', brukerId);

  return (
    <section>
      <Heading size="medium">Liste over AAP-saker i Arena for {brukerId}</Heading>
      <BodyLong>
        Her kan det f.eks. komme en liste med AAP-saker i arena som man kan trykke seg inn på for å få flere detaljer.
      </BodyLong>
    </section>
  );
}
