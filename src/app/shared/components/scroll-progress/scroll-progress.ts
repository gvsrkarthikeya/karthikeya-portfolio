import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-scroll-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="scroll-progress" aria-hidden="true">
    <div class="scroll-progress__bar" [style.transform]="'scaleX(' + progress() + ')'"></div>
  </div>`,
  styles: `
    .scroll-progress {
      position: fixed;
      inset: 0 0 auto 0;
      height: 3px;
      z-index: 1090;
      pointer-events: none;
    }
    .scroll-progress__bar {
      height: 100%;
      transform-origin: left;
      background: var(--color-primary);
    }
  `,
})
export class ScrollProgress {
  protected readonly progress = signal(0);

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const update = (): void => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        this.progress.set(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      };
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', update);
        window.removeEventListener('resize', update);
      });
      update();
    });
  }
}
