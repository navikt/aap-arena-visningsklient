import { describe, expect, it } from 'vitest';

import { dateComperator, norsktDatoformat, parseFaktaDato } from 'lib/utils/date';

const DEC_10_2024 = new Date('2024-12-10T00:00:00.000Z');
const JAN_01_2025 = new Date('2025-01-01T00:00:00.000Z');
const JAN_02_2025 = new Date('2025-01-02T00:00:00.000Z');

describe('dateComperator', () => {
  it('skal sortere datoer stigende og plassere manglende verdier til slutt', () => {
    const datoer: Array<Date | null> = [JAN_02_2025, null, DEC_10_2024, null, JAN_01_2025];

    const sorterteDatoer = [...datoer].sort((date1, date2) => dateComperator(date1, date2));

    expect(sorterteDatoer).toEqual([DEC_10_2024, JAN_01_2025, JAN_02_2025, null, null]);
  });

  it('skal sortere datoer synkende og plassere manglende verdier til slutt', () => {
    const datoer: Array<Date | null> = [JAN_02_2025, null, DEC_10_2024, null, JAN_01_2025];

    const sorterteDatoer = [...datoer].sort((date1, date2) => dateComperator(date1, date2, 'DESC'));

    expect(sorterteDatoer).toEqual([JAN_02_2025, JAN_01_2025, DEC_10_2024, null, null]);
  });

  it('skal beholde like datoer samlet og fortsatt ha manglende verdier til slutt', () => {
    const datoer: Array<Date | null> = [null, JAN_01_2025, JAN_01_2025, null, DEC_10_2024];

    const sorterteDatoer = [...datoer].sort((date1, date2) => dateComperator(date1, date2));

    expect(sorterteDatoer).toEqual([DEC_10_2024, JAN_01_2025, JAN_01_2025, null, null]);
  });
});

describe('norsktDatoformat', () => {
  it('skal formatere dato som dd.MM.yyyy', () => {
    expect(norsktDatoformat(DEC_10_2024)).toBe('10.12.2024');
  });
});

describe('parseFaktaDato', () => {
  it('skal parse dato på formatet dd-MM-yyyy', () => {
    const result = parseFaktaDato('10-12-2024');
    expect(result).not.toBeNull();
    expect(norsktDatoformat(result!)).toBe('10.12.2024');
  });

  it('skal returnere null for null', () => {
    expect(parseFaktaDato(null)).toBeNull();
  });

  it('skal returnere null for undefined', () => {
    expect(parseFaktaDato(undefined)).toBeNull();
  });
});
