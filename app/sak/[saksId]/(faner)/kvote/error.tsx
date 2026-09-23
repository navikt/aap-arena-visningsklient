'use client';

import { KvoteFeil } from 'components/kvote/kvote-feil';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <KvoteFeil prøvIgjen={reset} />;
}
