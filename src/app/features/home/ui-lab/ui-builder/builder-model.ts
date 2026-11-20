export type BlockType = 'navbar' | 'hero' | 'cards' | 'form' | 'button' | 'footer';
export type Tone = 'primary' | 'neutral';
export type BlockField = 'title' | 'text';

export interface Block {
  id: string;
  type: BlockType;
  title: string;
  text: string;
  tone: Tone;
}

export interface BlockDef {
  type: BlockType;
  label: string;
  icon: string;
  /** Which text fields the block exposes in the properties panel. */
  fields: BlockField[];
  fieldLabels: Partial<Record<BlockField, string>>;
  hasTone: boolean;
  defaults: Pick<Block, 'title' | 'text' | 'tone'>;
}

export const BLOCK_DEFS: BlockDef[] = [
  {
    type: 'navbar',
    label: 'Navbar',
    icon: '▭',
    fields: ['title'],
    fieldLabels: { title: 'Brand' },
    hasTone: true,
    defaults: { title: 'Brand', text: '', tone: 'neutral' },
  },
  {
    type: 'hero',
    label: 'Hero',
    icon: '▣',
    fields: ['title', 'text'],
    fieldLabels: { title: 'Headline', text: 'Subtext' },
    hasTone: true,
    defaults: {
      title: 'Build faster UIs',
      text: 'Compose a page from reusable blocks.',
      tone: 'primary',
    },
  },
  {
    type: 'cards',
    label: 'Cards',
    icon: '▦',
    fields: ['title', 'text'],
    fieldLabels: { title: 'Heading', text: 'Card text' },
    hasTone: false,
    defaults: { title: 'Features', text: 'Short supporting copy.', tone: 'neutral' },
  },
  {
    type: 'form',
    label: 'Form',
    icon: '☰',
    fields: ['title', 'text'],
    fieldLabels: { title: 'Heading', text: 'Description' },
    hasTone: false,
    defaults: { title: 'Stay in the loop', text: 'Get occasional updates.', tone: 'neutral' },
  },
  {
    type: 'button',
    label: 'Button',
    icon: '◉',
    fields: ['title'],
    fieldLabels: { title: 'Label' },
    hasTone: true,
    defaults: { title: 'Click me', text: '', tone: 'primary' },
  },
  {
    type: 'footer',
    label: 'Footer',
    icon: '▁',
    fields: ['text'],
    fieldLabels: { text: 'Text' },
    hasTone: true,
    defaults: { title: '', text: '© Your brand', tone: 'neutral' },
  },
];

export function defFor(type: BlockType): BlockDef {
  return BLOCK_DEFS.find((d) => d.type === type) ?? BLOCK_DEFS[0];
}

let counter = 0;

export function createBlock(type: BlockType): Block {
  counter += 1;
  return { id: `b${counter}`, type, ...defFor(type).defaults };
}

export function insertAt(blocks: Block[], block: Block, index: number): Block[] {
  const at = Math.max(0, Math.min(index, blocks.length));
  return [...blocks.slice(0, at), block, ...blocks.slice(at)];
}

/** `index` is the insertion point in the current list (0..length), as shown by a drop indicator. */
export function moveBlock(blocks: Block[], id: string, index: number): Block[] {
  const from = blocks.findIndex((b) => b.id === id);
  if (from < 0) return blocks;
  const target = index > from ? index - 1 : index;
  if (target === from) return blocks;
  const rest = blocks.filter((b) => b.id !== id);
  return insertAt(rest, blocks[from], target);
}

