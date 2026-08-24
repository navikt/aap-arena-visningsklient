// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InstitusjonSeksjon } from 'components/sakogvedtakinfo/vedtakdetaljer/institusjon-seksjon';
import { InstitusjonOppholdDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';

const lagOpphold = (overstyr: Partial<InstitusjonOppholdDTO> = {}): InstitusjonOppholdDTO => ({
  type: 'HELSEINSTITUSJON',
  fra: '2024-01-01',
  til: '2024-06-30',
  friKostOgLosji: true,
  reduksjonsType: 'HALV',
  ...overstyr,
});

const erMarkert = (tekst: string): boolean => {
  const verdi = screen.getByText(tekst);
  return /endret/.test(verdi.parentElement?.className ?? '');
};

describe('InstitusjonSeksjon endringsmarkering', () => {
  it('markerer ingenting når det ikke finnes et relatert opphold', () => {
    render(<InstitusjonSeksjon institusjonOpphold={lagOpphold()} relatertInstitusjonOpphold={undefined} />);

    expect(erMarkert('Helseinstitusjon')).toBe(false);
    expect(erMarkert('Ja')).toBe(false);
    expect(erMarkert('50 %')).toBe(false);
  });

  it('markerer alle felt når relatert vedtak ikke hadde institusjon', () => {
    render(<InstitusjonSeksjon institusjonOpphold={lagOpphold()} relatertInstitusjonOpphold={null} />);

    expect(erMarkert('Helseinstitusjon')).toBe(true);
    expect(erMarkert('Ja')).toBe(true);
    expect(erMarkert('50 %')).toBe(true);
  });

  it('markerer ingenting når opphold er uendret', () => {
    render(<InstitusjonSeksjon institusjonOpphold={lagOpphold()} relatertInstitusjonOpphold={lagOpphold()} />);

    expect(erMarkert('Helseinstitusjon')).toBe(false);
    expect(erMarkert('Ja')).toBe(false);
    expect(erMarkert('50 %')).toBe(false);
  });

  it('markerer kun feltet som er endret', () => {
    render(
      <InstitusjonSeksjon
        institusjonOpphold={lagOpphold({ reduksjonsType: 'HALV' })}
        relatertInstitusjonOpphold={lagOpphold({ reduksjonsType: null })}
      />
    );

    expect(erMarkert('50 %')).toBe(true);
    expect(erMarkert('Helseinstitusjon')).toBe(false);
    expect(erMarkert('Ja')).toBe(false);
  });
});

describe('InstitusjonSeksjon fengsel', () => {
  it('skjuler fri kost og losji og reduksjon for fengsel', () => {
    render(
      <InstitusjonSeksjon institusjonOpphold={lagOpphold({ type: 'FENGSEL' })} relatertInstitusjonOpphold={undefined} />
    );

    expect(screen.getByText('Fengsel')).toBeTruthy();
    expect(screen.queryByText('Fri kost og losji')).toBeNull();
    expect(screen.queryByText('Reduksjon')).toBeNull();
  });
});
