'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { hentTilkjentYtelse } from 'lib/services/arenaoppslag/arenaoppslag-service';
import { TilkjentYtelseDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { TilkjentYtelseStatus } from './tilkjent-ytelse-types';

type TilkjentYtelseResultat = {
  tilkjentYtelse: TilkjentYtelseDTO | null;
  status: TilkjentYtelseStatus;
  hentPaaNytt: () => void;
};

export function useTilkjentYtelse(saksId: string, aktiv: boolean): TilkjentYtelseResultat {
  const [tilkjentYtelse, setTilkjentYtelse] = useState<TilkjentYtelseDTO | null>(null);
  const [status, setStatus] = useState<TilkjentYtelseStatus>('ikkeHentet');
  // Data caches for hele levetiden til siden, slik at fanebytte ikke gir nye kall mot Arena.
  const harHentet = useRef(false);

  const hent = useCallback(async () => {
    harHentet.current = true;
    setStatus('laster');
    try {
      const data = await hentTilkjentYtelse(saksId);
      setTilkjentYtelse(data);
      setStatus('ferdig');
    } catch {
      setTilkjentYtelse(null);
      setStatus('feilet');
    }
  }, [saksId]);

  useEffect(() => {
    if (aktiv && !harHentet.current) {
      void hent();
    }
  }, [aktiv, hent]);

  const hentPaaNytt = useCallback(() => {
    void hent();
  }, [hent]);

  return { tilkjentYtelse, status, hentPaaNytt };
}
