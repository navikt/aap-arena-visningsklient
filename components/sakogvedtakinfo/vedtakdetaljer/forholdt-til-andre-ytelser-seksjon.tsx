'use client';

import { HStack, VStack } from '@navikt/ds-react';
import { AndreYtelseDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { FieldValue } from 'components/felleskomponenter/field-value/field-value';
import { SeksjonHeading } from 'components/sakogvedtakinfo/vedtakdetaljer/seksjon-heading';
import { formaterTilNok, storForbokstavOgMellomromForUnderstrek } from 'lib/utils/string';

const YTELSE_TYPE_TEKST: Record<string, string> = {
  UFORETRYGD: 'Uføretrygd',
  ALDERSPENSJON: 'Alderspensjon',
  AFP: 'AFP',
  SYKEPENGER: 'Sykepenger',
  FORELDREPENGER: 'Foreldrepenger',
  OMSORGSPENGER: 'Omsorgspenger',
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
  relatertAndreYtelser: AndreYtelseDTO[] | null;
};

export function ForholdTilAndreYtelserSeksjon({
  andreYtelser,
  relatertAndreYtelser,
}: Props): React.ReactElement | null {
  if (andreYtelser.length === 0) return null;

  const relatertMap = relatertAndreYtelser != null ? new Map(relatertAndreYtelser.map((y) => [y.type, y])) : null;

  function erEndret(ytelse: AndreYtelseDTO, felt: keyof AndreYtelseDTO): boolean {
    if (relatertMap == null) return false;
    const relatert = relatertMap.get(ytelse.type);
    // Rad finnes ikke i relatert vedtak → alt er nytt, marker som endret
    if (relatert == null) return true;
    return ytelse[felt] !== relatert[felt];
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
            <FieldValue
              label="Beløp"
              value={ytelse.belop != null ? formaterTilNok(ytelse.belop) : '—'}
              isChanged={erEndret(ytelse, 'belop')}
            />
          </HStack>
        ))}
      </VStack>
    </div>
  );
}
