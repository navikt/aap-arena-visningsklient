'use client';

import { FieldValue } from 'components/felleskomponenter/field-value/field-value';
import { TilkjentYtelseSpesialutbetalingDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { tekstEllerIkkeFunnet } from './tilkjent-ytelse-utils';

type Props = {
  spesialutbetaling: TilkjentYtelseSpesialutbetalingDTO | null | undefined;
};

export function SpesialutbetalingDetaljer({ spesialutbetaling }: Props): React.ReactElement {
  return <FieldValue label="Begrunnelse" value={tekstEllerIkkeFunnet(spesialutbetaling?.begrunnelse)} />;
}
