import { NIL } from 'lib/utils/types';

export type ArenaVedtakfaktaDTO = {
  kode: string;
  navn: string;
  verdi: string | NIL;
  registrertDato: string;
};

export type VilkårsvurderingDTO = {
  vilkårsvurderingId: number;
  vilkårkode: string;
  begrunnelse: string | NIL;
  vurdertAv: string | NIL;
  vilkårnavn: string;
  erObligatorisk: boolean;
  hjelpetekstUrl: string | NIL;
  lovtekstUrl: string | NIL;
  rundskrivUrl: string | NIL;
  statuskode: 'J' | 'N' | 'V';
  statusnavn: string;
};

export type AndreYtelseDTO = {
  type: string;
  belopPeriode: string | NIL;
  grad: string | NIL;
  belop: string | NIL;
};

export type InstitusjonOppholdDTO = {
  type: string;
  fra: string | NIL;
  til: string | NIL;
  friKostOgLosji: boolean;
  reduksjonsType: string | NIL;
};

export type ArenaVedtakMedFaktaDTO = {
  vedtakId: number;
  lopenrvedtak: number;
  statusKode: string;
  statusNavn: string;
  vedtaktypeKode: string;
  vedtaktypeNavn: string;
  aktivitetsfaseKode: string;
  aktivitetsfaseNavn: string;
  fraOgMed: string | NIL;
  tilDato: string | NIL;
  rettighetkode: string;
  rettighetnavn: string;
  begrunnelse: string | NIL;
  saksbehandler: string | NIL;
  beslutter: string | NIL;
  utfallkode: string | NIL;
  relatertVedtak: number | NIL;
  fakta: ArenaVedtakfaktaDTO[];
  vilkårsvurderinger: VilkårsvurderingDTO[];
  andreYtelser: AndreYtelseDTO[];
  institusjonOpphold: InstitusjonOppholdDTO | NIL;
};

export type SakPersonDTO = {
  personId: number;
  fodselsnummer: string;
  fornavn: string;
  etternavn: string;
};

export type TelleverkDTO = {
  ordineerAAPKvote: number;
  utvidetAAPKvote: number;
};

export type KvoteHistorikkDTO = {
  id: number;
  kvoteTypeKode: string;
  endringsGrunnlag: string;
  antallBevegelse: number;
  posteringTypeKode: string;
  datoHendelse: string;
  resterende: number;
  modUser: string;
  begrunnelse: string | NIL;
};

export type OppgaveDTO = {
  beskrivelse: string;
  sakskontekst: string | NIL;
  visningsnavn: string;
  fristDato: string | NIL;
  arbeidsbenk: string | NIL;
  oppgaveEnhet: string | NIL;
  navEnhet: string | NIL;
  notat: string | NIL;
};

export type TilkjentYtelseDagDTO = {
  dato: string | NIL;
  timerArbeidet: number | NIL;
  annetFravaer: boolean;
};

export type TilkjentYtelseUkeDTO = {
  ukenr: number;
  dager: TilkjentYtelseDagDTO[];
};

export type TilkjentYtelseAnmerkningDTO = {
  kode: string;
  navn: string | NIL;
  beskrivelse: string | NIL;
  // Beskrivelsen med &1/&2 erstattet av verdi/verdi2, og er teksten som skal vises.
  beskrivelseFlettet: string | NIL;
  verdi: number | NIL;
  verdi2: number | NIL;
};

export type TilkjentYtelseMeldekortDTO = {
  meldekortId: number;
  meldedato: string | NIL;
  meldeform: string | NIL;
  fortsattRegistrertArbeidssoker: boolean;
  kommentar: string | NIL;
  uker: TilkjentYtelseUkeDTO[];
  anmerkninger: TilkjentYtelseAnmerkningDTO[] | NIL;
};

export type TilkjentYtelseReduksjonDTO = {
  levertForSentDager: number | NIL;
  timerArbeidetProsent: number | NIL;
  samordningsProsent: number | NIL;
  totalReduksjonProsent: number | NIL;
  fravar: number | NIL;
  sykedager: number | NIL;
  institusjonsProsent: number | NIL;
  anvistProsent: number | NIL;
};

export type TilkjentYtelseRadDTO = {
  fraOgMedDato: string | NIL;
  tilOgMedDato: string | NIL;
  uke: string | NIL;
  kilde: string;
  dagsatsMedBarnetillegg: number | NIL;
  dagsats: number | NIL;
  beregnetBrutto: number | NIL;
  timerArbeidet: number | NIL;
  reduksjon: TilkjentYtelseReduksjonDTO | NIL;
  meldekort: TilkjentYtelseMeldekortDTO | NIL;
  // Gjenstående saldo etter denne perioden. Mangler på eldre rader fra før Arena begynte å telle.
  gjenstaaendeOrdinaerDager: number | NIL;
  gjenstaaendeUnntakDager: number | NIL;
};

export type TilkjentYtelseDTO = {
  sakId: number;
  rader: TilkjentYtelseRadDTO[];
};

export type SakDTO = {
  sakId: string;
  opprettetAar: number;
  lopenr: number;
  person: SakPersonDTO;
  statuskode: string;
  statusnavn: string;
  registrertDato: string;
  avsluttetDato: string | NIL;
  vedtak: ArenaVedtakMedFaktaDTO[];
  telleverkForPerson: TelleverkDTO | NIL;
  kvoteHistorikk: KvoteHistorikkDTO[];
  maksdato: string | NIL;
  sisteUtbetalingDato: string | NIL;
  tilkjentYtelse: TilkjentYtelseDTO | NIL;
  oppgaver: OppgaveDTO[];
};
