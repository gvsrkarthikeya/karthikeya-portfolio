import { escapeHtml, renderNode, renderPage, safeHref } from './builder-render';
import { UbNode, createNode } from './builder-tree';

const ids = (n: UbNode): string[] => [n.id, ...n.children.flatMap(ids)];
const EXPORT = { editor: false };
const EDITOR = { editor: true };

describe('builder render', () => {
  it('escapes user text', () => {
    const html = renderNode(createNode('heading', { text: '<script>alert(1)</script>' }), EXPORT);
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(escapeHtml(`"&'`)).toBe('&quot;&amp;&#39;');
  });

  it('neutralises dangerous hrefs', () => {
    expect(safeHref('javascript:alert(1)')).toBe('#');
    expect(safeHref(' JavaScript:x')).toBe('#');
    expect(safeHref('java\tscript:x')).toBe('#');
    expect(safeHref('data:text/html,<b>')).toBe('#');
    expect(safeHref('https://example.com/a')).toBe('https://example.com/a');
    expect(safeHref('mailto:a@b.co')).toBe('mailto:a@b.co');
    expect(safeHref('tel:+123')).toBe('tel:+123');
    expect(safeHref('#top')).toBe('#top');
    expect(safeHref('/docs')).toBe('/docs');
    expect(safeHref('docs/page.html')).toBe('docs/page.html');
    expect(safeHref('')).toBe('');
  });

  it('renders a link with a javascript: href as #', () => {
    const html = renderNode(createNode('link', { text: 'x', href: 'javascript:alert(1)' }), EXPORT);
    expect(html).toContain('href="#"');
    expect(html).not.toContain('javascript');
  });

  it('renders a button nested inside a card', () => {
    const card = createNode('card', {}, [createNode('button', { label: 'Buy' })]);
    const html = renderNode(card, EXPORT);
    expect(html.indexOf('ub-card')).toBeLessThan(html.indexOf('ub-btn'));
    expect(html.lastIndexOf('</article>')).toBeGreaterThan(html.indexOf('Buy'));
  });

  it('export has no data-ub attributes; editor marks every node', () => {
    const root = createNode('section', {}, [
      createNode('card', {}, [createNode('button'), createNode('divider')]),
      createNode('grid'),
    ]);
    expect(renderPage(root, EXPORT)).not.toContain('data-ub');
    const editor = renderPage(root, EDITOR);
    for (const id of ids(root)) expect(editor).toContain(`data-ub-id="${id}"`);
  });

  it('maps button props to classes', () => {
    const html = renderNode(
      createNode('button', { variant: 'outline', tone: 'danger', size: 'lg', fullWidth: true }),
      EXPORT,
    );
    for (const c of ['ub-btn--outline', 'ub-tone-danger', 'ub-btn--lg', 'ub-btn--block']) {
      expect(html).toContain(c);
    }
    expect(renderNode(createNode('button'), EXPORT)).not.toContain('ub-btn--block');
  });

  it('renders an anchor for href and aria-disabled without href when disabled', () => {
    const link = renderNode(createNode('button', { href: 'https://x.dev' }), EXPORT);
    expect(link.startsWith('<a ')).toBe(true);
    const off = renderNode(createNode('button', { href: 'https://x.dev', disabled: true }), EXPORT);
    expect(off).toContain('aria-disabled="true"');
    expect(off).not.toContain('href');
  });

  it('renders icons as aria-hidden svg on the chosen side', () => {
    const html = renderNode(
      createNode('button', { label: 'Go', icon: 'arrow', iconPosition: 'right' }),
      EXPORT,
    );
    expect(html).toContain('<svg aria-hidden="true"');
    expect(html.indexOf('Go')).toBeLessThan(html.indexOf('<svg'));
  });

  it('does not let a tampered select value reach a class attribute', () => {
    const node = createNode('button', { variant: '"><img src=x onerror=alert(1)>' });
    const html = renderNode(node, EXPORT);
    expect(html).not.toContain('onerror');
    expect(html).toContain('ub-btn--solid');
  });

  it('renders an image with no src or alt as a placeholder with empty alt', () => {
    const html = renderNode(createNode('image'), EXPORT);
    expect(html).toContain('alt=""');
    expect(html).toContain('ub-img--placeholder');
  });

  it('shows a drop target for empty containers only in the editor', () => {
    const grid = createNode('grid');
    expect(renderNode(grid, EDITOR)).toContain(`data-ub-empty="${grid.id}"`);
    expect(renderNode(grid, EXPORT)).not.toContain('ub-empty');
  });

  it('keeps only gap and columns in inline styles', () => {
    const html = renderNode(createNode('grid', { columns: 4, gap: 8 }), EXPORT);
    expect(html).toContain('style="--ub-cols:4;--ub-gap:8px"');
  });
});
