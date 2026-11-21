import {
  MAX_DEPTH,
  UbNode,
  createNode,
  duplicateNode,
  findNode,
  insertNode,
  moveNode,
  removeNode,
  updateProps,
} from './builder-tree';

describe('builder tree', () => {
  const make = () => {
    const button = createNode('button');
    const card = createNode('card', {}, [button]);
    const root = createNode('section', {}, [card]);
    return { root, card, button };
  };

  it('inserts a button into a card by id', () => {
    const { root, card } = make();
    const b = createNode('button', { label: 'Go' });
    const next = insertNode(root, b, card.id, 0);
    expect(findNode(next, card.id)!.children[0].id).toBe(b.id);
    expect(findNode(root, card.id)!.children.length).toBe(1);
  });

  it('rejects moving a container into its own descendant', () => {
    const { root, card } = make();
    const inner = createNode('stack');
    const withInner = insertNode(root, inner, card.id, 0);
    expect(moveNode(withInner, card.id, inner.id, 0)).toBe(withInner);
    expect(moveNode(withInner, card.id, card.id, 0)).toBe(withInner);
  });

  it('uses insertion-point semantics when moving down within a parent', () => {
    const [a, b, c] = [createNode('text'), createNode('text'), createNode('text')];
    const root = createNode('stack', {}, [a, b, c]);
    const next = moveNode(root, a.id, root.id, 3);
    expect(next.children.map((n) => n.id)).toEqual([b.id, c.id, a.id]);
  });

  it('removing a container drops its subtree', () => {
    const { root, card, button } = make();
    const next = removeNode(root, card.id);
    expect(findNode(next, card.id)).toBeNull();
    expect(findNode(next, button.id)).toBeNull();
  });

  it('cannot remove the root', () => {
    const { root } = make();
    expect(removeNode(root, root.id)).toBe(root);
  });

  it('duplicate gives fresh ids to every descendant, placed after the original', () => {
    const { root, card } = make();
    const { root: next, newId } = duplicateNode(root, card.id);
    const ids = (n: UbNode): string[] => [n.id, ...n.children.flatMap(ids)];
    const copy = findNode(next, newId)!;
    const original = ids(card);
    expect(ids(copy).some((id) => original.includes(id))).toBe(false);
    expect(next.children.map((n) => n.id)).toEqual([card.id, newId]);
  });

  it('rejects insertion beyond the max depth', () => {
    let root = createNode('section');
    let parent = root;
    for (let i = 1; i < MAX_DEPTH; i++) {
      const child = createNode('stack');
      root = insertNode(root, child, parent.id, 0);
      parent = child;
    }
    const tooDeep = insertNode(root, createNode('stack'), parent.id, 0);
    expect(tooDeep).toBe(root);
  });

  it('updateProps is immutable', () => {
    const { root, button } = make();
    const next = updateProps(root, button.id, { variant: 'outline' });
    expect(findNode(next, button.id)!.props['variant']).toBe('outline');
    expect(findNode(root, button.id)!.props['variant']).toBe('solid');
  });

  it('returns the identical root when a node is moved onto its own position', () => {
    const [a, b] = [createNode('text'), createNode('text')];
    const root = createNode('stack', {}, [a, b]);
    expect(moveNode(root, a.id, root.id, 0)).toBe(root);
    expect(moveNode(root, a.id, root.id, 1)).toBe(root);
    expect(moveNode(root, b.id, root.id, 1)).toBe(root);
    expect(moveNode(root, b.id, root.id, 2)).toBe(root);
  });
});
