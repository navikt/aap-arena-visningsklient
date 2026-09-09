import { hentSakHvisTilgang } from 'lib/services/arenaoppslag/arenaoppslag-service';
import { Oppgaver } from 'components/oppgaver/oppgaver';

export default async function OppgaverPage(props: { params: Promise<{ saksId: string }> }) {
  const { saksId } = await props.params;

  const sak = await hentSakHvisTilgang(saksId);
  if (sak == null) {
    return null;
  }

  return <Oppgaver sak={sak} />;
}
