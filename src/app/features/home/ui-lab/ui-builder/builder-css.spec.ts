import { EDITOR_CSS, EXPORT_CSS } from './builder-css';

describe('builder css', () => {
  it('collapses the grid by container width in the editor so device preview is honest', () => {
    expect(EDITOR_CSS).toContain('container-type: inline-size');
    expect(EDITOR_CSS).toMatch(/@container[^{]*\{[^}]*\.ub-grid/);
  });

  it('keeps the exported CSS free of editor-only container rules', () => {
    expect(EXPORT_CSS).toContain('@media (max-width: 40rem)');
    expect(EXPORT_CSS).not.toContain('@container');
    expect(EXPORT_CSS).not.toContain('container-type');
  });

  it('draws the divider from the text colour so it stays visible on any background', () => {
    const rule = /\.ub-divider\s*\{([^}]*)\}/.exec(EXPORT_CSS)![1];
    expect(rule).toMatch(/border-top:[^;]*color-mix\(in srgb, currentColor/);
  });
});
