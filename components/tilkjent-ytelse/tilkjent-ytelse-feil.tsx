'use client';

import styles from './tilkjent-ytelse-feil.module.css';
import { Button, GlobalAlert, VStack } from '@navikt/ds-react';

type Props = {
  prøvIgjen: () => void;
};

export function TilkjentYtelseFeil({ prøvIgjen }: Props): React.ReactElement {
  return (
    <div className={styles.wrapper}>
      <GlobalAlert className={styles.alert} status="error" size="medium">
        <GlobalAlert.Header>
          <GlobalAlert.Title>Klarte ikke å hente tilkjent ytelse</GlobalAlert.Title>
        </GlobalAlert.Header>
        <GlobalAlert.Content>
          <VStack gap="space-16" align="start">
            Noe gikk galt da tilkjent ytelse for saken skulle hentes. Ta kontakt med brukerstøtte hvis feilen vedvarer.
            <Button variant="secondary" size="small" onClick={prøvIgjen}>
              Prøv igjen
            </Button>
          </VStack>
        </GlobalAlert.Content>
      </GlobalAlert>
    </div>
  );
}
