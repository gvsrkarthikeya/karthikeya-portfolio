import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeToggle } from './theme-toggle';

describe('ThemeToggle', () => {
  let fixture: ComponentFixture<ThemeToggle>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ThemeToggle);
    fixture.componentRef.setInput('theme', 'light');
    await fixture.whenStable();
  });

  function button(): HTMLButtonElement {
    return (fixture.nativeElement as HTMLElement).querySelector('button')!;
  }

  it('exposes an unpressed, labelled button in light mode', () => {
    expect(button().getAttribute('aria-pressed')).toBe('false');
    expect(button().getAttribute('aria-label')).toBe('Dark mode');
  });

  it('is pressed in dark mode', async () => {
    fixture.componentRef.setInput('theme', 'dark');
    await fixture.whenStable();

    expect(button().getAttribute('aria-pressed')).toBe('true');
  });

  it('emits a toggle request on click', () => {
    const spy = vi.fn();
    fixture.componentInstance.toggled.subscribe(spy);

    button().click();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
