'use client';

import styles from './sak.module.css';
import { SakDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { PersonHeader } from 'components/header/PersonHeader';
import { InfoCard, Tabs } from '@navikt/ds-react';
import { Sakogvedtakinfo } from 'components/sakogvedtakinfo/sakogvedtakinfo';

type Props = {
  sak: SakDTO;
};

export function SakPageClient({ sak }: Props): React.ReactElement {
  return (
    <>
      <PersonHeader sak={sak} />
      <div className={styles.container}>
        <div>
          <Tabs defaultValue="sak">
            <Tabs.List>
              <Tabs.Tab value="sak" label={`Sak ${sak.opprettetAar} ${sak.lopenr}`} />
              <Tabs.Tab value="tilkjent-ytelse" label="Tilkjent ytelse" />
              <Tabs.Tab value="notater" label="Notater" />
            </Tabs.List>
            <Tabs.Panel value="sak">
              <div className={styles.tabcontent}>
                <Sakogvedtakinfo sak={sak} />
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="tilkjent-ytelse">
              <IkkeImplementertEnda />
            </Tabs.Panel>
            <Tabs.Panel value="notater">
              <IkkeImplementertEnda />
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
