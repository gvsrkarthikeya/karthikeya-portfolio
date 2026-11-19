import { TestBed } from '@angular/core/testing';
import { SkillGroup } from '../../../models';
import { Skills } from './skills';

const GROUPS: SkillGroup[] = [
  { title: 'Frontend', skills: [{ name: 'Angular' }, { name: 'React' }] },
  { title: 'Backend', skills: [{ name: 'Node.js' }] },
];

describe('Skills', () => {
  async function render(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(Skills);
    fixture.componentRef.setInput('groups', GROUPS);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('is the #skills section labelled by its heading', async () => {
    const element = await render();
    const headingId = element.querySelector('section#skills')?.getAttribute('aria-labelledby');

    expect(headingId).toBeTruthy();
    expect(element.querySelector(`#${headingId}`)?.tagName).toBe('H2');
  });

  it('renders one titled card per group with its skills', async () => {
    const element = await render();
    const cards = Array.from(element.querySelectorAll('.skills__group'));

    expect(cards.map((c) => c.querySelector('h3')?.textContent?.trim())).toEqual([
      'Frontend',
      'Backend',
    ]);
    expect(Array.from(cards[0].querySelectorAll('li')).map((li) => li.textContent?.trim())).toEqual(
      ['Angular', 'React'],
    );
  });

  it('does not invent proficiency levels', async () => {
    const element = await render();

    expect(element.querySelector('progress, [role="progressbar"], .skills__level')).toBeNull();
  });
});
