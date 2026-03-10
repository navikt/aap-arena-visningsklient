'use client';

import { GlobalAlert } from '@navikt/ds-react';

type Props = {
  brukerId: string;
};

export function IkkeTilgang({ brukerId }: Props): React.ReactElement {
  return (
    <GlobalAlert status="error">
      <GlobalAlert.Header>
        <GlobalAlert.Title>Ikke tilgang til bruker (WIP feilmelding)</GlobalAlert.Title>
      </GlobalAlert.Header>
      <GlobalAlert.Content>
        Du har ikke tilgang til bruker med fødselsnummer '{brukerId}'. Om dette er feil kan du ta kontakt med...
      </GlobalAlert.Content>
    </GlobalAlert>
  );
}
