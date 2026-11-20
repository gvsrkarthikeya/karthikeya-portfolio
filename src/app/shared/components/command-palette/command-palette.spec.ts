import { TestBed } from '@angular/core/testing';
import { CommandPaletteService } from '../../../core/services/command-palette.service';
import { PortfolioDataService } from '../../../core/services/portfolio-data.service';
import { CommandPalette } from './command-palette';

describe('CommandPalette', () => {
  function setup() {
    localStorage.clear();
    const fixture = TestBed.createComponent(CommandPalette);
    const content = TestBed.inject(PortfolioDataService).content;
    fixture.componentRef.setInput('navItems', [{ label: 'Skills', fragment: 'skills' }]);
    fixture.componentRef.setInput('profile', content.profile);
    return {
      fixture,
      el: fixture.nativeElement as HTMLElement,
      service: TestBed.inject(CommandPaletteService),
    };
  }

  it('is hidden until opened', async () => {
    const { fixture, el } = setup();
    await fixture.whenStable();
    expect(el.querySelector('[role=dialog]')).toBeNull();
  });

  it('opens with Ctrl+K and lists commands', async () => {
    const { fixture, el } = setup();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
    await fixture.whenStable();
    expect(el.querySelector('[role=dialog]')).toBeTruthy();
    expect(el.textContent).toContain('Go to Skills');
  });

  it('filters by query and closes on Escape', async () => {
    const { fixture, el, service } = setup();
    service.show();
    await fixture.whenStable();
    const input = el.querySelector('input') as HTMLInputElement;
    input.value = 'bento';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    const options = el.querySelectorAll('[role=option]');
    expect(options.length).toBe(1);
    expect(options[0].textContent).toContain('Bento');

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await fixture.whenStable();
    expect(el.querySelector('[role=dialog]')).toBeNull();
  });

  it('runs the active command on Enter', async () => {
    const { fixture, el, service } = setup();
    service.show();
    await fixture.whenStable();
    const input = el.querySelector('input') as HTMLInputElement;
    input.value = 'Design style: Bento';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(document.documentElement.getAttribute('data-design')).toBe('bento');
  });
});
