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
});
