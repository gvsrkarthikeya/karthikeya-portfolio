export const BLOCK_COLS = 7;
export const BLOCK_ROWS = 5;

export interface Pointer {
  x: number;
  y: number;
}

const LIFT_RADIUS = 0.35;

export function blockLift(col: number, row: number, pointer: Pointer | null): number {
  if (!pointer) return 0;

  const dx = (col + 0.5) / BLOCK_COLS - pointer.x;
  const dy = (row + 0.5) / BLOCK_ROWS - pointer.y;
  const distance = Math.hypot(dx, dy);
  const falloff = Math.max(0, 1 - distance / LIFT_RADIUS);
  return falloff * falloff;
}

export function normalisePointer(
  clientX: number,
  clientY: number,
  rect: { left: number; top: number; width: number; height: number },
): Pointer | null {
  if (rect.width === 0 || rect.height === 0) return null;

  const clamp = (value: number): number => Math.min(1, Math.max(0, value));
  return {
    x: clamp((clientX - rect.left) / rect.width),
    y: clamp((clientY - rect.top) / rect.height),
  };
}
