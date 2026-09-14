'use client';

import styles from './header.module.css';
import { CopyButton, HStack, Label, Spacer } from '@navikt/ds-react';
import { storForbokstavIHvertOrd } from 'lib/utils/string';
import { SakDTO, TelleverkResponseDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { FieldValue } from 'components/felleskomponenter/field-value/field-value';
import { norsktDatoformat } from 'lib/utils/date';

type Props = {
  sak: SakDTO;
  telleverk: TelleverkResponseDTO | null;
};

export function PersonHeader({ sak, telleverk }: Props): React.ReactElement {
  const { fornavn, etternavn, fodselsnummer } = sak.person;
  const telleverkForPerson = telleverk?.telleverk;
  const ordineerAAPKvote = telleverkForPerson?.ordineerAAPKvote;
  const utvidetAAPKvote = telleverkForPerson?.utvidetAAPKvote;

  const telleverkTekst =
    telleverkForPerson == null
      ? '—'
      : ordineerAAPKvote != null && ordineerAAPKvote > 0
        ? `${ordineerAAPKvote / 20} dager (Ordinær)`
        : utvidetAAPKvote != null && utvidetAAPKvote > 0
          ? `${utvidetAAPKvote / 20} dager (Utvidet)`
          : '0';

  return (
    <section className={styles.personheader}>
      <HStack gap="space-16" align="center">
        <Label size="small">{storForbokstavIHvertOrd(`${fornavn} ${etternavn}`)}</Label>

        <CopyButton
          copyText={fodselsnummer}
          size="xsmall"
          text={fodselsnummer}
          iconPosition="right"
          className={styles.copybutton}
        />
        <Spacer />
        <FieldValue
          label="Siste utbetaling"
          value={
            telleverk?.sisteUtbetalingDato != null ? norsktDatoformat(new Date(telleverk.sisteUtbetalingDato)) : '—'
          }
        />
        <FieldValue
          label="Maksdato"
          value={telleverk?.maksdato != null ? norsktDatoformat(new Date(telleverk.maksdato)) : '—'}
        />
        <FieldValue label="Gjenstående" value={telleverkTekst} />
      </HStack>
    </section>
  );
}
