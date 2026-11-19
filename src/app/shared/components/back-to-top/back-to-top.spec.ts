import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackToTop } from './back-to-top';

describe('BackToTop', () => {
  let fixture: ComponentFixture<BackToTop>;
  let scrollToSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 });
    setScrollY(0);
    fixture = TestBed.createComponent(BackToTop);
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function setScrollY(value: number): void {
    Object.defineProperty(window, 'scrollY', { configurable: true, value });
  }

  async function scrollPage(value: number): Promise<void> {
    setScrollY(value);
    window.dispatchEvent(new Event('scroll'));
    await fixture.whenStable();
  }

  function button(): HTMLButtonElement | null {
    return (fixture.nativeElement as HTMLElement).querySelector('button');
  }

  it('is not rendered at the top of the page', () => {
    expect(button()).toBeNull();
  });

  it('stays hidden until the visitor has scrolled about one screen', async () => {
    await scrollPage(799);

    expect(button()).toBeNull();
  });

  it('appears with an accessible name after scrolling past one screen', async () => {
    await scrollPage(801);

    expect(button()).not.toBeNull();
    expect(button()!.getAttribute('aria-label')).toBe('Back to top');
    expect(button()!.getAttribute('type')).toBe('button');
  });

  it('hides again when scrolled back near the top', async () => {
    await scrollPage(1200);
    await scrollPage(10);

    expect(button()).toBeNull();
  });

  it('scrolls to the top on click', async () => {
    await scrollPage(1200);

    button()!.click();

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0 });
  });

  it('clears the section hash so the URL returns to the page root', async () => {
    window.history.replaceState(null, '', '/#contact');
    await scrollPage(1000);

    button()!.click();

    expect(window.location.hash).toBe('');
    expect(window.location.pathname).toBe('/');
  });

  it('stops listening once destroyed', async () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    fixture.destroy();

    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});
