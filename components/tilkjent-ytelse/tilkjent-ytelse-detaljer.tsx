'use client';

import styles from './tilkjent-ytelse.module.css';
import { TilkjentYtelseRadDTO, TilkjentYtelseUkeDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { BodyShort, Heading, HStack, InlineMessage, Table, VStack } from '@navikt/ds-react';
import { CheckmarkIcon } from '@navikt/aksel-icons';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { FieldValue } from 'components/felleskomponenter/field-value/field-value';
import { parseISOorNull } from 'lib/utils/date';
import {
  datoEllerIkkeFunnet,
  formaterArbeid,
  formaterDager,
  formaterGjenstaaendeDager,
  formaterInstitusjon,
  formaterSamordning,
  formaterTimer,
  IKKE_FUNNET,
  jaNeiEllerIkkeFunnet,
  tekstEllerIkkeFunnet,
} from './tilkjent-ytelse-utils';

type Props = {
  rad: TilkjentYtelseRadDTO;
};

export function TilkjentYtelseDetaljer({ rad }: Props): React.ReactElement {
  const { reduksjon, meldekort } = rad;
  const erTrukketForSentLevertMeldekort = (reduksjon?.levertForSentDager ?? 0) > 0;

  return (
    <VStack gap="space-24" className={styles.detaljer}>
      <HStack gap="space-32" wrap>
        <FieldValue label="Arbeid" value={formaterArbeid(rad)} />
        <FieldValue label="Samordning" value={formaterSamordning(rad)} />
        <FieldValue label="Institusjon" value={formaterInstitusjon(rad)} />
        <FieldValue label="Trekk for sent innsendt meldekort" value={formaterDager(reduksjon?.levertForSentDager)} />
        <FieldValue
          label="Gjenstående ordinær periode"
          value={formaterGjenstaaendeDager(rad.gjenstaaendeOrdinaerDager)}
        />
        <FieldValue
          label="Gjenstående unntaksperiode §11-12 andre og tredje ledd"
          value={formaterGjenstaaendeDager(rad.gjenstaaendeUnntakDager)}
        />
      </HStack>

      {meldekort != null ? (
        <VStack gap="space-16">
          <HStack gap="space-12" align="center" wrap>
            <Heading size="small">Meldekort</Heading>
            {erTrukketForSentLevertMeldekort && (
              <InlineMessage status="warning" size="small">
                Det er trukket dager fordi forrige meldekort ble levert for sent
              </InlineMessage>
            )}
          </HStack>

          <HStack gap="space-32" wrap>
            <FieldValue label="Meldedato" value={datoEllerIkkeFunnet(meldekort.meldedato)} />
            <FieldValue label="Meldeform" value={tekstEllerIkkeFunnet(meldekort.meldeform)} />
            <FieldValue
              label="Fortsatt registrert som arbeidssøker"
              value={jaNeiEllerIkkeFunnet(meldekort.fortsattRegistrertArbeidssoker)}
            />
          </HStack>

          <div className={styles.ukerRamme}>
            {meldekort.uker.map((uke) => (
              <MeldekortUkeTabell key={uke.ukenr} uke={uke} />
            ))}
          </div>

          <HStack gap="space-32" wrap>
            <FieldValue label="Kommentar" value={tekstEllerIkkeFunnet(meldekort.kommentar)} />
            <FieldValue label="Feilmelding" value={IKKE_FUNNET} />
          </HStack>
        </VStack>
      ) : (
        <BodyShort size="small">Ingen meldekortdetaljer for denne raden.</BodyShort>
      )}
    </VStack>
  );
}

function MeldekortUkeTabell({ uke }: { uke: TilkjentYtelseUkeDTO }): React.ReactElement {
  return (
    <Table size="small" className={styles.ukeTabell}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell scope="col">{`UKE ${uke.ukenr}`}</Table.HeaderCell>
          {uke.dager.map((dag, index) => (
            <Table.HeaderCell key={dag.dato ?? index} scope="col">
              {formaterUkedag(dag.dato)}
            </Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell scope="row">Arbeid</Table.HeaderCell>
          {uke.dager.map((dag, index) => (
            <Table.DataCell key={dag.dato ?? index}>{formaterTimer(dag.timerArbeidet)}</Table.DataCell>
          ))}
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope="row">Annet fravær</Table.HeaderCell>
          {uke.dager.map((dag, index) => (
            <Table.DataCell key={dag.dato ?? index}>
              {dag.annetFravaer && <CheckmarkIcon className={styles.checkmarkIcon} title="Annet fravær" />}
            </Table.DataCell>
          ))}
        </Table.Row>
      </Table.Body>
    </Table>
  );
}

function formaterUkedag(datostring: string | null | undefined): string {
  const parsed = parseISOorNull(datostring);
  return parsed != null ? format(parsed, 'EEE dd.MM.', { locale: nb }) : IKKE_FUNNET;
}
