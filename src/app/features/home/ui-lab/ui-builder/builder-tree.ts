export type NodeType =
  | 'section'
  | 'stack'
  | 'grid'
  | 'card'
  | 'heading'
  | 'text'
  | 'button'
  | 'image'
  | 'input'
  | 'link'
  | 'badge'
  | 'divider';

export type PropValue = string | number | boolean;

export interface UbNode {
  id: string;
  type: NodeType;
  props: Record<string, PropValue>;
  children: UbNode[];
}

export interface PropSchema {
  key: string;
  label: string;
  kind: 'text' | 'textarea' | 'select' | 'toggle' | 'number';
  options?: string[];
  min?: number;
  max?: number;
  default: PropValue;
}

export interface NodeDef {
  label: string;
  icon: string;
  props: PropSchema[];
}

export const CONTAINERS: NodeType[] = ['section', 'stack', 'grid', 'card'];
export const MAX_DEPTH = 6;

const select = (key: string, label: string, options: string[]): PropSchema => ({
  key,
  label,
  kind: 'select',
  options,
  default: options[0],
});
const text = (key: string, label: string, def = ''): PropSchema => ({
  key,
  label,
  kind: 'text',
  default: def,
});
const toggle = (key: string, label: string): PropSchema => ({
  key,
  label,
  kind: 'toggle',
  default: false,
});
const num = (key: string, label: string, min: number, max: number, def: number): PropSchema => ({
  key,
  label,
  kind: 'number',
  min,
  max,
  default: def,
});
const tones = ['primary', 'neutral', 'danger'];
const aligns = ['start', 'center', 'end'];

export const NODE_DEFS: Record<NodeType, NodeDef> = {
  section: {
    label: 'Section',
    icon: '▭',
    props: [
      select('padding', 'Padding', ['md', 'sm', 'lg']),
      select('background', 'Background', ['none', 'raised', 'primary']),
    ],
  },
  stack: {
    label: 'Stack',
    icon: '☰',
    props: [
      select('direction', 'Direction', ['column', 'row']),
      num('gap', 'Gap', 0, 48, 16),
      select('align', 'Align', ['start', 'center', 'end', 'stretch']),
      select('justify', 'Justify', ['start', 'center', 'end', 'between']),
      toggle('wrap', 'Wrap'),
    ],
  },
  grid: {
    label: 'Grid',
    icon: '▦',
    props: [num('columns', 'Columns', 1, 6, 3), num('gap', 'Gap', 0, 48, 16)],
  },
  card: {
    label: 'Card',
    icon: '▣',
    props: [
      select('elevation', 'Elevation', ['sm', 'none', 'md']),
      select('padding', 'Padding', ['md', 'sm', 'lg']),
      text('imageSrc', 'Image URL'),
      text('imageAlt', 'Image alt text'),
    ],
  },
  heading: {
    label: 'Heading',
    icon: 'H',
    props: [
      text('text', 'Text', 'Heading'),
      num('level', 'Level', 1, 4, 2),
      select('align', 'Align', aligns),
    ],
  },
  text: {
    label: 'Text',
    icon: '¶',
    props: [
      { key: 'text', label: 'Text', kind: 'textarea', default: 'Some supporting text.' },
      select('size', 'Size', ['md', 'sm', 'lg']),
      select('align', 'Align', aligns),
      toggle('muted', 'Muted'),
    ],
  },
  button: {
    label: 'Button',
    icon: '◉',
    props: [
      text('label', 'Label', 'Click me'),
      select('variant', 'Variant', ['solid', 'outline', 'ghost', 'link']),
      select('tone', 'Tone', tones),
      select('size', 'Size', ['sm', 'md', 'lg']),
      toggle('fullWidth', 'Full width'),
      toggle('disabled', 'Disabled'),
      select('icon', 'Icon', ['none', 'arrow', 'plus', 'check']),
      select('iconPosition', 'Icon position', ['left', 'right']),
      text('href', 'Link (href)'),
    ],
  },
  image: {
    label: 'Image',
    icon: '▨',
    props: [
      text('src', 'Image URL'),
      text('alt', 'Alt text'),
      select('ratio', 'Ratio', ['auto', '16:9', '1:1']),
    ],
  },
  input: {
    label: 'Input',
    icon: '▱',
    props: [
      text('label', 'Label', 'Label'),
      text('placeholder', 'Placeholder'),
      select('type', 'Type', ['text', 'email', 'password']),
    ],
  },
  link: {
    label: 'Link',
    icon: '↗',
    props: [text('text', 'Text', 'Link'), text('href', 'Link (href)', '#')],
  },
  badge: {
    label: 'Badge',
    icon: '●',
    props: [text('text', 'Text', 'New'), select('tone', 'Tone', tones)],
  },
  divider: { label: 'Divider', icon: '—', props: [] },
};

