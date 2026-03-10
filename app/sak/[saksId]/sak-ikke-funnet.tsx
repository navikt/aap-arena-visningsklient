'use client';

import { GlobalAlert } from '@navikt/ds-react';

type Props = {
  saksId: string;
};

export function SakIkkeFunnet({ saksId }: Props): React.ReactElement {
  return (
    <GlobalAlert status="warning">
      <GlobalAlert.Header>
        <GlobalAlert.Title>Sak Ikke funnet: {saksId}</GlobalAlert.Title>
      </GlobalAlert.Header>
      <GlobalAlert.Content>
        Fant ikke sak med saks-id '{saksId}' i Arena. Om dette er feil kan du ta kontakt med...
      </GlobalAlert.Content>
    </GlobalAlert>
  );
}
