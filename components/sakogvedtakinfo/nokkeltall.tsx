'use client';

import { ArenaVedtakfaktaDTO, SakDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { Heading, HStack, VStack } from '@navikt/ds-react';
import { useMemo } from 'react';
import { norsktDatoformat } from 'lib/utils/date';
import { FieldValue } from 'components/felleskomponenter/field-value/field-value';
import { formaterTilNok } from 'lib/utils/string';
import { parse } from 'date-fns';

type Props = {
  sak: SakDTO;
};

export function Nokkeltall({ sak }: Props): React.ReactElement | null {
  const sisteVedtak = useMemo(() => sak.vedtak.sort((a, b) => b.lopenrvedtak - a.lopenrvedtak)[0], [sak.sakId]);
  const fakta = sisteVedtak?.fakta ?? [];

  const { barnetillegg, antallBarn, beregningstidspunkt, grunnlag, dagsats } = useMemo(
    () => ({
      beregningstidspunkt: finnFaktaMedKode('AAPBERDATO', fakta),
      grunnlag: finnFaktaMedKode('GRUNN', fakta),
      dagsats: finnFaktaMedKode('DAGS', fakta),
      barnetillegg: finnFaktaMedKode('BARNTILL', fakta) ?? '0',
      antallBarn: finnFaktaMedKode('BARNMSTON', fakta) ?? '0',
    }),
    [sak.sakId]
  );

  if (sisteVedtak == null) {
    return null;
  }

  return (
    <VStack gap="space-16">
      <Heading as="h2" size="small">
        Siste status beregningsgrunnlag
      </Heading>
      <HStack gap="space-32">
        <FieldValue label="Beregningstidspunkt" value={formaterDato(beregningstidspunkt)} />
        <FieldValue label="Grunnlag" value={grunnlag != null ? formaterTilNok(parseInt(grunnlag)) : '—'} />
        <FieldValue label="Dagsats" value={dagsats != null ? formaterTilNok(parseInt(dagsats)) : '—'} />
        <FieldValue
          label={`Barnetillegg (${antallBarn})`}
          value={barnetillegg != null ? formaterTilNok(parseInt(barnetillegg)) : '—'}
        />
      </HStack>
    </VStack>
  );
}

function finnFaktaMedKode(faktakode: string, fakta: ArenaVedtakfaktaDTO[]): string | null {
  return fakta.find((f) => f.kode === faktakode)?.verdi ?? null;
}

function formaterDato(dateString: string | null): string {
  if (dateString == null) {
    return '—';
  }
  return norsktDatoformat(parse(dateString, 'dd-MM-yyyy', new Date()));
}
