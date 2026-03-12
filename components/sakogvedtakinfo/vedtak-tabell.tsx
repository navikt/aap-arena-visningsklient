'use client';

import { ArenaVedtakMedFaktaDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { BodyShort, Heading, Table } from '@navikt/ds-react';
import { format } from 'date-fns';
import { Vedtakfakta } from 'components/sakogvedtakinfo/vedtakfakta';
import { dateComperator, parseISOorNull } from 'lib/utils/date';

type Props = {
  vedtak: ArenaVedtakMedFaktaDTO[];
};

export function VedtakTabell({ vedtak }: Props): React.ReactElement {
  if (vedtak.length === 0) {
    return (
      <div>
        <Heading size="small">Vedtak på saken (0)</Heading>
        <BodyShort size="medium">Det er ingen vedtak på saken</BodyShort>{' '}
      </div>
    );
  }

  const sortedVedtak = vedtak.sort((v1, v2) =>
    dateComperator(parseISOorNull(v1.fraOgMed), parseISOorNull(v2.fraOgMed), 'DESC')
  );

  return (
    <div>
      <Heading size="small">Vedtak på saken ({vedtak.length})</Heading>
      <Table zebraStripes>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">Rettighetskode</Table.HeaderCell>
            <Table.HeaderCell scope="col">Vedtakstype</Table.HeaderCell>
            <Table.HeaderCell scope="col">Fra og med</Table.HeaderCell>
            <Table.HeaderCell scope="col">Til og med</Table.HeaderCell>
            <Table.HeaderCell scope="col">Status</Table.HeaderCell>
            <Table.HeaderCell scope="col">Utfall</Table.HeaderCell>
            <Table.HeaderCell scope="col"></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortedVedtak.map(
            ({
              rettighetkode,
              vedtaktypeNavn,
              vedtaktypeKode,
              fraOgMed,
              tilDato,
              statusNavn,
              utfallkode,
              vedtakId,
              fakta,
            }) => {
              return (
                <Table.ExpandableRow
                  key={vedtakId}
                  togglePlacement="right"
                  content={<Vedtakfakta vedtakfakta={fakta} />}
                >
                  <Table.HeaderCell scope="row">{rettighetkode}</Table.HeaderCell>
                  <Table.DataCell>{`${vedtaktypeNavn} (${vedtaktypeKode})`}</Table.DataCell>
                  <Table.DataCell>{dateOrBlank(fraOgMed)}</Table.DataCell>
                  <Table.DataCell>{dateOrBlank(tilDato)}</Table.DataCell>
                  <Table.DataCell>{statusNavn}</Table.DataCell>
                  <Table.DataCell>{utfallkode}</Table.DataCell>
                </Table.ExpandableRow>
              );
            }
          )}
        </Table.Body>
      </Table>
    </div>
  );
}

function dateOrBlank(datostring: string | null | undefined): string {
  if (datostring == null) {
    return '—';
  }
  return format(new Date(datostring), 'dd.MM.yyyy');
}
