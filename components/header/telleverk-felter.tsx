import { hentTelleverkHvisTilgang } from 'lib/services/arenaoppslag/arenaoppslag-service';
import { TelleverkVerdier } from 'components/header/telleverk-verdier';

type Props = {
  saksId: string;
  harUnntaksperiode: boolean;
};

export async function TelleverkFelter({ saksId, harUnntaksperiode }: Props): Promise<React.ReactElement> {
  const telleverk = await hentTelleverkHvisTilgang(saksId);

  return <TelleverkVerdier telleverk={telleverk} harUnntaksperiode={harUnntaksperiode} />;
}
