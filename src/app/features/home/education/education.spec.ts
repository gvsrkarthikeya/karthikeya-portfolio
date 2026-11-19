import { TestBed } from '@angular/core/testing';
import { Certification, Education as EducationEntry } from '../../../models';
import { Education } from './education';

const DEGREES: EducationEntry[] = [
  { degree: 'M.Tech', institution: 'Uni A', startYear: 2025, endYear: 2026 },
  { degree: 'B.Tech', institution: 'Uni B', startYear: 2016, endYear: 2020, grade: '8.0 CGPA' },
];
const CERTS: Certification[] = [
  { title: 'Cert One', issuer: 'Issuer A', note: 'Topper' },
  { title: 'Cert Two', issuer: 'Issuer B' },
];

describe('Education', () => {
  async function render(certifications: Certification[] = CERTS): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(Education);
    fixture.componentRef.setInput('entries', DEGREES);
    fixture.componentRef.setInput('certifications', certifications);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('is the #education section labelled by its heading', async () => {
    const element = await render();
    const headingId = element.querySelector('section#education')?.getAttribute('aria-labelledby');

    expect(headingId).toBeTruthy();
    expect(element.querySelector(`#${headingId}`)?.tagName).toBe('H2');
  });

  it('lists degrees with institution, years and optional grade', async () => {
    const element = await render();
    const items = Array.from(element.querySelectorAll('.education__degree'));

    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('Uni A');
    expect(items[0].textContent).toContain('2025 – 2026');
    expect(items[0].textContent).not.toContain('CGPA');
    expect(items[1].textContent).toContain('8.0 CGPA');
  });

  it('lists certifications with issuer and optional note', async () => {
    const element = await render();
    const items = Array.from(element.querySelectorAll('.education__cert'));

    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('Issuer A');
    expect(items[0].textContent).toContain('Topper');
    expect(items[1].textContent).not.toContain('Topper');
  });

  it('hides the certifications block when there are none', async () => {
    const element = await render([]);

    expect(element.querySelector('.education__cert')).toBeNull();
    expect(element.querySelector('#certifications-heading')).toBeNull();
  });
});
