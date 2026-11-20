import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { AppearanceService } from '../../../core/services/appearance.service';
import { CommandPaletteService } from '../../../core/services/command-palette.service';
import { DESIGN_STYLES, NavItem, Profile } from '../../../models';
import { fuzzyScore } from './fuzzy';

export interface PaletteCommand {
  id: string;
  label: string;
  group: 'Navigate' | 'Appearance' | 'Links';
  run: () => void;
}

@Component({
  selector: 'app-command-palette',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './command-palette.html',
  styleUrl: './command-palette.scss',
  host: { '(document:keydown)': 'onGlobalKeydown($event)' },
})
export class CommandPalette {
  readonly navItems = input.required<NavItem[]>();
  readonly profile = input.required<Profile>();

  protected readonly palette = inject(CommandPaletteService);
  private readonly appearance = inject(AppearanceService);
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('search');

  protected readonly query = signal('');
  protected readonly activeIndex = signal(0);
  private returnFocus: HTMLElement | null = null;

  private readonly commands = computed<PaletteCommand[]>(() => {
    const profile = this.profile();
    const go = (id: string): void => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      history.replaceState(null, '', `#${id}`);
    };
    const open = (url: string): void => void window.open(url, '_blank', 'noopener');

    const commands: PaletteCommand[] = [
      { id: 'nav-home', label: 'Go to Home', group: 'Navigate', run: () => go('home') },
      ...this.navItems().map<PaletteCommand>((item) => ({
        id: `nav-${item.fragment}`,
        label: `Go to ${item.label}`,
        group: 'Navigate',
        run: () => go(item.fragment),
      })),
      {
        id: 'theme',
        label: 'Toggle light / dark theme',
        group: 'Appearance',
        run: () => this.appearance.toggleColorTheme(),
      },
      ...DESIGN_STYLES.map<PaletteCommand>((style) => ({
        id: `style-${style}`,
        label: `Design style: ${style.charAt(0).toUpperCase()}${style.slice(1)}`,
        group: 'Appearance',
        run: () => this.appearance.setDesignStyle(style),
      })),
    ];

    if (profile.resumeUrl) {
      const url = profile.resumeUrl;
      commands.push({
        id: 'resume',
        label: 'Open resume (PDF)',
        group: 'Links',
        run: () => open(url),
      });
    }
    for (const link of profile.socialLinks) {
      commands.push({
        id: `link-${link.kind}`,
        label: `Open ${link.label}`,
        group: 'Links',
        run: () => (link.kind === 'email' ? (window.location.href = link.url) : open(link.url)),
      });
    }
    return commands;
  });

  protected readonly results = computed(() => {
    const q = this.query();
    return this.commands()
      .map((command) => ({ command, score: fuzzyScore(q, command.label) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.command);
  });

  constructor() {
    effect(() => {
      if (this.palette.open()) {
        this.returnFocus = document.activeElement as HTMLElement | null;
        this.query.set('');
        this.activeIndex.set(0);
        queueMicrotask(() => this.searchInput()?.nativeElement.focus());
      }
    });
  }

  protected onGlobalKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.palette.toggle();
      if (!this.palette.open()) this.restoreFocus();
    }
  }

  protected onInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.activeIndex.set(0);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const count = this.results().length;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (count) this.activeIndex.update((i) => (i + 1) % count);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (count) this.activeIndex.update((i) => (i - 1 + count) % count);
        break;
      case 'Enter':
        event.preventDefault();
        this.run(this.results()[this.activeIndex()]);
        break;
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
      case 'Tab':
        // Keep focus inside the dialog; the input is its only focus stop.
        event.preventDefault();
        break;
    }
  }

  protected run(command: PaletteCommand | undefined): void {
    if (!command) return;
    this.close();
    command.run();
  }

  protected close(): void {
    this.palette.hide();
    this.restoreFocus();
  }

  private restoreFocus(): void {
    this.returnFocus?.focus?.();
  }
}
