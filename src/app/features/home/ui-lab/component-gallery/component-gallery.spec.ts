import { TestBed } from '@angular/core/testing';
import { ComponentGallery } from './component-gallery';

describe('ComponentGallery', () => {
  async function render() {
    const fixture = TestBed.createComponent(ComponentGallery);
    await fixture.whenStable();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('switches tabs with the arrow keys', async () => {
    const { fixture, el } = await render();
    const list = el.querySelector('[role=tablist]') as HTMLElement;
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await fixture.whenStable();
    const tabs = el.querySelectorAll('[role=tab]');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(tabs[0].getAttribute('tabindex')).toBe('-1');
  });

  it('toggles accordion items via aria-expanded', async () => {
    const { fixture, el } = await render();
    const triggers = el.querySelectorAll<HTMLButtonElement>('.gal__trigger');
    expect(triggers[0].getAttribute('aria-expanded')).toBe('true');
    triggers[1].click();
    await fixture.whenStable();
    expect(triggers[1].getAttribute('aria-expanded')).toBe('true');
    expect(triggers[0].getAttribute('aria-expanded')).toBe('false');
  });

  it('opens a modal and closes it on Escape', async () => {
    const { fixture, el } = await render();
    Array.from(el.querySelectorAll<HTMLButtonElement>('button'))
      .find((b) => b.textContent?.includes('Open modal'))!
      .click();
    await fixture.whenStable();
    const modal = el.querySelector('[role=dialog]') as HTMLElement;
    expect(modal.getAttribute('aria-modal')).toBe('true');
    modal.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await fixture.whenStable();
    expect(el.querySelector('[role=dialog]')).toBeNull();
  });

  it('announces toasts in a live region', async () => {
    const { fixture, el } = await render();
    Array.from(el.querySelectorAll<HTMLButtonElement>('button'))
      .find((b) => b.textContent?.includes('Show toast'))!
      .click();
    await fixture.whenStable();
    expect(el.querySelector('[aria-live=polite]')?.textContent).toContain('Saved successfully');
  });
});
