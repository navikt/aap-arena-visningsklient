'use client';

import styles from './header.module.css';
import { CopyButton, HStack, Label, Spacer } from '@navikt/ds-react';
import { storForbokstavIHvertOrd } from 'lib/utils/string';
import { SakDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';

type Props = {
  sak: SakDTO;
  // Telleverk hentes fra et eget, tregere endepunkt og sendes inn som en Suspense-grense,
  // slik at navn og fødselsnummer kan vises før telleverket er klart.
  children: React.ReactNode;
};

export function PersonHeader({ sak, children }: Props): React.ReactElement {
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
        {children}
      </HStack>
    </section>
  );
}
