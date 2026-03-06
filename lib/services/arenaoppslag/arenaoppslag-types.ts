type NIL = null | undefined;

export type ArenaVedtakfaktaDTO = {
  vedtakId: number;
  kode: string;
  verdi: string | NIL;
  registrertDato: string;
};

export type ArenaVedtakMedFaktaDTO = {
  statusKode: string;
  vedtaktypeKode: string | NIL;
  fraOgMed: string | NIL;
  tilDato: string | NIL;
  rettighetkode: string;
  utfallkode: string | NIL;
  fakta: ArenaVedtakfaktaDTO[];
};

export type SakDTO = {
  sakId: string;
  aar: number;
  lopenr: number;
  fodselsnummer: string;
  statuskode: string;
  registrertDato: string;
  avsluttetDato: string | NIL;
  vedtak: ArenaVedtakMedFaktaDTO[];
};
