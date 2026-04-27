'use client';

import { HStack } from '@navikt/ds-react';
import { ArenaVedtakfaktaDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { FieldValue } from 'components/felleskomponenter/field-value/field-value';
import { SeksjonHeading } from 'components/sakogvedtakinfo/vedtakdetaljer/seksjon-heading';
import { formaterFaktaNok } from 'lib/utils/string';

type Props = {
  faktaMap: Map<string, ArenaVedtakfaktaDTO>;
  relatertFaktaMap: Map<string, ArenaVedtakfaktaDTO> | null;
};

export function SatsSeksjon({ faktaMap, relatertFaktaMap }: Props): React.ReactElement {
  function erEndret(kode: string): boolean {
    if (relatertFaktaMap == null) return false;
    return faktaMap.get(kode)?.verdi !== relatertFaktaMap.get(kode)?.verdi;
  }

  return (
    <div>
      <SeksjonHeading tittel="Sats" />
      <HStack gap="space-32" wrap>
        <FieldValue
          label="Grunnsats"
          value={formaterFaktaNok(faktaMap.get('GRSATS')?.verdi)}
          isChanged={erEndret('GRSATS')}
        />
        <FieldValue
          label="Ant. barn med stønad"
          value={faktaMap.get('BARNMSTON')?.verdi ?? '—'}
          isChanged={erEndret('BARNMSTON')}
        />
        <FieldValue
          label="Dagsats med barnetillegg før samordning"
          value={formaterFaktaNok(faktaMap.get('DAGSMBFSAM')?.verdi)}
          isChanged={erEndret('DAGSMBFSAM')}
        />
        <FieldValue
          label="Dagsats med barnetillegg etter samordning"
          value={formaterFaktaNok(faktaMap.get('DAGSMBT')?.verdi)}
          isChanged={erEndret('DAGSMBT')}
        />
      </HStack>
    </div>
  );
}
