'use client';

import { HGrid, VStack } from '@navikt/ds-react';
import { KvoteHistorikkDTO, SakDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { KvoteTabell, KvoteEndring } from 'components/kvote/kvote-tabell';
import { norsktDatoformat, parseISOorNull } from 'lib/utils/date';

const posteringTypeNavn: Record<string, string> = {
  OPPD: 'Oppdatering',
  NULLE: 'Nullstillling',
  INIT: 'Initialisering',
};

const endringsGrunnlagNavn: Record<string, string> = {
  MKORT: 'Meldekort',
};

function formaterEndring(antallBevegelse: number): string {
  const dager = Math.abs(antallBevegelse / 20);
  return antallBevegelse < 0 ? `– ${dager} dager` : `${dager} dager`;
}

function formaterGjenvaerende(resterende: number): string {
  return `${resterende / 20} dager`;
}

function mapTilKvoteEndring(dto: KvoteHistorikkDTO): KvoteEndring {
  const parsedDato = parseISOorNull(dto.datoHendelse);
  return {
    id: dto.id,
    dato: parsedDato != null ? norsktDatoformat(parsedDato) : '–',
    type: posteringTypeNavn[dto.posteringTypeKode] ?? dto.posteringTypeKode,
    endretAv: endringsGrunnlagNavn[dto.endringsGrunnlag] ?? dto.modUser,
    endring: formaterEndring(dto.antallBevegelse),
    gjenvaerende: formaterGjenvaerende(dto.resterende),
    begrunnelse: dto.begrunnelse ?? undefined,
  };
}

type Props = {
  sak: SakDTO;
};

function harUnntakAAP(sak: SakDTO): boolean {
  return sak.vedtak.some((vedtak) => vedtak.fakta.some((fakta) => fakta.kode === 'UNNTAKAAP' && fakta.verdi === 'J'));
}

export function Kvote({ sak }: Props): React.ReactElement {
  const ordinaerEndringer = sak.kvoteHistorikk.filter((h) => h.kvoteTypeKode === 'AAP').map(mapTilKvoteEndring);

  const utvidetEndringer = sak.kvoteHistorikk.filter((h) => h.kvoteTypeKode !== 'AAP').map(mapTilKvoteEndring);

  return (
    <VStack paddingBlock="space-40" gap="space-24">
      <HGrid gap="space-40" columns={2}>
        <KvoteTabell tittel="Historikk ordinær periode" endringer={ordinaerEndringer} />
        {harUnntakAAP(sak) && (
          <KvoteTabell tittel="Historikk unntaksperiode §11-12 andre og tredje ledd" endringer={utvidetEndringer} />
        )}
      </HGrid>
    </VStack>
  );
}
