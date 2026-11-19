import { TestBed } from '@angular/core/testing';
import { Profile } from '../../../models';
import { Contact } from './contact';

const PROFILE: Profile = {
  displayName: 'Ada Lovelace',
  headline: 'Engineer',
  summary: 'Summary.',
  portraitUrl: '',
  avatarUrl: '',
  resumeUrl: 'resume/ada.pdf',
  socialLinks: [
    { kind: 'email', label: 'Email', url: 'mailto:ada@example.com' },
    { kind: 'github', label: 'GitHub', url: 'https://github.com/ada' },
  ],
};

describe('Contact', () => {
  async function render(profile: Profile = PROFILE): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(Contact);
    fixture.componentRef.setInput('profile', profile);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('is the #contact section labelled by its heading', async () => {
    const element = await render();
    const headingId = element.querySelector('section#contact')?.getAttribute('aria-labelledby');

    expect(headingId).toBeTruthy();
    expect(element.querySelector(`#${headingId}`)?.tagName).toBe('H2');
  });

  it('offers every configured contact link', async () => {
    const element = await render();
    const hrefs = Array.from(element.querySelectorAll('app-social-links a')).map((a) =>
      a.getAttribute('href'),
    );

    expect(hrefs).toEqual(['mailto:ada@example.com', 'https://github.com/ada']);
  });

  it('links the resume in a new tab when one is published', async () => {
    const element = await render();
    const resume = element.querySelector<HTMLAnchorElement>('a.contact__resume');

    expect(resume?.getAttribute('href')).toBe('resume/ada.pdf');
    expect(resume?.target).toBe('_blank');
    expect(resume?.rel).toBe('noopener noreferrer');
  });

  it('hides the resume link when no resume is published', async () => {
    const element = await render({ ...PROFILE, resumeUrl: undefined });

    expect(element.querySelector('a.contact__resume')).toBeNull();
  });
});
