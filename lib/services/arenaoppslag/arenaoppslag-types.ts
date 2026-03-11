type NIL = null | undefined;

export type ArenaVedtakfaktaDTO = {
  kode: string;
  navn: string;
  verdi: string | NIL;
  registrertDato: string;
};

export type ArenaVedtakMedFaktaDTO = {
  vedtakId: number;
  statusKode: string;
  statusNavn: string;
  vedtaktypeKode: string;
  vedtaktypeNavn: string;
  fraOgMed: string | NIL;
  tilDato: string | NIL;
  rettighetkode: string;
  utfallkode: string | NIL;
  fakta: ArenaVedtakfaktaDTO[];
};

export type SakPersonDTO = {
  personId: number;
  fodselsnummer: string;
  fornavn: string;
  etternavn: string;
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
};
