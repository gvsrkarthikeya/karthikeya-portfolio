import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommandPaletteService } from './core/services/command-palette.service';
import { AppearanceService } from './core/services/appearance.service';
import { PortfolioDataService } from './core/services/portfolio-data.service';
import { NavItem } from './models';
import { BackToTop } from './shared/components/back-to-top/back-to-top';
import { ScrollProgress } from './shared/components/scroll-progress/scroll-progress';
import { CommandPalette } from './shared/components/command-palette/command-palette';
import { SiteFooter } from './shared/components/site-footer/site-footer';
import { StyleSelector } from './shared/components/style-selector/style-selector';
import { ThemeToggle } from './shared/components/theme-toggle/theme-toggle';
import { SiteHeader } from './shared/components/site-header/site-header';

@Component({
  imports: [
    SiteHeader,
    StyleSelector,
    ThemeToggle,
    RouterOutlet,
    SiteFooter,
    BackToTop,
    ScrollProgress,
    CommandPalette,
  ],
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly appearance = inject(AppearanceService);
  protected readonly palette = inject(CommandPaletteService);
  protected readonly profile = inject(PortfolioDataService).content.profile;

  protected readonly shortcut = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘K' : 'Ctrl K';

  protected toggleTheme(): void {
    const active = document.activeElement;
    const box = active instanceof HTMLElement ? active.getBoundingClientRect() : undefined;
    this.appearance.toggleColorTheme(
      box ? { x: box.left + box.width / 2, y: box.top + box.height / 2 } : undefined,
    );
  }

  /** Header links: home sections first, then the separate pages. */
  protected readonly navItems: NavItem[] = [
    { label: 'About', path: '', fragment: 'about' },
    { label: 'Experience', path: '', fragment: 'experience' },
    { label: 'Skills', path: '', fragment: 'skills' },
    { label: 'Projects', path: '', fragment: 'projects' },
    { label: 'Contact', path: '', fragment: 'contact' },
    { label: 'GitHub', path: 'github' },
    { label: 'UI Lab', path: 'lab' },
  ];

  /** The palette also reaches sections that are left out of the header to keep it tidy. */
  protected readonly paletteItems: NavItem[] = [
    ...this.navItems.slice(0, 4),
    { label: 'Education', path: '', fragment: 'education' },
    ...this.navItems.slice(4),
  ];

  protected skipToMain(event: Event): void {
    // A bare "#id" href would resolve against <base href="/"> and reload the home page.
    event.preventDefault();
    document.getElementById('main-content')?.focus();
  }
}
