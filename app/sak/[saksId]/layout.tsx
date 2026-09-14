import styles from './sak.module.css';
import { logAudit } from 'lib/serverutlis/logger';
import {
  hentOppgaverHvisTilgang,
  hentSak,
  hentTelleverkHvisTilgang,
} from 'lib/services/arenaoppslag/arenaoppslag-service';
import { harTilgangTilBruker } from 'lib/services/tilgang/tilgang-service';
import { IkkeTilgang } from 'components/ikke-tilgang/ikke-tilgang';
import { SakIkkeFunnet } from 'components/sak-ikke-funnet/sak-ikke-funnet';
import { PersonHeader } from 'components/header/PersonHeader';
import { SakTabsNav } from 'app/sak/[saksId]/sak-tabs-nav';

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

  const [telleverk, oppgaver] = await Promise.all([hentTelleverkHvisTilgang(saksId), hentOppgaverHvisTilgang(saksId)]);

  return (
    <>
      <PersonHeader sak={sak} telleverk={telleverk} />
      <div className={styles.container}>
        <SakTabsNav
          saksId={saksId}
          sakLabel={`Sak ${sak.opprettetAar} ${sak.lopenr}`}
          antallOppgaver={oppgaver?.length ?? 0}
        />
        <div className={styles.tabcontent}>{props.children}</div>
      </div>
    </>
  );
}
