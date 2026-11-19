import { TestBed } from '@angular/core/testing';
import { Project } from '../../../models';
import { Projects } from './projects';

const PROJECTS: Project[] = [
  {
    title: 'Alpha',
    organization: 'Acme',
    description: 'First project.',
    contributions: ['Did a.', 'Did b.'],
    technologies: ['Angular', 'Bootstrap'],
  },
  {
    title: 'Beta',
    organization: 'Initech',
    description: 'Second project.',
    contributions: ['Did c.'],
    technologies: ['React'],
    url: 'https://example.com/beta',
  },
];

describe('Projects', () => {
  async function render(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(Projects);
    fixture.componentRef.setInput('projects', PROJECTS);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('is the #projects section labelled by its heading', async () => {
    const element = await render();
    const headingId = element.querySelector('section#projects')?.getAttribute('aria-labelledby');

    expect(headingId).toBeTruthy();
    expect(element.querySelector(`#${headingId}`)?.tagName).toBe('H2');
  });

  it('renders one card per project with organization, description and technologies', async () => {
    const element = await render();
    const cards = Array.from(element.querySelectorAll('.projects__card'));

    expect(cards.length).toBe(2);
    expect(cards[0].querySelector('h3')?.textContent?.trim()).toBe('Alpha');
    expect(cards[0].textContent).toContain('Acme');
    expect(cards[0].textContent).toContain('First project.');
    expect(cards[0].querySelectorAll('.projects__tech li').length).toBe(2);
    expect(cards[0].querySelectorAll('ul:not(.projects__tech) li').length).toBe(2);
  });

  it('only shows a link when a verified project url exists', async () => {
    const element = await render();
    const cards = Array.from(element.querySelectorAll('.projects__card'));
    const link = cards[1].querySelector<HTMLAnchorElement>('a.projects__link');

    expect(cards[0].querySelector('a')).toBeNull();
    expect(link?.getAttribute('href')).toBe('https://example.com/beta');
    expect(link?.target).toBe('_blank');
    expect(link?.rel).toBe('noopener noreferrer');
  });
});
