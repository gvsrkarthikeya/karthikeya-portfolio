import { TestBed } from '@angular/core/testing';
import { Experience, SkillGroup } from '../../../models';
import { About } from './about';

const EXPERIENCE: Experience[] = [
  { company: 'Acme', role: 'Lead', startDate: '2024-01', contributions: [] },
  {
    company: 'Initech',
    role: 'Engineer',
    startDate: '2020-12',
    endDate: '2023-12',
    contributions: [],
  },
];
const GROUPS: SkillGroup[] = [
  { title: 'Frontend', skills: [{ name: 'Angular' }, { name: 'React' }, { name: 'TypeScript' }] },
  { title: 'Backend', skills: [{ name: 'Node.js' }] },
];

describe('About', () => {
  async function render(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(About);
    fixture.componentRef.setInput('experience', EXPERIENCE);
    fixture.componentRef.setInput('skillGroups', GROUPS);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  function facts(element: HTMLElement): Record<string, string> {
    const result: Record<string, string> = {};
    element.querySelectorAll('dl > div').forEach((row) => {
      result[row.querySelector('dt')!.textContent!.trim()] = row
        .querySelector('dd')!
        .textContent!.trim();
    });
    return result;
  }

  it('is the #about section labelled by its heading', async () => {
    const element = await render();
    const headingId = element.querySelector('section#about')?.getAttribute('aria-labelledby');

    expect(headingId).toBeTruthy();
    expect(element.querySelector(`#${headingId}`)?.tagName).toBe('H2');
  });

  it('derives the at-a-glance facts from experience and skills', async () => {
    const element = await render();

    expect(facts(element)).toEqual({
      'Current role': 'Lead at Acme',
      'Working since': 'Dec 2020',
      Companies: 'Acme, Initech',
      'Core stack': 'Angular, React, TypeScript',
    });
  });
});
