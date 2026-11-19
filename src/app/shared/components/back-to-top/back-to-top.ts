import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-back-to-top',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './back-to-top.html',
  styleUrl: './back-to-top.scss',
})
export class BackToTop {
  protected readonly visible = signal(false);

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const update = (): void => this.visible.set(window.scrollY > window.innerHeight);
      window.addEventListener('scroll', update, { passive: true });
      destroyRef.onDestroy(() => window.removeEventListener('scroll', update));
      update();
    });
  }

  protected scrollToTop(): void {
    // Smoothness comes from the global scroll-behavior rule, which honours reduced motion.
    window.scrollTo({ top: 0 });
    document.getElementById('home')?.focus({ preventScroll: true });
  }
}
