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

  it('insets its content from the background edges by more than the row gutter', async () => {
    const section = (await render()).querySelector('section#home')!;

    expect(section.classList).toContain('px-4');
    expect(section.classList).toContain('px-lg-5');
  });

  it('shows the avatar photo with descriptive alt text when one is set', async () => {
    const element = await render({ ...PROFILE, avatarUrl: 'images/ada.webp' });
    const photo = element.querySelector<HTMLImageElement>('img.hero__photo');

    expect(photo?.getAttribute('src')).toBe('images/ada.webp');
    expect(photo?.alt).toBe('Portrait of Ada Lovelace');
    expect(photo?.getAttribute('width')).toBe('224');
    expect(photo?.getAttribute('height')).toBe('224');
    expect(element.querySelector('.hero__initials')).toBeNull();
  });

  it('falls back to initials when the avatar photo fails to load', async () => {
    const fixture = TestBed.createComponent(Hero);
    fixture.componentRef.setInput('profile', { ...PROFILE, avatarUrl: 'images/missing.webp' });
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    element.querySelector('img.hero__photo')!.dispatchEvent(new Event('error'));
    await fixture.whenStable();

    expect(element.querySelector('img.hero__photo')).toBeNull();
    expect(element.querySelector('.hero__initials')?.textContent?.trim()).toBe('AL');
  });

  describe('profile photo interactions', () => {
    // jsdom does not implement modal dialogs yet.
    beforeAll(() => {
      const proto = HTMLDialogElement.prototype;
      proto.showModal ??= function (this: HTMLDialogElement) {
        this.open = true;
      };
      proto.close ??= function (this: HTMLDialogElement) {
        this.open = false;
      };
    });

    async function renderWithPhoto() {
      const fixture = TestBed.createComponent(Hero);
      fixture.componentRef.setInput('profile', { ...PROFILE, avatarUrl: 'images/ada.webp' });
      await fixture.whenStable();
      return { fixture, element: fixture.nativeElement as HTMLElement };
    }

    it('does not rotate the photo to follow the cursor', async () => {
      const { fixture, element } = await renderWithPhoto();
      const trigger = element.querySelector<HTMLElement>('.hero__photo-trigger')!;

      trigger.dispatchEvent(new MouseEvent('mousemove', { clientX: 5, clientY: 5, bubbles: true }));
      await fixture.whenStable();

      expect(element.querySelector<HTMLElement>('img.hero__photo')!.style.transform).toBe('');
    });

    it('opens an enlarged photo in a labelled dialog when clicked', async () => {
      const { fixture, element } = await renderWithPhoto();
      const trigger = element.querySelector<HTMLButtonElement>('button.hero__photo-trigger')!;

      expect(trigger.getAttribute('aria-label')).toBe('Enlarge photo of Ada Lovelace');
      trigger.click();
      await fixture.whenStable();

      const dialog = element.querySelector<HTMLDialogElement>('dialog.hero__lightbox')!;
      expect(dialog.open).toBe(true);
      expect(dialog.getAttribute('aria-label')).toBe('Photo of Ada Lovelace');
      expect(dialog.querySelector('img')?.getAttribute('src')).toBe('images/ada.webp');
    });

    it('closes the enlarged photo from its close button', async () => {
      const { fixture, element } = await renderWithPhoto();
      element.querySelector<HTMLButtonElement>('button.hero__photo-trigger')!.click();
      await fixture.whenStable();

      element.querySelector<HTMLButtonElement>('.hero__lightbox-close')!.click();
      await fixture.whenStable();

      expect(element.querySelector<HTMLDialogElement>('dialog.hero__lightbox')!.open).toBe(false);
    });
  });
});
