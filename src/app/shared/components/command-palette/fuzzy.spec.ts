import { fuzzyScore } from './fuzzy';

describe('fuzzyScore', () => {
  it('matches everything for an empty query', () => {
    expect(fuzzyScore('', 'Go to Skills')).toBeGreaterThan(0);
  });

  it('matches in-order subsequences case-insensitively', () => {
    expect(fuzzyScore('gts', 'Go to Skills')).toBeGreaterThan(0);
  });

  it('rejects out-of-order or missing characters', () => {
    expect(fuzzyScore('zz', 'Go to Skills')).toBe(0);
    expect(fuzzyScore('sg', 'Go')).toBe(0);
  });

  it('ranks contiguous matches higher', () => {
    expect(fuzzyScore('ski', 'skills')).toBeGreaterThan(fuzzyScore('ski', 'sxxkxxi'));
  });
});
