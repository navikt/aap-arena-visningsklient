'use client';

import { BodyLong, Detail, VStack } from '@navikt/ds-react';
import styles from './fieldvalue.module.css';

type Props = {
  label: string;
  value: string;
};

export function FieldValue({ label, value }: Props): React.ReactElement {
  return (
    <VStack>
      <Detail className={styles.header}>{label}</Detail>
      <BodyLong size="small">{value}</BodyLong>
    </VStack>
  );
}
