import { TestBed } from '@angular/core/testing';
import { STORAGE_KEY, deserialize, serialize } from './builder-storage';
import { renderPage } from './builder-render';
import { UiBuilder } from './ui-builder';
import { createNode } from './builder-tree';

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

  describe('history, shortcuts, device preview and persistence', () => {
    const key = async (k: string, init: KeyboardEventInit = {}, target?: EventTarget) => {
      (target ?? el.querySelector('.ub')!).dispatchEvent(
        new KeyboardEvent('keydown', {
          key: k,
          bubbles: true,
          composed: true,
          cancelable: true,
          ...init,
        }),
      );
      await settle();
    };
    const press = async (label: string) => {
      el.querySelector<HTMLElement>(`button[aria-label="${label}"]`)!.click();
      await settle();
    };
    const badges = () => page().querySelectorAll('.ub-badge').length;

    it('undoes an insert with Cmd/Ctrl+Z and redoes with Shift+Z', async () => {
      await clickPalette('Badge');
      expect(badges()).toBe(1);
      await key('z', { metaKey: true });
      expect(badges()).toBe(0);
      await key('z', { metaKey: true, shiftKey: true });
      expect(badges()).toBe(1);
      await key('z', { ctrlKey: true });
      expect(badges()).toBe(0);
      expect(status()).toContain('Undid');
    });

    it('offers Undo and Redo buttons with disabled states', async () => {
      const undoBtn = () => el.querySelector<HTMLButtonElement>('button[aria-label="Undo"]')!;
      expect(undoBtn().disabled).toBe(true);
      await clickPalette('Badge');
      expect(undoBtn().disabled).toBe(false);
      await press('Undo');
      expect(el.querySelector<HTMLButtonElement>('button[aria-label="Redo"]')!.disabled).toBe(
        false,
      );
    });

    it('clears the selection when undo removes the selected node', async () => {
      await clickPalette('Badge');
      await key('z', { metaKey: true });
      expect(el.textContent).toContain('Select a component');
    });

    it('deletes the selection with Delete and duplicates with Cmd+D', async () => {
      await clickNode('h1');
      await key('d', { metaKey: true });
      expect(page().querySelectorAll('h1')).toHaveLength(2);
      await key('Delete');
      expect(page().querySelectorAll('h1')).toHaveLength(1);
    });

    it('does not run shortcuts while typing in a properties input', async () => {
      await clickNode('h1');
      const input = el.querySelector<HTMLInputElement>('.ub__props [data-prop="text"]')!;
      await key('Delete', {}, input);
      await key('z', { metaKey: true }, input);
      await key('d', { metaKey: true }, input);
      expect(page().querySelectorAll('h1')).toHaveLength(1);
      expect(el.textContent).toContain('Editing: Heading');
    });

    it('switches device preview widths and reports the pressed state', async () => {
      const canvas = () => el.querySelector<HTMLElement>('.ub__canvas')!;
      const btn = (name: string) =>
        el.querySelector<HTMLButtonElement>(
          `[aria-label="Device preview"] button[aria-label="${name}"]`,
        )!;
      expect(canvas().style.width).toBe('100%');
      expect(btn('Desktop').getAttribute('aria-pressed')).toBe('true');
      btn('Tablet').click();
      await settle();
      expect(canvas().style.width).toBe('768px');
      btn('Mobile').click();
      await settle();
      expect(canvas().style.width).toBe('375px');
      expect(btn('Mobile').getAttribute('aria-pressed')).toBe('true');
      expect(btn('Desktop').getAttribute('aria-pressed')).toBe('false');
    });

    it('exports exactly the non-editor render of the page', async () => {
      await clickPalette('Pricing card');
      expect(code()).toBe(renderPage(cmp['root'](), { editor: false }));
      expect(code()).not.toContain('data-ub');
    });

    it('switches the export between HTML and CSS', async () => {
      el.querySelectorAll<HTMLElement>('[aria-label="Export format"] button')[1].click();
      await settle();
      expect(code()).toContain('.ub-btn');
    });

    it('autosaves to localStorage after a change', async () => {
      await clickPalette('Badge');
      const saved = deserialize(localStorage.getItem(STORAGE_KEY));
      expect(saved).toEqual(cmp['root']());
    });

    it('restores a saved page on load', async () => {
      localStorage.setItem(
        STORAGE_KEY,
        serialize(createNode('section', {}, [createNode('badge', { text: 'Saved' })])),
      );
      const again = TestBed.createComponent(UiBuilder);
      await again.whenStable();
      const shadow = again.nativeElement.querySelector('.ub__canvas').shadowRoot as ShadowRoot;
      expect(shadow.textContent).toContain('Saved');
    });

    it('falls back to the starter page when stored JSON is corrupt', async () => {
      localStorage.setItem(STORAGE_KEY, '{bad json');
      const again = TestBed.createComponent(UiBuilder);
      await again.whenStable();
      const shadow = again.nativeElement.querySelector('.ub__canvas').shadowRoot as ShadowRoot;
      expect(shadow.querySelector('h1')).toBeTruthy();
    });

    it('resets to the starter page and the reset can be undone', async () => {
      await clickPalette('Badge');
      await press('Reset');
      expect(badges()).toBe(0);
      expect(page().querySelector('h1')).toBeTruthy();
      await press('Undo');
      expect(badges()).toBe(1);
    });

    it('coalesces typing in a text field into one undo step per focus', async () => {
      await clickNode('h1');
      const original = page().querySelector('h1')!.textContent;
      const input = el.querySelector<HTMLInputElement>('.ub__props [data-prop="text"]')!;
      input.dispatchEvent(new Event('focus'));
      for (const v of ['a', 'ab', 'abc']) {
        input.value = v;
        input.dispatchEvent(new Event('input'));
        await settle();
      }
      expect(page().querySelector('h1')!.textContent).toBe('abc');
      await press('Undo');
      expect(page().querySelector('h1')!.textContent).toBe(original);
    });

    it('announces actions in the live region', async () => {
      await press('Reset');
      expect(status()).toContain('reset');
      await press('Undo');
      expect(status().length).toBeGreaterThan(0);
    });
  });
});
