'use client';

import { ArenaVedtakfaktaDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { Heading, Table } from '@navikt/ds-react';

type Props = {
  vedtakfakta: ArenaVedtakfaktaDTO[];
};

export function Vedtakfakta({ vedtakfakta }: Props): React.ReactElement {
  const fakta = vedtakfakta.filter((f) => f.verdi != null);
  return (
    <div>
      <Heading size="small">Vedtaksfakta på vedtaket ({fakta.length})</Heading>
      <Table size="small" zebraStripes>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
            <Table.HeaderCell scope="col">Verdi</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {fakta.map(({ navn, verdi, kode }) => {
            return (
              <Table.Row key={kode}>
                <Table.HeaderCell scope="row">{navn}</Table.HeaderCell>
                <Table.DataCell>{verdi}</Table.DataCell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
}
