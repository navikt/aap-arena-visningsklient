'use client';

import { BodyLong, InfoCard, List } from '@navikt/ds-react';
import { ArenaVedtakMedFaktaDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';

type Props = {
  vedtak: ArenaVedtakMedFaktaDTO;
  key: React.Key;
};

export function SaksVedtak({ vedtak, key }: Props): React.ReactElement {
  return (
    <InfoCard key={key} data-color="info">
      <InfoCard.Header>
        <InfoCard.Title>Vedtak {vedtak.fraOgMed}</InfoCard.Title>
      </InfoCard.Header>
      <InfoCard.Content>
        <BodyLong>Fra og med: {vedtak.fraOgMed}</BodyLong>
        <BodyLong>Til: {vedtak.tilDato ?? 'Ukjent'}</BodyLong>
        <BodyLong>Statuskode: {vedtak.statusKode ?? '—'}</BodyLong>
        <BodyLong>Utfallskode: {vedtak.utfallkode ?? '—'}</BodyLong>
        <BodyLong>Rettighetkode: {vedtak.rettighetkode ?? '—'}</BodyLong>
        <BodyLong>Vedtaktypekode: {vedtak.vedtaktypeKode ?? '—'}</BodyLong>
        <BodyLong>Antall fakta: {vedtak.fakta.length}</BodyLong>

        {vedtak.fakta.length > 0 && (
          <List>
            {vedtak.fakta.map((fakta) => (
              <List.Item key={fakta.kode}>
                <BodyLong>Kode: {fakta.kode}</BodyLong>
                <BodyLong>Registrert dato: {fakta.registrertDato}</BodyLong>
                <BodyLong>Verdi: {fakta.verdi}</BodyLong>
              </List.Item>
            ))}
          </List>
        )}
      </InfoCard.Content>
    </InfoCard>
  );
}
