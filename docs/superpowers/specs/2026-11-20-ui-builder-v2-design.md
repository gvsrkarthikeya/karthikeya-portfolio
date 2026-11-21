# UI builder v2: design

## Intent
The UI Lab builder is flat: six fixed blocks in a list, so a button can only sit *below* things, cards are three hardcoded titles, and a button has only a label and tone. The owner (a senior frontend engineer) wants it to feel production-grade as a portfolio showpiece: nest components, edit rich properties, and export clean HTML/CSS.

## Goals
- Nested tree: containers hold children, so a Button can go inside a Card.
- Rich, per-type properties (button variants, sizes, icons, link, disabled, full-width).
- Layers panel, undo/redo, device preview (mobile/tablet/desktop), HTML+CSS export, autosave with Reset.
- Keyboard and screen-reader operable (move/duplicate/delete without a mouse).

## Non-goals
Backend, arbitrary custom CSS, real JS actions (only href/anchor), multiple saved projects, external libraries.

## Anti-goals
Exported HTML containing editor attributes; any user value reaching markup unescaped; a `javascript:` link surviving into the preview or export.

## Constraints
Angular signals, standalone, OnPush; no new dependencies; preview stays in a shadow root; respects prefers-reduced-motion; lazy-loaded (initial bundle budget unchanged); no invented personal content.

## Approaches considered
1. **Extend the flat list with "slots"**: rejected, nesting cannot work on it.
2. **Adopt GrapesJS or similar**: rejected, heavy, and hides the Angular work this portfolio exists to show.
3. **Nested node tree, pure model + one shadow render of the whole tree (chosen).** The model is plain functions (testable without the DOM); the page is rendered once from the tree with `data-ub-id` markers in editor mode.

## Design
- Node: `{ id, type, props, children }`. Containers: `section`, `stack`, `grid`, `card`. Leaves: `heading`, `text`, `button`, `image`, `input`, `link`, `badge`, `divider`.
- Presets (navbar, hero, signup form, pricing card, footer) insert pre-built subtrees, fully editable afterwards.
- Drop zones resolve to `{ parentId, index }`: over a container's middle = inside; near top/bottom edge = before/after. Max depth 6. A node can never be dropped into itself or its descendants.
- History: snapshot stack (cap 100) of trees, so undo/redo is exact.
- Persistence: localStorage, validated on read; corrupt data falls back to the starter page.
- Export: clean HTML (no editor attributes) plus the CSS.
