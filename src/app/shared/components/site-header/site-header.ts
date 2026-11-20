import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  input,
  signal,
} from '@angular/core';
import { NavItem } from '../../../models';

@Component({
  selector: 'app-site-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
})
export class SiteHeader {
  readonly brand = input.required<string>();
  readonly navItems = input.required<NavItem[]>();

  protected readonly menuOpen = signal(false);
  protected readonly activeSection = signal('');

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (typeof IntersectionObserver === 'undefined') return;
      const sections = Array.from(document.querySelectorAll('main section[id]'));
      // A section is "current" while it crosses a band around the upper-middle of the viewport.
      const observer = new IntersectionObserver(
        (entries) => {
          const hit = entries.find((e) => e.isIntersecting);
          if (hit) this.activeSection.set(hit.target.id);
        },
        { rootMargin: '-35% 0px -60% 0px' },
      );
      sections.forEach((s) => observer.observe(s));
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
