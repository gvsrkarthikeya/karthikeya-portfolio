import { Directive, ElementRef, effect, inject, input } from '@angular/core';

/**
 * Renders trusted markup plus its CSS inside a shadow root. The preview keeps its own
 * headings, landmarks and styles out of the page, while theme custom properties still inherit.
 * Callers must pass escaped markup: the builder escapes every user-entered value.
 */
@Directive({ selector: '[appShadowHtml]' })
export class ShadowHtml {
  readonly appShadowHtml = input.required<string>();
  readonly css = input.required<string>();

  private readonly root = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.attachShadow({
    mode: 'open',
  });

  constructor() {
    effect(() => {
      this.root.innerHTML = `<style>${this.css()}</style>${this.appShadowHtml()}`;
    });
  }
}
