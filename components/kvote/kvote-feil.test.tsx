// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { KvoteFeil } from './kvote-feil';

describe('KvoteFeil', () => {
  it('viser forventet melding uten retry ved manglende tilgang', () => {
    render(<KvoteFeil ingenTilgang />);

    expect(screen.getByRole('heading', { name: 'Advarsel: Ikke tilgang til kvotehistorikk' })).toBeInTheDocument();
    expect(
      screen.getByText('Du har ikke tilgang til å se denne saken. Ta kontakt med brukerstøtte hvis feilen vedvarer.')
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Prøv igjen' })).not.toBeInTheDocument();
    expect(screen.queryByText('Klarte ikke å hente kvotehistorikk')).not.toBeInTheDocument();
  });

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
