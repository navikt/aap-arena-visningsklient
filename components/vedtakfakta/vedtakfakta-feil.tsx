'use client';

import styles from './vedtakfakta-feil.module.css';
import { Button, GlobalAlert, VStack } from '@navikt/ds-react';

type Props = {
  prøvIgjen: () => void;
};

export function VedtakfaktaFeil({ prøvIgjen }: Props): React.ReactElement {
  return (
    <div className={styles.wrapper}>
      <GlobalAlert className={styles.alert} status="error" size="medium">
        <GlobalAlert.Header>
          <GlobalAlert.Title>Klarte ikke å hente vedtaksfakta</GlobalAlert.Title>
        </GlobalAlert.Header>
        <GlobalAlert.Content>
          <VStack gap="space-16" align="start">
            Noe gikk galt da vedtaksfakta for vedtaket skulle hentes. Ta kontakt med brukerstøtte hvis feilen vedvarer.
            <Button variant="secondary" size="small" onClick={prøvIgjen}>
              Prøv igjen
            </Button>
          </VStack>
        </GlobalAlert.Content>
      </GlobalAlert>
    </div>
  );
}

export function VedtakIkkeFunnet(): React.ReactElement {
  return (
    <div className={styles.wrapper}>
      <GlobalAlert className={styles.alert} status="warning" size="medium">
        <GlobalAlert.Header>
          <GlobalAlert.Title>Vedtak ikke funnet</GlobalAlert.Title>
        </GlobalAlert.Header>
        <GlobalAlert.Content>
          Fant ikke vedtaket på saken. Ta kontakt med brukerstøtte hvis feilen vedvarer.
        </GlobalAlert.Content>
      </GlobalAlert>
    </div>
  );
}
