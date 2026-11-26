'use client';

import styles from './kvote-feil.module.css';
import { Button, GlobalAlert, VStack } from '@navikt/ds-react';

type Props = { ingenTilgang: true; prøvIgjen?: never } | { ingenTilgang?: false; prøvIgjen: () => void };

export function KvoteFeil({ ingenTilgang = false, prøvIgjen }: Props): React.ReactElement {
  return (
    <div className={styles.wrapper}>
      <GlobalAlert className={styles.alert} status={ingenTilgang ? 'warning' : 'error'} size="medium">
        <GlobalAlert.Header>
          <GlobalAlert.Title>
            {ingenTilgang ? 'Ikke tilgang til kvotehistorikk' : 'Klarte ikke å hente kvotehistorikk'}
          </GlobalAlert.Title>
        </GlobalAlert.Header>
        <GlobalAlert.Content>
          <VStack gap="space-16" align="start">
            {ingenTilgang
              ? 'Du har ikke tilgang til å se denne saken. Ta kontakt med brukerstøtte hvis feilen vedvarer.'
              : 'Noe gikk galt da kvotehistorikken for saken skulle hentes. Ta kontakt med brukerstøtte hvis feilen vedvarer.'}
            {prøvIgjen && (
              <Button variant="secondary" size="small" onClick={prøvIgjen}>
                Prøv igjen
              </Button>
            )}
          </VStack>
        </GlobalAlert.Content>
      </GlobalAlert>
    </div>
  );
}
