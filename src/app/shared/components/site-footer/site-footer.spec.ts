import { TestBed } from '@angular/core/testing';
import { SiteFooter } from './site-footer';

describe('SiteFooter', () => {
  async function render(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(SiteFooter);
    fixture.componentRef.setInput('ownerName', 'GVSR Karthikeya');
    fixture.componentRef.setInput('links', [
      { kind: 'email', label: 'Email', url: 'mailto:someone@example.com' },
    ]);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the social links inside the footer', async () => {
    const element = await render();

    expect(element.querySelector('footer app-social-links a')?.getAttribute('href')).toBe(
      'mailto:someone@example.com',
    );
  });

  it('shows a copyright line with the current year and owner name', async () => {
    const element = await render();

    expect(element.querySelector('footer')?.textContent).toContain(
      `© ${new Date().getFullYear()} GVSR Karthikeya`,
    );
  });
});
