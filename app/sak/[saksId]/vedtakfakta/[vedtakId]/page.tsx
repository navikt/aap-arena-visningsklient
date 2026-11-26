import { hentSakHvisTilgang } from 'lib/services/arenaoppslag/arenaoppslag-service';
import { Vedtakfakta } from 'components/vedtakfakta/vedtakfakta';
import { VedtakIkkeFunnet } from 'components/vedtakfakta/vedtakfakta-feil';
import { TilgangAvvist } from 'lib/utils/api';

export default async function VedtakfaktaPage(props: { params: Promise<{ saksId: string; vedtakId: string }> }) {
  const { saksId, vedtakId } = await props.params;

  const sak = await hentSakHvisTilgang(saksId);
  if (sak == null || sak === TilgangAvvist) {
    return null;
  }

  const vedtak = sak.vedtak.find((v) => v.vedtakId.toString() === vedtakId);
  if (vedtak == null) {
    return <VedtakIkkeFunnet />;
  }

  return <Vedtakfakta vedtak={vedtak} />;
}
