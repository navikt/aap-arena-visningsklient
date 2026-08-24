// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Nokkeltall } from 'components/sakogvedtakinfo/nokkeltall';
import { SakDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';

const lagSak = (overrides: Partial<SakDTO> = {}): SakDTO =>
  ({
    sakId: '123',
    opprettetAar: 2024,
    lopenr: 1,
    statuskode: 'AKTIV',
    statusnavn: 'Aktiv',
    registrertDato: '2024-01-01',
    avsluttetDato: null,
    vedtak: [],
    telleverkForPerson: null,
    kvoteHistorikk: [],
    maksdato: null,
    sisteUtbetalingDato: null,
    person: {
      personId: 1,
      fodselsnummer: '01010101010',
      fornavn: 'Test',
      etternavn: 'Testesen',
    },
    ...overrides,
  }) as SakDTO;

describe('Nokkeltall', () => {
  it('skal ikke krasje og returnere null når sak ikke har noen vedtak', () => {
    const { container } = render(<Nokkeltall sak={lagSak({ vedtak: [] })} />);
    expect(container.firstChild).toBeNull();
  });

  it('skal vise beregningsgrunnlag når sak har vedtak', () => {
    const sak = lagSak({
      vedtak: [
        {
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
          saksbehandler: 'SAK1234',
          beslutter: 'BES5678',
          utfallkode: 'JA',
          begrunnelse: null,
          relatertVedtak: null,
          fakta: [
            { kode: 'AAPBERDATO', navn: 'Beregningsdato', verdi: '01-01-2024', registrertDato: '2024-01-01' },
            { kode: 'GRUNN', navn: 'Grunnlag', verdi: '500000', registrertDato: '2024-01-01' },
            { kode: 'DAGS', navn: 'Dagsats', verdi: '1000', registrertDato: '2024-01-01' },
            { kode: 'BARNTILL', navn: 'Barnetillegg', verdi: '200', registrertDato: '2024-01-01' },
            { kode: 'BARNMSTON', navn: 'Antall barn', verdi: '2', registrertDato: '2024-01-01' },
          ],
          vilkårsvurderinger: [],
          andreYtelser: [],
          institusjonOpphold: null,
        },
      ],
    });

    render(<Nokkeltall sak={sak} />);
    expect(screen.getByText('Siste status beregningsgrunnlag')).toBeInTheDocument();
  });
});
