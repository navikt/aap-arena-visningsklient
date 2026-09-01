'use client';

import { SakDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { BodyShort, Heading, HStack, Tag, VStack } from '@navikt/ds-react';
import { VedtakTabell } from 'components/sakogvedtakinfo/vedtak-tabell';
import { Nokkeltall } from 'components/sakogvedtakinfo/nokkeltall';
import { norsktDatoformat } from 'lib/utils/date';
import { finnSaksperiode } from 'lib/utils/saksperiode';
import { differenceInWeeks } from 'date-fns';

type Props = {
  sak: SakDTO;
};

function SluttdatoTag({ sluttdato }: { sluttdato: Date }): React.ReactElement {
  if (differenceInWeeks(new Date(), sluttdato) > 52) {
    return (
      <Tag variant="moderate" size="small" data-color="neutral" data-testid="sak-over-52-uker">
        Over 52 uker
      </Tag>
    );
  }
  return (
    <Tag variant="moderate" size="small" data-color="warning" data-testid="sak-under-52-uker">
      Under 52 uker
    </Tag>
  );
}

export function Sakogvedtakinfo({ sak }: Props): React.ReactElement {
  const nyesteVedtak = sak.vedtak.sort((a, b) => b.lopenrvedtak - a.lopenrvedtak)[0];

  const { startdato, sluttdato } = finnSaksperiode(sak.vedtak);

  return (
    <VStack gap="space-24">
      <HStack gap="space-20" align="center">
        <Heading size="medium">
          Arena {nyesteVedtak?.rettighetnavn ?? ''} {sak.opprettetAar} {sak.lopenr}
        </Heading>
        {startdato != null && (
          <BodyShort size="small" data-testid="sak-datoperiode">
            {norsktDatoformat(startdato)} {sluttdato != null && `– ${norsktDatoformat(sluttdato)}`}
          </BodyShort>
        )}
        <HStack gap="space-8">
          {sak.statuskode != null && (
            <Tag variant="moderate" size="small" data-color={sak.statuskode === 'AKTIV' ? 'success' : 'neutral'}>
              {sak.statusnavn}
            </Tag>
          )}
          {sluttdato != null && <SluttdatoTag sluttdato={sluttdato} />}
        </HStack>
      </HStack>
      <Nokkeltall sak={sak} />
      <VedtakTabell vedtak={sak.vedtak} />
    </VStack>
  );
}
