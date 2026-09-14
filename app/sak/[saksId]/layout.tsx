import styles from './sak.module.css';
import { Suspense } from 'react';
import { logAudit } from 'lib/serverutlis/logger';
import { hentSak } from 'lib/services/arenaoppslag/arenaoppslag-service';
import { harTilgangTilBruker } from 'lib/services/tilgang/tilgang-service';
import { IkkeTilgang } from 'components/ikke-tilgang/ikke-tilgang';
import { SakIkkeFunnet } from 'components/sak-ikke-funnet/sak-ikke-funnet';
import { PersonHeader } from 'components/header/PersonHeader';
import { TelleverkFelter } from 'components/header/telleverk-felter';
import { TelleverkSkeleton } from 'components/header/telleverk-skeleton';
import { SakTabsNav } from 'app/sak/[saksId]/sak-tabs-nav';
import { SakTabsNavData } from 'app/sak/[saksId]/sak-tabs-nav-data';

export default async function SakLayout(props: { params: Promise<{ saksId: string }>; children: React.ReactNode }) {
  const { saksId } = await props.params;

  const sak = await hentSak(saksId);

  if (sak == null) {
    return <SakIkkeFunnet />;
  }

  const harTilgang = await harTilgangTilBruker(sak.person.fodselsnummer);

  if (!harTilgang) {
    return <IkkeTilgang saklopenummer={sak.lopenr} sakaar={sak.opprettetAar} />;
  }

  // Denne audit-loggen burde gjøres når man vet 100% at man viser denne dataen til bruker. Typisk etter man har hentet
  // data om en bestemt bruker. Viktig at man sørger for at den ikke logged mange ganger.
  logAudit(`Åpnet arenasak ${sak.sakId}`, 'audit:access', sak.person.fodselsnummer);

  const sakLabel = `Sak ${sak.opprettetAar} ${sak.lopenr}`;

  // Telleverk og oppgaver hentes i egne Suspense-grenser slik at de ikke forsinker selve saksinnholdet.
  return (
    <>
      <PersonHeader sak={sak}>
        <Suspense fallback={<TelleverkSkeleton />}>
          <TelleverkFelter saksId={saksId} />
        </Suspense>
      </PersonHeader>
      <div className={styles.container}>
        <Suspense fallback={<SakTabsNav saksId={saksId} sakLabel={sakLabel} antallOppgaver={null} />}>
          <SakTabsNavData saksId={saksId} sakLabel={sakLabel} />
        </Suspense>
        <div className={styles.tabcontent}>{props.children}</div>
      </div>
    </>
  );
}
