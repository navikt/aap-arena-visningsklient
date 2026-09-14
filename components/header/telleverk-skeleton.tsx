'use client';

import styles from 'components/felleskomponenter/field-value/fieldvalue.module.css';
import { Detail, Skeleton, VStack } from '@navikt/ds-react';

const FELTER = ['Siste utbetaling', 'Maksdato', 'Gjenstående'];

// Speiler oppsettet i FieldValue slik at headeren ikke hopper når telleverket er hentet.
export function TelleverkSkeleton(): React.ReactElement {
  return (
    <>
      {FELTER.map((label) => (
        <VStack key={label}>
          <Detail className={styles.header}>{label}</Detail>
          <Skeleton variant="text" width="6rem" />
        </VStack>
      ))}
    </>
  );
}
