'use client';

import { useMemo } from 'react';
import { BodyShort, HStack, Label, VStack } from '@navikt/ds-react';
import { ArenaVedtakMedFaktaDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { FieldValue } from 'components/felleskomponenter/field-value/field-value';
import { norsktDatoformat, parseFaktaDato } from 'lib/utils/date';
import { Vilkar } from 'components/sakogvedtakinfo/vedtakdetaljer/vilkar';

type Props = {
  vedtak: ArenaVedtakMedFaktaDTO;
};

export function Vedtakdetaljer({ vedtak }: Props): React.ReactElement {
  const faktaMap = useMemo(() => new Map(vedtak.fakta.map((f) => [f.kode, f])), [vedtak.vedtakId]);

  const vedtaksdato = faktaMap.get('INNVF')?.verdi ?? null;
  const vedtaksdatoFormatert = vedtaksdato != null ? norsktDatoformat(parseFaktaDato(vedtaksdato)!) : null;

  return (
    <VStack gap="space-32">
      <HStack gap="space-16">
        <Label size="medium">Vedtak {vedtak.rettighetnavn}</Label>
        {vedtaksdatoFormatert != null && <BodyShort size="medium">{vedtaksdatoFormatert}</BodyShort>}
      </HStack>
      <HStack gap="space-32">
        <FieldValue label="Saksbehandler" value={vedtak.saksbehandler ?? '—'} />
        <FieldValue label="Beslutter" value={vedtak.beslutter ?? '—'} />
      </HStack>
      <Vilkar vedtak={vedtak} />
    </VStack>
  );
}
