import { hentOppgaverHvisTilgang, hentSakHvisTilgang } from 'lib/services/arenaoppslag/arenaoppslag-service';
import { Oppgaver } from 'components/oppgaver/oppgaver';
import { TilgangAvvist } from 'lib/utils/api';

export default async function OppgaverPage(props: { params: Promise<{ saksId: string }> }) {
  const { saksId } = await props.params;

  const [sak, oppgaver] = await Promise.all([hentSakHvisTilgang(saksId), hentOppgaverHvisTilgang(saksId)]);
  if (sak == null || sak === TilgangAvvist || oppgaver === TilgangAvvist) {
    return null;
  }

  return <Oppgaver oppgaver={oppgaver} />;
}
