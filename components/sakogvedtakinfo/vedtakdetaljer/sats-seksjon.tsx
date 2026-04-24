'use client';

import { HStack } from '@navikt/ds-react';
import { ArenaVedtakfaktaDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { FieldValue } from 'components/felleskomponenter/field-value/field-value';
import { SeksjonHeading } from 'components/sakogvedtakinfo/vedtakdetaljer/seksjon-heading';
import { formaterFaktaNok } from 'lib/utils/string';

type Props = {
  faktaMap: Map<string, ArenaVedtakfaktaDTO>;
};

export function SatsSeksjon({ faktaMap }: Props): React.ReactElement {
  return (
    <div>
      <SeksjonHeading tittel="Sats" />
      <HStack gap="space-32" wrap>
        <FieldValue label="Grunnsats" value={formaterFaktaNok(faktaMap.get('GRSATS')?.verdi)} />
        <FieldValue label="Ant. barn med stønad" value={faktaMap.get('BARNMSTON')?.verdi ?? '—'} />
        <FieldValue
          label="Dagsats med barnetillegg før samordning"
          value={formaterFaktaNok(faktaMap.get('DAGSMBFSAM')?.verdi)}
        />
        <FieldValue
          label="Dagsats med barnetillegg etter samordning"
          value={formaterFaktaNok(faktaMap.get('DAGSMBT')?.verdi)}
        />
      </HStack>
    </div>
  );
}
