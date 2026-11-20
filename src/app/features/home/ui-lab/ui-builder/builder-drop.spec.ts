import { resolveDrop } from './builder-drop';

const rect = { top: 100, bottom: 200, left: 0, right: 300 };
const at = (y: number) => ({ x: 150, y });

describe('resolveDrop', () => {
  it('drops inside the middle of a container', () => {
    expect(resolveDrop(rect, at(150), true, true)).toBe('inside');
  });

  it('uses the top and bottom quarters of a container as before/after', () => {
    expect(resolveDrop(rect, at(110), true, true)).toBe('before');
    expect(resolveDrop(rect, at(190), true, true)).toBe('after');
  });

  it('never drops inside a leaf; splits it in halves', () => {
    expect(resolveDrop(rect, at(140), false, false)).toBe('before');
    expect(resolveDrop(rect, at(160), false, false)).toBe('after');
    expect(resolveDrop(rect, at(150), false, false)).not.toBe('inside');
  });

  it('gives an empty container a wider inside zone', () => {
    expect(resolveDrop(rect, at(115), true, false)).toBe('inside');
    expect(resolveDrop(rect, at(115), true, true)).toBe('before');
  });

  it('handles a zero-height rect without throwing', () => {
    expect(resolveDrop({ top: 5, bottom: 5, left: 0, right: 0 }, at(5), false, false)).toBe(
      'before',
    );
  });
});
