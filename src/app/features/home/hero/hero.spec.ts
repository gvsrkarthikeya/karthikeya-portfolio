import { TestBed } from '@angular/core/testing';
import { Profile } from '../../../models';
import { Hero } from './hero';

const PROFILE: Profile = {
  displayName: 'Ada Lovelace',
  headline: 'Analytical Engine Programmer',
  summary: 'Wrote the first published algorithm.',
  portraitUrl: '',
  avatarUrl: '',
  resumeUrl: 'resume/ada.pdf',
  socialLinks: [
    { kind: 'email', label: 'Email', url: 'mailto:ada@example.com' },
    { kind: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/ada/' },
  ],
};

describe('Hero', () => {
  async function render(profile: Profile = PROFILE): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(Hero);
    fixture.componentRef.setInput('profile', profile);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the name as the page heading with headline and summary', async () => {
    const element = await render();

    expect(element.querySelector('h1')?.textContent?.trim()).toBe('Ada Lovelace');
    expect(element.textContent).toContain('Analytical Engine Programmer');
    expect(element.textContent).toContain('Wrote the first published algorithm.');
  });

  it('is the #home section labelled by its heading', async () => {
    const element = await render();
    const headingId = element.querySelector('section#home')?.getAttribute('aria-labelledby');

    expect(headingId).toBeTruthy();
    expect(element.querySelector(`#${headingId}`)?.tagName).toBe('H1');
  });

  it('shows initials as a decorative avatar while no portrait exists', async () => {
    const element = await render();
    const avatar = element.querySelector('.hero__initials');

    expect(avatar?.textContent?.trim()).toBe('AL');
    expect(avatar?.getAttribute('aria-hidden')).toBe('true');
  });

  it('offers an email call to action from the email social link', async () => {
    const element = await render();

    expect(element.querySelector('a.hero__cta-email')?.getAttribute('href')).toBe(
      'mailto:ada@example.com',
    );
  });

  it('links to the LinkedIn profile in a new tab', async () => {
    const element = await render();
    const linkedin = element.querySelector<HTMLAnchorElement>('a.hero__cta-linkedin');

    expect(linkedin?.getAttribute('href')).toBe('https://www.linkedin.com/in/ada/');
    expect(linkedin?.target).toBe('_blank');
    expect(linkedin?.rel).toBe('noopener noreferrer');
  });

  it('offers a resume download that opens in a new tab', async () => {
    const element = await render();
    const resume = element.querySelector<HTMLAnchorElement>('a.hero__cta-resume');

    expect(resume?.getAttribute('href')).toBe('resume/ada.pdf');
    expect(resume?.target).toBe('_blank');
    expect(resume?.rel).toBe('noopener noreferrer');
  });

  it('hides the resume action when no resume is published', async () => {
    const element = await render({ ...PROFILE, resumeUrl: undefined });

    expect(element.querySelector('a.hero__cta-resume')).toBeNull();
  });

  it('shows a decorative icon and a short label on every call to action', async () => {
    const element = await render();
    const expected = { email: 'Email', resume: 'Resume', linkedin: 'LinkedIn' };

    for (const [name, label] of Object.entries(expected)) {
      const cta = element.querySelector(`a.hero__cta-${name}`);

      expect(cta?.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
      expect(cta?.querySelector('.hero__cta-label')?.textContent?.trim()).toBe(label);
    }
  });
});
