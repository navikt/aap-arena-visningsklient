'use client';

import styles from './arena-info.module.css';
import { useState } from 'react';
import { LocalAlert } from '@navikt/ds-react';

export function ArenaInfo(): React.ReactElement | null {
  const [erLukket, setErLukket] = useState(false);

  if (erLukket) {
    return null;
  }

  return (
    <LocalAlert status="announcement" size="small" className={styles.alert}>
      <LocalAlert.Header>
        <LocalAlert.Title as="h2">Ikke all informasjon vises her</LocalAlert.Title>
        <LocalAlert.CloseButton onClick={() => setErLukket(true)} />
      </LocalAlert.Header>
      <LocalAlert.Content>
        Visningsklienten viser ikke utfyllende informasjon om blant annet helseopplysninger og notater. Disse må du se i
        Arena.
      </LocalAlert.Content>
    </LocalAlert>
  );
}
