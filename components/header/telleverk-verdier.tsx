'use client';

import { TelleverkResponseDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { FieldValue } from 'components/felleskomponenter/field-value/field-value';
import { norsktDatoformat } from 'lib/utils/date';

type Props = {
  telleverk: TelleverkResponseDTO | null;
  harUnntaksperiode: boolean;
};

function gjenstaaendeTekst(telleverk: TelleverkResponseDTO | null, harUnntaksperiode: boolean): string {
  const telleverkForPerson = telleverk?.telleverk;
  if (telleverkForPerson == null) {
    return '—';
  }

  const { ordineerAAPKvote, utvidetAAPKvote } = telleverkForPerson;

  if (ordineerAAPKvote != null && ordineerAAPKvote > 0) {
    return `${ordineerAAPKvote / 20} dager (Ordinær)`;
  }

  if (harUnntaksperiode && utvidetAAPKvote != null) {
    return `${utvidetAAPKvote / 20} dager (Unntaksperiode)`;
  }

  return '0 dager (Ordinær)';
}

export function TelleverkVerdier({ telleverk, harUnntaksperiode }: Props): React.ReactElement {
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
      <FieldValue label="Gjenstående" value={gjenstaaendeTekst(telleverk, harUnntaksperiode)} />
    </>
  );
}
