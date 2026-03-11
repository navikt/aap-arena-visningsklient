'use client';

import { BodyShort, Dropdown, InternalHeader, Spacer } from '@navikt/ds-react';
import Link from 'next/link';
import { LeaveIcon, ThemeIcon } from '@navikt/aksel-icons';
import { useEffect, useState } from 'react';

type Props = {
  visningsnavn: string;
};

export function HeaderClient({ visningsnavn }: Props): React.ReactElement {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const theme = window.localStorage.getItem('theme') ?? 'light';
    document.querySelectorAll('HTML')[0].className = theme;
    setDarkMode(theme === 'dark');
  }, []);

  const handleSwapTheme = () => {
    const newTheme = darkMode ? 'light' : 'dark';

    window.localStorage.setItem('theme', newTheme);
    document.querySelectorAll('HTML')[0].className = newTheme;
    setDarkMode(!darkMode);
  };

  return (
    <InternalHeader>
      <InternalHeader.Title as="h1">Kelvin</InternalHeader.Title>
      <Spacer />
      <Dropdown>
        <InternalHeader.UserButton name={visningsnavn} as={Dropdown.Toggle} />
        <Dropdown.Menu>
          <Dropdown.Menu.GroupedList>
            <Dropdown.Menu.List.Item as="button" onClick={handleSwapTheme}>
              <BodyShort>{darkMode ? 'Lys' : 'Mørk'} modus</BodyShort>
              <Spacer />
              <ThemeIcon aria-hidden fontSize="1.5rem" />
            </Dropdown.Menu.List.Item>
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
