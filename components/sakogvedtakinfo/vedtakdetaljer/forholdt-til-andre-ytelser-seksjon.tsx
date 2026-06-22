'use client';

import { HStack, VStack } from '@navikt/ds-react';
import { AndreYtelseDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { FieldValue } from 'components/felleskomponenter/field-value/field-value';
import { SeksjonHeading } from 'components/sakogvedtakinfo/vedtakdetaljer/seksjon-heading';
import { formaterFaktaNok, storForbokstavOgMellomromForUnderstrek } from 'lib/utils/string';

const YTELSE_TYPE_TEKST: Record<string, string> = {
  FORELDREPENGER_ADOPSJON: 'Foreldrepenger adopsjon',
  BARNEPENSJON: 'Barnepensjon',
  OMSORGSPENGER: 'Omsorgspenger',
  FORELDREPENGER_FODSEL: 'Foreldrepenger fødsel',
  LONN_FRA_ARBEIDSGIVER: 'Lønn fra arbeidsgiver',
  OPPLARINGSPENGER: 'Opplæringspenger',
  PLEIEPENGER: 'Pleiepenger',
  SVANGERSKAPSPENGER: 'Svangerskapspenger',
  UFORETRYGD: 'Uføretrygd',
};

const BELOP_PERIODE_TEKST: Record<string, string> = {
  MND: 'Måned',
  UKE: 'Uke',
  DAG: 'Dag',
};

function ytelseTypeTekst(type: string): string {
  return YTELSE_TYPE_TEKST[type] ?? storForbokstavOgMellomromForUnderstrek(type);
}

function belopPeriodeTekst(kode: string | null | undefined): string {
  if (kode == null) return '—';
  return BELOP_PERIODE_TEKST[kode] ?? kode;
}

type Props = {
  andreYtelser: AndreYtelseDTO[];
  relatertAndreYtelserMap: Map<string, AndreYtelseDTO> | null;
};

export function ForholdTilAndreYtelserSeksjon({
  andreYtelser,
  relatertAndreYtelserMap,
}: Props): React.ReactElement | null {
  if (andreYtelser.length === 0) return null;

  function erEndret(ytelse: AndreYtelseDTO, felt: keyof AndreYtelseDTO): boolean {
    if (relatertAndreYtelserMap == null) return false;
    return ytelse[felt] !== relatertAndreYtelserMap.get(ytelse.type)?.[felt];
  }

  return (
    <div>
      <SeksjonHeading tittel="Forhold til andre ytelser" />
      <VStack gap="space-16">
        {andreYtelser.map((ytelse, index) => (
          <HStack key={index} gap="space-32" wrap>
            <FieldValue label="Type" value={ytelseTypeTekst(ytelse.type)} isChanged={erEndret(ytelse, 'type')} />
            <FieldValue
              label="Beløpsperiode"
              value={belopPeriodeTekst(ytelse.belopPeriode)}
              isChanged={erEndret(ytelse, 'belopPeriode')}
            />
            <FieldValue
              label="Grad"
              value={ytelse.grad != null ? `${ytelse.grad}%` : '—'}
              isChanged={erEndret(ytelse, 'grad')}
            />
            {!(ytelse.grad != null && ytelse.belop != null && Number(ytelse.belop) === 0) && (
              <FieldValue
                label="Beløp"
                value={ytelse.belop != null ? formaterFaktaNok(ytelse.belop) : '—'}
                isChanged={erEndret(ytelse, 'belop')}
              />
            )}
          </HStack>
        ))}
      </VStack>
    </div>
  );
}
