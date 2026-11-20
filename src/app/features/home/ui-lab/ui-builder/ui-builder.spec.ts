import { TestBed } from '@angular/core/testing';
import { UiBuilder } from './ui-builder';

describe('UiBuilder', () => {
  let el: HTMLElement;
  let fixture: ReturnType<typeof TestBed.createComponent<UiBuilder>>;
  let cmp: UiBuilder;

  const page = () => el.querySelector<HTMLElement>('.ub__canvas')!.shadowRoot!;
  const idOf = (selector: string) => page().querySelector(selector)!.getAttribute('data-ub-id')!;
  const code = () => el.querySelector('.ub__code')?.textContent ?? '';
  const status = () => el.querySelector('[role="status"]')?.textContent ?? '';
  const settle = () => fixture.whenStable();
  const clickPalette = async (label: string) => {
    el.querySelector<HTMLElement>(`button[aria-label="Add ${label}"]`)!.click();
    await settle();
  };
  const clickNode = async (selector: string) => {
    page().querySelector<HTMLElement>(selector)!.click();
    await settle();
  };

  beforeEach(async () => {
    localStorage.clear();
    fixture = TestBed.createComponent(UiBuilder);
    el = fixture.nativeElement;
    cmp = fixture.componentInstance;
    await settle();
  });

  it('renders the starter page inside a shadow root, keeping headings out of the page', () => {
    expect(el.querySelector('h1, section')).toBeNull();
    expect(page().querySelector('h1')).toBeTruthy();
  });

  it('selects a node when it is clicked inside the shadow root', async () => {
    await clickNode('h1');
    expect(el.textContent).toContain('Editing: Heading');
  });

  it('inserts a palette component inside the selected container', async () => {
    await clickPalette('Card');
    await clickPalette('Button');
    expect(page().querySelector('.ub-card .ub-btn')).toBeTruthy();
  });

  it('appends to the root when nothing is selected', async () => {
    await clickPalette('Badge');
    expect(page().querySelector('.ub-section > .ub-badge')).toBeTruthy();
    expect(status()).toContain('Badge added');
  });

  it('nests a dropped button inside a card via dropAt', async () => {
    await clickPalette('Card');
    const cardId = idOf('.ub-card');
    cmp.dropAt(cardId, 0, { kind: 'new', type: 'button' });
    await settle();
    expect(page().querySelector('.ub-card .ub-btn')).toBeTruthy();
  });

  it('rejects dropping a container into its own descendant and keeps the tree', async () => {
    await clickPalette('Card');
    const cardId = idOf('.ub-card');
    cmp.dropAt(cardId, 0, { kind: 'new', type: 'stack' });
    await settle();
    const before = code();
    const innerId = page().querySelector('.ub-card .ub-stack')!.getAttribute('data-ub-id')!;
    cmp.dropAt(innerId, 0, { kind: 'move', id: cardId });
    await settle();
    expect(code()).toBe(before);
    expect(status()).toContain("can't");
  });

  it('inserts a preset subtree', async () => {
    await clickPalette('Pricing card');
    expect(page().querySelector('.ub-card .ub-btn')).toBeTruthy();
  });

  describe('properties and layers', () => {
    const control = (key: string) =>
      el.querySelector<HTMLElement>(`.ub__props [data-prop="${key}"]`)!;
    const press = async (label: string) => {
      el.querySelector<HTMLElement>(`button[aria-label="${label}"]`)!.click();
      await settle();
    };

    it('shows controls for exactly the button schema when a button is selected', async () => {
      await clickNode('.ub-btn');
      const keys = Array.from(el.querySelectorAll<HTMLElement>('.ub__props [data-prop]')).map(
        (c) => c.dataset['prop'],
      );
      expect(keys).toEqual([
        'label',
        'variant',
        'tone',
        'size',
        'fullWidth',
        'disabled',
        'icon',
        'iconPosition',
        'href',
      ]);
    });

    it('renders toggles as switches and selects with their options', async () => {
      await clickNode('.ub-btn');
      expect(control('fullWidth').getAttribute('role')).toBe('switch');
      expect(control('variant').querySelectorAll('option')).toHaveLength(4);
    });

    it('updates the exported class when the variant changes', async () => {
      await clickNode('.ub-btn');
      const select = control('variant') as HTMLSelectElement;
      select.value = 'outline';
      select.dispatchEvent(new Event('change'));
      await settle();
      expect(code()).toContain('ub-btn--outline');
    });

    it('updates text props as the user types', async () => {
      await clickNode('h1');
      const input = control('text') as HTMLInputElement;
      input.value = 'Hello <b>';
      input.dispatchEvent(new Event('input'));
      await settle();
      expect(page().querySelector('h1')?.textContent).toBe('Hello <b>');
      expect(code()).toContain('Hello &lt;b&gt;');
    });

    it('lists layers with indentation levels and selects on click', async () => {
      const items = Array.from(el.querySelectorAll<HTMLElement>('[role="tree"] [role="treeitem"]'));
      expect(items).toHaveLength(5);
      expect(items.map((i) => i.getAttribute('aria-level'))).toEqual(['1', '2', '3', '3', '3']);
      items[2].click();
      await settle();
      expect(el.textContent).toContain('Editing: Heading');
      expect(el.querySelectorAll('[role="treeitem"][aria-selected="true"]')).toHaveLength(1);
    });

    it('removing a selected container clears selection and drops its children', async () => {
      await clickPalette('Card');
      await clickPalette('Button');
      await clickNode('.ub-card');
      await press('Delete');
      expect(page().querySelector('.ub-card')).toBeNull();
      expect(page().querySelectorAll('.ub-btn')).toHaveLength(1);
      expect(el.textContent).toContain('Select a component');
    });

    it('duplicates the selection as a sibling', async () => {
      await clickNode('h1');
      await press('Duplicate');
      expect(page().querySelectorAll('h1')).toHaveLength(2);
    });

    it('moves the selection up and down among its siblings', async () => {
      await clickNode('.ub-text');
      await press('Move up');
      const order = Array.from(page().querySelectorAll('.ub-stack > *')).map((n) => n.tagName);
      expect(order).toEqual(['P', 'H1', 'BUTTON']);
      await press('Move down');
      await press('Move down');
      expect(page().querySelector('.ub-stack')!.lastElementChild!.tagName).toBe('P');
    });

    it('does not offer delete, duplicate or move for the root', async () => {
      el.querySelector<HTMLElement>('[role="treeitem"]')!.click();
      await settle();
      for (const label of ['Delete', 'Duplicate', 'Move up', 'Move down']) {
        expect(el.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)!.disabled).toBe(
          true,
        );
      }
    });
  });
});
