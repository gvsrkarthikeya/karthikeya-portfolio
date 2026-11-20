import { Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

/** Fades and slides the host in the first time it scrolls into view. */
@Directive({ selector: '[appReveal]' })
export class Reveal {
  /** Stagger delay in ms. */
  readonly appReveal = input<number | string>('');

  constructor() {
    const el: HTMLElement = inject(ElementRef).nativeElement;

    afterNextRender(() => {
      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (reduced || typeof IntersectionObserver === 'undefined') return;

      const delay = Number(this.appReveal()) || 0;
      el.style.setProperty('--reveal-delay', `${delay}ms`);
      el.classList.add('reveal');

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            el.classList.add('reveal--visible');
            observer.disconnect();
          }
        },
        { threshold: 0.12 },
      );
      observer.observe(el);
    });
  }
}
