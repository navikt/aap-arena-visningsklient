'use client';

import styles from './ikke-tilgang.module.css';
import { GlobalAlert } from '@navikt/ds-react';

export function IkkeTilgang(): React.ReactElement {
  return (
    <div className={styles.wrapper}>
      <GlobalAlert className={styles.alert} status="warning" size="medium">
        <GlobalAlert.Header>
          <GlobalAlert.Title>Ikke tilgang til sak</GlobalAlert.Title>
        </GlobalAlert.Header>
        <GlobalAlert.Content>
          Du har ikke tilgang til å se denne saken. Hvis du mener dette er feil, kan du ta kontakt med brukerstøtte.
        </GlobalAlert.Content>
      </GlobalAlert>
    </div>
  );
}
