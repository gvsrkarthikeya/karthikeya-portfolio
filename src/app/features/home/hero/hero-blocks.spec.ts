import { blockLift, normalisePointer } from './hero-blocks';

describe('hero block lift model', () => {
  describe('blockLift', () => {
    it('returns zero when there is no pointer', () => {
      expect(blockLift(3, 2, null)).toBe(0);
    });

    it('returns one for the block whose centre matches the pointer', () => {
      expect(blockLift(3, 2, { x: 0.5, y: 0.5 })).toBe(1);
    });

    it('returns less lift for a block three columns away', () => {
      expect(blockLift(0, 2, { x: 0.5, y: 0.5 })).toBeLessThan(blockLift(3, 2, { x: 0.5, y: 0.5 }));
    });

    it('stays within the unit range at the pointer corners', () => {
      for (const pointer of [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
      ]) {
        for (let row = 0; row < 5; row += 1) {
          for (let col = 0; col < 7; col += 1) {
            const lift = blockLift(col, row, pointer);
            expect(lift).toBeGreaterThanOrEqual(0);
            expect(lift).toBeLessThanOrEqual(1);
          }
        }
      }
    });
  });

  describe('normalisePointer', () => {
    it('returns null for a zero-size rectangle', () => {
      expect(normalisePointer(10, 10, { left: 0, top: 0, width: 0, height: 20 })).toBeNull();
      expect(normalisePointer(10, 10, { left: 0, top: 0, width: 20, height: 0 })).toBeNull();
    });

    it('clamps coordinates outside the rectangle', () => {
      const rect = { left: 10, top: 20, width: 100, height: 50 };

      expect(normalisePointer(-100, 200, rect)).toEqual({ x: 0, y: 1 });
      expect(normalisePointer(200, -100, rect)).toEqual({ x: 1, y: 0 });
    });

    it('maps the rectangle centre to the unit centre', () => {
      expect(normalisePointer(350, 250, { left: 0, top: 0, width: 700, height: 500 })).toEqual({
        x: 0.5,
        y: 0.5,
      });
    });
  });
});
