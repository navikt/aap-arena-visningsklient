import { hentOppgaverHvisTilgang, hentSakHvisTilgang } from 'lib/services/arenaoppslag/arenaoppslag-service';
import { Oppgaver } from 'components/oppgaver/oppgaver';

export default async function OppgaverPage(props: { params: Promise<{ saksId: string }> }) {
  const { saksId } = await props.params;

  const [sak, oppgaver] = await Promise.all([hentSakHvisTilgang(saksId), hentOppgaverHvisTilgang(saksId)]);
  if (sak == null) {
    return null;
  }

  return <Oppgaver oppgaver={oppgaver} />;
}
