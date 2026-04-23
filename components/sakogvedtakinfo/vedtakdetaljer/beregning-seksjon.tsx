'use client';

import { HStack, InlineMessage, Label, VStack } from '@navikt/ds-react';
import { ArenaVedtakfaktaDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { FieldValue } from 'components/felleskomponenter/field-value/field-value';
import { SeksjonHeading } from 'components/sakogvedtakinfo/vedtakdetaljer/seksjon-heading';
import { formaterFaktaDato } from 'lib/utils/date';
import { formaterFaktaNok, jaNeiEllerBlank } from 'lib/utils/string';

type Props = {
  faktaMap: Map<string, ArenaVedtakfaktaDTO>;
};

export function BeregningSeksjon({ faktaMap }: Props): React.ReactElement {
  const erManueltBeregnet = faktaMap.get('GRLAGMAN')?.verdi === 'J';
  const harYrkesskade = faktaMap.get('AYRKESKADE')?.verdi === 'J';

  const overgangstilfeller = ['OVERGTAT', 'OVERGTRP', 'OVERGTTU']
    .map((kode) => faktaMap.get(kode))
    .filter((f) => f?.verdi === 'J')
    .map((f) => f!.navn)
    .join(', ');

  return (
    <div>
      <SeksjonHeading
        tittel="Beregning"
        action={
          erManueltBeregnet ? <InlineMessage status="warning">Grunnlaget er beregnet manuelt</InlineMessage> : undefined
        }
      />
      <VStack gap="space-16">
        <HStack gap="space-32" wrap>
          <FieldValue
            label="Tidspunkt arbeidsevnen ble nedsatt"
            value={formaterFaktaDato(faktaMap.get('AAPBERDATO')?.verdi) ?? '—'}
          />
          <FieldValue label="Beregningsregelverk" value={faktaMap.get('AAPBERREGL')?.verdi ?? '—'} />
        </HStack>

        {harYrkesskade && (
          <VStack gap="space-8">
            <Label size="small">Yrkesskade</Label>
            <HStack gap="space-32" wrap>
              <FieldValue label="Skadedato" value={formaterFaktaDato(faktaMap.get('YDATO')?.verdi) ?? '—'} />
              <FieldValue label="Yrkesskadegrad" value={faktaMap.get('YSKADEGRD')?.verdi ?? '—'} />
              <FieldValue label="Inntekt på skadetidspunkt" value={formaterFaktaNok(faktaMap.get('YINNT')?.verdi)} />
            </HStack>
          </VStack>
        )}

        <VStack gap="space-8">
          <Label size="small">Inntektsgrunnlag</Label>
          <HStack gap="space-32" wrap>
            <FieldValue label="Siste beregningsår" value={formaterFaktaNok(faktaMap.get('INTARSISTE')?.verdi)} />
            <FieldValue label="Nest siste beregningsår" value={formaterFaktaNok(faktaMap.get('INTARNESTS')?.verdi)} />
            <FieldValue label="Tredje siste beregningsår" value={formaterFaktaNok(faktaMap.get('INTARTREDS')?.verdi)} />
            <FieldValue label="Grunnlag for beregning" value={formaterFaktaNok(faktaMap.get('GRUNN')?.verdi)} />
            <FieldValue label="Beregningsregel" value={faktaMap.get('BERREGEL')?.verdi ?? '—'} />
            <FieldValue label="Overgangstilfelle" value={overgangstilfeller || '—'} />
            <FieldValue label="Arbeidsperiode fra EØS/Norden" value={jaNeiEllerBlank(faktaMap.get('ARBPEOS')?.verdi)} />
            <FieldValue label="Ung ufør" value={jaNeiEllerBlank(faktaMap.get('AUNGFOR')?.verdi)} />
          </HStack>
        </VStack>
      </VStack>
    </div>
  );
}
