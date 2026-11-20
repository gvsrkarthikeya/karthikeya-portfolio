import {
  Block,
  createBlock,
  escapeHtml,
  insertAt,
  moveBlock,
  removeBlock,
  toHtml,
} from './builder-model';

describe('builder model', () => {
  const make = () => [createBlock('navbar'), createBlock('hero'), createBlock('footer')];
  const types = (blocks: Block[]) => blocks.map((b) => b.type);

  it('creates blocks with unique ids and the default content', () => {
    const [a, b] = [createBlock('hero'), createBlock('hero')];
    expect(a.id).not.toBe(b.id);
    expect(a.title).toBe('Build faster UIs');
  });

  it('inserts at a clamped index', () => {
    const blocks = make();
    expect(types(insertAt(blocks, createBlock('cards'), 1))).toEqual([
      'navbar',
      'cards',
      'hero',
      'footer',
    ]);
    expect(types(insertAt(blocks, createBlock('cards'), 99)).at(-1)).toBe('cards');
    expect(types(insertAt(blocks, createBlock('cards'), -5))[0]).toBe('cards');
  });

  it('moves a block to an insertion point, accounting for its own removal', () => {
    const blocks = make();
    // dropping the navbar at the end (index 3) puts it last
    expect(types(moveBlock(blocks, blocks[0].id, 3))).toEqual(['hero', 'footer', 'navbar']);
    // dropping the footer before the navbar
    expect(types(moveBlock(blocks, blocks[2].id, 0))).toEqual(['footer', 'navbar', 'hero']);
    // dropping a block next to itself changes nothing
    expect(moveBlock(blocks, blocks[1].id, 1)).toBe(blocks);
    expect(moveBlock(blocks, blocks[1].id, 2)).toBe(blocks);
  });

  it('removes a block', () => {
    const blocks = make();
    expect(types(removeBlock(blocks, blocks[1].id))).toEqual(['navbar', 'footer']);
  });

  it('escapes user text in the exported HTML', () => {
    expect(escapeHtml('<b>"x" & y</b>')).toBe('&lt;b&gt;&quot;x&quot; &amp; y&lt;/b&gt;');
    const hero = { ...createBlock('hero'), title: '<script>alert(1)</script>' };
    const html = toHtml([hero]);
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('exports one chunk of markup per block, in order', () => {
    const html = toHtml(make());
    expect(html.indexOf('ub-navbar')).toBeLessThan(html.indexOf('ub-hero'));
    expect(html.indexOf('ub-hero')).toBeLessThan(html.indexOf('ub-footer'));
  });
});
