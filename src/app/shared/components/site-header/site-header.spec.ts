import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { SiteHeader } from './site-header';

describe('SiteHeader', () => {
  let fixture: ComponentFixture<SiteHeader>;
  let element: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    fixture = TestBed.createComponent(SiteHeader);
    fixture.componentRef.setInput('brand', 'GVSR Karthikeya');
    fixture.componentRef.setInput('navItems', [
      { label: 'About', path: '', fragment: 'about' },
      { label: 'GitHub', path: 'github' },
    ]);
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

  it('renders navigation links for home sections and separate pages', () => {
    const links = Array.from(element.querySelectorAll('nav[aria-label="Primary"] a'));

    expect(links.map((a) => a.getAttribute('href'))).toEqual(['/#about', '/github']);
    expect(links.map((a) => a.textContent?.trim())).toEqual(['About', 'GitHub']);
  });

  it('links the brand to the home page', () => {
    expect(element.querySelector('a.navbar-brand')?.getAttribute('href')).toBe('/');
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

  it('projects appearance controls inside the collapsible menu', () => {
    @Component({
      imports: [SiteHeader],
      template: `<app-site-header brand="X" [navItems]="[]"
        ><button id="ctl">c</button></app-site-header
      >`,
    })
    class Host {}

    const host = TestBed.createComponent(Host);
    const control = (host.nativeElement as HTMLElement).querySelector('#ctl');

    expect(control?.closest('#primary-menu')).not.toBeNull();
  });

  it('projects headerAction content outside the collapsible menu', () => {
    @Component({
      imports: [SiteHeader],
      template: `<app-site-header brand="X" [navItems]="[]">
        <button headerAction id="act">a</button>
        <button id="ctl">c</button>
      </app-site-header>`,
    })
    class Host {}

    const root = TestBed.createComponent(Host).nativeElement as HTMLElement;

    expect(root.querySelector('#act')).not.toBeNull();
    expect(root.querySelector('#act')?.closest('#primary-menu')).toBeNull();
    expect(root.querySelector('#ctl')?.closest('#primary-menu')).not.toBeNull();
  });
});
