'use client';

import styles from './sak.module.css';
import { SakDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { PersonHeader } from 'components/header/PersonHeader';
import { InfoCard, Tabs } from '@navikt/ds-react';
import { Sakogvedtakinfo } from 'components/sakogvedtakinfo/sakogvedtakinfo';
import { Kvote } from 'components/kvote/kvote';
import { Oppgaver } from 'components/oppgaver/oppgaver';
import { TilkjentYtelse } from 'components/tilkjent-ytelse/tilkjent-ytelse';
import { useTilkjentYtelse } from 'components/tilkjent-ytelse/use-tilkjent-ytelse';
import { useState } from 'react';

type Props = {
  sak: SakDTO;
  // Arena-API-et slår opp saker på «år-løpenummer», ikke på den interne sak.sakId.
  saksId: string;
};

const TILKJENT_YTELSE_TAB = 'tilkjent-ytelse';

export function SakPageClient({ sak, saksId }: Props): React.ReactElement {
  const antallOppgaver = sak.oppgaver?.length ?? 0;
  const [aktivTab, setAktivTab] = useState('sak');

  // Hooken bor her fordi Tabs.Panel avmonteres ved fanebytte, og hentet data skal caches.
  const { tilkjentYtelse, status, hentPaaNytt } = useTilkjentYtelse(saksId, aktivTab === TILKJENT_YTELSE_TAB);

  return (
    <>
      <PersonHeader sak={sak} />
      <div className={styles.container}>
        <div>
          <Tabs value={aktivTab} onChange={setAktivTab}>
            <Tabs.List>
              <Tabs.Tab value="sak" label={`Sak ${sak.opprettetAar} ${sak.lopenr}`} />
              <Tabs.Tab value={TILKJENT_YTELSE_TAB} label="Tilkjent ytelse" />
              <Tabs.Tab value="kvote" label="Kvote" />
              <Tabs.Tab value="notater" label="Notater" />
              <Tabs.Tab value="oppgaver" label={`Oppgaver (${antallOppgaver})`} />
            </Tabs.List>
            <Tabs.Panel value="sak">
              <div className={styles.tabcontent}>
                <Sakogvedtakinfo sak={sak} />
              </div>
            </Tabs.Panel>
            <Tabs.Panel value={TILKJENT_YTELSE_TAB}>
              <div className={styles.tabcontent}>
                <TilkjentYtelse sak={sak} tilkjentYtelse={tilkjentYtelse} status={status} hentPaaNytt={hentPaaNytt} />
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="kvote">
              <Kvote sak={sak} />
            </Tabs.Panel>
            <Tabs.Panel value="notater">
              <IkkeImplementertEnda />
            </Tabs.Panel>
            <Tabs.Panel value="oppgaver">
              <Oppgaver sak={sak} />
            </Tabs.Panel>
          </Tabs>
        </div>
      </div>
    </>
  );
}

function IkkeImplementertEnda(): React.ReactElement {
  return (
    <InfoCard data-color="warning">
      <InfoCard.Header>
        <InfoCard.Title>Ikke implementert enda</InfoCard.Title>
      </InfoCard.Header>
      <InfoCard.Content>
        Denne informasjonen er ikke tilgjengelig fordi funksjonaliteten ikke er implementert helt enda.
      </InfoCard.Content>
    </InfoCard>
  );
}
