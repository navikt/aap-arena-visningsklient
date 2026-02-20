'use server';

import { TilgangTilBruker } from 'app/bruker/[brukerId]/tilgang';
import { Heading } from '@navikt/ds-react';

export default async function BrukerPage(props: { params: Promise<{ brukerId: string }> }) {
  const params = await props.params;

  return (
    <section>
      <Heading size="medium">Liste over saker i Arena for bruker</Heading>
      <TilgangTilBruker brukerIdent={params.brukerId} />
    </section>
  );
}
