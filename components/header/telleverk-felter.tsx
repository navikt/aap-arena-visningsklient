import { hentTelleverkHvisTilgang } from 'lib/services/arenaoppslag/arenaoppslag-service';
import { TelleverkVerdier } from 'components/header/telleverk-verdier';
import { TilgangAvvist } from 'lib/utils/api';

type Props = {
  saksId: string;
  harUnntaksperiode: boolean;
};

export async function TelleverkFelter({ saksId, harUnntaksperiode }: Props): Promise<React.ReactElement | null> {
  const telleverk = await hentTelleverkHvisTilgang(saksId);
  if (telleverk === TilgangAvvist) {
    return null;
  }

  return <TelleverkVerdier telleverk={telleverk} harUnntaksperiode={harUnntaksperiode} />;
}
