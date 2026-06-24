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
};
