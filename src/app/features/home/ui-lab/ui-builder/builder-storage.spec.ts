import { commit, createHistory, undo } from './builder-history';
import { deserialize, serialize } from './builder-storage';
import { PRESETS, starterPage } from './builder-presets';
import { UbNode, createNode, findNode } from './builder-tree';

const ids = (n: UbNode): string[] => [n.id, ...n.children.flatMap(ids)];

describe('builder storage', () => {
  it('round-trips a tree', () => {
    const page = starterPage();
    expect(deserialize(serialize(page))).toEqual(page);
  });

  it('returns null for null, malformed JSON and unknown node types', () => {
    expect(deserialize(null)).toBeNull();
    expect(deserialize('{bad')).toBeNull();
    expect(
      deserialize(JSON.stringify({ id: 'a', type: 'marquee', props: {}, children: [] })),
    ).toBeNull();
  });

  it('returns null for a tree deeper than 6', () => {
    let node: UbNode = createNode('text');
    for (let i = 0; i < 7; i++) node = createNode('stack', {}, [node]);
    expect(deserialize(serialize(node))).toBeNull();
  });

  it('returns null when the root is missing required shape', () => {
    expect(deserialize(JSON.stringify({ id: 'a', type: 'section' }))).toBeNull();
    expect(deserialize('[]')).toBeNull();
  });

  it('drops unknown props and resets select values that are not offered', () => {
    const json = JSON.stringify({
      id: 'x1',
      type: 'button',
      props: { variant: '"><script>', evil: 'y', label: 'Hi' },
      children: [],
    });
    const node = deserialize(json)!;
    expect(node.props['variant']).toBe('solid');
    expect(node.props['evil']).toBeUndefined();
    expect(node.props['label']).toBe('Hi');
  });

  it('rejects ids that are not plain tokens', () => {
    const bad = { id: 'a"]{}', type: 'section', props: {}, children: [] };
    expect(deserialize(JSON.stringify(bad))).toBeNull();
  });

  it('does not hand out ids that collide with a loaded tree', () => {
    const loaded = deserialize(
      JSON.stringify({ id: 'n99999', type: 'section', props: {}, children: [] }),
    )!;
    const fresh = createNode('text');
    expect(ids(loaded)).not.toContain(fresh.id);
  });

  it('undo after replacing with the starter page restores the previous tree', () => {
    const before = createNode('section');
    const h = undo(commit(createHistory(before), starterPage()));
    expect(h.present).toBe(before);
  });

  it('builds every preset as a valid tree', () => {
    for (const p of PRESETS) expect(deserialize(serialize(p.build())), p.id).not.toBeNull();
  });

  it('pricing preset has a button inside a card', () => {
    const pricing = PRESETS.find((p) => p.id === 'pricing')!.build();
    const card =
      pricing.type === 'card' ? pricing : pricing.children.find((c) => c.type === 'card')!;
    expect(card.children.some((c) => c.type === 'button')).toBe(true);
    expect(findNode(pricing, card.id)).toBe(card);
  });
});
