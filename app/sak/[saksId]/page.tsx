'use server';

import { harTilgangTilBruker } from 'lib/services/tilgang/tilgang-service';
import { logAudit } from 'lib/serverutlis/logger';
import { IkkeTilgang } from 'components/ikke-tilgang/ikke-tilgang';
import { hentSak } from 'lib/services/arenaoppslag/arenaoppslag-service';
import { SakIkkeFunnet } from 'app/sak/[saksId]/sak-ikke-funnet';
import { SakPageClient } from 'app/sak/[saksId]/sak-page-client';

export default async function SaksPage(props: { params: Promise<{ saksId: string }> }) {
  const { saksId } = await props.params;

  const sak = await hentSak(saksId);

  if (sak == null) {
    return <SakIkkeFunnet saksId={saksId} />;
  }

  const harTilgang = await harTilgangTilBruker(sak.person.fodselsnummer);

  if (!harTilgang) {
    return <IkkeTilgang brukerId={sak.person.fodselsnummer} />;
  }

  // Denne audit-loggen burde gjøres når man vet 100% at man viser denne dataen til bruker. Typisk etter man har hentet
  // data om en bestemt bruker. Viktig at man sørger for at den ikke logged mange ganger.
  logAudit(`Åpnet arenasak ${sak.sakId}`, 'audit:access', sak.person.fodselsnummer);

  return <SakPageClient sak={sak} />;
}
