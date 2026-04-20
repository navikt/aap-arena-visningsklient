'use client';

import { useMemo } from 'react';
import { BodyShort, HStack, Label, VStack } from '@navikt/ds-react';
import { ArenaVedtakMedFaktaDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { FieldValue } from 'components/felleskomponenter/field-value/field-value';
import { formaterFaktaDato } from 'lib/utils/date';
import { Vilkar } from 'components/sakogvedtakinfo/vedtakdetaljer/vilkar';

type Props = {
  vedtak: ArenaVedtakMedFaktaDTO;
};

export function Vedtakdetaljer({ vedtak }: Props): React.ReactElement {
  const faktaMap = useMemo(() => new Map(vedtak.fakta.map((f) => [f.kode, f])), [vedtak.vedtakId]);

  const vedtaksdatoFormatert = formaterFaktaDato(faktaMap.get('INNVF')?.verdi);

  return (
    <VStack gap="space-32">
      <HStack gap="space-16">
        <Label size="medium">Vedtak {vedtak.rettighetnavn}</Label>
        {vedtaksdatoFormatert != null && <BodyShort size="medium">{vedtaksdatoFormatert}</BodyShort>}
      </HStack> 
      <HStack gap="space-32">
        {vedtak.rettighetkode === 'AAP' && (
          <>
            <FieldValue label="Gjelder fra" value={formaterFaktaDato(faktaMap.get('FDATO')?.verdi) ?? '—'} />
            <FieldValue label="Justert fra-dato" value={formaterFaktaDato(faktaMap.get('AAPJUSTFD')?.verdi) ?? '—'} />
            <FieldValue
              label="Opprinnelig til-dato"
              value={formaterFaktaDato(faktaMap.get('OPPRTDATO')?.verdi) ?? '—'}
            />
            <FieldValue label="Gjelder fra" value={formaterFaktaDato(faktaMap.get('TDATO')?.verdi) ?? '—'} />
          </>
        )}
        <FieldValue label="Saksbehandler" value={vedtak.saksbehandler ?? '—'} />
        <FieldValue label="Beslutter" value={vedtak.beslutter ?? '—'} />
      </HStack>
      <Vilkar vedtak={vedtak} />
    </VStack>
  );
}
