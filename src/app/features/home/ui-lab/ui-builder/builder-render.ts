import { NODE_DEFS, UbNode, isContainer } from './builder-tree';

export interface RenderOptions {
  editor: boolean;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const SAFE_SCHEMES = ['http:', 'https:', 'mailto:', 'tel:'];

/** Allows http(s), mailto, tel, fragments, absolute and relative paths; anything else becomes '#'. */
export function safeHref(value: string): string {
  const trimmed = value.trim();
  // Browsers ignore tabs, newlines and control characters inside a scheme, so strip them to check.
  const probe = trimmed.replace(/[\u0000-\u0020]/g, '').toLowerCase();
  const scheme = /^([a-z][a-z0-9+.-]*:)/.exec(probe);
  if (scheme && !SAFE_SCHEMES.includes(scheme[1])) return '#';
  return trimmed;
}

const str = (n: UbNode, key: string): string => String(n.props[key] ?? '');
const flag = (n: UbNode, key: string): boolean => n.props[key] === true;

/** Reads a select prop, falling back to its default if the value is not one the schema offers. */
function pick(n: UbNode, key: string): string {
  const schema = NODE_DEFS[n.type].props.find((p) => p.key === key);
  const value = n.props[key];
  return typeof value === 'string' && schema?.options?.includes(value)
    ? value
    : String(schema?.default ?? '');
}

function int(n: UbNode, key: string): number {
  const schema = NODE_DEFS[n.type].props.find((p) => p.key === key);
  const value = n.props[key];
  const fallback = Number(schema?.default ?? 0);
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.round(Math.min(schema?.max ?? value, Math.max(schema?.min ?? value, value)));
}

const ICONS: Record<string, string> = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="M5 13l4 4L19 7"/>',
};

function icon(name: string): string {
  const path = ICONS[name];
  if (!path) return '';
  return `<svg aria-hidden="true" class="ub-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
}

const PLACEHOLDER_SRC =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9"><rect width="16" height="9" fill="#cbd5e1"/></svg>',
  );

function image(src: string, alt: string, cls: string): string {
  const url = src.trim() ? safeHref(src) : '';
  if (!url || url === '#') {
    return `<img class="${cls} ub-img--placeholder" src="${PLACEHOLDER_SRC}" alt="">`;
  }
  return `<img class="${cls}" src="${escapeHtml(url)}" alt="${escapeHtml(alt)}">`;
}

function renderChildren(node: UbNode, opts: RenderOptions): string {
  if (!node.children.length) {
    return opts.editor
      ? `<div class="ub-empty" data-ub-empty="${escapeHtml(node.id)}">Drop here</div>`
      : '';
  }
  return node.children.map((c) => renderNode(c, opts)).join('');
}

export function renderNode(node: UbNode, opts: RenderOptions): string {
  const mark = opts.editor ? ` data-ub-id="${escapeHtml(node.id)}"` : '';
  const inner = isContainer(node.type) ? renderChildren(node, opts) : '';

  switch (node.type) {
    case 'section':
      return `<section${mark} class="ub-section ub-pad-${pick(node, 'padding')} ub-bg-${pick(node, 'background')}">${inner}</section>`;
    case 'stack': {
      const wrap = flag(node, 'wrap') ? ' ub-wrap' : '';
      return `<div${mark} class="ub-stack ub-dir-${pick(node, 'direction')} ub-align-${pick(node, 'align')} ub-justify-${pick(node, 'justify')}${wrap}" style="--ub-gap:${int(node, 'gap')}px">${inner}</div>`;
    }
    case 'grid':
      return `<div${mark} class="ub-grid" style="--ub-cols:${int(node, 'columns')};--ub-gap:${int(node, 'gap')}px">${inner}</div>`;
    case 'card': {
      const cover = str(node, 'imageSrc').trim()
        ? image(str(node, 'imageSrc'), str(node, 'imageAlt'), 'ub-card__cover')
        : '';
      return `<article${mark} class="ub-card ub-elev-${pick(node, 'elevation')} ub-pad-${pick(node, 'padding')}">${cover}${inner}</article>`;
    }
    case 'heading': {
      const level = int(node, 'level');
      return `<h${level}${mark} class="ub-heading ub-align-${pick(node, 'align')}">${escapeHtml(str(node, 'text'))}</h${level}>`;
    }
    case 'text': {
      const muted = flag(node, 'muted') ? ' ub-muted' : '';
      return `<p${mark} class="ub-text ub-text--${pick(node, 'size')} ub-align-${pick(node, 'align')}${muted}">${escapeHtml(str(node, 'text'))}</p>`;
    }
    case 'button': {
      const iconName = pick(node, 'icon');
      const glyph = icon(iconName);
      const label = escapeHtml(str(node, 'label'));
      const content =
        pick(node, 'iconPosition') === 'right' ? `${label}${glyph}` : `${glyph}${label}`;
      const block = flag(node, 'fullWidth') ? ' ub-btn--block' : '';
      const cls = `ub-btn ub-btn--${pick(node, 'variant')} ub-tone-${pick(node, 'tone')} ub-btn--${pick(node, 'size')}${block}`;
      const href = str(node, 'href').trim();
      if (flag(node, 'disabled')) {
        return `<button${mark} type="button" class="${cls}" aria-disabled="true">${content}</button>`;
      }
      if (href) {
        return `<a${mark} class="${cls}" href="${escapeHtml(safeHref(href))}">${content}</a>`;
      }
      return `<button${mark} type="button" class="${cls}">${content}</button>`;
    }
    case 'image':
      return image(
        str(node, 'src'),
        str(node, 'alt'),
        `ub-img ub-ratio-${pick(node, 'ratio').replace(':', '-')}`,
      ).replace('<img ', `<img${mark} `);
    case 'input':
      return `<label${mark} class="ub-field"><span>${escapeHtml(str(node, 'label'))}</span><input type="${pick(node, 'type')}" placeholder="${escapeHtml(str(node, 'placeholder'))}"></label>`;
    case 'link':
      return `<a${mark} class="ub-link" href="${escapeHtml(safeHref(str(node, 'href')) || '#')}">${escapeHtml(str(node, 'text'))}</a>`;
    case 'badge':
      return `<span${mark} class="ub-badge ub-tone-${pick(node, 'tone')}">${escapeHtml(str(node, 'text'))}</span>`;
    case 'divider':
      return `<hr${mark} class="ub-divider">`;
  }
}

export function renderPage(root: UbNode, opts: RenderOptions): string {
  return renderNode(root, opts);
}
