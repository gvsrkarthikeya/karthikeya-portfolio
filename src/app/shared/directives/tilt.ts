import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core';

/** Tilts the host in 3D towards the pointer and adds a moving glare. Fine pointers only. */
@Directive({ selector: '[appTilt]' })
export class Tilt {
  constructor() {
    const el: HTMLElement = inject(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const mq = (q: string) => window.matchMedia?.(q).matches;
      if (mq('(prefers-reduced-motion: reduce)') || !mq('(hover: hover) and (pointer: fine)')) {
        return;
      }

      el.classList.add('tilt');
      const max = 7;

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        el.style.setProperty('--tilt-x', `${((0.5 - y) * 2 * max).toFixed(2)}deg`);
        el.style.setProperty('--tilt-y', `${((x - 0.5) * 2 * max).toFixed(2)}deg`);
        el.style.setProperty('--glare-x', `${(x * 100).toFixed(1)}%`);
        el.style.setProperty('--glare-y', `${(y * 100).toFixed(1)}%`);
        el.classList.add('tilt--active');
      };
      const leave = () => {
        el.classList.remove('tilt--active');
        el.style.removeProperty('--tilt-x');
        el.style.removeProperty('--tilt-y');
      };

      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      destroyRef.onDestroy(() => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
      });
    });
  }
}
