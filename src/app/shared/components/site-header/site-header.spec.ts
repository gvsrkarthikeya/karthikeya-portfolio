import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SiteHeader } from './site-header';

describe('SiteHeader', () => {
  let fixture: ComponentFixture<SiteHeader>;
  let element: HTMLElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(SiteHeader);
    fixture.componentRef.setInput('brand', 'GVSR Karthikeya');
    fixture.componentRef.setInput('navItems', [{ label: 'About', fragment: 'about' }]);
    await fixture.whenStable();
    element = fixture.nativeElement as HTMLElement;
  });

  function toggle(): HTMLButtonElement {
    return element.querySelector<HTMLButtonElement>('button.site-header__toggle')!;
  }

  function menu(): Element | null {
    return element.querySelector(`#${toggle().getAttribute('aria-controls')}`);
  }

  it('renders the brand inside a banner header', () => {
    expect(element.querySelector('header')?.textContent).toContain('GVSR Karthikeya');
  });

  it('renders section navigation with fragment links', () => {
    const link = element.querySelector('nav[aria-label="Primary"] a');

    expect(link?.getAttribute('href')).toBe('#about');
    expect(link?.textContent?.trim()).toBe('About');
  });

  it('links the brand to the home section', () => {
    expect(element.querySelector('a.navbar-brand')?.getAttribute('href')).toBe('#home');
  });

  it('keeps the inline menu for large screens only', () => {
    expect(element.querySelector('.navbar')?.classList).toContain('navbar-expand-lg');
    expect(element.querySelector('.navbar')?.classList).not.toContain('navbar-expand-md');
  });

  it('starts with the mobile menu collapsed', () => {
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
    expect(menu()?.classList).not.toContain('show');
  });

  it('expands and collapses the mobile menu from the toggle button', async () => {
    toggle().click();
    await fixture.whenStable();

    expect(toggle().getAttribute('aria-expanded')).toBe('true');
    expect(menu()?.classList).toContain('show');

    toggle().click();
    await fixture.whenStable();

    expect(toggle().getAttribute('aria-expanded')).toBe('false');
  });

  it('collapses the menu after a navigation link is chosen', async () => {
    toggle().click();
    await fixture.whenStable();

    element.querySelector<HTMLAnchorElement>('nav a')!.click();
    await fixture.whenStable();

    expect(toggle().getAttribute('aria-expanded')).toBe('false');
  });
});
