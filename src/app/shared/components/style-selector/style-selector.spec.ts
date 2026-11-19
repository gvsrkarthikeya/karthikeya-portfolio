import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DESIGN_STYLES } from '../../../models';
import { StyleSelector } from './style-selector';

describe('StyleSelector', () => {
  let fixture: ComponentFixture<StyleSelector>;
  let element: HTMLElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(StyleSelector);
    fixture.componentRef.setInput('style', 'flat');
    await fixture.whenStable();
    element = fixture.nativeElement as HTMLElement;
  });

  const trigger = () => element.querySelector<HTMLButtonElement>('button.style-selector__trigger')!;
  const items = () =>
    Array.from(element.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]'));

  async function open(): Promise<void> {
    trigger().click();
    await fixture.whenStable();
  }

  function key(target: Element, name: string): void {
    target.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true }));
  }

  it('is closed initially and shows the current style on the trigger', () => {
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(trigger().getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger().textContent).toContain('Flat');
    expect(items().length).toBe(0);
  });

  it('has an accessible name that includes the purpose', () => {
    expect(trigger().getAttribute('aria-label')).toContain('Design style');
  });

  it('opens a menu listing every style with the current one checked', async () => {
    await open();

    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(items().length).toBe(DESIGN_STYLES.length);
    const checked = items().filter((i) => i.getAttribute('aria-checked') === 'true');
    expect(checked.length).toBe(1);
    expect(checked[0].textContent).toContain('Flat');
  });

  it('emits the chosen style, closes and returns focus to the trigger', async () => {
    const spy = vi.fn();
    fixture.componentInstance.changed.subscribe(spy);
    await open();

    items()[7].click();
    await fixture.whenStable();

    expect(spy).toHaveBeenCalledWith('bento');
    expect(items().length).toBe(0);
    expect(document.activeElement).toBe(trigger());
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    await open();

    key(items()[0], 'Escape');
    await fixture.whenStable();

    expect(items().length).toBe(0);
    expect(document.activeElement).toBe(trigger());
  });

  it('closes when clicking outside', async () => {
    await open();

    document.body.click();
    await fixture.whenStable();

    expect(items().length).toBe(0);
  });

  it('moves focus with arrow keys, wrapping around', async () => {
    document.body.appendChild(element);
    await open();
    expect(document.activeElement).toBe(items()[1]);

    key(items()[1], 'ArrowDown');
    expect(document.activeElement).toBe(items()[2]);

    key(items()[2], 'Home');
    key(items()[0], 'ArrowUp');
    expect(document.activeElement).toBe(items()[7]);

    key(items()[7], 'ArrowDown');
    expect(document.activeElement).toBe(items()[0]);
    element.remove();
  });
});
