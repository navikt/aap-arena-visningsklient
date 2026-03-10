'use client';

import styles from './sak.module.css';
import { SakDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { PersonHeader } from 'components/header/PersonHeader';
import { Tabs } from '@navikt/ds-react';
import { Sakogvedtakinfo } from 'components/sakogvedtakinfo/sakogvedtakinfo';
import { Meldekortperioder } from 'components/meldekortperioder/meldekortperioder';
import { Card } from 'components/felleskomponenter/card/Card';

type Props = {
  sak: SakDTO;
};

export function SakPageClient({ sak }: Props): React.ReactElement {
  return (
    <>
      <PersonHeader
        fodselsnummer={sak.person.fodselsnummer}
        fornavn={sak.person.fornavn}
        etternavn={sak.person.etternavn}
      />
      <div className={styles.container}>
        <div>
          <Tabs defaultValue="sak">
            <Tabs.List>
              <Tabs.Tab value="sak" label="Sak" />
              <Tabs.Tab value="meldekortperioder" label="Meldekortperioder" />
            </Tabs.List>
            <Tabs.Panel value="sak">
              <div className={styles.tabcontent}>
                <Sakogvedtakinfo sak={sak} />
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="meldekortperioder">
              <div className={styles.tabcontent}>
                <Meldekortperioder />
              </div>
            </Tabs.Panel>
          </Tabs>
        </div>
        <div>
          <Card>Her kan det komme informasjon om f.eks. kvoter</Card>
        </div>
      </div>
    </>
  );
}
