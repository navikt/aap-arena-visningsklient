import { hentSakHvisTilgang } from 'lib/services/arenaoppslag/arenaoppslag-service';
import { Sakogvedtakinfo } from 'components/sakogvedtakinfo/sakogvedtakinfo';

export default async function SakPage(props: { params: Promise<{ saksId: string }> }) {
  const { saksId } = await props.params;

  const sak = await hentSakHvisTilgang(saksId);
  if (sak == null) {
    return null;
  }

  return <Sakogvedtakinfo sak={sak} />;
}
