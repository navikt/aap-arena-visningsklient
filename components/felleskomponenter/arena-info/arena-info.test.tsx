// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { ArenaInfo } from 'components/felleskomponenter/arena-info/arena-info';

describe('ArenaInfo', () => {
  it('viser informasjon om at helseopplysninger og notater må ses i Arena', () => {
    render(<ArenaInfo />);

    expect(screen.getByRole('heading', { name: /Ikke all informasjon vises her/ })).toBeDefined();
    expect(screen.getByText(/helseopplysninger og notater/)).toBeDefined();
    expect(screen.getByText(/se i\s+Arena/)).toBeDefined();
  });

  it('skjuler meldingen når lukkeknappen klikkes', () => {
    render(<ArenaInfo />);

    fireEvent.click(screen.getByRole('button', { name: 'Lukk' }));

    expect(screen.queryByRole('heading', { name: /Ikke all informasjon vises her/ })).toBeNull();
  });
});
