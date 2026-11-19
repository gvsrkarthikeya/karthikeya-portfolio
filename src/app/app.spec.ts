import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  async function render(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('composes header, main content and footer in order', async () => {
    const element = await render();
    const regions = Array.from(element.querySelectorAll('app-site-header, main, app-site-footer'));

    expect(regions.map((node) => node.tagName.toLowerCase())).toEqual([
      'app-site-header',
      'main',
      'app-site-footer',
    ]);
  });

  it('provides a skip link that targets the main content', async () => {
    const element = await render();

    expect(element.querySelector('a.skip-link')?.getAttribute('href')).toBe('#main-content');
    expect(element.querySelector('main#main-content')).toBeTruthy();
  });

  it('renders the owner profile from portfolio data', async () => {
    const element = await render();

    expect(element.querySelector('header')?.textContent).toContain('GVSR Karthikeya');
    expect(element.querySelector('main app-hero h1')?.textContent?.trim()).toBe('GVSR Karthikeya');
    expect(element.querySelector('main a.hero__cta-resume')?.getAttribute('href')).toBe(
      'resume/Karthikeya_Resume.pdf',
    );
  });
});
