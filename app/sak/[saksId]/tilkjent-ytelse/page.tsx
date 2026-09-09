import { hentSakHvisTilgang } from 'lib/services/arenaoppslag/arenaoppslag-service';
import { TilkjentYtelse } from 'components/tilkjent-ytelse/tilkjent-ytelse';

export default async function TilkjentYtelsePage(props: { params: Promise<{ saksId: string }> }) {
  const { saksId } = await props.params;

  const sak = await hentSakHvisTilgang(saksId);
  if (sak == null) {
    return null;
  }

  return <TilkjentYtelse sak={sak} />;
}
