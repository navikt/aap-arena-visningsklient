import { hentSakHvisTilgang, hentTilkjentYtelseHvisTilgang } from 'lib/services/arenaoppslag/arenaoppslag-service';
import { TilkjentYtelse } from 'components/tilkjent-ytelse/tilkjent-ytelse';
import { TilgangAvvist } from 'lib/utils/api';

export default async function TilkjentYtelsePage(props: { params: Promise<{ saksId: string }> }) {
  const { saksId } = await props.params;

  const [sak, tilkjentYtelse] = await Promise.all([hentSakHvisTilgang(saksId), hentTilkjentYtelseHvisTilgang(saksId)]);
  if (sak == null || sak === TilgangAvvist || tilkjentYtelse === TilgangAvvist) {
    return null;
  }

  return <TilkjentYtelse sak={sak} tilkjentYtelse={tilkjentYtelse} />;
}
