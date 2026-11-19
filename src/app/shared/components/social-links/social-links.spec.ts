import { TestBed } from '@angular/core/testing';
import { SocialLink } from '../../../models';
import { SocialLinks } from './social-links';

const LINKS: SocialLink[] = [
  { kind: 'email', label: 'Email', url: 'mailto:someone@example.com' },
  { kind: 'github', label: 'GitHub', url: 'https://github.com/example' },
];

describe('SocialLinks', () => {
  async function render(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(SocialLinks);
    fixture.componentRef.setInput('links', LINKS);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders one labelled link per entry inside a list', async () => {
    const element = await render();
    const anchors = Array.from(element.querySelectorAll('ul li a'));

    expect(anchors.map((a) => a.getAttribute('href'))).toEqual([
      'mailto:someone@example.com',
      'https://github.com/example',
    ]);
    expect(anchors.map((a) => a.textContent?.trim())).toEqual(['Email', 'GitHub']);
  });

  it('opens external links in a new tab safely', async () => {
    const element = await render();
    const github = element.querySelector<HTMLAnchorElement>('a[href^="https://"]');

    expect(github?.target).toBe('_blank');
    expect(github?.rel).toBe('noopener noreferrer');
    expect(github?.getAttribute('aria-label')).toBe('GitHub (opens in a new tab)');
  });

  it('keeps mailto links in the same tab', async () => {
    const element = await render();
    const email = element.querySelector<HTMLAnchorElement>('a[href^="mailto:"]');

    expect(email?.hasAttribute('target')).toBe(false);
    expect(email?.hasAttribute('aria-label')).toBe(false);
  });

  it('pairs each link with a decorative icon and a text label', async () => {
    const element = await render();

    for (const anchor of Array.from(element.querySelectorAll('ul li a'))) {
      expect(anchor.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
      expect(anchor.querySelector('.social-links__label')?.textContent?.trim()).toBeTruthy();
    }
  });
});
