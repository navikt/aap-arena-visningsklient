'use client';

import { BodyShort, Box, HGrid, Label, VStack } from '@navikt/ds-react';
import { ArenaVedtakMedFaktaDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { VilkarListe } from 'components/sakogvedtakinfo/vedtakdetaljer/vilkar-liste';
import styles from './vedtakdetaljer.module.css';

type Props = {
  vedtak: ArenaVedtakMedFaktaDTO;
};

export function Vilkar({ vedtak }: Props): React.ReactElement {
  return (
    <Box>
      <Label className={styles.vilkårHeading} size="medium">
        Vilkår
      </Label>
      <HGrid columns={2} gap="space-64">
        <VilkarListe vilkarsvurderinger={vedtak.vilkårsvurderinger} />
        <VStack gap="space-8">
          <Label size="small">Begrunnelse</Label>
          <BodyShort size="small">{vedtak.begrunnelse ?? '—'}</BodyShort>
        </VStack>
      </HGrid>
    </Box>
  );
}
