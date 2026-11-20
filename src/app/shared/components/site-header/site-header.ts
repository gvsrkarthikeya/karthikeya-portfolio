import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { NavItem } from '../../../models';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
})
export class SiteHeader {
  readonly brand = input.required<string>();
  readonly navItems = input.required<NavItem[]>();

  private readonly router = inject(Router);
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly menuOpen = signal(false);
  protected readonly activeSection = signal('');

  constructor() {
    // Home sections are tracked by scroll position; re-observe whenever the page changes.
    effect((onCleanup) => {
      this.url();
      if (typeof IntersectionObserver === 'undefined') return;
      let observer: IntersectionObserver | undefined;
      const frame = requestAnimationFrame(() => {
        const sections = Array.from(document.querySelectorAll('main section[id]'));
        // A section is "current" while it crosses a band around the upper-middle of the viewport.
        observer = new IntersectionObserver(
          (entries) => {
            const hit = entries.find((e) => e.isIntersecting);
            if (hit) this.activeSection.set(hit.target.id);
          },
          { rootMargin: '-35% 0px -60% 0px' },
        );
        sections.forEach((s) => observer?.observe(s));
      });
      onCleanup(() => {
        cancelAnimationFrame(frame);
        observer?.disconnect();
      });
    });
  }

  /** True for the first link that leaves the home page, so a divider can separate the groups. */
  protected startsPages(index: number): boolean {
    const items = this.navItems();
    return index > 0 && !items[index].fragment && !!items[index - 1].fragment;
  }

  protected isActive(item: NavItem): boolean {
    const path = this.url().split(/[?#]/)[0].replace(/^\//, '');
    if (item.fragment) return path === item.path && this.activeSection() === item.fragment;
    return path === item.path;
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
