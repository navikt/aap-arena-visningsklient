import { Loader } from '@navikt/ds-react';

export default function Loading() {
  return (
    <section>
      <Loader size="3xlarge" title="Venter..." />
    </section>
  );
}
