'use server';

import { BodyLong } from '@navikt/ds-react';
import { harTilgangTilBruker } from 'lib/services/tilgang/tilgang-service';
import { logAudit } from 'lib/serverutlis/logger';

type Props = {
  brukerIdent: string;
};

export async function TilgangTilBruker({ brukerIdent }: Props) {
  const harTilgang = await harTilgangTilBruker(brukerIdent);

  if (harTilgang) {
    logAudit('Hentet ut liste over AAP saker i Arena for bruker', 'audit:access', brukerIdent);
  }

  return (
    <section>
      <BodyLong>
        Har du tilgang til {brukerIdent}? {harTilgang ? 'Ja' : 'Nei'}
      </BodyLong>
    </section>
  );
}
