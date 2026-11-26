import { hentKvotehistorikkHvisTilgang, hentSakHvisTilgang } from 'lib/services/arenaoppslag/arenaoppslag-service';
import { Kvote } from 'components/kvote/kvote';
import { KvoteFeil } from 'components/kvote/kvote-feil';

export default async function KvotePage(props: { params: Promise<{ saksId: string }> }) {
  const { saksId } = await props.params;

  const [sak, kvotehistorikk] = await Promise.all([hentSakHvisTilgang(saksId), hentKvotehistorikkHvisTilgang(saksId)]);
  if (sak == null) {
    return null;
  }

  if (kvotehistorikk != null && !Array.isArray(kvotehistorikk)) {
    return <KvoteFeil ingenTilgang />;
  }

  return <Kvote sak={sak} kvotehistorikk={kvotehistorikk} />;
}
