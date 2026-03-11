'use client';

import { SakDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { Heading, VStack } from '@navikt/ds-react';
import { VedtakTabell } from 'components/sakogvedtakinfo/vedtak-tabell';

type Props = {
  sak: SakDTO;
};

export function Sakogvedtakinfo({ sak }: Props): React.ReactElement {
  return (
    <VStack gap="space-24">
      <Heading size="medium">
        Arenasak {sak.opprettetAar} {sak.lopenr} {sak.statusnavn != null ? `(${sak.statusnavn})` : ''}
      </Heading>
      <VedtakTabell vedtak={sak.vedtak} />
    </VStack>
  );
}
