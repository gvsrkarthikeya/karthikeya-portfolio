import { TestBed } from '@angular/core/testing';
import { Experience as ExperienceEntry } from '../../../models';
import { Experience } from './experience';

const ENTRIES: ExperienceEntry[] = [
  { company: 'Acme', role: 'Lead', startDate: '2024-01', contributions: ['Led a team.'] },
  {
    company: 'Initech',
    role: 'Engineer',
    startDate: '2020-12',
    endDate: '2023-12',
    contributions: ['Built things.', 'Fixed things.'],
  },
];

describe('Experience', () => {
  async function render(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(Experience);
    fixture.componentRef.setInput('entries', ENTRIES);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('is the #experience section labelled by its heading', async () => {
    const element = await render();
    const headingId = element.querySelector('section#experience')?.getAttribute('aria-labelledby');

    expect(headingId).toBeTruthy();
    expect(element.querySelector(`#${headingId}`)?.tagName).toBe('H2');
  });

  it('lists each role with company in the given order', async () => {
    const element = await render();
    const items = Array.from(element.querySelectorAll('ol > li'));

    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('Lead');
    expect(items[0].textContent).toContain('Acme');
    expect(items[1].textContent).toContain('Initech');
  });

  it('shows Present for the current role and an end date for past roles', async () => {
    const element = await render();
    const dates = Array.from(element.querySelectorAll('.experience__dates')).map((d) =>
      d.textContent?.trim(),
    );

    expect(dates).toEqual(['Jan 2024 – Present', 'Dec 2020 – Dec 2023']);
  });

  it('renders every contribution as a bullet', async () => {
    const element = await render();

    expect(element.querySelectorAll('ul li').length).toBe(3);
  });
});
