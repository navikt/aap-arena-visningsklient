import { hentSakHvisTilgang } from 'lib/services/arenaoppslag/arenaoppslag-service';
import { Kvote } from 'components/kvote/kvote';

export default async function KvotePage(props: { params: Promise<{ saksId: string }> }) {
  const { saksId } = await props.params;

  const sak = await hentSakHvisTilgang(saksId);
  if (sak == null) {
    return null;
  }

  return <Kvote sak={sak} />;
}
