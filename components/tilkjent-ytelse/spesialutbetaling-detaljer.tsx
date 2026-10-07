'use client';

import { HStack } from '@navikt/ds-react';
import { FieldValue } from 'components/felleskomponenter/field-value/field-value';
import { TilkjentYtelseSpesialutbetalingDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { tekstEllerIkkeFunnet } from './tilkjent-ytelse-utils';

type Props = {
  spesialutbetaling: TilkjentYtelseSpesialutbetalingDTO | null | undefined;
};

export function SpesialutbetalingDetaljer({ spesialutbetaling }: Props): React.ReactElement {
  return (
    <HStack gap="space-32" wrap>
      <FieldValue label="Vedtaksstatus" value={tekstEllerIkkeFunnet(spesialutbetaling?.vedtakStatusKode)} />
      <FieldValue label="Begrunnelse" value={tekstEllerIkkeFunnet(spesialutbetaling?.begrunnelse)} />
    </HStack>
  );
}
