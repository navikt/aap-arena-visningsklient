// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Oppgaver } from 'components/oppgaver/oppgaver';
import { formaterFrist, INGEN_VERDI, sorterPaaFristSynkende } from 'components/oppgaver/oppgave-utils';
import { OppgaveDTO, SakDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';

const lagOppgave = (overrides: Partial<OppgaveDTO> = {}): OppgaveDTO => ({
  beskrivelse: 'Vurder dokument',
  sakskontekst: 'AA:30519244698',
  visningsnavn: 'Oppfølging',
  fristDato: '2026-05-20',
  arbeidsbenk: 'AEA4411',
  oppgaveEnhet: '4411',
  navEnhet: '0220',
  notat: null,
  ...overrides,
});

const lagSak = (oppgaver: OppgaveDTO[]): SakDTO =>
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
    oppgaver,
    person: {
      personId: 1,
      fodselsnummer: '01010101010',
      fornavn: 'Test',
      etternavn: 'Testesen',
    },
  }) as SakDTO;

describe('formaterFrist', () => {
  it('formaterer dato på norsk format', () => {
    expect(formaterFrist('2026-05-20')).toBe('20.05.2026');
  });

  it('viser ingen verdi når frist mangler', () => {
    expect(formaterFrist(null)).toBe(INGEN_VERDI);
    expect(formaterFrist(undefined)).toBe(INGEN_VERDI);
  });
});

describe('sorterPaaFristSynkende', () => {
  it('sorterer nyeste frist først og legger oppgaver uten frist sist', () => {
    const sortert = sorterPaaFristSynkende([
      lagOppgave({ beskrivelse: 'Eldst', fristDato: '2026-01-01' }),
      lagOppgave({ beskrivelse: 'Uten frist', fristDato: null }),
      lagOppgave({ beskrivelse: 'Nyest', fristDato: '2026-06-05' }),
    ]);

    expect(sortert.map((oppgave) => oppgave.beskrivelse)).toEqual(['Nyest', 'Eldst', 'Uten frist']);
  });

  it('endrer ikke original liste', () => {
    const oppgaver = [lagOppgave({ fristDato: '2026-01-01' }), lagOppgave({ fristDato: '2026-06-05' })];
    sorterPaaFristSynkende(oppgaver);
    expect(oppgaver[0].fristDato).toBe('2026-01-01');
  });
});

describe('Oppgaver', () => {
  it('viser tomtilstand når saken ikke har oppgaver', () => {
    render(<Oppgaver sak={lagSak([])} />);
    expect(screen.getByTestId('ingen-oppgaver')).toBeInTheDocument();
    expect(screen.queryByRole('table')).toBeNull();
  });

  it('viser frist, beskrivelse, arbeidsbenk og tema i tabellen', () => {
    render(<Oppgaver sak={lagSak([lagOppgave()])} />);

    expect(screen.getByText('20.05.2026')).toBeInTheDocument();
    expect(screen.getByText('Vurder dokument')).toBeInTheDocument();
    expect(screen.getByText('AEA4411')).toBeInTheDocument();
    expect(screen.getByText('Oppfølging')).toBeInTheDocument();
  });

  it('viser kommentarknapp kun når oppgaven har notat', () => {
    render(<Oppgaver sak={lagSak([lagOppgave({ notat: 'Må følges opp' })])} />);
    expect(screen.getByRole('button', { name: 'Kommentar' })).toBeInTheDocument();
  });

  it('viser ingen kommentarknapp når notat mangler', () => {
    render(<Oppgaver sak={lagSak([lagOppgave({ notat: null })])} />);
    expect(screen.queryByRole('button', { name: 'Kommentar' })).toBeNull();
  });
});