export function removeBlock(blocks: Block[], id: string): Block[] {
  return blocks.filter((b) => b.id !== id);
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const CARD_TITLES = ['Fast', 'Accessible', 'Themeable'];

export function blockToHtml(block: Block): string {
  const title = escapeHtml(block.title);
  const text = escapeHtml(block.text);
  const tone = `ub-tone-${block.tone}`;

  switch (block.type) {
    case 'navbar':
      return `<header class="ub-navbar ${tone}">
  <strong>${title}</strong>
  <nav aria-label="Primary">
    <a href="#">Home</a>
    <a href="#">Docs</a>
    <a href="#">Contact</a>
  </nav>
</header>`;
    case 'hero':
      return `<section class="ub-hero ${tone}">
  <h1>${title}</h1>
  <p>${text}</p>
  <button type="button" class="ub-btn">Get started</button>
</section>`;
    case 'cards':
      return `<section class="ub-cards">
  <h2>${title}</h2>
  <div class="ub-cards__grid">
${CARD_TITLES.map(
  (t) => `    <article class="ub-card">
      <h3>${t}</h3>
      <p>${text}</p>
    </article>`,
).join('\n')}
  </div>
</section>`;
    case 'form':
      return `<form class="ub-form">
  <h2>${title}</h2>
  <p>${text}</p>
  <label>Email
    <input type="email" placeholder="you@example.com" />
  </label>
  <button type="submit" class="ub-btn">Subscribe</button>
</form>`;
    case 'button':
      return `<div class="ub-row">
  <button type="button" class="ub-btn ${tone}">${title}</button>
</div>`;
    case 'footer':
      return `<footer class="ub-footer ${tone}">${text}</footer>`;
  }
}

export function toHtml(blocks: Block[]): string {
  return blocks.map(blockToHtml).join('\n');
}

/** Standalone CSS for the exported markup. Falls back to neutral colours outside this site. */
export const EXPORT_CSS = `:root,
:host {
  --ub-primary: var(--color-primary, #2563eb);
  --ub-on-primary: var(--color-on-primary, #ffffff);
  --ub-surface: var(--color-surface, #ffffff);
  --ub-raised: var(--color-surface-raised, #f1f5f9);
  --ub-border: var(--color-border, #e2e8f0);
  --ub-text: var(--color-text, #0f172a);
  --ub-radius: var(--radius-card, 12px);
}

.ub-tone-primary { background: var(--ub-primary); color: var(--ub-on-primary); }
.ub-tone-neutral { background: var(--ub-raised); color: var(--ub-text); }

.ub-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1.25rem;
}
.ub-navbar nav { display: flex; gap: 1rem; }
.ub-navbar a { color: inherit; text-decoration: none; opacity: 0.85; }

.ub-hero { padding: 2.5rem 1.5rem; text-align: center; }
.ub-hero h1 { margin: 0 0 0.5rem; font-size: 1.75rem; }
.ub-hero p { margin: 0 0 1rem; opacity: 0.9; }

.ub-btn {
  padding: 0.5rem 1.1rem;
  font: inherit;
  color: var(--ub-on-primary);
  background: var(--ub-primary);
  border: 1px solid var(--ub-primary);
  border-radius: 8px;
  cursor: pointer;
}
.ub-btn.ub-tone-neutral { color: var(--ub-primary); background: transparent; }
.ub-hero.ub-tone-primary .ub-btn {
  color: var(--ub-primary);
  background: var(--ub-on-primary);
  border-color: var(--ub-on-primary);
}
.ub-row { padding: 1rem 1.5rem; }

.ub-cards { padding: 1.5rem; }
.ub-cards h2 { margin: 0 0 1rem; font-size: 1.25rem; }
.ub-cards__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: 1rem;
}
.ub-card {
  padding: 1rem;
  background: var(--ub-surface);
  border: 1px solid var(--ub-border);
  border-radius: var(--ub-radius);
}
.ub-card h3 { margin: 0 0 0.35rem; font-size: 1rem; }
.ub-card p { margin: 0; font-size: 0.9rem; opacity: 0.8; }

.ub-form { display: grid; gap: 0.6rem; max-width: 22rem; padding: 1.5rem; }
.ub-form h2 { margin: 0; font-size: 1.25rem; }
.ub-form p { margin: 0; opacity: 0.8; }
.ub-form label { display: grid; gap: 0.25rem; font-size: 0.9rem; }
.ub-form input {
  padding: 0.45rem 0.6rem;
  font: inherit;
  border: 1px solid var(--ub-border);
  border-radius: 8px;
}

.ub-footer { padding: 1rem 1.5rem; font-size: 0.85rem; text-align: center; }
`;
