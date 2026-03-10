'use client';

import styles from './header.module.css';
import { CopyButton, HStack, Label } from '@navikt/ds-react';
import { storForbokstavIHvertOrd } from 'lib/utils/string';

type Props = {
  fodselsnummer: string;
  fornavn: string;
  etternavn: string;
};

export function PersonHeader({ fodselsnummer, fornavn, etternavn }: Props): React.ReactElement {
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
      </HStack>
    </section>
  );
}
