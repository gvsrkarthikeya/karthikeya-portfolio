import { TestBed } from '@angular/core/testing';
import { SiteFooter } from './site-footer';

describe('SiteFooter', () => {
  async function render(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(SiteFooter);
    fixture.componentRef.setInput('ownerName', 'GVSR Karthikeya');
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('does not repeat the contact links', async () => {
    const element = await render();

    expect(element.querySelector('footer a')).toBeNull();
    expect(element.querySelector('footer app-social-links')).toBeNull();
  });

  it('shows a copyright line with the current year and owner name', async () => {
    const element = await render();

    expect(element.querySelector('footer')?.textContent).toContain(
      `© ${new Date().getFullYear()} GVSR Karthikeya`,
    );
  });
});
