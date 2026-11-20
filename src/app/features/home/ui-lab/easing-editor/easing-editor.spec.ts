import { TestBed } from '@angular/core/testing';
import { EasingEditor, toCss } from './easing-editor';

describe('EasingEditor', () => {
  it('formats cubic-bezier css with trimmed decimals', () => {
    expect(toCss([0.25, 0.1, 0.25, 1])).toBe('cubic-bezier(0.25, 0.1, 0.25, 1)');
    expect(toCss([0.3333, 0, 0.6667, 1])).toBe('cubic-bezier(0.33, 0, 0.67, 1)');
  });

  it('applies a preset and shows its css', async () => {
    const fixture = TestBed.createComponent(EasingEditor);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const ease = Array.from(el.querySelectorAll<HTMLButtonElement>('.ease__preset')).find(
      (b) => b.textContent?.trim() === 'ease-in',
    )!;
    ease.click();
    await fixture.whenStable();
    expect(el.querySelector('.ease__code')?.textContent).toBe('cubic-bezier(0.42, 0, 1, 1)');
  });

  it('moves a handle with arrow keys and clamps x to 0..1', async () => {
    const fixture = TestBed.createComponent(EasingEditor);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const handle = el.querySelector('circle[aria-label="Control point 1"]') as SVGElement;
    for (let i = 0; i < 40; i++) {
      handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    }
    await fixture.whenStable();
    expect(handle.getAttribute('aria-valuenow')).toBe('0');
  });
});
