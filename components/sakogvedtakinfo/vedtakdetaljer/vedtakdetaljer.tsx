'use client';

import { useMemo, useState } from 'react';
import { BodyShort, HStack, Label, Switch, VStack } from '@navikt/ds-react';
import { ArenaVedtakMedFaktaDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import { FieldValue } from 'components/felleskomponenter/field-value/field-value';
import { formaterFaktaDato } from 'lib/utils/date';
import { Vilkar } from 'components/sakogvedtakinfo/vedtakdetaljer/vilkar';
import { SatsSeksjon } from 'components/sakogvedtakinfo/vedtakdetaljer/sats-seksjon';
import { BeregningSeksjon } from 'components/sakogvedtakinfo/vedtakdetaljer/beregning-seksjon';

type Props = {
  vedtak: ArenaVedtakMedFaktaDTO;
  relatertVedtak: ArenaVedtakMedFaktaDTO | null;
};

export function Vedtakdetaljer({ vedtak, relatertVedtak }: Props): React.ReactElement {
  const faktaMap = useMemo(() => new Map(vedtak.fakta.map((f) => [f.kode, f])), [vedtak.vedtakId]);

  const relatertFaktaMap = useMemo(
    () => (relatertVedtak != null ? new Map(relatertVedtak.fakta.map((f) => [f.kode, f])) : null),
    [relatertVedtak]
  );

  const [visEndringer, setVisEndringer] = useState(true);

  function erEndret(verdi: string | null | undefined, relatertVerdi: string | null | undefined): boolean {
    if (relatertVedtak == null || !visEndringer) return false;
    return verdi !== relatertVerdi;
  }

  function erFaktaEndret(kode: string): boolean {
    if (relatertFaktaMap == null || !visEndringer) return false;
    return faktaMap.get(kode)?.verdi !== relatertFaktaMap.get(kode)?.verdi;
  }

  function getNavn(navn: string | null | undefined): string {
    if (navn == null) {
      return '—';
    }
    if (navn === 'GRENSESN') {
      return 'Automatisk';
    }
    return navn;
  }

  const vedtaksdatoFormatert = formaterFaktaDato(faktaMap.get('INNVF')?.verdi);

  return (
    <VStack gap="space-32">
      <HStack gap="space-16">
        <Label size="medium">Vedtak {vedtak.rettighetnavn}</Label>
        {vedtaksdatoFormatert != null && <BodyShort size="medium">{vedtaksdatoFormatert}</BodyShort>}
      </HStack>
      {relatertVedtak != null && (
        <HStack gap="space-32">
          <FieldValue label="Endring av vedtak nr." value={relatertVedtak.lopenrvedtak.toString()} />
          <Switch onClick={() => setVisEndringer(!visEndringer)} checked={visEndringer}>
            Marker endringer
          </Switch>
        </HStack>
      )}
      <HStack gap="space-32" wrap>
        {vedtak.rettighetkode === 'AAP' && (
          <>
            <FieldValue
              label="Gjelder fra"
              value={formaterFaktaDato(faktaMap.get('FDATO')?.verdi) ?? '—'}
              isChanged={erFaktaEndret('FDATO')}
            />
            <FieldValue
              label="Justert fra-dato"
              value={formaterFaktaDato(faktaMap.get('AAPJUSTFD')?.verdi) ?? '—'}
              isChanged={erFaktaEndret('AAPJUSTFD')}
            />
            <FieldValue
              label="Opprinnelig til-dato"
              value={formaterFaktaDato(faktaMap.get('OPPRTDATO')?.verdi) ?? '—'}
              isChanged={erFaktaEndret('OPPRTDATO')}
            />
            <FieldValue
              label="Til-dato"
              value={formaterFaktaDato(faktaMap.get('TDATO')?.verdi) ?? '—'}
              isChanged={erFaktaEndret('TDATO')}
            />
          </>
        )}
        <FieldValue
          label="Saksbehandler"
          value={getNavn(vedtak.saksbehandler)}
          isChanged={erEndret(vedtak.saksbehandler, relatertVedtak?.saksbehandler)}
        />
        <FieldValue
          label="Beslutter"
          value={getNavn(vedtak.beslutter)}
          isChanged={erEndret(vedtak.beslutter, relatertVedtak?.beslutter)}
        />
      </HStack>
      {vedtak.rettighetkode === 'AAP' && (
        <>
          <SatsSeksjon faktaMap={faktaMap} relatertFaktaMap={visEndringer ? relatertFaktaMap : null} />
          <BeregningSeksjon faktaMap={faktaMap} relatertFaktaMap={visEndringer ? relatertFaktaMap : null} />
        </>
      )}
      <Vilkar vedtak={vedtak} />
    </VStack>
  );
}
