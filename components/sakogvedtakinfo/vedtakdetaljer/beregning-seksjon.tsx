'use client';

import { HStack, InlineMessage, Label, VStack } from '@navikt/ds-react';
import { ArenaVedtakfaktaDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { FieldValue } from 'components/felleskomponenter/field-value/field-value';
import { SeksjonHeading } from 'components/sakogvedtakinfo/vedtakdetaljer/seksjon-heading';
import { formaterFaktaDato } from 'lib/utils/date';
import { formaterFaktaNok, jaNeiEllerBlank } from 'lib/utils/string';

type Props = {
  faktaMap: Map<string, ArenaVedtakfaktaDTO>;
  relatertFaktaMap: Map<string, ArenaVedtakfaktaDTO> | null;
};

export function BeregningSeksjon({ faktaMap, relatertFaktaMap }: Props): React.ReactElement {
  const erManueltBeregnet = faktaMap.get('AGRLAGMAN')?.verdi === 'J';
  const harYrkesskade = faktaMap.get('AYRKESKADE')?.verdi === 'J';

  const overgangstilfeller = ['OVERGTAT', 'OVERGTRP', 'OVERGTTU']
    .map((kode) => faktaMap.get(kode))
    .filter((f) => f?.verdi === 'J')
    .map((f) => f!.navn)
    .join(', ');

  const relatertOvergangstilfeller = relatertFaktaMap
    ? ['OVERGTAT', 'OVERGTRP', 'OVERGTTU']
        .map((kode) => relatertFaktaMap.get(kode))
        .filter((f) => f?.verdi === 'J')
        .map((f) => f!.navn)
        .join(', ')
    : null;

  function erEndret(kode: string): boolean {
    if (relatertFaktaMap == null) return false;
    return faktaMap.get(kode)?.verdi !== relatertFaktaMap.get(kode)?.verdi;
  }

  function beregningBelopOgAarString(verdiKode: string, aarKode: string): string {
    const verdi = faktaMap.get(verdiKode)?.verdi;
    const aar = faktaMap.get(aarKode)?.verdi;

    if (verdi == null) return '—';
    if (aar == null) return formaterFaktaNok(verdi);

    return `${formaterFaktaNok(verdi)} (${aar})`;
  }

  return (
    <div>
      <SeksjonHeading
        tittel="Beregning"
        action={
          erManueltBeregnet ? (
            <InlineMessage status="warning" size="small">
              Grunnlaget er beregnet manuelt
            </InlineMessage>
          ) : undefined
        }
      />
      <VStack gap="space-16">
        <HStack gap="space-32" wrap>
          <FieldValue
            label="Tidspunkt arbeidsevnen ble nedsatt"
            value={formaterFaktaDato(faktaMap.get('AAPBERDATO')?.verdi) ?? '—'}
            isChanged={erEndret('AAPBERDATO')}
          />
          <FieldValue
            label="Beregningsregelverk"
            value={faktaMap.get('AAPBERREGL')?.verdi ?? '—'}
            isChanged={erEndret('AAPBERREGL')}
          />
        </HStack>

        {harYrkesskade && (
          <VStack gap="space-8">
            <Label size="small">Yrkesskade</Label>
            <HStack gap="space-32" wrap>
              <FieldValue
                label="Skadedato"
                value={formaterFaktaDato(faktaMap.get('YDATO')?.verdi) ?? '—'}
                isChanged={erEndret('YDATO')}
              />
              <FieldValue
                label="Yrkesskadegrad"
                value={faktaMap.get('YSKADEGRD')?.verdi != null ? `${faktaMap.get('YSKADEGRD')?.verdi}%` : '—'}
                isChanged={erEndret('YSKADEGRD')}
              />
              <FieldValue
                label="Inntekt på skadetidspunkt"
                value={formaterFaktaNok(faktaMap.get('YINNT')?.verdi)}
                isChanged={erEndret('YINNT')}
              />
            </HStack>
          </VStack>
        )}

        <VStack gap="space-8">
          <Label size="small">Inntektsgrunnlag</Label>
          <HStack gap="space-32" wrap>
            <FieldValue
              label="Siste beregningsår"
              value={beregningBelopOgAarString('INTSISTE', 'INTARSISTE')}
              isChanged={erEndret('INTSISTE')}
            />
            <FieldValue
              label="Nest siste beregningsår"
              value={beregningBelopOgAarString('INTNESTS', 'INTARNESTS')}
              isChanged={erEndret('INTNESTS')}
            />
            <FieldValue
              label="Tredje siste beregningsår"
              value={beregningBelopOgAarString('INTTREDS', 'INTARTREDS')}
              isChanged={erEndret('INTTREDS')}
            />
            <FieldValue
              label="Grunnlag for beregning"
              value={formaterFaktaNok(faktaMap.get('GRUNN')?.verdi)}
              isChanged={erEndret('GRUNN')}
            />
            <FieldValue
              label="Beregningsregel"
              value={faktaMap.get('BERREGEL')?.verdi ?? '—'}
              isChanged={erEndret('BERREGEL')}
            />
            {overgangstilfeller && (
              <FieldValue
                label="Overgangstilfelle"
                value={overgangstilfeller || '—'}
                isChanged={relatertFaktaMap != null && overgangstilfeller !== relatertOvergangstilfeller}
              />
            )}
            {faktaMap.get('ARBPEOS')?.verdi === 'J' && (
              <FieldValue label="Arbeidsperiode fra EØS/Norden" value="Ja" isChanged={erEndret('ARBPEOS')} />
            )}
            <FieldValue
              label="Ung ufør"
              value={jaNeiEllerBlank(faktaMap.get('AUNGFOR')?.verdi)}
              isChanged={erEndret('AUNGFOR')}
            />
          </HStack>
        </VStack>
      </VStack>
    </div>
  );
}
