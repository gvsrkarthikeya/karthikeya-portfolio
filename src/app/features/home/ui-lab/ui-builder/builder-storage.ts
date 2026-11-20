import {
  MAX_DEPTH,
  NODE_DEFS,
  NodeType,
  PropSchema,
  PropValue,
  UbNode,
  reserveIds,
} from './builder-tree';

export const STORAGE_KEY = 'portfolio.uibuilder.v2';

export const serialize = (root: UbNode): string => JSON.stringify(root);

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

function cleanValue(schema: PropSchema, value: unknown): PropValue {
  switch (schema.kind) {
    case 'toggle':
      return typeof value === 'boolean' ? value : schema.default;
    case 'number':
      return typeof value === 'number' && Number.isFinite(value)
        ? Math.min(schema.max ?? value, Math.max(schema.min ?? value, value))
        : schema.default;
    case 'select':
      return typeof value === 'string' && schema.options?.includes(value) ? value : schema.default;
    default:
      return typeof value === 'string' ? value : schema.default;
  }
}

function parseNode(raw: unknown, depth: number, seen: Set<string>): UbNode | null {
  if (depth > MAX_DEPTH || !isRecord(raw)) return null;
  const { id, type, props, children } = raw;
  if (typeof id !== 'string' || !id || seen.has(id)) return null;
  if (typeof type !== 'string' || !Object.hasOwn(NODE_DEFS, type)) return null;
  if (!isRecord(props) || !Array.isArray(children)) return null;
  seen.add(id);
  const cleaned: UbNode['props'] = {};
  for (const schema of NODE_DEFS[type as NodeType].props) {
    cleaned[schema.key] = cleanValue(schema, props[schema.key]);
  }
  const kids: UbNode[] = [];
  for (const child of children) {
    const parsed = parseNode(child, depth + 1, seen);
    if (!parsed) return null;
    kids.push(parsed);
  }
  return { id, type: type as NodeType, props: cleaned, children: kids };
}

/** Returns null for anything that is not a valid, in-budget tree; never throws. */
export function deserialize(json: string | null): UbNode | null {
  if (!json) return null;
  try {
    const root = parseNode(JSON.parse(json), 1, new Set());
    if (root) reserveIds(root);
    return root;
  } catch {
    return null;
  }
}
