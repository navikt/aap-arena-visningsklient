'use client';

import { BodyShort, Box, Heading, HGrid, Label, Page, VStack } from '@navikt/ds-react';
import { norsktDatoformatMedTid } from 'lib/utils/date';

interface Props {
  error: Error & { digest?: string };
}

const Error = ({ error }: Props) => {
  return (
    <Page>
      <Page.Block width="md" gutters>
        <Box marginBlock="space-32" padding="space-16">
          <VStack gap="space-16" marginBlock="space-32">
            <Heading level="2" size="large">
              En feil har oppstått!
            </Heading>

            <BodyShort>
              Du kan prøve igjen. Dersom feilen vedvarer kan du melde problemet i Porten med skjermbilde av denne siden.
            </BodyShort>

            <HGrid columns={2} gap="space-8">
              <Label>Tidspunkt:</Label>
              <BodyShort>{norsktDatoformatMedTid(new Date())}</BodyShort>

              <Label>Feilmelding:</Label>
              <BodyShort>{error.message}</BodyShort>
            </HGrid>
          </VStack>
        </Box>
      </Page.Block>
    </Page>
  );
};

export default Error;
