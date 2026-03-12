'use client';

import { ArenaVedtakfaktaDTO, SakDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { Heading, HStack, VStack } from '@navikt/ds-react';
import { useMemo } from 'react';
import { dateComperator, norsktDatoformat, parseISOorNull } from 'lib/utils/date';
import { FieldValue } from 'components/felleskomponenter/field-value/field-value';
import { formaterTilNok } from 'lib/utils/string';
import { parse } from 'date-fns';

type Props = {
  sak: SakDTO;
};

export function Nokkeltall({ sak }: Props): React.ReactElement {
  const sisteVedtak = useMemo(
    () => sak.vedtak.sort((a, b) => dateComperator(parseISOorNull(a.fraOgMed), parseISOorNull(b.fraOgMed), 'DESC'))[0],
    [sak.sakId]
  );

  const { barnetillegg, antallBarn, beregningstidspunkt, grunnlag, dagsats } = useMemo(
    () => ({
      beregningstidspunkt: finnFaktaMedKode('AAPBERDATO', sisteVedtak.fakta),
      grunnlag: finnFaktaMedKode('GRUNN', sisteVedtak.fakta),
      dagsats: finnFaktaMedKode('DAGS', sisteVedtak.fakta),
      barnetillegg: finnFaktaMedKode('BARNTILL', sisteVedtak.fakta) ?? '0',
      antallBarn: finnFaktaMedKode('BARNMSTON', sisteVedtak.fakta) ?? '0',
    }),
    [sak.sakId]
  );

  return (
    <VStack gap="space-16">
      <Heading as="h2" size="small">
        Siste status beregningsgrunnlag
      </Heading>
      <HStack gap="space-32">
        <FieldValue label="Beregningstidspunkt" value={formaterDato(beregningstidspunkt)} />
        <FieldValue label="Grunnlag" value={grunnlag != null ? formaterTilNok(parseInt(grunnlag)) : '—'} />
        <FieldValue label="Dagsats" value={dagsats != null ? formaterTilNok(parseInt(dagsats)) : '—'} />
        <FieldValue label={`Barnetillegg (${antallBarn})`} value={barnetillegg} />
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
