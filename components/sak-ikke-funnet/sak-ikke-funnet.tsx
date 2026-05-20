'use client';

import styles from './sak-ikke-funnet.module.css';
import { GlobalAlert } from '@navikt/ds-react';

export function SakIkkeFunnet(): React.ReactElement {
  return (
    <div className={styles.wrapper}>
      <GlobalAlert className={styles.alert} status="warning" size="medium">
        <GlobalAlert.Header>
          <GlobalAlert.Title>Sak ikke funnet</GlobalAlert.Title>
        </GlobalAlert.Header>
        <GlobalAlert.Content>Fant ikke saken. Ta kontakt med brukerstøtte hvis feilen vedvarer.</GlobalAlert.Content>
      </GlobalAlert>
    </div>
  );
}
