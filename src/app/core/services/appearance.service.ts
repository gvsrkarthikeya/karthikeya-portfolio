import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';
import {
  AppearanceSettings,
  ColorTheme,
  DesignStyle,
  isColorTheme,
  isDesignStyle,
} from '../../models';

export const APPEARANCE_STORAGE_KEY = 'portfolio.appearance';

export const DEFAULT_APPEARANCE: AppearanceSettings = {
  designStyle: 'minimalism',
  colorTheme: 'light',
};

@Injectable({ providedIn: 'root' })
export class AppearanceService {
  private readonly document = inject(DOCUMENT);
  private readonly root = this.document.documentElement;
  private readonly style = signal<DesignStyle>(DEFAULT_APPEARANCE.designStyle);
  private readonly theme = signal<ColorTheme>(DEFAULT_APPEARANCE.colorTheme);

  readonly designStyle = this.style.asReadonly();
  readonly colorTheme = this.theme.asReadonly();

  constructor() {
    const stored = this.read();
    this.style.set(stored.designStyle);
    this.theme.set(stored.colorTheme);
    this.apply();
  }

  setDesignStyle(value: DesignStyle): void {
    if (!isDesignStyle(value)) {
      return;
    }
    this.style.set(value);
    this.commit();
  }

  setColorTheme(value: ColorTheme): void {
    if (!isColorTheme(value)) {
      return;
    }
    this.theme.set(value);
    this.commit();
  }

  /**
   * Flips the theme. Where the View Transitions API exists and motion is allowed,
   * the new theme is revealed as a circle growing from `origin` (viewport px).
   */
  toggleColorTheme(origin?: { x: number; y: number }): void {
    const next: ColorTheme = this.theme() === 'dark' ? 'light' : 'dark';
    const doc = this.document as Document & {
      startViewTransition?: (update: () => void) => { ready: Promise<void> };
    };
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (!doc.startViewTransition || reduced) {
      this.setColorTheme(next);
      return;
    }

    const x = origin?.x ?? window.innerWidth / 2;
    const y = origin?.y ?? window.innerHeight / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = doc.startViewTransition(() => this.setColorTheme(next));
    transition.ready
      .then(() =>
        this.root.animate(
          { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 500, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' },
        ),
      )
      .catch(() => undefined);
  }

  private commit(): void {
    this.apply();
    this.write();
  }

  private apply(): void {
    this.root.setAttribute('data-design', this.style());
    this.root.setAttribute('data-bs-theme', this.theme());
  }

  private read(): AppearanceSettings {
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(APPEARANCE_STORAGE_KEY) ?? 'null');
      const stored = (typeof parsed === 'object' && parsed !== null ? parsed : {}) as Record<
        string,
        unknown
      >;
      return {
        designStyle: isDesignStyle(stored['designStyle'])
          ? stored['designStyle']
          : DEFAULT_APPEARANCE.designStyle,
        colorTheme: isColorTheme(stored['colorTheme'])
          ? stored['colorTheme']
          : DEFAULT_APPEARANCE.colorTheme,
      };
    } catch {
      return { ...DEFAULT_APPEARANCE };
    }
  }

  private write(): void {
    const settings: AppearanceSettings = { designStyle: this.style(), colorTheme: this.theme() };
    try {
      localStorage.setItem(APPEARANCE_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Storage is an enhancement only; ignore quota or privacy-mode failures.
    }
  }
}
