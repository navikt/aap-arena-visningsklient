'use client';

import styles from './sakogvedtak.module.css';
import { ArenaVedtakMedFaktaDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { BodyShort, Heading, HStack, Table } from '@navikt/ds-react';
import { format } from 'date-fns';
import { Vedtakdetaljer } from 'components/sakogvedtakinfo/vedtakdetaljer/vedtakdetaljer';
import { CheckmarkCircleIcon } from '@navikt/aksel-icons';
import { XMarkOctagonIcon } from '@navikt/aksel-icons';

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

  const sortedVedtak = [...vedtak].sort((v1, v2) => v2.lopenrvedtak - v1.lopenrvedtak);

  return (
    <div>
      <Heading size="small">Vedtak på saken ({vedtak.length})</Heading>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">Nr.</Table.HeaderCell>
            <Table.HeaderCell scope="col">Rettighet</Table.HeaderCell>
            <Table.HeaderCell scope="col">Vedtakstype</Table.HeaderCell>
            <Table.HeaderCell scope="col">Aktivitetsfase</Table.HeaderCell>
            <Table.HeaderCell scope="col">Fra og med</Table.HeaderCell>
            <Table.HeaderCell scope="col">Til og med</Table.HeaderCell>
            <Table.HeaderCell scope="col">Behandslingsstatus</Table.HeaderCell>
            <Table.HeaderCell scope="col">Utfall</Table.HeaderCell>
            <Table.HeaderCell scope="col"></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortedVedtak.map((vedtak) => {
            const {
              rettighetnavn,
              vedtaktypeNavn,
              lopenrvedtak,
              aktivitetsfaseNavn,
              fraOgMed,
              tilDato,
              statusNavn,
              utfallkode,
              vedtakId,
            } = vedtak;
            const relatertVedtak =
              vedtak.relatertVedtak != null
                ? (sortedVedtak.find((v) => v.vedtakId === vedtak.relatertVedtak) ?? null)
                : null;
            return (
              <Table.ExpandableRow
                key={vedtakId}
                togglePlacement="right"
                content={<Vedtakdetaljer vedtak={vedtak} relatertVedtak={relatertVedtak} />}
              >
                <Table.DataCell>{lopenrvedtak}</Table.DataCell>
                <Table.HeaderCell scope="row">{rettighetnavn}</Table.HeaderCell>
                <Table.DataCell>{vedtaktypeNavn}</Table.DataCell>
                <Table.DataCell>{aktivitetsfaseNavn}</Table.DataCell>
                <Table.DataCell>{dateOrBlank(fraOgMed)}</Table.DataCell>
                <Table.DataCell>{dateOrBlank(tilDato)}</Table.DataCell>
                <Table.DataCell>{statusNavn}</Table.DataCell>
                <Table.DataCell>
                  <JaNeiStatus status={utfallkode} />
                </Table.DataCell>
              </Table.ExpandableRow>
            );
          })}
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

type JaNeiStatusProps = {
  status: string | null | undefined;
};

function JaNeiStatus({ status }: JaNeiStatusProps): React.ReactElement {
  if (status == null) {
    return <div>—</div>;
  }
  if (status.toLowerCase() === 'ja') {
    return (
      <HStack align="center" gap="space-4">
        <CheckmarkCircleIcon className={styles.successIcon} />
        <BodyShort size="medium">Ja</BodyShort>
      </HStack>
    );
  }
  if (status.toLowerCase() === 'nei') {
    return (
      <HStack align="center" gap="space-4">
        <XMarkOctagonIcon className={styles.errorIcon} />
        <BodyShort size="medium">Nei</BodyShort>
      </HStack>
    );
  }

  return <div>{status}</div>;
}
