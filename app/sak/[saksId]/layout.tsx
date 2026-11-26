import styles from './sak.module.css';
import { Suspense } from 'react';
import { logAudit } from 'lib/serverutlis/logger';
import { hentSakHvisTilgang } from 'lib/services/arenaoppslag/arenaoppslag-service';
import { TilgangAvvist } from 'lib/utils/api';
import { IkkeTilgang } from 'components/ikke-tilgang/ikke-tilgang';
import { SakIkkeFunnet } from 'components/sak-ikke-funnet/sak-ikke-funnet';
import { PersonHeader } from 'components/header/PersonHeader';
import { TelleverkFelter } from 'components/header/telleverk-felter';
import { TelleverkSkeleton } from 'components/header/telleverk-skeleton';
import { harUnntakAAP } from 'lib/utils/vedtaksfakta';
import { ArenaInfo } from 'components/felleskomponenter/arena-info/arena-info';

export default async function SakLayout(props: { params: Promise<{ saksId: string }>; children: React.ReactNode }) {
  const { saksId } = await props.params;

  const sak = await hentSakHvisTilgang(saksId);

  if (sak == null) {
    return <SakIkkeFunnet />;
  }

  if (sak === TilgangAvvist) {
    return <IkkeTilgang />;
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
          <TelleverkFelter saksId={saksId} harUnntaksperiode={harUnntakAAP(sak.vedtak)} />
        </Suspense>
      </PersonHeader>
      <div className={styles.container}>
        <ArenaInfo />
        {props.children}
      </div>
    </>
  );
}
