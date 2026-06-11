'use client';

import { useId, useState } from 'react';
import { Button, Label, Popover, Table, VStack } from '@navikt/ds-react';

export type KvoteEndring = {
  id: number;
  dato: string;
  type: string;
  endretAv: string;
  endring: string;
  gjenvaerende: string;
  begrunnelse?: string;
};

type Props = {
  tittel: string;
  endringer: KvoteEndring[];
};

function BegrunnelsePopover({ begrunnelse }: { begrunnelse: string }): React.ReactElement {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [openState, setOpenState] = useState(false);
  const popoverId = useId();

  return (
    <>
      <Button
        ref={setAnchorEl}
        onClick={() => setOpenState(!openState)}
        aria-expanded={openState}
        aria-controls={openState ? popoverId : undefined}
        variant="tertiary"
        size="small"
      >
        Vis begrunnelse
      </Button>

      <Popover open={openState} onClose={() => setOpenState(false)} anchorEl={anchorEl} id={popoverId}>
        <Popover.Content>{begrunnelse}</Popover.Content>
      </Popover>
    </>
  );
}

export function KvoteTabell({ tittel, endringer }: Props): React.ReactElement {
  return (
    <VStack gap="space-16">
      <Label size="medium">{tittel}</Label>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">Dato</Table.HeaderCell>
            <Table.HeaderCell scope="col">Type</Table.HeaderCell>
            <Table.HeaderCell scope="col">Endret av</Table.HeaderCell>
            <Table.HeaderCell scope="col">Endring</Table.HeaderCell>
            <Table.HeaderCell scope="col">Gjenværende</Table.HeaderCell>
            <Table.HeaderCell scope="col">Begrunnelse</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {endringer.map((endring) => (
            <Table.Row key={endring.id}>
              <Table.DataCell>{endring.dato}</Table.DataCell>
              <Table.DataCell>{endring.type}</Table.DataCell>
              <Table.DataCell>{endring.endretAv}</Table.DataCell>
              <Table.DataCell>{endring.endring}</Table.DataCell>
              <Table.DataCell>{endring.gjenvaerende}</Table.DataCell>
              <Table.DataCell>
                {endring.begrunnelse != null && <BegrunnelsePopover begrunnelse={endring.begrunnelse} />}
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </VStack>
  );
}
