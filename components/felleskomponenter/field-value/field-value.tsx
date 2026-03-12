'use client';

import { BodyLong, Detail, VStack } from '@navikt/ds-react';

type Props = {
  label: string;
  value: string;
};

export function FieldValue({ label, value }: Props): React.ReactElement {
  return (
    <VStack>
      <Detail>{label}</Detail>
      <BodyLong size="small">{value}</BodyLong>
    </VStack>
  );
}
