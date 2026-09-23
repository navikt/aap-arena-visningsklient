'use client';

import { VedtakfaktaFeil } from 'components/vedtakfakta/vedtakfakta-feil';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <VedtakfaktaFeil prøvIgjen={reset} />;
}
