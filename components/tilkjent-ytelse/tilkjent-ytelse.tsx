'use client';

import styles from './tilkjent-ytelse.module.css';
import { SakDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { BodyShort, Chips, HStack, ToggleGroup, VStack } from '@navikt/ds-react';
import { useMemo, useState } from 'react';
import { TilkjentYtelseTabell } from './tilkjent-ytelse-tabell';
import { filtrerRader, sorterRaderEtterTilOgMedDesc } from './tilkjent-ytelse-utils';

type Props = {
  sak: SakDTO;
};

export function TilkjentYtelse({ sak }: Props): React.ReactElement {
  const [visMeldekort, setVisMeldekort] = useState(true);
  const [visSpesialutbetaling, setVisSpesialutbetaling] = useState(true);

  const tilkjentYtelse = sak.tilkjentYtelse;
  const rader = useMemo(() => tilkjentYtelse?.rader ?? [], [tilkjentYtelse]);

  const synligeRader = useMemo(
    () => sorterRaderEtterTilOgMedDesc(filtrerRader(rader, { visMeldekort, visSpesialutbetaling })),
    [rader, visMeldekort, visSpesialutbetaling]
  );

  if (tilkjentYtelse == null) {
    return (
      <VStack paddingBlock="space-40">
        <BodyShort>Det finnes ingen tilkjent ytelse for denne saken.</BodyShort>
      </VStack>
    );
  }

  return (
    <VStack paddingBlock="space-24" gap="space-24">
      <HStack gap="space-16" align="center" wrap>
        {/* Saksperiode/Alle perioder er ikke implementert enda fordi vi mangler data til å skille periodene */}
        <div className={styles.deaktivert} aria-disabled="true">
          <ToggleGroup value="saksperiode" onChange={() => {}} size="small">
            <ToggleGroup.Item value="saksperiode" label="Saksperiode" />
            <ToggleGroup.Item value="alle" label="Alle perioder" />
          </ToggleGroup>
        </div>
        <Chips>
          <Chips.Toggle selected={visMeldekort} checkmark onClick={() => setVisMeldekort((forrige) => !forrige)}>
            Vis meldekort
          </Chips.Toggle>
          <Chips.Toggle
            selected={visSpesialutbetaling}
            checkmark
            onClick={() => setVisSpesialutbetaling((forrige) => !forrige)}
          >
            Vis spesialutbetaling
          </Chips.Toggle>
        </Chips>
      </HStack>

      <TilkjentYtelseTabell rader={synligeRader} />
    </VStack>
  );
}
