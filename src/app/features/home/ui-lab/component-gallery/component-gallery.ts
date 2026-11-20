import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';

const TABS = [
  {
    id: 'keyboard',
    label: 'Keyboard',
    body: 'Arrow keys move between tabs; Home and End jump to the first and last. Only the active tab is in the Tab order (roving tabindex).',
  },
  {
    id: 'semantics',
    label: 'Semantics',
    body: 'Tabs use role=tablist/tab/tabpanel with aria-selected and aria-controls, so screen readers announce position and state.',
  },
  {
    id: 'motion',
    label: 'Motion',
    body: 'Every transition here is switched off when the user prefers reduced motion.',
  },
];

const FAQ = [
  {
    q: 'Why build these by hand?',
    a: 'To show the ARIA patterns and focus management behind common UI widgets, with no component library.',
  },
  {
    q: 'Which pattern is trickiest?',
    a: 'The modal: it must trap focus, close on Escape, and return focus to the button that opened it.',
  },
  {
    q: 'Is it themeable?',
    a: 'Yes. Everything reads the active design style’s CSS tokens, so all eight styles and both themes apply.',
  },
];

@Component({
  selector: 'app-component-gallery',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './component-gallery.html',
  styleUrl: './component-gallery.scss',
})
export class ComponentGallery {
  protected readonly tabs = TABS;
  protected readonly faq = FAQ;

  protected readonly activeTab = signal(0);
  protected readonly openItem = signal<number | null>(0);
  protected readonly modalOpen = signal(false);
  protected readonly tipOpen = signal(false);
  protected readonly toast = signal('');

  private readonly modal = viewChild<ElementRef<HTMLElement>>('modal');
  private readonly tabButtons = viewChild<ElementRef<HTMLElement>>('tablist');
  private readonly injector = inject(Injector);
  private opener: HTMLElement | null = null;
  private toastTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.toastTimer));
  }

  protected onTabKeydown(event: KeyboardEvent): void {
    const last = this.tabs.length - 1;
    const current = this.activeTab();
    const next: Record<string, number> = {
      ArrowRight: current === last ? 0 : current + 1,
      ArrowLeft: current === 0 ? last : current - 1,
      Home: 0,
      End: last,
    };
    if (!(event.key in next)) return;
    event.preventDefault();
    this.activeTab.set(next[event.key]);
    this.tabButtons()
      ?.nativeElement.querySelectorAll<HTMLElement>('[role=tab]')
      [next[event.key]]?.focus();
  }

  protected toggleItem(index: number): void {
    this.openItem.update((open) => (open === index ? null : index));
  }

  protected openModal(event: Event): void {
    this.opener = event.currentTarget as HTMLElement;
    this.modalOpen.set(true);
    afterNextRender(() => this.focusables()[0]?.focus(), { injector: this.injector });
  }

  protected closeModal(): void {
    this.modalOpen.set(false);
    this.opener?.focus();
  }

  protected onModalKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.stopPropagation();
      this.closeModal();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = this.focusables();
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  protected showToast(message: string): void {
    this.toast.set(message);
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toast.set(''), 3000);
  }

  private focusables(): HTMLElement[] {
    const root = this.modal()?.nativeElement;
    return root
      ? Array.from(
          root.querySelectorAll<HTMLElement>(
            'button, [href], input, [tabindex]:not([tabindex="-1"])',
          ),
        )
      : [];
  }
}
