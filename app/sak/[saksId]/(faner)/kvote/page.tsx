import { hentKvotehistorikkHvisTilgang, hentSakHvisTilgang } from 'lib/services/arenaoppslag/arenaoppslag-service';
import { Kvote } from 'components/kvote/kvote';
import { IkkeTilgang } from 'components/ikke-tilgang/ikke-tilgang';
import { TilgangAvvist } from 'lib/utils/api';

export default async function KvotePage(props: { params: Promise<{ saksId: string }> }) {
  const { saksId } = await props.params;

  const [sak, kvotehistorikk] = await Promise.all([hentSakHvisTilgang(saksId), hentKvotehistorikkHvisTilgang(saksId)]);
  if (sak == null || sak === TilgangAvvist) {
    return null;
  }

  if (kvotehistorikk === TilgangAvvist) {
    return <IkkeTilgang />;
  }

  return <Kvote sak={sak} kvotehistorikk={kvotehistorikk} />;
}
