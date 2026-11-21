export interface DropRect {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export type DropZone = 'before' | 'after' | 'inside';

/**
 * Decides where a pointer over a node should land. Containers take the middle of their height as
 * "inside" (a wider band when empty); leaves split in halves and are never "inside".
 */
export function resolveDrop(
  rect: DropRect,
  point: { x: number; y: number },
  isContainer: boolean,
  hasChildren: boolean,
): DropZone {
  const height = rect.bottom - rect.top;
  const ratio = height > 0 ? (point.y - rect.top) / height : 0;
  if (!isContainer) return ratio < 0.5 ? 'before' : 'after';
  const edge = hasChildren ? 0.25 : 0.1;
  if (ratio < edge) return 'before';
  if (ratio > 1 - edge) return 'after';
  return 'inside';
}
