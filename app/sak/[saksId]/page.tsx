'use server';

import { BodyLong, Heading } from '@navikt/ds-react';
import { harTilgangTilBruker } from 'lib/services/tilgang/tilgang-service';
import { logAudit } from 'lib/serverutlis/logger';
import { IkkeTilgang } from 'components/ikke-tilgang/ikke-tilgang';
import { hentSak } from 'lib/services/arenaoppslag/arenaoppslag-service';
import { SakIkkeFunnet } from 'app/sak/[saksId]/sak-ikke-funnet';

export default async function SaksPage(props: { params: Promise<{ saksId: string }> }) {
  const { saksId } = await props.params;

  const saker = await hentSak(saksId);

  if (saker == null || saker.length === 0) {
    return <SakIkkeFunnet saksId={saksId} />;
  }

  const sak = saker[0];

  const harTilgang = await harTilgangTilBruker(sak.fodselsnr);

  if (!harTilgang) {
    return <IkkeTilgang brukerId={sak.fodselsnr} />;
  }

  // Denne audit-loggen burde gjøres når man vet 100% at man viser denne dataen til bruker. Typisk etter man har hentet
  // data om en bestemt bruker. Viktig at man sørger for at den ikke logged mange ganger.
  logAudit(`Åpnet arenasak ${sak.sakId}`, 'audit:access', sak.fodselsnr);

  return (
    <section>
      <Heading size="medium">AAP Arenasak {sak.sakId}</Heading>
      <BodyLong>Her skal det komme litt mer detaljert informasjon om den gitte saken for brukeren</BodyLong>
      <BodyLong>Fra og med: {sak.fraOgMed}</BodyLong>
      <BodyLong>Til-dato: {sak.tilDato}</BodyLong>
      <BodyLong>Rettighetskode: {sak.rettighetkode}</BodyLong>
    </section>
  );
}
