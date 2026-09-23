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

  // Telleverk hentes i egen Suspense-grense slik at det ikke forsinker selve saksinnholdet.
  // Fanene ligger i (faner)/layout.tsx, slik at sider som vedtaksfakta kan vises med banner men uten faner.
  return (
    <>
      <PersonHeader sak={sak}>
        <Suspense fallback={<TelleverkSkeleton />}>
          <TelleverkFelter saksId={saksId} />
        </Suspense>
      </PersonHeader>
      <div className={styles.container}>{props.children}</div>
    </>
  );
}
