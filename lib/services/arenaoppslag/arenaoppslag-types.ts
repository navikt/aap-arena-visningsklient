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

export type TilkjentYtelseDagDTO = {
  dato: string | NIL;
  timerArbeidet: number | NIL;
  annetFravaer: boolean;
};

export type TilkjentYtelseUkeDTO = {
  ukenr: number;
  dager: TilkjentYtelseDagDTO[];
};

export type TilkjentYtelseMeldekortDTO = {
  meldekortId: number;
  meldedato: string | NIL;
  meldeform: string | NIL;
  fortsattRegistrertArbeidssoker: boolean;
  kommentar: string | NIL;
  uker: TilkjentYtelseUkeDTO[];
};

export type TilkjentYtelseReduksjonDTO = {
  sykedager: number;
  levertForSent: boolean;
  fravaer: number;
};

export type TilkjentYtelseRadDTO = {
  fraOgMedDato: string | NIL;
  tilOgMedDato: string | NIL;
  uke: string | NIL;
  kilde: string;
  dagsatsMedBarnetillegg: number | NIL;
  beregnetBrutto: number | NIL;
  timerArbeidet: number | NIL;
  reduksjon: TilkjentYtelseReduksjonDTO | NIL;
  meldekort: TilkjentYtelseMeldekortDTO | NIL;
};

export type TilkjentYtelseDTO = {
  sakId: number;
  gjenstaaendeOrdinaerDager: number;
  gjenstaaendeUnntakDager: number;
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
};
