import { hentOppgaverHvisTilgang } from 'lib/services/arenaoppslag/arenaoppslag-service';
import { SakTabsNav } from 'app/sak/[saksId]/sak-tabs-nav';

type Props = {
  saksId: string;
  sakLabel: string;
};

export async function SakTabsNavData({ saksId, sakLabel }: Props): Promise<React.ReactElement> {
  const oppgaver = await hentOppgaverHvisTilgang(saksId);

  return <SakTabsNav saksId={saksId} sakLabel={sakLabel} antallOppgaver={oppgaver?.length ?? 0} />;
}
