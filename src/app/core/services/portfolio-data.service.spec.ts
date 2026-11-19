import { TestBed } from '@angular/core/testing';
import { PortfolioDataService } from './portfolio-data.service';

describe('PortfolioDataService', () => {
  let service: PortfolioDataService;

  beforeEach(() => {
    service = TestBed.inject(PortfolioDataService);
  });

  it('exposes the owner profile from the resume', () => {
    const { profile } = service.content;

    expect(profile.displayName).toBe('GVSR Karthikeya');
    expect(profile.headline).toContain('Senior UI Engineer');
  });

  it('links to the published resume with a relative path', () => {
    expect(service.content.profile.resumeUrl).toBe('resume/Karthikeya_Resume.pdf');
  });

  it('provides email, LinkedIn and GitHub links', () => {
    const urls = service.content.profile.socialLinks.map((link) => link.url);

    expect(urls).toEqual([
      'mailto:gvsrkarthikeya@gmail.com',
      'https://www.linkedin.com/in/gvsr-karthikeya-a251b91a4/',
      'https://github.com/gvsrkarthikeya',
    ]);
  });

  it('lists experience with the current role first', () => {
    const [current, ...previous] = service.content.experience;

    expect(current.company).toBe('Teradata');
    expect(current.endDate).toBeUndefined();
    expect(previous.every((role) => role.endDate !== undefined)).toBe(true);
  });

  it('never publishes a phone number', () => {
    const serialized = JSON.stringify(service.content);

    expect(serialized).not.toMatch(/\+\d{2}/);
    expect(serialized).not.toMatch(/\d{10}/);
    expect(serialized).not.toMatch(/tel:/i);
  });

  it('does not invent skill proficiency levels the resume does not state', () => {
    const skills = service.content.skillGroups.flatMap((group) => group.skills);

    expect(skills.length).toBeGreaterThan(0);
    expect(skills.every((skill) => skill.proficiency === undefined)).toBe(true);
  });
});
