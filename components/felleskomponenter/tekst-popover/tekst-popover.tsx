'use client';

import { useId, useState } from 'react';
import { Button, Popover } from '@navikt/ds-react';

type Props = {
  knappetekst: string;
  tekst: string;
};

export function TekstPopover({ knappetekst, tekst }: Props): React.ReactElement {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [openState, setOpenState] = useState(false);
  const popoverId = useId();

  return (
    <>
      <Button
        ref={setAnchorEl}
        onClick={() => setOpenState(!openState)}
        aria-expanded={openState}
        aria-controls={openState ? popoverId : undefined}
        variant="tertiary"
        size="small"
      >
        {knappetekst}
      </Button>

      <Popover open={openState} onClose={() => setOpenState(false)} anchorEl={anchorEl} id={popoverId}>
        <Popover.Content>{tekst}</Popover.Content>
      </Popover>
    </>
  );
}
