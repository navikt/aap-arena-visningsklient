'use client';

import { HStack, VStack } from '@navikt/ds-react';
import { InstitusjonOppholdDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { FieldValue } from 'components/felleskomponenter/field-value/field-value';
import { SeksjonHeading } from 'components/sakogvedtakinfo/vedtakdetaljer/seksjon-heading';
import { norsktDatoformat, parseISOorNull } from 'lib/utils/date';
import { storForbokstavOgMellomromForUnderstrek } from 'lib/utils/string';

const INSTITUSJON_TYPE_TEKST: Record<string, string> = {
  HELSEINSTITUSJON: 'Helseinstitusjon',
  FENGSEL: 'Fengsel',
};

// HALV = 50 % reduksjon, null/undefined = ingen reduksjon
const REDUKSJONS_TYPE_TEKST: Record<string, string> = {
  HALV: '50 %',
};

function institusjonTypeTekst(type: string): string {
  return INSTITUSJON_TYPE_TEKST[type] ?? storForbokstavOgMellomromForUnderstrek(type);
}

function reduksjonTekst(reduksjonsType: string | null | undefined): string {
  if (reduksjonsType == null) return '0 %';
  return REDUKSJONS_TYPE_TEKST[reduksjonsType] ?? reduksjonsType;
}

function formaterPeriode(fra: string | null | undefined, til: string | null | undefined): string {
  const fraDate = parseISOorNull(fra);
  const tilDate = parseISOorNull(til);
  const fraFormatert = fraDate != null ? norsktDatoformat(fraDate) : 'dd.mm.åååå';
  const tilFormatert = tilDate != null ? norsktDatoformat(tilDate) : 'dd.mm.åååå';
  return `${fraFormatert} – ${tilFormatert}`;
}

type Props = {
  institusjonOpphold: InstitusjonOppholdDTO[];
  relatertInstitusjonOpphold: InstitusjonOppholdDTO[] | null;
};

export function InstitusjonSeksjon({
  institusjonOpphold,
  relatertInstitusjonOpphold,
}: Props): React.ReactElement | null {
  if (institusjonOpphold.length === 0) return null;

  const relatertMap =
    relatertInstitusjonOpphold != null
      ? new Map(relatertInstitusjonOpphold.map((o) => [o.type, o]))
      : null;

  function erEndret(opphold: InstitusjonOppholdDTO, felt: keyof InstitusjonOppholdDTO): boolean {
    if (relatertMap == null) return false;
    const relatert = relatertMap.get(opphold.type);
    // Rad finnes ikke i relatert vedtak → alt er nytt, marker som endret
    if (relatert == null) return true;
    return opphold[felt] !== relatert[felt];
  }

  return (
    <div>
      <SeksjonHeading tittel="Institusjon" />
      <VStack gap="space-16">
        {institusjonOpphold.map((opphold, index) => (
          <HStack key={index} gap="space-32" wrap>
            <FieldValue label="Type" value={institusjonTypeTekst(opphold.type)} isChanged={erEndret(opphold, 'type')} />
            <FieldValue
              label="Periode"
              value={formaterPeriode(opphold.fra, opphold.til)}
              isChanged={erEndret(opphold, 'fra') || erEndret(opphold, 'til')}
            />
            <FieldValue
              label="Fri kost og losji"
              value={opphold.friKostOgLosji ? 'Ja' : 'Nei'}
              isChanged={erEndret(opphold, 'friKostOgLosji')}
            />
            <FieldValue
              label="Reduksjon"
              value={reduksjonTekst(opphold.reduksjonsType)}
              isChanged={erEndret(opphold, 'reduksjonsType')}
            />
          </HStack>
        ))}
      </VStack>
    </div>
  );
}

