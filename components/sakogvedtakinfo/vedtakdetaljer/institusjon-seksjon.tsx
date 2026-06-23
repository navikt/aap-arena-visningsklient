'use client';

import { HStack } from '@navikt/ds-react';
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
  const fraFormatert = fraDate != null ? norsktDatoformat(fraDate) : '—';
  const tilFormatert = tilDate != null ? norsktDatoformat(tilDate) : '—';
  return `${fraFormatert} – ${tilFormatert}`;
}

type Props = {
  institusjonOpphold: InstitusjonOppholdDTO | null;
  // undefined = ingen sammenlikning aktiv (ikke relatert vedtak, eller "vis endringer" er av)
  // null = relatert vedtak finnes, men hadde ingen institusjon → alle felt skal markeres
  relatertInstitusjonOpphold: InstitusjonOppholdDTO | null | undefined;
};

export function InstitusjonSeksjon({
  institusjonOpphold,
  relatertInstitusjonOpphold,
}: Props): React.ReactElement | null {
  if (institusjonOpphold == null) return null;

  const opphold = institusjonOpphold;

  function erEndret(felt: keyof InstitusjonOppholdDTO): boolean {
    if (relatertInstitusjonOpphold === undefined) return false;
    if (relatertInstitusjonOpphold === null) return true;
    return opphold[felt] !== relatertInstitusjonOpphold[felt];
  }

  return (
    <div>
      <SeksjonHeading tittel="Institusjon" />
      <HStack gap="space-32" wrap>
        <FieldValue label="Type" value={institusjonTypeTekst(opphold.type)} isChanged={erEndret('type')} />
        <FieldValue
          label="Periode"
          value={formaterPeriode(opphold.fra, opphold.til)}
          isChanged={erEndret('fra') || erEndret('til')}
        />
        <FieldValue
          label="Fri kost og losji"
          value={opphold.friKostOgLosji ? 'Ja' : 'Nei'}
          isChanged={erEndret('friKostOgLosji')}
        />
        <FieldValue
          label="Reduksjon"
          value={reduksjonTekst(opphold.reduksjonsType)}
          isChanged={erEndret('reduksjonsType')}
        />
      </HStack>
    </div>
  );
}
