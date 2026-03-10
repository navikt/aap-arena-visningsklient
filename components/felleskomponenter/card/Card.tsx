'use client';

import styles from './card.module.css';
import { Box, BoxProps } from '@navikt/ds-react';

export function Card({ children, className, ...restProps }: BoxProps): React.ReactElement {
  return (
    <Box
      className={`${styles.card} ${className ?? ''}`}
      background="default"
      borderRadius="8"
      padding="space-24"
      borderColor="neutral-subtle"
      borderWidth="1"
      {...restProps}
    >
      <>{children}</>
    </Box>
  );
}
