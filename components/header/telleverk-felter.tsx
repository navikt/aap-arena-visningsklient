import { hentTelleverkHvisTilgang } from 'lib/services/arenaoppslag/arenaoppslag-service';
import { TelleverkVerdier } from 'components/header/telleverk-verdier';

type Props = {
  saksId: string;
};

export async function TelleverkFelter({ saksId }: Props): Promise<React.ReactElement> {
  const telleverk = await hentTelleverkHvisTilgang(saksId);

  return <TelleverkVerdier telleverk={telleverk} />;
}
