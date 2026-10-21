'use client';

import styles from './tilkjent-ytelse.module.css';
import { TilkjentYtelseRadDTO, TilkjentYtelseUkeDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { BodyShort, Heading, HStack, InlineMessage, List, Table, VStack } from '@navikt/ds-react';
import { CheckmarkIcon } from '@navikt/aksel-icons';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { FieldValue } from 'components/felleskomponenter/field-value/field-value';
import { parseISOorNull } from 'lib/utils/date';
import { SpesialutbetalingDetaljer } from './spesialutbetaling-detaljer';
import {
  datoEllerIkkeFunnet,
  erDatoIPerioden,
  erSpesialutbetaling,
  formaterAnmerkning,
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
  visUnntaksperiode: boolean;
};

export function TilkjentYtelseDetaljer({ rad, visUnntaksperiode }: Props): React.ReactElement {
  if (erSpesialutbetaling(rad)) {
    return (
      <VStack gap="space-24" className={styles.detaljer}>
        <SpesialutbetalingDetaljer spesialutbetaling={rad.spesialutbetaling} />
      </VStack>
    );
  }

  const { reduksjon, meldekort } = rad;
  const erTrukketForSentLevertMeldekort = (reduksjon?.levertForSentDager ?? 0) > 0;
  const anmerkninger = meldekort?.anmerkninger ?? [];

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
        {visUnntaksperiode && (
          <FieldValue
            label="Gjenstående unntaksperiode §11-12 andre og tredje ledd"
            value={formaterGjenstaaendeDager(rad.gjenstaaendeUnntakDager)}
          />
        )}
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

          <VStack gap="space-8">
            <div className={styles.ukerRamme}>
              {meldekort.uker.map((uke) => (
                <MeldekortUkeTabell key={uke.ukenr} uke={uke} rad={rad} />
              ))}
            </div>
            {meldekort.uker.length > 0 && rad.fraOgMedDato != null && rad.tilOgMedDato != null && (
              <HStack gap="space-8" align="center">
                <span className={styles.periodeFargeforklaring} aria-hidden />
                <BodyShort size="small" textColor="subtle">
                  {`Grønn farge viser dagene som er med i perioden ${datoEllerIkkeFunnet(rad.fraOgMedDato)}–${datoEllerIkkeFunnet(rad.tilOgMedDato)}.`}
                </BodyShort>
              </HStack>
            )}
          </VStack>

          {anmerkninger.length > 0 && (
            <VStack gap="space-8">
              <Heading size="xsmall" level="4">
                Anmerkninger
              </Heading>
              <List size="small">
                {anmerkninger.map((anmerkning, index) => (
                  <List.Item key={`${anmerkning.kode}-${index}`}>{formaterAnmerkning(anmerkning)}</List.Item>
                ))}
              </List>
            </VStack>
          )}

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

function MeldekortUkeTabell({
  uke,
  rad,
}: {
  uke: TilkjentYtelseUkeDTO;
  rad: TilkjentYtelseRadDTO;
}): React.ReactElement {
  const dager = uke.dager.map((dag, index) => ({
    ...dag,
    nokkel: dag.dato ?? index,
    className: erDatoIPerioden(dag.dato, rad) ? styles.iPerioden : undefined,
  }));

  return (
    <Table size="small" className={styles.ukeTabell}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell scope="col">{`UKE ${uke.ukenr}`}</Table.HeaderCell>
          {dager.map((dag) => (
            <Table.HeaderCell key={dag.nokkel} scope="col" className={dag.className}>
              {formaterUkedag(dag.dato)}
            </Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell scope="row">Arbeid</Table.HeaderCell>
          {dager.map((dag) => (
            <Table.DataCell key={dag.nokkel} className={dag.className}>
              {formaterTimer(dag.timerArbeidet)}
            </Table.DataCell>
          ))}
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope="row">Annet fravær</Table.HeaderCell>
          {dager.map((dag) => (
            <Table.DataCell key={dag.nokkel} className={dag.className}>
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
