import styles from './faner.module.css';
import { Suspense } from 'react';
import { hentSakHvisTilgang } from 'lib/services/arenaoppslag/arenaoppslag-service';
import { SakTabsNav } from 'app/sak/[saksId]/sak-tabs-nav';
import { SakTabsNavData } from 'app/sak/[saksId]/sak-tabs-nav-data';

export default async function FanerLayout(props: { params: Promise<{ saksId: string }>; children: React.ReactNode }) {
  const { saksId } = await props.params;

  // Tilgangssjekk og feilvisning gjøres i app/sak/[saksId]/layout.tsx.
  const sak = await hentSakHvisTilgang(saksId);
  if (sak == null) {
    return null;
  }

  const sakLabel = `Sak ${sak.opprettetAar} ${sak.lopenr}`;

  // Oppgaver hentes i egen Suspense-grense slik at fanene kan vises med en gang.
  return (
    <>
      <Suspense fallback={<SakTabsNav saksId={saksId} sakLabel={sakLabel} antallOppgaver={null} />}>
        <SakTabsNavData saksId={saksId} sakLabel={sakLabel} />
      </Suspense>
      <div className={styles.tabcontent}>{props.children}</div>
    </>
  );
}
