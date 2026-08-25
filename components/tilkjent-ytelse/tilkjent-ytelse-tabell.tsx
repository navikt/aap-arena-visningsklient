'use client';

import { TilkjentYtelseRadDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { BodyShort, Table } from '@navikt/ds-react';
import { TilkjentYtelseDetaljer } from './tilkjent-ytelse-detaljer';
import styles from './tilkjent-ytelse.module.css';
import {
  datoEllerIkkeFunnet,
  formaterAnvistProsent,
  formaterTotalReduksjon,
  formaterUke,
  kronerEllerIkkeFunnet,
  tekstEllerIkkeFunnet,
} from './tilkjent-ytelse-utils';

type Props = {
  rader: TilkjentYtelseRadDTO[];
};

export function TilkjentYtelseTabell({ rader }: Props): React.ReactElement {
  if (rader.length === 0) {
    return <BodyShort>Det er ingen perioder å vise.</BodyShort>;
  }

  return (
    <Table zebraStripes size="small">
      <Table.Header>
        <Table.Row className={styles.headRow}>
          <Table.HeaderCell scope="col" textSize="small" className={styles.headerCell}>
            Fra og med
          </Table.HeaderCell>
          <Table.HeaderCell scope="col" textSize="small" className={styles.headerCell}>
            Til og med
          </Table.HeaderCell>
          <Table.HeaderCell scope="col" textSize="small" className={styles.headerCell}>
            Uke
          </Table.HeaderCell>
          <Table.HeaderCell scope="col" textSize="small" className={styles.headerCell}>
            Kilde
          </Table.HeaderCell>
          <Table.HeaderCell scope="col" textSize="small" className={styles.headerCell}>
            Dagsats m/barnetillegg
          </Table.HeaderCell>
          <Table.HeaderCell scope="col" textSize="small" className={styles.headerCell}>
            Total reduksjon
          </Table.HeaderCell>
          <Table.HeaderCell scope="col" textSize="small" className={styles.headerCell}>
            Anvist prosent
          </Table.HeaderCell>
          <Table.HeaderCell scope="col" textSize="small" className={styles.headerCell}>
            Effektiv dagsats
          </Table.HeaderCell>
          <Table.HeaderCell scope="col" textSize="small" className={styles.headerCell}>
            Beregnet brutto
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rader.map((rad, index) => (
          <Table.ExpandableRow
            key={`${rad.meldekort?.meldekortId ?? rad.kilde}-${index}`}
            togglePlacement="right"
            content={<TilkjentYtelseDetaljer rad={rad} />}
          >
            <Table.DataCell textSize="small">{datoEllerIkkeFunnet(rad.fraOgMedDato)}</Table.DataCell>
            <Table.DataCell textSize="small">{datoEllerIkkeFunnet(rad.tilOgMedDato)}</Table.DataCell>
            <Table.DataCell textSize="small">{formaterUke(rad)}</Table.DataCell>
            <Table.DataCell textSize="small">{tekstEllerIkkeFunnet(rad.kilde)}</Table.DataCell>
            <Table.DataCell textSize="small">{kronerEllerIkkeFunnet(rad.dagsatsMedBarnetillegg)}</Table.DataCell>
            <Table.DataCell textSize="small">{formaterTotalReduksjon(rad)}</Table.DataCell>
            <Table.DataCell textSize="small">{formaterAnvistProsent(rad)}</Table.DataCell>
            <Table.DataCell textSize="small">{kronerEllerIkkeFunnet(rad.dagsats)}</Table.DataCell>
            <Table.DataCell textSize="small">{kronerEllerIkkeFunnet(rad.beregnetBrutto)}</Table.DataCell>
          </Table.ExpandableRow>
        ))}
      </Table.Body>
    </Table>
  );
}
