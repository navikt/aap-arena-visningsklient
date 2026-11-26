// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { KvoteFeil } from './kvote-feil';

describe('KvoteFeil', () => {
  it('beholder feilmelding og retry ved uventede feil', () => {
    const prøvIgjen = vi.fn();
    render(<KvoteFeil prøvIgjen={prøvIgjen} />);

    expect(screen.getByRole('heading', { name: 'Feil: Klarte ikke å hente kvotehistorikk' })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Noe gikk galt da kvotehistorikken for saken skulle hentes. Ta kontakt med brukerstøtte hvis feilen vedvarer.'
      )
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Prøv igjen' }));
    expect(prøvIgjen).toHaveBeenCalledOnce();
  });
});
