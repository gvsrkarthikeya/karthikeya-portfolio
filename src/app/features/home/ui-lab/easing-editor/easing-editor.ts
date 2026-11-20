import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

export type Bezier = [number, number, number, number];

export const EASING_PRESETS: { name: string; value: Bezier }[] = [
  { name: 'ease', value: [0.25, 0.1, 0.25, 1] },
  { name: 'ease-in', value: [0.42, 0, 1, 1] },
  { name: 'ease-out', value: [0, 0, 0.58, 1] },
  { name: 'ease-in-out', value: [0.42, 0, 0.58, 1] },
  { name: 'back-out', value: [0.34, 1.56, 0.64, 1] },
  { name: 'snappy', value: [0.8, 0, 0.1, 1] },
];

export function toCss(b: Bezier): string {
  return `cubic-bezier(${b.map((n) => +n.toFixed(2)).join(', ')})`;
}

// SVG space: x spans 40..200, y spans 220 (0) .. 60 (1); overshoot is allowed vertically.
const X0 = 40;
const Y0 = 220;
const SIZE = 160;
const Y_MIN = -0.6;
const Y_MAX = 1.6;

@Component({
  selector: 'app-easing-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './easing-editor.html',
  styleUrl: './easing-editor.scss',
})
export class EasingEditor {
  protected readonly presets = EASING_PRESETS;
  protected readonly bezier = signal<Bezier>([0.34, 1.56, 0.64, 1]);
  protected readonly atEnd = signal(false);
  protected readonly status = signal('');

  protected readonly css = computed(() => toCss(this.bezier()));
  protected readonly p1 = computed(() => this.toSvg(this.bezier()[0], this.bezier()[1]));
  protected readonly p2 = computed(() => this.toSvg(this.bezier()[2], this.bezier()[3]));
  protected readonly path = computed(
    () =>
      `M${X0} ${Y0} C${this.p1().x} ${this.p1().y} ${this.p2().x} ${this.p2().y} ${X0 + SIZE} ${Y0 - SIZE}`,
  );

  private toSvg(x: number, y: number): { x: number; y: number } {
    return { x: X0 + x * SIZE, y: Y0 - y * SIZE };
  }

  protected setPreset(value: Bezier): void {
    this.bezier.set([...value]);
  }

  protected isPreset(value: Bezier): boolean {
    return value.every((n, i) => n === this.bezier()[i]);
  }

  protected play(): void {
    this.atEnd.update((v) => !v);
  }

  protected drag(handle: 0 | 1, event: PointerEvent): void {
    const target = event.currentTarget as SVGElement;
    const svg = target.ownerSVGElement as SVGSVGElement;
    target.setPointerCapture(event.pointerId);

    const move = (e: PointerEvent): void => {
      const box = svg.getBoundingClientRect();
      const vb = svg.viewBox.baseVal;
      const sx = ((e.clientX - box.left) / box.width) * vb.width;
      const sy = vb.y + ((e.clientY - box.top) / box.height) * vb.height;
      this.setHandle(handle, (sx - X0) / SIZE, (Y0 - sy) / SIZE);
    };
    const stop = (): void => {
      target.removeEventListener('pointermove', move);
      target.removeEventListener('pointerup', stop);
      target.removeEventListener('pointercancel', stop);
    };
    target.addEventListener('pointermove', move);
    target.addEventListener('pointerup', stop);
    target.addEventListener('pointercancel', stop);
  }

  protected nudge(handle: 0 | 1, event: KeyboardEvent): void {
    const step = event.shiftKey ? 0.1 : 0.02;
    const [x1, y1, x2, y2] = this.bezier();
    const [x, y] = handle === 0 ? [x1, y1] : [x2, y2];
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, step],
      ArrowDown: [0, -step],
    };
    const d = delta[event.key];
    if (!d) return;
    event.preventDefault();
    this.setHandle(handle, x + d[0], y + d[1]);
  }

  protected async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.css());
      this.status.set('Copied to clipboard');
    } catch {
      this.status.set('Copy not available in this browser');
    }
  }

  private setHandle(handle: 0 | 1, x: number, y: number): void {
    const cx = Math.min(1, Math.max(0, x));
    const cy = Math.min(Y_MAX, Math.max(Y_MIN, y));
    const next = [...this.bezier()] as Bezier;
    next[handle * 2] = cx;
    next[handle * 2 + 1] = cy;
    this.bezier.set(next);
    this.status.set('');
  }
}
