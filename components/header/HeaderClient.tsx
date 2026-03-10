'use client';

import { BodyShort, Dropdown, InternalHeader, Spacer } from '@navikt/ds-react';
import Link from 'next/link';
import { LeaveIcon } from '@navikt/aksel-icons';

type Props = {
  visningsnavn: string;
};

export function HeaderClient({ visningsnavn }: Props): React.ReactElement {
  return (
    <InternalHeader>
      <InternalHeader.Title as="h1">Kelvin</InternalHeader.Title>
      <Spacer />
      <Dropdown>
        <InternalHeader.UserButton name={visningsnavn} as={Dropdown.Toggle} />
        <Dropdown.Menu>
          <Dropdown.Menu.GroupedList>
            <Dropdown.Menu.List.Item as={Link} href={'/oauth2/logout'}>
              <BodyShort>Logg ut</BodyShort>
              <Spacer />
              <LeaveIcon aria-hidden fontSize="1.5rem" />
            </Dropdown.Menu.List.Item>
          </Dropdown.Menu.GroupedList>
        </Dropdown.Menu>
      </Dropdown>
    </InternalHeader>
  );
}
