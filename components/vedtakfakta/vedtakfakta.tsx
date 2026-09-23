'use client';

import { BodyShort, Heading, HStack, Table, VStack } from '@navikt/ds-react';
import { ArenaVedtakfaktaDTO, ArenaVedtakMedFaktaDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { formaterFaktaDato } from 'lib/utils/date';

type Props = {
  vedtak: ArenaVedtakMedFaktaDTO;
  fakta: ArenaVedtakfaktaDTO[];
};

export function Vedtakfakta({ vedtak, fakta }: Props): React.ReactElement {
  const vedtaksdato = formaterFaktaDato(vedtak.fakta.find((f) => f.kode === 'INNVF')?.verdi);

  return (
    <VStack gap="space-24">
      <VStack gap="space-8">
        <Heading size="medium" level="1">
          Vedtaksfakta
        </Heading>
        <HStack gap="space-16">
          <BodyShort size="medium" weight="semibold">
            Vedtak nr. {vedtak.lopenrvedtak} – {vedtak.rettighetnavn}
          </BodyShort>
          {vedtaksdato != null && <BodyShort size="medium">{vedtaksdato}</BodyShort>}
        </HStack>
      </VStack>
      {fakta.length === 0 ? (
        <BodyShort size="medium">Det er ingen vedtaksfakta på vedtaket</BodyShort>
      ) : (
        <Table zebraStripes>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell scope="col">Faktanavn</Table.HeaderCell>
              <Table.HeaderCell scope="col">Verdi</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {fakta.map((f) => (
              <Table.Row key={f.kode}>
                <Table.DataCell>{f.navn}</Table.DataCell>
                <Table.DataCell>{f.verdi ?? '—'}</Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </VStack>
  );
}
