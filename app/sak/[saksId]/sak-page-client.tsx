'use client';

import styles from './sak.module.css';
import { SakDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { PersonHeader } from 'components/header/PersonHeader';
import { Tabs } from '@navikt/ds-react';
import { Sakogvedtakinfo } from 'components/sakogvedtakinfo/sakogvedtakinfo';
import { Meldekortperioder } from 'components/meldekortperioder/meldekortperioder';

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
              <Tabs.Tab value="spesialutbetaling" label="Spesialutbetaling" />
              <Tabs.Tab value="notater" label="Notater" />
            </Tabs.List>
            <Tabs.Panel value="sak">
              <div className={styles.tabcontent}>
                <Sakogvedtakinfo sak={sak} />
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="tilkjent-ytelse">
              <div className={styles.tabcontent}>
                <Meldekortperioder />
              </div>
            </Tabs.Panel>
          </Tabs>
        </div>
      </div>
    </>
  );
}
