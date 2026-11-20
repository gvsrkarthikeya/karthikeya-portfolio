import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
} from '@angular/core';
import { SkillGroup } from '../../../../models';

const FACE_WIDTH = 220;

/**
 * A rotating CSS 3D prism with one face per skill group. Purely decorative: the same
 * content is available as text in the skills grid, so it is hidden from assistive tech.
 */
@Component({
  selector: 'app-tech-cube',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tech-cube.html',
  styleUrl: './tech-cube.scss',
})
export class TechCube {
  readonly groups = input.required<SkillGroup[]>();

  protected readonly faces = computed(() => {
    const groups = this.groups().slice(0, 8);
    const step = 360 / groups.length;
    return groups.map((group, i) => ({
      title: group.title,
      skills: group.skills.slice(0, 6).map((s) => s.name),
      angle: i * step,
    }));
  });

  /** Distance from the prism axis to the middle of each face. */
  protected readonly apothem = computed(() => {
    const n = Math.max(this.faces().length, 3);
    return Math.round(FACE_WIDTH / 2 / Math.tan(Math.PI / n));
  });

  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private resetView: () => void = () => undefined;

  protected reset(): void {
    this.resetView();
  }

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const stage = this.host.querySelector<HTMLElement>('.cube__prism');
      if (!stage) return;
      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

      const initial = { yaw: -20, pitch: -12 };
      let yaw = initial.yaw;
      let pitch = initial.pitch;
      let dragging: { x: number; y: number } | null = null;
      let hovered = false;
      let frame = 0;
      let last = performance.now();

      const paint = () =>
        stage.style.setProperty('transform', `rotateX(${pitch}deg) rotateY(${yaw}deg)`);

      const tick = (now: number) => {
        const dt = now - last;
        last = now;
        if (!dragging && !hovered) yaw += dt * 0.02;
        paint();
        frame = requestAnimationFrame(tick);
      };

      const down = (e: PointerEvent) => {
        if ((e.target as Element).closest('button')) return;
        dragging = { x: e.clientX, y: e.clientY };
        this.host.setPointerCapture(e.pointerId);
      };
      const move = (e: PointerEvent) => {
        if (!dragging) return;
        yaw += (e.clientX - dragging.x) * 0.5;
        pitch = Math.max(-40, Math.min(40, pitch - (e.clientY - dragging.y) * 0.3));
        dragging = { x: e.clientX, y: e.clientY };
        paint();
      };
      const up = () => (dragging = null);
      const enter = () => (hovered = true);
      const leave = () => (hovered = false);

      this.resetView = () => {
        // Take the shortest way back to the start angle instead of unwinding every turn.
        const turns = Math.round((yaw - initial.yaw) / 360);
        yaw = initial.yaw + turns * 360;
        pitch = initial.pitch;
        stage.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.2, 0.64, 1)';
        paint();
        setTimeout(() => stage.style.removeProperty('transition'), 650);
      };

      paint();
      this.host.addEventListener('pointerdown', down);
      this.host.addEventListener('pointermove', move);
      this.host.addEventListener('pointerup', up);
      this.host.addEventListener('pointercancel', up);
      this.host.addEventListener('pointerenter', enter);
      this.host.addEventListener('pointerleave', leave);
      if (!reduced) frame = requestAnimationFrame(tick);

      destroyRef.onDestroy(() => {
        cancelAnimationFrame(frame);
        this.host.removeEventListener('pointerdown', down);
        this.host.removeEventListener('pointermove', move);
        this.host.removeEventListener('pointerup', up);
        this.host.removeEventListener('pointercancel', up);
        this.host.removeEventListener('pointerenter', enter);
        this.host.removeEventListener('pointerleave', leave);
      });
    });
  }
}
