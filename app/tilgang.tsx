'use server';

import { BodyLong } from '@navikt/ds-react';
import { harTilgangTilBruker } from 'lib/services/tilgang/tilgang-service';
import { logAudit } from 'lib/serverutlis/logger';

type Props = {
  brukerIdent: string;
};

export async function TilgangTilBruker({ brukerIdent }: Props) {
  logAudit('Hentet ut liste over AAP saker i Arena for bruker', 'audit:access', brukerIdent);

  const harTilgang = await harTilgangTilBruker(brukerIdent);

  return (
    <section>
      <BodyLong>
        Har bruker tilgang til {brukerIdent}? {harTilgang ? 'Ja' : 'Nei'}{' '}
      </BodyLong>
    </section>
  );
}
