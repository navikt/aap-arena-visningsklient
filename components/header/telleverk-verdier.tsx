'use client';

import { TelleverkResponseDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { FieldValue } from 'components/felleskomponenter/field-value/field-value';
import { norsktDatoformat } from 'lib/utils/date';

type Props = {
  telleverk: TelleverkResponseDTO | null;
};

function gjenstaaendeTekst(telleverk: TelleverkResponseDTO | null): string {
  const telleverkForPerson = telleverk?.telleverk;
  if (telleverkForPerson == null) {
    return '—';
  }

  const { ordineerAAPKvote, utvidetAAPKvote } = telleverkForPerson;

  if (ordineerAAPKvote != null && ordineerAAPKvote > 0) {
    return `${ordineerAAPKvote / 20} dager (Ordinær)`;
  }

  if (utvidetAAPKvote != null && utvidetAAPKvote > 0) {
    return `${utvidetAAPKvote / 20} dager (Utvidet)`;
  }

  return '0';
}

export function TelleverkVerdier({ telleverk }: Props): React.ReactElement {
  return (
    <>
      <FieldValue
        label="Siste utbetaling"
        value={telleverk?.sisteUtbetalingDato != null ? norsktDatoformat(new Date(telleverk.sisteUtbetalingDato)) : '—'}
      />
      <FieldValue
        label="Maksdato"
        value={telleverk?.maksdato != null ? norsktDatoformat(new Date(telleverk.maksdato)) : '—'}
      />
      <FieldValue label="Gjenstående" value={gjenstaaendeTekst(telleverk)} />
    </>
  );
}
