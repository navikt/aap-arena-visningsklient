'use client';

import styles from './tilkjent-ytelse.module.css';
import { SakDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { BodyShort, Chips, HStack, ToggleGroup, VStack } from '@navikt/ds-react';
import { useMemo, useState } from 'react';
import { TilkjentYtelseTabell } from './tilkjent-ytelse-tabell';
import { filtrerRader, filtrerRaderPaaSaksperiode, sorterRaderEtterTilOgMedDesc } from './tilkjent-ytelse-utils';
import { finnSaksperiode, formaterSaksperiode, harSaksperiode } from 'lib/utils/saksperiode';
import { harUnntakAAP } from 'lib/utils/vedtaksfakta';

type Props = {
  sak: SakDTO;
};

type PeriodeValg = 'saksperiode' | 'alle';

export function TilkjentYtelse({ sak }: Props): React.ReactElement {
  const [visMeldekort, setVisMeldekort] = useState(true);
  const [visSpesialutbetaling, setVisSpesialutbetaling] = useState(true);
  const [periodeValg, setPeriodeValg] = useState<PeriodeValg>('saksperiode');

  const tilkjentYtelse = sak.tilkjentYtelse;
  const rader = useMemo(() => tilkjentYtelse?.rader ?? [], [tilkjentYtelse]);

  const saksperiode = useMemo(() => finnSaksperiode(sak.vedtak), [sak.vedtak]);
  const kanFiltrerePaaSaksperiode = harSaksperiode(saksperiode);
  const saksperiodeTekst = formaterSaksperiode(saksperiode);
  const visUnntaksperiode = harUnntakAAP(sak.vedtak);

  const synligeRader = useMemo(() => {
    const raderIPerioden = periodeValg === 'saksperiode' ? filtrerRaderPaaSaksperiode(rader, saksperiode) : rader;
    return sorterRaderEtterTilOgMedDesc(filtrerRader(raderIPerioden, { visMeldekort, visSpesialutbetaling }));
  }, [rader, saksperiode, periodeValg, visMeldekort, visSpesialutbetaling]);

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
        {/* Uten datoer på vedtakene finnes det ingen saksperiode å filtrere på, og valget deaktiveres. */}
        <div
          className={kanFiltrerePaaSaksperiode ? undefined : styles.deaktivert}
          aria-disabled={kanFiltrerePaaSaksperiode ? undefined : 'true'}
        >
          <ToggleGroup value={periodeValg} onChange={(verdi) => setPeriodeValg(verdi as PeriodeValg)} size="small">
            <ToggleGroup.Item value="saksperiode" label="Saksperiode" />
            <ToggleGroup.Item value="alle" label="Alle perioder" />
          </ToggleGroup>
        </div>
        {saksperiodeTekst != null && (
          <BodyShort size="small" textColor="subtle" data-testid="tilkjent-ytelse-saksperiode">
            {saksperiodeTekst}
          </BodyShort>
        )}
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

      <TilkjentYtelseTabell rader={synligeRader} visUnntaksperiode={visUnntaksperiode} />
    </VStack>
  );
}
