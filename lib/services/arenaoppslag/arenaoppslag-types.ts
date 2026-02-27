export type VedtakDTO = SakDTO[];

export type SakDTO = {
  sakId: string;
  statusKode: string;
  vedtaktypeKode: string | null;
  fraOgMed: string | null;
  tilDato: string | null;
  rettighetkode: string;
  utfallkode: string | null;
  fodselsnr: string;
};
