/** Standalone CSS for the exported markup. Falls back to neutral colours outside this site. */
export const EXPORT_CSS = `:root,
:host {
  --ub-primary: var(--color-primary, #2563eb);
  --ub-on-primary: var(--color-on-primary, #ffffff);
  --ub-danger: var(--color-danger, #dc2626);
  --ub-surface: var(--color-surface, #ffffff);
  --ub-raised: var(--color-surface-raised, #f1f5f9);
  --ub-border: var(--color-border, #e2e8f0);
  --ub-text: var(--color-text, #0f172a);
  --ub-muted: var(--color-text-muted, #64748b);
  --ub-radius: var(--radius-card, 12px);
}

.ub-section { display: block; }
.ub-pad-sm { padding: 0.75rem; }
.ub-pad-md { padding: 1.25rem; }
.ub-pad-lg { padding: 2.5rem 1.5rem; }
.ub-bg-raised { background: var(--ub-raised); color: var(--ub-text); }
.ub-bg-primary { background: var(--ub-primary); color: var(--ub-on-primary); }

.ub-stack {
  display: flex;
  gap: var(--ub-gap, 16px);
}
.ub-dir-column { flex-direction: column; }
.ub-dir-row { flex-direction: row; }
.ub-wrap { flex-wrap: wrap; }
.ub-stack.ub-align-start { align-items: flex-start; }
.ub-stack.ub-align-center { align-items: center; }
.ub-stack.ub-align-end { align-items: flex-end; }
.ub-stack.ub-align-stretch { align-items: stretch; }
.ub-justify-start { justify-content: flex-start; }
.ub-justify-center { justify-content: center; }
.ub-justify-end { justify-content: flex-end; }
.ub-justify-between { justify-content: space-between; }

.ub-grid {
  display: grid;
  grid-template-columns: repeat(var(--ub-cols, 3), minmax(0, 1fr));
  gap: var(--ub-gap, 16px);
}
@media (max-width: 40rem) {
  .ub-grid { grid-template-columns: 1fr; }
}

.ub-card {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  overflow: hidden;
  color: var(--ub-text);
  background: var(--ub-surface);
  border: 1px solid var(--ub-border);
  border-radius: var(--ub-radius);
}
.ub-elev-none { box-shadow: none; }
.ub-elev-sm { box-shadow: 0 1px 3px rgb(15 23 42 / 12%); }
.ub-elev-md { box-shadow: 0 8px 24px rgb(15 23 42 / 16%); }
.ub-card__cover { display: block; width: 100%; height: auto; }

.ub-heading { margin: 0; line-height: 1.2; }
h1.ub-heading { font-size: 1.9rem; }
h2.ub-heading { font-size: 1.5rem; }
h3.ub-heading { font-size: 1.2rem; }
h4.ub-heading { font-size: 1rem; }
.ub-text { margin: 0; }
.ub-text--sm { font-size: 0.85rem; }
.ub-text--md { font-size: 1rem; }
.ub-text--lg { font-size: 1.15rem; }
.ub-muted { color: var(--ub-muted); }
.ub-bg-primary .ub-muted { color: inherit; opacity: 0.85; }
.ub-align-start { text-align: start; }
.ub-align-center { text-align: center; }
.ub-align-end { text-align: end; }

.ub-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.5rem 1.1rem;
  font: inherit;
  line-height: 1.2;
  text-decoration: none;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 8px;
  transition: background-color 0.15s, border-color 0.15s, color 0.15s;
}
.ub-btn--sm { padding: 0.3rem 0.7rem; font-size: 0.85rem; }
.ub-btn--lg { padding: 0.7rem 1.5rem; font-size: 1.1rem; }
.ub-btn--block { display: flex; width: 100%; }
.ub-btn[aria-disabled='true'] { opacity: 0.5; cursor: not-allowed; }
.ub-btn:focus-visible, .ub-link:focus-visible { outline: 2px solid var(--ub-primary); outline-offset: 2px; }
.ub-btn { --tone: var(--ub-primary); --on-tone: var(--ub-on-primary); }
.ub-btn.ub-tone-neutral { --tone: var(--ub-text); --on-tone: var(--ub-surface); }
.ub-btn.ub-tone-danger { --tone: var(--ub-danger); --on-tone: #ffffff; }
.ub-btn--solid { color: var(--on-tone); background: var(--tone); border-color: var(--tone); }
.ub-btn--outline { color: var(--tone); background: transparent; border-color: var(--tone); }
.ub-btn--ghost { color: var(--tone); background: transparent; }
.ub-btn--link { padding-inline: 0; color: var(--tone); background: transparent; text-decoration: underline; }
.ub-btn--solid:hover:not([aria-disabled='true']) { filter: brightness(0.92); }
.ub-btn--outline:hover:not([aria-disabled='true']),
.ub-btn--ghost:hover:not([aria-disabled='true']) { background: var(--ub-raised); }
.ub-bg-primary .ub-btn--solid.ub-tone-neutral { --tone: var(--ub-on-primary); --on-tone: var(--ub-primary); }
.ub-icon { flex: none; }

.ub-img { display: block; width: 100%; height: auto; object-fit: cover; border-radius: var(--ub-radius); }
.ub-ratio-16-9 { aspect-ratio: 16 / 9; }
.ub-ratio-1-1 { aspect-ratio: 1 / 1; }
.ub-field { display: grid; gap: 0.25rem; font-size: 0.9rem; }
.ub-field input {
  padding: 0.45rem 0.6rem;
  font: inherit;
  color: var(--ub-text);
  background: var(--ub-surface);
  border: 1px solid var(--ub-border);
  border-radius: 8px;
}
.ub-link { color: var(--ub-primary); }
.ub-bg-primary .ub-link { color: inherit; }
.ub-badge {
  display: inline-block;
  align-self: flex-start;
  padding: 0.1rem 0.6rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--ub-on-primary);
  background: var(--ub-primary);
  border-radius: 999px;
}
.ub-badge.ub-tone-neutral { color: var(--ub-text); background: var(--ub-raised); }
.ub-badge.ub-tone-danger { background: var(--ub-danger); color: #ffffff; }
.ub-divider { width: 100%; margin: 0; border: 0; border-top: 1px solid color-mix(in srgb, currentColor 40%, transparent); }

@media (prefers-reduced-motion: reduce) {
  .ub-btn { transition: none; }
}
`;

/** Editor-only affordances, appended to the preview but never exported. */
export const EDITOR_CSS = `
:host { container-type: inline-size; }
@container (max-width: 40rem) {
  .ub-grid { grid-template-columns: 1fr; }
}
.ub-empty {
  padding: 0.9rem;
  font-size: 0.8rem;
  color: var(--ub-muted);
  text-align: center;
  border: 1px dashed var(--ub-border);
  border-radius: 8px;
}
[data-ub-id] { cursor: pointer; }
`;