let counter = 0;
const nextId = () => `n${++counter}`;

export function createNode(
  type: NodeType,
  props: Partial<UbNode['props']> = {},
  children: UbNode[] = [],
): UbNode {
  const defaults: UbNode['props'] = {};
  for (const p of NODE_DEFS[type].props) defaults[p.key] = p.default;
  return { id: nextId(), type, props: { ...defaults, ...props } as UbNode['props'], children };
}

export const isContainer = (type: NodeType) => CONTAINERS.includes(type);

export function findNode(root: UbNode, id: string): UbNode | null {
  if (root.id === id) return root;
  for (const child of root.children) {
    const hit = findNode(child, id);
    if (hit) return hit;
  }
  return null;
}

export function findParent(root: UbNode, id: string): { parent: UbNode; index: number } | null {
  for (let i = 0; i < root.children.length; i++) {
    if (root.children[i].id === id) return { parent: root, index: i };
    const hit = findParent(root.children[i], id);
    if (hit) return hit;
  }
  return null;
}

/** Depth of the deepest node in the subtree, counting the node itself as 1. */
export function treeDepth(node: UbNode): number {
  return 1 + node.children.reduce((max, c) => Math.max(max, treeDepth(c)), 0);
}

function depthOf(root: UbNode, id: string, current = 1): number {
  if (root.id === id) return current;
  for (const child of root.children) {
    const d = depthOf(child, id, current + 1);
    if (d) return d;
  }
  return 0;
}

function fits(root: UbNode, subtree: UbNode, parentId: string): boolean {
  const parent = findNode(root, parentId);
  if (!parent || !isContainer(parent.type)) return false;
  if (findNode(subtree, parentId)) return false;
  return depthOf(root, parentId) + treeDepth(subtree) <= MAX_DEPTH;
}

export function canDrop(root: UbNode, id: string | null, parentId: string): boolean {
  if (id === null) return fits(root, { id: '', type: 'text', props: {}, children: [] }, parentId);
  const node = findNode(root, id);
  if (!node || node.id === root.id) return false;
  return fits(root, node, parentId);
}

const replaceChildren = (
  node: UbNode,
  parentId: string,
  fn: (children: UbNode[]) => UbNode[],
): UbNode => {
  if (node.id === parentId) return { ...node, children: fn(node.children) };
  let changed = false;
  const children = node.children.map((c) => {
    const next = replaceChildren(c, parentId, fn);
    if (next !== c) changed = true;
    return next;
  });
  return changed ? { ...node, children } : node;
};

const clampIndex = (i: number, len: number) => Math.max(0, Math.min(i, len));

export function insertNode(root: UbNode, node: UbNode, parentId: string, index: number): UbNode {
  if (!fits(root, node, parentId)) return root;
  return replaceChildren(root, parentId, (kids) => {
    const at = clampIndex(index, kids.length);
    return [...kids.slice(0, at), node, ...kids.slice(at)];
  });
}

export function removeNode(root: UbNode, id: string): UbNode {
  const hit = findParent(root, id);
  if (!hit) return root;
  return replaceChildren(root, hit.parent.id, (kids) => kids.filter((k) => k.id !== id));
}

export function moveNode(root: UbNode, id: string, parentId: string, index: number): UbNode {
  if (!canDrop(root, id, parentId)) return root;
  const node = findNode(root, id)!;
  const from = findParent(root, id)!;
  const adjusted = from.parent.id === parentId && from.index < index ? index - 1 : index;
  const without = removeNode(root, id);
  return insertNode(without, node, parentId, adjusted);
}

const cloneFresh = (node: UbNode): UbNode => ({
  ...node,
  id: nextId(),
  props: { ...node.props },
  children: node.children.map(cloneFresh),
});

export function duplicateNode(root: UbNode, id: string): { root: UbNode; newId: string } {
  const hit = findParent(root, id);
  if (!hit) return { root, newId: id };
  const copy = cloneFresh(hit.parent.children[hit.index]);
  const next = insertNode(root, copy, hit.parent.id, hit.index + 1);
  return next === root ? { root, newId: id } : { root: next, newId: copy.id };
}

export function updateProps(root: UbNode, id: string, patch: Partial<UbNode['props']>): UbNode {
  if (root.id === id) return { ...root, props: { ...root.props, ...patch } as UbNode['props'] };
  let changed = false;
  const children = root.children.map((c) => {
    const next = updateProps(c, id, patch);
    if (next !== c) changed = true;
    return next;
  });
  return changed ? { ...root, children } : root;
}

/** Moves the id counter past every `n<number>` id in a loaded tree so new nodes never collide. */
export function reserveIds(root: UbNode): void {
  const match = /^n(\d+)$/.exec(root.id);
  if (match) counter = Math.max(counter, Number(match[1]));
  root.children.forEach(reserveIds);
}
