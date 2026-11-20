import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) }),
    );
    sessionStorage.clear();
  });
  afterEach(() => vi.unstubAllGlobals());

  async function render(url = '/'): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl(url);
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

  it('renders the home sections on the home page', async () => {
    const element = await render();
    const ids = Array.from(element.querySelectorAll('main section')).map((s) => s.id);

    expect(ids).toEqual([
      'home',
      'about',
      'experience',
      'skills',
      'projects',
      'explore',
      'education',
      'contact',
    ]);
  });

  it.each([
    ['/github', 'github'],
    ['/lab', 'ui-lab'],
  ])('renders only the %s section on its own page', async (url, id) => {
    const element = await render(url);
    const ids = Array.from(element.querySelectorAll('main section')).map((s) => s.id);

    expect(ids).toEqual([id]);
  });

  it('redirects unknown URLs to the home page', async () => {
    await render('/nope');

    expect(TestBed.inject(Router).url).toBe('/');
  });

  it('links to the GitHub and UI Lab pages from the home page', async () => {
    const element = await render();
    const hrefs = Array.from(element.querySelectorAll('main app-explore a')).map((a) =>
      a.getAttribute('href'),
    );

    expect(hrefs).toEqual(['/github', '/lab']);
  });

  it('links home sections and pages from the header navigation', async () => {
    const element = await render();
    const hrefs = Array.from(element.querySelectorAll('nav[aria-label="Primary"] a')).map((a) =>
      a.getAttribute('href'),
    );

    expect(hrefs).toEqual([
      '/#about',
      '/#experience',
      '/#skills',
      '/#projects',
      '/#contact',
      '/github',
      '/lab',
    ]);
  });

  it('marks the current page link in the header', async () => {
    const element = await render('/github');
    const current = element.querySelector('nav[aria-label="Primary"] a[aria-current="page"]');

    expect(current?.textContent?.trim()).toBe('GitHub');
  });
});
