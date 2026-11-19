import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { COLOR_THEMES, DESIGN_STYLES } from '../app/models';

const REQUIRED_TOKENS = [
  '--color-bg',
  '--color-surface',
  '--color-surface-raised',
  '--color-text',
  '--color-text-muted',
  '--color-primary',
  '--color-on-primary',
  '--color-accent',
  '--color-border',
  '--shadow-card',
  '--shadow-control',
  '--radius-card',
  '--radius-control',
  '--font-heading',
  '--font-body',
  '--focus-ring',
];

const STYLES_DIR = __dirname;
const DESIGNS_DIR = join(STYLES_DIR, 'designs');
const designFiles = readdirSync(DESIGNS_DIR).filter((f) => f.endsWith('.scss'));

function block(source: string, style: string, theme: string): string | undefined {
  const selector = `[data-design='${style}'][data-bs-theme='${theme}']`;
  const start = source.indexOf(selector);
  if (start < 0) {
    return undefined;
  }
  return source.slice(source.indexOf('{', start) + 1, source.indexOf('}', start));
}

describe('design token contract', () => {
  it('has at least one design implemented', () => {
    expect(designFiles.length).toBeGreaterThan(0);
  });

  describe.each(designFiles)('%s', (file) => {
    const name = file.replace(/^_/, '').replace(/\.scss$/, '');
    const source = readFileSync(join(DESIGNS_DIR, file), 'utf8');

    it('is a known design style', () => {
      expect(DESIGN_STYLES as readonly string[]).toContain(name);
    });

    it.each([...COLOR_THEMES])('defines every token for the %s theme', (theme) => {
      const css = block(source, name, theme);

      expect(css, `missing ${theme} block`).toBeDefined();
      const missing = REQUIRED_TOKENS.filter((token) => !css!.includes(`${token}:`));
      expect(missing).toEqual([]);
    });

    it('is loaded by the global stylesheet', () => {
      const global = readFileSync(join(STYLES_DIR, '..', 'styles.scss'), 'utf8');

      expect(global).toContain(`styles/designs/${name}`);
    });
  });

  it.each([...COLOR_THEMES])(
    'falls back to minimalism tokens (%s) for styles without a design file yet',
    (theme) => {
      const source = readFileSync(join(DESIGNS_DIR, '_minimalism.scss'), 'utf8');

      expect(source).toContain(`:root[data-bs-theme='${theme}']`);
    },
  );
});
