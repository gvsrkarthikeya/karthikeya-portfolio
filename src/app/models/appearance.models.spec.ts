import { COLOR_THEMES, DESIGN_STYLES, isColorTheme, isDesignStyle } from './appearance.models';

describe('appearance models', () => {
  describe('isDesignStyle', () => {
    it('accepts every documented design style', () => {
      const documented = [
        'minimalism',
        'flat',
        'material',
        'glassmorphism',
        'neumorphism',
        'neubrutalism',
        'skeuomorphism',
        'bento',
      ];

      expect([...DESIGN_STYLES]).toEqual(documented);
      for (const style of documented) {
        expect(isDesignStyle(style)).toBe(true);
      }
    });

    it('rejects unknown, wrongly cased and non-string values', () => {
      for (const value of ['retro', 'Minimalism', '', null, undefined, 3, {}]) {
        expect(isDesignStyle(value)).toBe(false);
      }
    });
  });

  describe('isColorTheme', () => {
    it('accepts light and dark', () => {
      expect([...COLOR_THEMES]).toEqual(['light', 'dark']);
      expect(isColorTheme('light')).toBe(true);
      expect(isColorTheme('dark')).toBe(true);
    });

    it('rejects unknown, wrongly cased and non-string values', () => {
      for (const value of ['auto', 'Dark', '', null, undefined, 1, []]) {
        expect(isColorTheme(value)).toBe(false);
      }
    });
  });
});
