'use client';

import { InfoCard } from '@navikt/ds-react';

export function IkkeImplementertNotater(): React.ReactElement {
  return (
    <InfoCard data-color="warning">
      <InfoCard.Header>
        <InfoCard.Title>Ikke implementert enda</InfoCard.Title>
      </InfoCard.Header>
      <InfoCard.Content>
        Denne informasjonen er ikke tilgjengelig fordi funksjonaliteten ikke er implementert helt enda.
      </InfoCard.Content>
    </InfoCard>
  );
}
