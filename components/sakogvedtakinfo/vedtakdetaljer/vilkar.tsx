'use client';

import { HGrid, VStack } from '@navikt/ds-react';
import { ArenaVedtakMedFaktaDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { VilkarListe } from 'components/sakogvedtakinfo/vedtakdetaljer/vilkar-liste';
import { SeksjonHeading } from 'components/sakogvedtakinfo/vedtakdetaljer/seksjon-heading';
import { FieldValue } from 'components/felleskomponenter/field-value/field-value';

type Props = {
  vedtak: ArenaVedtakMedFaktaDTO;
};

export function Vilkar({ vedtak }: Props): React.ReactElement {
  return (
    <div>
      <SeksjonHeading tittel="Vilkår" />
      <HGrid columns={2} gap="space-64">
        <VilkarListe vilkarsvurderinger={vedtak.vilkårsvurderinger} />
        <VStack gap="space-8">
          <FieldValue label="Begrunnelse" value={vedtak.begrunnelse ?? '—'} />
        </VStack>
      </HGrid>
    </div>
  );
}
