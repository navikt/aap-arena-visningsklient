'use client';

import styles from './header.module.css';
import { CopyButton, HStack, Label, Spacer } from '@navikt/ds-react';
import { storForbokstavIHvertOrd } from 'lib/utils/string';
import { SakDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { FieldValue } from 'components/felleskomponenter/field-value/field-value';
import {norsktDatoformat} from "lib/utils/date";

type Props = {
  sak: SakDTO;
};

export function PersonHeader({ sak }: Props): React.ReactElement {
  const { fornavn, etternavn, fodselsnummer } = sak.person;
  const ordineerAAPKvote = sak.telleverkForPerson?.ordineerAAPKvote;
  const utvidetAAPKvote = sak.telleverkForPerson?.utvidetAAPKvote;

  const telleverkTekst =
    sak.telleverkForPerson == null
      ? '—'
      : ordineerAAPKvote != null && ordineerAAPKvote > 0
        ? `${ordineerAAPKvote} dager (Ordinær)`
        : utvidetAAPKvote != null && utvidetAAPKvote > 0
          ? `${utvidetAAPKvote} dager (Utvidet)`
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
        <FieldValue label="Siste utbetaling" value={ sak.sisteUtbetalingsDato != null ? norsktDatoformat(sak.sisteUtbetalingsDato) : '—'} />
        <FieldValue label="Maksdato" value={ sak.maksDato != null ? norsktDatoformat(sak.maksDato) : '—'} />
        <FieldValue label="Gjenstående" value={telleverkTekst} />
      </HStack>
    </section>
  );
}
