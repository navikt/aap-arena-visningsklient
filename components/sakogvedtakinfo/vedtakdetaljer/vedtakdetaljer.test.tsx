// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Vedtakdetaljer } from 'components/sakogvedtakinfo/vedtakdetaljer/vedtakdetaljer';
import { ArenaVedtakMedFaktaDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';

const lagVedtak = (overrides: Partial<ArenaVedtakMedFaktaDTO> = {}): ArenaVedtakMedFaktaDTO =>
  ({
    vedtakId: 42,
    lopenrvedtak: 1,
    rettighetkode: 'AAP',
    rettighetnavn: 'Arbeidsavklaringspenger',
    saksbehandler: null,
    beslutter: null,
    relatertVedtak: null,
    fakta: [],
    vilkårsvurderinger: [],
    andreYtelser: [],
    institusjonOpphold: null,
    ...overrides,
  }) as ArenaVedtakMedFaktaDTO;

describe('Vedtakdetaljer', () => {
  it('viser lenke til alle vedtaksfakta som åpnes i ny fane', () => {
    render(<Vedtakdetaljer saksId="2024-1" vedtak={lagVedtak()} relatertVedtak={null} />);

    const lenke = screen.getByRole('link', { name: /Vis alle vedtaksfakta/ });
    expect(lenke).toHaveAttribute('href', '/sak/2024-1/vedtakfakta/42');
    expect(lenke).toHaveAttribute('target', '_blank');
    expect(lenke).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
