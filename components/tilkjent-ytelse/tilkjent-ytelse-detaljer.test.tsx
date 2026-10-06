// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { TilkjentYtelseDetaljer } from 'components/tilkjent-ytelse/tilkjent-ytelse-detaljer';
import {
  TilkjentYtelseAnmerkningDTO,
  TilkjentYtelseMeldekortDTO,
  TilkjentYtelseRadDTO,
} from 'lib/services/arenaoppslag/arenaoppslag-types';

const lagMeldekort = (anmerkninger: TilkjentYtelseAnmerkningDTO[]): TilkjentYtelseMeldekortDTO => ({
  meldekortId: 1,
  meldedato: '2017-08-07',
  meldeform: 'Elektronisk',
  fortsattRegistrertArbeidssoker: true,
  kommentar: null,
  uker: [],
  anmerkninger,
});

const lagRad = (meldekort: TilkjentYtelseMeldekortDTO | null): TilkjentYtelseRadDTO => ({
  fraOgMedDato: '2017-07-28',
  tilOgMedDato: '2017-08-10',
  uke: '30-31',
  kilde: 'Meldekort',
  dagsatsMedBarnetillegg: 1426,
  dagsats: 1426,
  beregnetBrutto: 8556,
  timerArbeidet: 0,
  reduksjon: null,
  meldekort,
  spesialutbetaling: null,
  gjenstaaendeOrdinaerDager: null,
  gjenstaaendeUnntakDager: null,
});

const lagSpesialutbetalingRad = (begrunnelse: string | null): TilkjentYtelseRadDTO => ({
  ...lagRad(null),
  uke: null,
  kilde: 'SPESIALUTBETALING',
  spesialutbetaling: {
    begrunnelse,
    belop: 1581,
    belopKode: 'AAP',
    datoUtbetaling: '2025-06-04',
    fraOgMedDato: '2025-05-01',
    tilOgMedDato: '2025-05-25',
    vedtakStatusKode: 'IVERK',
    posteringTypeKode: 'INIT',
    statusBilag: null,
    statusAnvistBilag: null,
    kategori: null,
    valgtUtbetalingType: null,
    saksbehandler: '4491',
    beslutter: 'GRENSESN',
  },
});

describe('TilkjentYtelseDetaljer spesialutbetaling', () => {
  it('viser begrunnelsen som tekst', () => {
    render(
      <TilkjentYtelseDetaljer
        rad={lagSpesialutbetalingRad('Maskinell etterbetaling på grunn av endret grunnbeløp')}
        visUnntaksperiode={false}
      />
    );

    expect(screen.getByText('Begrunnelse')).toBeInTheDocument();
    expect(screen.getByText('Maskinell etterbetaling på grunn av endret grunnbeløp')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('viser "Ikke funnet" når begrunnelsen mangler eller er tom', () => {
    const { unmount } = render(
      <TilkjentYtelseDetaljer rad={lagSpesialutbetalingRad(null)} visUnntaksperiode={false} />
    );
    expect(screen.getByText('Ikke funnet')).toBeInTheDocument();
    unmount();

    render(<TilkjentYtelseDetaljer rad={lagSpesialutbetalingRad('')} visUnntaksperiode={false} />);
    expect(screen.getByText('Ikke funnet')).toBeInTheDocument();
  });

  it('viser ikke meldekortfeltene for spesialutbetalinger', () => {
    render(<TilkjentYtelseDetaljer rad={lagSpesialutbetalingRad('Begrunnelse')} visUnntaksperiode={true} />);

    expect(screen.queryByText('Arbeid')).not.toBeInTheDocument();
    expect(screen.queryByText('Samordning')).not.toBeInTheDocument();
    expect(screen.queryByText('Gjenstående ordinær periode')).not.toBeInTheDocument();
    expect(screen.queryByText('Ingen meldekortdetaljer for denne raden.')).not.toBeInTheDocument();
  });
});

describe('TilkjentYtelseDetaljer anmerkninger', () => {
  it('viser anmerkningene som en liste', () => {
    const meldekort = lagMeldekort([
      {
        kode: 'IFD',
        navn: 'Innvilget fra dato',
        beskrivelse: 'Innvilget fra dato er i perioden',
        beskrivelseFlettet: 'Innvilget fra dato er i perioden',
        verdi: null,
        verdi2: null,
      },
      {
        kode: 'MAXAA',
        navn: 'Maks periode AAP',
        beskrivelse: 'Maksimal stønadsperiode AAP er nådd',
        beskrivelseFlettet: 'Maksimal stønadsperiode AAP er nådd',
        verdi: null,
        verdi2: null,
      },
    ]);

    render(<TilkjentYtelseDetaljer rad={lagRad(meldekort)} visUnntaksperiode={false} />);

    expect(screen.getByText('Anmerkninger')).toBeInTheDocument();
    expect(screen.getByText('Innvilget fra dato er i perioden')).toBeInTheDocument();
    expect(screen.getByText('Maksimal stønadsperiode AAP er nådd')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('viser den flettede teksten når anmerkningen har en verdi', () => {
    const meldekort = lagMeldekort([
      {
        kode: 'FXNN',
        navn: 'Fravær av type X',
        beskrivelse: 'Utbetalingen er redusert pga fravær av type X &1 dager',
        beskrivelseFlettet: 'Utbetalingen er redusert pga fravær av type X 2 dager',
        verdi: 2,
        verdi2: null,
      },
    ]);

    render(<TilkjentYtelseDetaljer rad={lagRad(meldekort)} visUnntaksperiode={false} />);

    expect(screen.getByText('Utbetalingen er redusert pga fravær av type X 2 dager')).toBeInTheDocument();
  });

  it('viser ingen anmerkningsseksjon når listen er tom', () => {
    render(<TilkjentYtelseDetaljer rad={lagRad(lagMeldekort([]))} visUnntaksperiode={false} />);

    expect(screen.queryByText('Anmerkninger')).not.toBeInTheDocument();
  });

  it('viser ingen anmerkningsseksjon når meldekort mangler', () => {
    render(<TilkjentYtelseDetaljer rad={lagRad(null)} visUnntaksperiode={false} />);

    expect(screen.queryByText('Anmerkninger')).not.toBeInTheDocument();
  });
});

describe('TilkjentYtelseDetaljer unntaksperiode', () => {
  const unntakLabel = 'Gjenstående unntaksperiode §11-12 andre og tredje ledd';

  it('viser gjenstående unntaksperiode når saken har innvilget unntak', () => {
    render(<TilkjentYtelseDetaljer rad={lagRad(null)} visUnntaksperiode={true} />);

    expect(screen.getByText(unntakLabel)).toBeInTheDocument();
  });

  it('skjuler gjenstående unntaksperiode når saken mangler innvilget unntak', () => {
    render(<TilkjentYtelseDetaljer rad={lagRad(null)} visUnntaksperiode={false} />);

    expect(screen.queryByText(unntakLabel)).not.toBeInTheDocument();
    expect(screen.getByText('Gjenstående ordinær periode')).toBeInTheDocument();
  });
});
