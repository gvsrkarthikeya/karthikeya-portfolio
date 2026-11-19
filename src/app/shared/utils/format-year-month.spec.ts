import { formatYearMonth } from './format-year-month';

describe('formatYearMonth', () => {
  it('formats an ISO year-month as a short month and year', () => {
    expect(formatYearMonth('2026-05')).toBe('May 2026');
    expect(formatYearMonth('2020-12')).toBe('Dec 2020');
  });

  it('returns the input unchanged when it is not a valid year-month', () => {
    expect(formatYearMonth('soon')).toBe('soon');
    expect(formatYearMonth('2026-13')).toBe('2026-13');
  });
});
