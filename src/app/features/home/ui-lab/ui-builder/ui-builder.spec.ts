import { TestBed } from '@angular/core/testing';
import { UiBuilder } from './ui-builder';

describe('UiBuilder', () => {
  let el: HTMLElement;
  let fixture: ReturnType<typeof TestBed.createComponent<UiBuilder>>;

  const slots = () => Array.from(el.querySelectorAll<HTMLElement>('.ub__slot'));
  const tags = () => slots().map((s) => s.querySelector('.ub__tag')?.textContent?.trim());
  const click = async (selector: string, index = 0) => {
    el.querySelectorAll<HTMLElement>(selector)[index].click();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    fixture = TestBed.createComponent(UiBuilder);
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('starts with a sample page', () => {
    expect(tags()).toEqual(['Navbar', 'Hero', 'Cards', 'Footer']);
  });

  it('adds a block from the palette and selects it', async () => {
    await click('.ub__chip', 4); // Button
    expect(tags().at(-1)).toBe('Button');
    expect(slots().at(-1)?.classList).toContain('ub__slot--selected');
    expect(el.textContent).toContain('Editing: Button');
  });

  it('moves and removes blocks with the toolbar buttons', async () => {
    await click('button[aria-label="Move Hero up"]');
    expect(tags().slice(0, 2)).toEqual(['Hero', 'Navbar']);
    await click('button[aria-label="Remove Hero"]');
    expect(tags()).toEqual(['Navbar', 'Cards', 'Footer']);
  });

  it('disables moving the first block up and the last block down', () => {
    const up = el.querySelector<HTMLButtonElement>('button[aria-label="Move Navbar up"]');
    const down = el.querySelector<HTMLButtonElement>('button[aria-label="Move Footer down"]');
    expect(up?.disabled).toBe(true);
    expect(down?.disabled).toBe(true);
  });

  it('edits the selected block and reflects it in preview and export', async () => {
    await click('.ub__slot', 1); // Hero
    const input = el.querySelector<HTMLInputElement>('#ub-title')!;
    input.value = 'Hello <world>';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(
      slots()[1].querySelector('.ub__preview')?.shadowRoot?.querySelector('h1')?.textContent,
    ).toBe('Hello <world>');
    expect(el.querySelector('.ub__code')?.textContent).toContain('Hello &lt;world&gt;');
  });

  it('switches the export between HTML and CSS', async () => {
    expect(el.querySelector('.ub__code')?.textContent).toContain('class="ub-navbar');
    await click('.btn-group[aria-label="Export format"] button', 1);
    expect(el.querySelector('.ub__code')?.textContent).toContain('.ub-btn');
  });

  it('clears the canvas and shows the empty hint', async () => {
    await click('button.btn-outline-secondary', 1); // Clear
    expect(slots()).toHaveLength(0);
    expect(el.querySelector('.ub__empty')).toBeTruthy();
  });

  it('keeps preview markup out of the page so headings and landmarks do not leak', () => {
    expect(el.querySelector('h1, section, nav')).toBeNull();
    expect(slots()[1].querySelector('.ub__preview')?.shadowRoot?.querySelector('h1')).toBeTruthy();
  });

  it('keeps the interactive preview inert', () => {
    expect(el.querySelector('.ub__preview')?.hasAttribute('inert')).toBe(true);
  });
});
