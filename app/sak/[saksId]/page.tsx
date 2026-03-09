'use server';

import { BodyLong, Heading, VStack } from '@navikt/ds-react';
import { harTilgangTilBruker } from 'lib/services/tilgang/tilgang-service';
import { logAudit } from 'lib/serverutlis/logger';
import { IkkeTilgang } from 'components/ikke-tilgang/ikke-tilgang';
import { hentSak } from 'lib/services/arenaoppslag/arenaoppslag-service';
import { SakIkkeFunnet } from 'app/sak/[saksId]/sak-ikke-funnet';
import { SaksVedtak } from 'app/sak/[saksId]/Saksvedtak';

export default async function SaksPage(props: { params: Promise<{ saksId: string }> }) {
  const { saksId } = await props.params;

  const sak = await hentSak(saksId);

  if (sak == null) {
    return <SakIkkeFunnet saksId={saksId} />;
  }

  const harTilgang = await harTilgangTilBruker(sak.fodselsnummer);

  if (!harTilgang) {
    return <IkkeTilgang brukerId={sak.fodselsnummer} />;
  }

  // Denne audit-loggen burde gjøres når man vet 100% at man viser denne dataen til bruker. Typisk etter man har hentet
  // data om en bestemt bruker. Viktig at man sørger for at den ikke logged mange ganger.
  logAudit(`Åpnet arenasak ${sak.sakId}`, 'audit:access', sak.fodselsnummer);

  return (
    <section>
      <Heading size="medium">AAP Arenasak {sak.sakId}</Heading>
      <BodyLong>
        Saksnummer: {sak.opprettetAar}-{sak.lopenr}
      </BodyLong>
      <BodyLong>Fødselsnummer på sak: {sak.fodselsnummer}</BodyLong>
      <BodyLong>Registrert dato: {sak.registrertDato}</BodyLong>
      <BodyLong>Avsluttet dato: {sak.avsluttetDato ?? 'Ikke avsluttet'}</BodyLong>
      <BodyLong>Statuskode: {sak.statuskode}</BodyLong>
      <BodyLong>Antall vedtak på sak: {sak.vedtak.length}</BodyLong>

      <VStack gap="space-2">
        {sak.vedtak.map((vedtak) => (
          <SaksVedtak vedtak={vedtak} key={`${vedtak.fraOgMed}-${vedtak.rettighetkode}`} />
        ))}
      </VStack>
    </section>
  );
}
