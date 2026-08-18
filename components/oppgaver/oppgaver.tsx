'use client';

import { BodyShort, Label, Table, VStack } from '@navikt/ds-react';
import { OppgaveDTO, SakDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { TekstPopover } from 'components/felleskomponenter/tekst-popover/tekst-popover';
import { formaterFrist, INGEN_VERDI, sorterPaaFristSynkende } from 'components/oppgaver/oppgave-utils';

type Props = {
  sak: SakDTO;
};

function OppgaveRad({ oppgave }: { oppgave: OppgaveDTO }): React.ReactElement {
  return (
    <Table.Row>
      <Table.DataCell>{formaterFrist(oppgave.fristDato)}</Table.DataCell>
      <Table.DataCell>{oppgave.beskrivelse}</Table.DataCell>
      <Table.DataCell>{oppgave.arbeidsbenk ?? INGEN_VERDI}</Table.DataCell>
      <Table.DataCell>{oppgave.visningsnavn}</Table.DataCell>
      <Table.DataCell>
        {oppgave.notat != null ? <TekstPopover knappetekst="Kommentar" tekst={oppgave.notat} /> : INGEN_VERDI}
      </Table.DataCell>
    </Table.Row>
  );
}

export function Oppgaver({ sak }: Props): React.ReactElement {
  const oppgaver = sorterPaaFristSynkende(sak.oppgaver ?? []);

  return (
    <VStack paddingBlock="space-40" gap="space-16">
      <Label size="medium">
        Oppgaver i Arena registrert på tema AAP, oppfølging, feilutbetaling, klage/anke og person
      </Label>
      {oppgaver.length === 0 ? (
        <BodyShort data-testid="ingen-oppgaver">Det er ingen oppgaver på denne saken.</BodyShort>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell scope="col">Frist</Table.HeaderCell>
              <Table.HeaderCell scope="col">Beskrivelse</Table.HeaderCell>
              <Table.HeaderCell scope="col">Registrert av</Table.HeaderCell>
              <Table.HeaderCell scope="col">Tema</Table.HeaderCell>
              <Table.HeaderCell scope="col">Kommentar</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {oppgaver.map((oppgave, index) => (
              <OppgaveRad key={`${oppgave.beskrivelse}-${oppgave.fristDato}-${index}`} oppgave={oppgave} />
            ))}
          </Table.Body>
        </Table>
      )}
    </VStack>
  );
}
