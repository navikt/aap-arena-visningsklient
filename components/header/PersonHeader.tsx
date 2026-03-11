'use client';

import styles from './header.module.css';
import { BodyLong, Box, Button, CopyButton, Detail, HStack, Label, Spacer, VStack } from '@navikt/ds-react';
import { storForbokstavIHvertOrd } from 'lib/utils/string';
import { SakDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { ClockDashedIcon } from '@navikt/aksel-icons';

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
        <HeaderField label="Siste utbetaling" value="Ikke implementert" />
        <HeaderField label="Maksdato" value="Ikke implementert" />
        <HeaderField label="Gjenstående" value="Ikke implementert" />
        <Button variant="tertiary" size="small" iconPosition="left" icon={<ClockDashedIcon />}>
          Historikk
        </Button>
      </HStack>
    </section>
  );
}

type HeaderFieldProps = {
  label: string;
  value: string;
};

function HeaderField({ label, value }: HeaderFieldProps): React.ReactElement {
  return (
    <Box>
      <VStack>
        <Detail>{label}</Detail>
        <BodyLong size="small">{value}</BodyLong>
      </VStack>
    </Box>
  );
}
