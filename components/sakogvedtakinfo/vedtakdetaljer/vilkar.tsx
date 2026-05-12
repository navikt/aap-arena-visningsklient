'use client';

import { BodyLong, HGrid, Label, VStack } from '@navikt/ds-react';
import { ArenaVedtakMedFaktaDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { VilkarListe } from 'components/sakogvedtakinfo/vedtakdetaljer/vilkar-liste';
import { SeksjonHeading } from 'components/sakogvedtakinfo/vedtakdetaljer/seksjon-heading';

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
          <Label size="small">Begrunnelse</Label>
          <BodyLong size="small">{vedtak.begrunnelse ?? '—'}</BodyLong>
        </VStack>
      </HGrid>
    </div>
  );
}
