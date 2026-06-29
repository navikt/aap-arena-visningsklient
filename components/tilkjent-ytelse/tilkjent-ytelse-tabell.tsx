'use client';

import { TilkjentYtelseRadDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { BodyShort, Table } from '@navikt/ds-react';
import { TilkjentYtelseDetaljer } from './tilkjent-ytelse-detaljer';
import {
  datoEllerIkkeFunnet,
  formaterUke,
  IKKE_FUNNET,
  kronerEllerIkkeFunnet,
  tekstEllerIkkeFunnet,
} from './tilkjent-ytelse-utils';

type Props = {
  rader: TilkjentYtelseRadDTO[];
  gjenstaaendeOrdinaerDager: number;
  gjenstaaendeUnntakDager: number;
};

export function TilkjentYtelseTabell({
  rader,
  gjenstaaendeOrdinaerDager,
  gjenstaaendeUnntakDager,
}: Props): React.ReactElement {
  if (rader.length === 0) {
    return <BodyShort>Det er ingen perioder å vise.</BodyShort>;
  }

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell scope="col">Fra og med</Table.HeaderCell>
          <Table.HeaderCell scope="col">Til og med</Table.HeaderCell>
          <Table.HeaderCell scope="col">Uke</Table.HeaderCell>
          <Table.HeaderCell scope="col">Kilde</Table.HeaderCell>
          <Table.HeaderCell scope="col">Dagsats m/barnetillegg</Table.HeaderCell>
          <Table.HeaderCell scope="col">Total reduksjon</Table.HeaderCell>
          <Table.HeaderCell scope="col">Anvist prosent</Table.HeaderCell>
          <Table.HeaderCell scope="col">Effektiv dagsats</Table.HeaderCell>
          <Table.HeaderCell scope="col">Beregnet brutto</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rader.map((rad, index) => (
          <Table.ExpandableRow
            key={`${rad.meldekort?.meldekortId ?? rad.kilde}-${index}`}
            togglePlacement="right"
            content={
              <TilkjentYtelseDetaljer
                rad={rad}
                gjenstaaendeOrdinaerDager={gjenstaaendeOrdinaerDager}
                gjenstaaendeUnntakDager={gjenstaaendeUnntakDager}
              />
            }
          >
            <Table.DataCell>{datoEllerIkkeFunnet(rad.fraOgMedDato)}</Table.DataCell>
            <Table.DataCell>{datoEllerIkkeFunnet(rad.tilOgMedDato)}</Table.DataCell>
            <Table.DataCell>{formaterUke(rad)}</Table.DataCell>
            <Table.DataCell>{tekstEllerIkkeFunnet(rad.kilde)}</Table.DataCell>
            <Table.DataCell>{kronerEllerIkkeFunnet(rad.dagsatsMedBarnetillegg)}</Table.DataCell>
            <Table.DataCell>{IKKE_FUNNET}</Table.DataCell>
            <Table.DataCell>{IKKE_FUNNET}</Table.DataCell>
            <Table.DataCell>{IKKE_FUNNET}</Table.DataCell>
            <Table.DataCell>{kronerEllerIkkeFunnet(rad.beregnetBrutto)}</Table.DataCell>
          </Table.ExpandableRow>
        ))}
      </Table.Body>
    </Table>
  );
}
