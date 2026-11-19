import {
  afterNextRender,
  ChangeDetectionStrategy,
  Injector,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { DESIGN_STYLES, DesignStyle } from '../../../models';

const LABELS: Record<DesignStyle, string> = {
  minimalism: 'Minimalism',
  flat: 'Flat',
  material: 'Material',
  glassmorphism: 'Glassmorphism',
  neumorphism: 'Neumorphism',
  neubrutalism: 'Neubrutalism',
  skeuomorphism: 'Skeuomorphism',
  bento: 'Bento Grid',
};

@Component({
  selector: 'app-style-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './style-selector.html',
  styleUrl: './style-selector.scss',
})
export class StyleSelector {
  readonly style = input.required<DesignStyle>();
  readonly changed = output<DesignStyle>();

  protected readonly options = DESIGN_STYLES.map((value) => ({ value, label: LABELS[value] }));
  protected readonly isOpen = signal(false);
  protected readonly currentLabel = () => LABELS[this.style()];

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly trigger = viewChild<ElementRef<HTMLButtonElement>>('trigger');

  protected toggle(): void {
    if (this.isOpen()) {
      this.close(true);
    } else {
      this.open();
    }
  }

  protected select(value: DesignStyle): void {
    this.changed.emit(value);
    this.close(true);
  }

  protected onMenuKeydown(event: KeyboardEvent): void {
    const items = this.items();
    const index = items.indexOf(document.activeElement as HTMLElement);
    const moves: Record<string, number> = {
      ArrowDown: (index + 1) % items.length,
      ArrowUp: (index - 1 + items.length) % items.length,
      Home: 0,
      End: items.length - 1,
    };

    if (event.key === 'Escape') {
      event.preventDefault();
      this.close(true);
    } else if (event.key in moves) {
      event.preventDefault();
      items[moves[event.key]]?.focus();
    } else if (event.key === 'Tab') {
      this.close(false);
    }
  }

  protected onTriggerKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' && !this.isOpen()) {
      event.preventDefault();
      this.open();
    }
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: Event): void {
    if (this.isOpen() && !this.host.nativeElement.contains(event.target as Node)) {
      this.close(false);
    }
  }

  private open(): void {
    this.isOpen.set(true);
    afterNextRender(
      () => {
        const items = this.items();
        const current = this.options.findIndex((o) => o.value === this.style());
        items[Math.max(current, 0)]?.focus();
      },
      { injector: this.injector },
    );
  }

  private close(restoreFocus: boolean): void {
    this.isOpen.set(false);
    if (restoreFocus) {
      this.trigger()?.nativeElement.focus();
    }
  }

  private items(): HTMLElement[] {
    return Array.from(
      this.host.nativeElement.querySelectorAll<HTMLElement>('[role="menuitemradio"]'),
    );
  }
}
