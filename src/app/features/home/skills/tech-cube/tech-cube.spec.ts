import { TestBed } from '@angular/core/testing';
import { TechCube } from './tech-cube';

describe('TechCube', () => {
  async function render(groups: { title: string; skills: { name: string }[] }[]) {
    const fixture = TestBed.createComponent(TechCube);
    fixture.componentRef.setInput('groups', groups);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders one face per group and is hidden from assistive tech', async () => {
    const el = await render([
      { title: 'Frontend', skills: [{ name: 'Angular' }, { name: 'React' }] },
      { title: 'Backend', skills: [{ name: 'Node.js' }] },
      { title: 'Tools', skills: [{ name: 'Git' }] },
      { title: 'Languages', skills: [{ name: 'Java' }] },
    ]);
    const faces = el.querySelectorAll('.cube__face');
    expect(faces).toHaveLength(4);
    expect(el.querySelector('.cube')?.getAttribute('aria-hidden')).toBe('true');
    expect(faces[1].getAttribute('style')).toContain('rotateY(90deg)');
  });

  it('caps faces at eight and skills per face at six', async () => {
    const groups = Array.from({ length: 10 }, (_, i) => ({
      title: `G${i}`,
      skills: Array.from({ length: 9 }, (_, j) => ({ name: `s${j}` })),
    }));
    const el = await render(groups);
    expect(el.querySelectorAll('.cube__face')).toHaveLength(8);
    expect(el.querySelectorAll('.cube__face')[0].querySelectorAll('li')).toHaveLength(6);
  });

  it('has an accessible reset button', async () => {
    const el = await render([
      { title: 'A', skills: [{ name: 'x' }] },
      { title: 'B', skills: [{ name: 'y' }] },
      { title: 'C', skills: [{ name: 'z' }] },
    ]);
    const btn = el.querySelector<HTMLButtonElement>('.cube__reset');
    expect(btn?.getAttribute('aria-label')).toBe('Reset cube rotation');
    expect(() => btn?.click()).not.toThrow();
  });
});
