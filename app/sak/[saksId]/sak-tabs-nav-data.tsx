import { hentOppgaverHvisTilgang } from 'lib/services/arenaoppslag/arenaoppslag-service';
import { SakTabsNav } from 'app/sak/[saksId]/sak-tabs-nav';
import { TilgangAvvist } from 'lib/utils/api';

type Props = {
  saksId: string;
  sakLabel: string;
};

export async function SakTabsNavData({ saksId, sakLabel }: Props): Promise<React.ReactElement | null> {
  const oppgaver = await hentOppgaverHvisTilgang(saksId);
  if (oppgaver === TilgangAvvist) {
    return null;
  }

  return <SakTabsNav saksId={saksId} sakLabel={sakLabel} antallOppgaver={oppgaver?.length ?? 0} />;
}
