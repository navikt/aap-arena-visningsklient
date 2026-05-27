'use client';

import { HGrid, VStack } from '@navikt/ds-react';
import { KvoteHistorikkDTO, SakDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { KvoteTabell, KvoteEndring } from 'components/kvote/kvote-tabell';
import { norsktDatoformat, parseISOorNull } from 'lib/utils/date';

const posteringTypeNavn: Record<string, string> = {
  OPPD: 'Oppdatering',
  NULL: 'Nullstillling',
};

const tabellnavnAliasNavn: Record<string, string> = {
  MKORT: 'Meldekort',
};

function mapTilKvoteEndring(dto: KvoteHistorikkDTO): KvoteEndring {
  const parsedDato = parseISOorNull(dto.datoHendelse);
  return {
    id: dto.id,
    dato: parsedDato != null ? norsktDatoformat(parsedDato) : dto.datoHendelse,
    type: posteringTypeNavn[dto.posteringTypeKode] ?? dto.posteringTypeKode,
    endretAv: tabellnavnAliasNavn[dto.tabellnavnAliasGrunnlag]
      ? tabellnavnAliasNavn[dto.tabellnavnAliasGrunnlag]
      : dto.modUser,
    endring: `${dto.antallBevegelse > 0 ? '' : '- '}${Math.abs(dto.antallBevegelse / 20)} dager`,
    gjenvaerende: `${dto.resterende / 20} dager`,
    begrunnelse: dto.begrunnelse ?? undefined,
  };
}

type Props = {
  sak: SakDTO;
};

export function Kvote({ sak }: Props): React.ReactElement {
  const ordinaerEndringer = sak.kvoteHistorikk.filter((h) => h.kvoteTypeKode === 'AAP').map(mapTilKvoteEndring);

  const utvidetEndringer = sak.kvoteHistorikk.filter((h) => h.kvoteTypeKode !== 'AAP').map(mapTilKvoteEndring);

  return (
    <VStack paddingBlock="space-40" gap="space-24">
      <HGrid gap="space-40" columns={2}>
        <KvoteTabell tittel="Historikk ordinær periode" endringer={ordinaerEndringer} />
        <KvoteTabell tittel="Historikk unntaksperiode §11-12 andre og tredje ledd" endringer={utvidetEndringer} />
      </HGrid>
    </VStack>
  );
}
