// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sakogvedtakinfo } from 'components/sakogvedtakinfo/sakogvedtakinfo';
import { ArenaVedtakMedFaktaDTO, SakDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';

const lagFakta = (kode: string, verdi: string) => ({ kode, navn: kode, verdi, registrertDato: '2024-01-01' });

const lagVedtak = (overrides: Partial<ArenaVedtakMedFaktaDTO> = {}): ArenaVedtakMedFaktaDTO => ({
  vedtakId: 1,
  lopenrvedtak: 1,
  statusKode: 'IVERK',
  statusNavn: 'Iverksatt',
  vedtaktypeKode: 'O',
  vedtaktypeNavn: 'Ny rettighet',
  aktivitetsfaseKode: 'UA',
  aktivitetsfaseNavn: 'Under arbeidsavklaring',
  fraOgMed: '2024-01-01',
  tilDato: null,
  rettighetkode: 'AAP',
  rettighetnavn: 'Arbeidsavklaringspenger',
  begrunnelse: null,
  saksbehandler: null,
  beslutter: null,
  utfallkode: null,
  relatertVedtak: null,
  fakta: [],
  vilkårsvurderinger: [],
  ...overrides,
});

const lagSak = (overrides: Partial<SakDTO> = {}): SakDTO => ({
  sakId: '123',
  opprettetAar: 2024,
  lopenr: 1,
  statuskode: 'AKTIV',
  statusnavn: 'Aktiv',
  registrertDato: '2024-01-01',
  avsluttetDato: null,
  vedtak: [lagVedtak()],
  tellerverk: null,
  person: {
    personId: 1,
    fodselsnummer: '01010101010',
    fornavn: 'Test',
    etternavn: 'Testesen',
  },
  ...overrides,
});

describe('Sakogvedtakinfo datovisning', () => {
  it('viser ikke dato når ingen vedtak har fradato', () => {
    const sak = lagSak({ vedtak: [lagVedtak({ fakta: [] })] });
    render(<Sakogvedtakinfo sak={sak} />);
    expect(screen.queryByTestId('sak-datoperiode')).toBeNull();
  });

  it('viser fradato fra FDATO', () => {
    const sak = lagSak({
      vedtak: [lagVedtak({ fakta: [lagFakta('FDATO', '01-01-2024')] })],
    });
    render(<Sakogvedtakinfo sak={sak} />);
    expect(screen.getByTestId('sak-datoperiode')).toHaveTextContent('01.01.2024');
  });

  it('bruker AAPJUSTFD fremfor FDATO som fradato', () => {
    const sak = lagSak({
      vedtak: [
        lagVedtak({
          fakta: [lagFakta('FDATO', '01-01-2024'), lagFakta('AAPJUSTFD', '15-03-2024')],
        }),
      ],
    });
    render(<Sakogvedtakinfo sak={sak} />);
    const datoperiode = screen.getByTestId('sak-datoperiode');
    expect(datoperiode).toHaveTextContent('15.03.2024');
    expect(datoperiode).not.toHaveTextContent('01.01.2024');
  });

  it('viser sluttdato når TDATO er satt', () => {
    const sak = lagSak({
      vedtak: [
        lagVedtak({
          fakta: [lagFakta('FDATO', '01-01-2024'), lagFakta('TDATO', '31-12-2024')],
        }),
      ],
    });
    render(<Sakogvedtakinfo sak={sak} />);
    const datoperiode = screen.getByTestId('sak-datoperiode');
    expect(datoperiode).toHaveTextContent('01.01.2024');
    expect(datoperiode).toHaveTextContent('31.12.2024');
  });

  it('viser tidligste fradato og seneste sluttdato ved flere vedtak', () => {
    const sak = lagSak({
      vedtak: [
        lagVedtak({
          lopenrvedtak: 1,
          fakta: [lagFakta('FDATO', '01-06-2023'), lagFakta('TDATO', '30-06-2024')],
        }),
        lagVedtak({
          lopenrvedtak: 2,
          fakta: [lagFakta('FDATO', '01-01-2023'), lagFakta('TDATO', '31-12-2024')],
        }),
      ],
    });
    render(<Sakogvedtakinfo sak={sak} />);
    const datoperiode = screen.getByTestId('sak-datoperiode');
    expect(datoperiode).toHaveTextContent('01.01.2023');
    expect(datoperiode).toHaveTextContent('31.12.2024');
  });
});

describe('Sakogvedtakinfo uker-tag', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('viser ingen tag når sluttdato mangler', () => {
    const sak = lagSak({ vedtak: [lagVedtak({ fakta: [lagFakta('FDATO', '01-01-2024')] })] });
    render(<Sakogvedtakinfo sak={sak} />);
    expect(screen.queryByTestId('sak-over-52-uker')).toBeNull();
    expect(screen.queryByTestId('sak-under-52-uker')).toBeNull();
  });

  it('viser "Under 52 uker" når sluttdato er nøyaktig 52 uker siden', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01'));
    // 01-01-2024 er nøyaktig 52 uker (364 dager) før 2025-01-01
    const sak = lagSak({
      vedtak: [lagVedtak({ fakta: [lagFakta('FDATO', '01-01-2023'), lagFakta('TDATO', '01-01-2024')] })],
    });
    render(<Sakogvedtakinfo sak={sak} />);
    expect(screen.queryByTestId('sak-over-52-uker')).toBeNull();
    expect(screen.getByTestId('sak-under-52-uker')).toBeInTheDocument();
  });

  it('viser "Under 52 uker" når sluttdato er mindre enn 52 uker siden', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01'));
    const sak = lagSak({
      vedtak: [lagVedtak({ fakta: [lagFakta('FDATO', '01-01-2024'), lagFakta('TDATO', '01-06-2024')] })],
    });
    render(<Sakogvedtakinfo sak={sak} />);
    expect(screen.queryByTestId('sak-over-52-uker')).toBeNull();
    expect(screen.getByTestId('sak-under-52-uker')).toBeInTheDocument();
  });

  it('viser "Over 52 uker" når sluttdato er mer enn 52 uker siden', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01'));
    const sak = lagSak({
      vedtak: [lagVedtak({ fakta: [lagFakta('FDATO', '01-01-2023'), lagFakta('TDATO', '27-12-2023')] })],
    });
    render(<Sakogvedtakinfo sak={sak} />);
    expect(screen.getByTestId('sak-over-52-uker')).toBeInTheDocument();
    expect(screen.queryByTestId('sak-under-52-uker')).toBeNull();
  });
});
