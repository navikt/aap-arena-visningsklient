'use client';

import { TilkjentYtelseFeil } from 'components/tilkjent-ytelse/tilkjent-ytelse-feil';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <TilkjentYtelseFeil prøvIgjen={reset} />;
}
