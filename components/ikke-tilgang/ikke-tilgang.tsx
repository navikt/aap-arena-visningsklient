'use client';

import styles from './ikke-tilgang.module.css';
import { GlobalAlert } from '@navikt/ds-react';

type Props = {
  saklopenummer: number;
  sakaar: number;
};

export function IkkeTilgang({ saklopenummer, sakaar }: Props): React.ReactElement {
  return (
    <div className={styles.wrapper}>
      <GlobalAlert className={styles.alert} status="warning" size="medium">
        <GlobalAlert.Header>
          <GlobalAlert.Title>Ikke tilgang til sak</GlobalAlert.Title>
        </GlobalAlert.Header>
        <GlobalAlert.Content>
          Du har ikke tilgang til bruker på sak {sakaar} {saklopenummer}. Hvis du mener dette er feil, kan du ta kontakt
          med brukerstøtte.
        </GlobalAlert.Content>
      </GlobalAlert>
    </div>
  );
}
