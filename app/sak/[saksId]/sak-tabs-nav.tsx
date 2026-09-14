'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tabs } from '@navikt/ds-react';

type Props = {
  saksId: string;
  sakLabel: string;
  // null mens oppgavene fortsatt hentes, slik at fanene kan vises og klikkes med en gang.
  antallOppgaver: number | null;
};

const TAB_SEGMENTER = ['tilkjent-ytelse', 'kvote', 'notater', 'oppgaver'] as const;

export function SakTabsNav({ saksId, sakLabel, antallOppgaver }: Props): React.ReactElement {
  const pathname = usePathname();
  const sisteSegment = pathname.split('/').pop();
  // Faller tilbake til "sak" siden /sak/[saksId] (uten videre segmenter) er "sak"-fanen.
  const aktivFane = TAB_SEGMENTER.find((segment) => segment === sisteSegment) ?? 'sak';

  return (
    <Tabs value={aktivFane}>
      <Tabs.List>
        <Tabs.Tab as={Link} href={`/sak/${saksId}`} value="sak" label={sakLabel} />
        <Tabs.Tab as={Link} href={`/sak/${saksId}/tilkjent-ytelse`} value="tilkjent-ytelse" label="Tilkjent ytelse" />
        <Tabs.Tab as={Link} href={`/sak/${saksId}/kvote`} value="kvote" label="Kvote" />
        <Tabs.Tab as={Link} href={`/sak/${saksId}/notater`} value="notater" label="Notater" />
        <Tabs.Tab
          as={Link}
          href={`/sak/${saksId}/oppgaver`}
          value="oppgaver"
          label={antallOppgaver != null ? `Oppgaver (${antallOppgaver})` : 'Oppgaver'}
        />
      </Tabs.List>
    </Tabs>
  );
}
