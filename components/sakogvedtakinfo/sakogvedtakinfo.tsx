'use client';

import { SakDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { Card } from 'components/felleskomponenter/card/Card';
import { BodyShort, Heading, VStack } from '@navikt/ds-react';
import { VedtakTabell } from 'components/sakogvedtakinfo/vedtak-tabell';

type Props = {
  sak: SakDTO;
};

export function Sakogvedtakinfo({ sak }: Props): React.ReactElement {
  return (
    <Card>
      <VStack gap="space-24">
        <Heading size="medium">
          Arenasak {sak.opprettetAar} {sak.lopenr}
        </Heading>
        <VedtakTabell vedtak={sak.vedtak} />
      </VStack>
    </Card>
  );
}
