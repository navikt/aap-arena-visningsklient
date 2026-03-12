'use client';

import styles from './header.module.css';
import { Button, CopyButton, HStack, Label, Spacer } from '@navikt/ds-react';
import { storForbokstavIHvertOrd } from 'lib/utils/string';
import { SakDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { ClockDashedIcon } from '@navikt/aksel-icons';
import { FieldValue } from 'components/felleskomponenter/field-value/field-value';

type Props = {
  sak: SakDTO;
};

export function PersonHeader({ sak }: Props): React.ReactElement {
  const { fornavn, etternavn, fodselsnummer } = sak.person;

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
        <FieldValue label="Siste utbetaling" value="Ikke implementert" />
        <FieldValue label="Maksdato" value="Ikke implementert" />
        <FieldValue label="Gjenstående" value="Ikke implementert" />
        <Button variant="tertiary" size="small" iconPosition="left" icon={<ClockDashedIcon />}>
          Historikk
        </Button>
      </HStack>
    </section>
  );
}
