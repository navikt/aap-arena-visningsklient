import { hentSakHvisTilgang } from 'lib/services/arenaoppslag/arenaoppslag-service';
import { Sakogvedtakinfo } from 'components/sakogvedtakinfo/sakogvedtakinfo';

export default async function SakPage(props: { params: Promise<{ saksId: string }> }) {
  const { saksId } = await props.params;

  const sak = await hentSakHvisTilgang(saksId);
  if (sak == null) {
    return null;
  }

  // Denne audit-loggen burde gjøres når man vet 100% at man viser denne dataen til bruker. Typisk etter man har hentet
  // data om en bestemt bruker. Viktig at man sørger for at den ikke logged mange ganger.
  logAudit(`Åpnet arenasak ${sak.sakId}`, 'audit:access', sak.person.fodselsnummer);

  return <SakPageClient sak={sak} saksId={saksId} />;
  return <Sakogvedtakinfo sak={sak} />;
}
