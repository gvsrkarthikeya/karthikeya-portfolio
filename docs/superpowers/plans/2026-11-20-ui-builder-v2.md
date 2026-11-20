# UI Builder v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Replace the flat block builder with a nested-tree builder with rich properties, layers, undo/redo, device preview, export and autosave.

**Architecture:** Pure TypeScript model modules (tree ops, history, render, persistence) tested with vitest; one `UiBuilder` component renders the whole tree into a single shadow root with `data-ub-id` markers and handles selection/drag via event delegation.

**Tech Stack:** Angular 22 signals, Bootstrap, vitest (jsdom). No new dependencies.

**Spec:** `docs/superpowers/specs/2026-11-20-ui-builder-v2-design.md`

## Global Constraints
- Folder: `src/app/features/home/ui-lab/ui-builder/`. Standalone, OnPush, signals only.
- No new dependencies; initial bundle budget (600 kB warn / 1 MB error) unchanged; builder stays lazy.
- Every user value is escaped via `escapeHtml`; hrefs pass `safeHref`.
- Exported HTML has no `data-ub-*` attributes.
- Max tree depth 6; history cap 100; storage key `portfolio.uibuilder.v2`.
- Run `npx prettier --check`, `npx ng build` (0 warnings), `npx ng test --watch=false` (all pass) before the PR. Never commit `angular.json`. No Co-authored-by trailer.
- `jsdom` has no IntersectionObserver/startViewTransition; keep DOM-dependent logic thin.

## Review Focus
- Link `href` of `javascript:`/`data:` → rendered as `#` (test in Task 3).
- Dropping a container into itself/descendant → rejected, tree unchanged (Task 1).
- Corrupt/old localStorage JSON → starter page, no throw (Task 2).
- Deleting a selected container with children → selection cleared, children gone, undo restores (Tasks 1, 2, 5).
- Image with no alt/src → renders placeholder with `alt=""`, export still valid (Task 3).
- Empty container shows a drop target; empty grid exports valid HTML (Tasks 3, 5).
- Undo after Reset restores previous page (Task 2).

---

### Task 1: Tree model and operations
**Files:** Create `builder-tree.ts`, `builder-tree.spec.ts`.
**Interfaces — Produces:**
```ts
type NodeType = 'section'|'stack'|'grid'|'card'|'heading'|'text'|'button'|'image'|'input'|'link'|'badge'|'divider';
interface UbNode { id: string; type: NodeType; props: Record<string, string|number|boolean>; children: UbNode[] }
const CONTAINERS: NodeType[]; const MAX_DEPTH = 6;
createNode(type: NodeType, props?: Partial<UbNode['props']>, children?: UbNode[]): UbNode  // fills defaults from NODE_DEFS
findNode(root: UbNode, id: string): UbNode | null
findParent(root: UbNode, id: string): { parent: UbNode; index: number } | null
canDrop(root: UbNode, id: string | null, parentId: string): boolean // parent is container, not self/descendant, depth <= MAX_DEPTH
insertNode(root: UbNode, node: UbNode, parentId: string, index: number): UbNode   // immutable; returns same root if invalid
moveNode(root: UbNode, id: string, parentId: string, index: number): UbNode       // index = insertion point in the CURRENT child list
removeNode(root: UbNode, id: string): UbNode                                       // root cannot be removed
duplicateNode(root: UbNode, id: string): { root: UbNode; newId: string }          // deep copy with fresh ids, placed after original
updateProps(root: UbNode, id: string, patch: Partial<UbNode['props']>): UbNode
```
`NODE_DEFS: Record<NodeType, { label; icon; props: PropSchema[] }>` where `PropSchema = { key; label; kind: 'text'|'textarea'|'select'|'toggle'|'number'; options?: string[]; default }`.
Prop schemas (defaults first): button — label "Click me", variant solid|outline|ghost|link, tone primary|neutral|danger, size sm|md|lg, fullWidth false, disabled false, icon none|arrow|plus|check, iconPosition left|right, href ""; card — elevation none|sm|md, padding sm|md|lg, imageSrc "", imageAlt ""; stack — direction column|row, gap 0–48, align start|center|end|stretch, justify start|center|end|between, wrap false; grid — columns 1–6, gap; section — padding, background none|raised|primary; heading — text, level 1–4, align; text — text, size sm|md|lg, align, muted; image — src, alt, ratio auto|16:9|1:1; input — label, placeholder, type text|email|password; link — text, href; badge — text, tone; divider — none.

- [ ] Step 1: Write failing tests: insert button into a card by id appears in `card.children`; `moveNode` card→own descendant returns the identical root (`toBe`); moving within same parent downward uses insertion-point semantics (`[a,b,c]` move a to index 3 → `[b,c,a]`); `removeNode` of a container drops its subtree; `duplicateNode` yields new ids for every descendant; depth > 6 insert rejected; `updateProps` is immutable (original unchanged).
- [ ] Step 2: Run `npx ng test --watch=false` → FAIL (module missing).
- [ ] Step 3: Implement the signatures above in `builder-tree.ts`; ids from a module counter `n${++counter}`.
- [ ] Step 4: Run tests → PASS. Prettier check.
- [ ] Step 5: Commit `feat(ui-builder): nested tree model`.

### Task 2: History, persistence, starter page
**Files:** Create `builder-history.ts`, `builder-storage.ts`, `builder-presets.ts` + specs.
**Interfaces — Produces:**
```ts
interface History<T> { past: T[]; present: T; future: T[] }
createHistory<T>(initial: T): History<T>
commit<T>(h: History<T>, next: T): History<T>   // no-op if next === present; clears future; caps past at 100
undo<T>(h): History<T>; redo<T>(h): History<T>
serialize(root: UbNode): string
deserialize(json: string | null): UbNode | null  // validates shape, types in NODE_DEFS, depth; null on anything invalid
starterPage(): UbNode
PRESETS: { id: 'navbar'|'hero'|'signup'|'pricing'|'footer'; label: string; build(): UbNode }[]
```
- [ ] Step 1: Tests: commit/undo/redo sequence; commit after undo clears future; 101 commits keep 100 past; `deserialize('{bad')`, `deserialize(null)`, unknown node type, 8-deep tree → `null`; round-trip equals; undo after replacing with `starterPage()` restores the previous tree; every PRESET builds a valid tree (`deserialize(serialize(p.build()))` non-null) and the pricing preset contains a `button` inside a `card`.
- [ ] Step 2: Run → FAIL. Step 3: Implement (presets use `createNode`; pricing = card[heading, text, heading(price), button, badge]). Step 4: PASS. Step 5: Commit.

### Task 3: Renderer and CSS
**Files:** Create `builder-render.ts` (+ `builder-css.ts` holding `EXPORT_CSS`), `builder-render.spec.ts`. Delete nothing yet.
**Interfaces — Consumes:** Task 1 types. **Produces:**
```ts
escapeHtml(v: string): string; safeHref(v: string): string  // allow http(s):, mailto:, tel:, #, /, relative; else '#'
renderNode(node: UbNode, opts: { editor: boolean }): string  // editor adds data-ub-id="<id>" on every element; export does not
renderPage(root: UbNode, opts: { editor: boolean }): string
```
Class conventions: `.ub-btn.ub-btn--{variant}.ub-tone-{tone}.ub-btn--{size}`, `.ub-btn--block`, `.ub-card.ub-elev-{x}.ub-pad-{x}`, `.ub-stack`, `.ub-grid` (inline `style` only for `--ub-gap`, `--ub-cols`), etc. Button with `href` renders `<a>`, with `disabled` renders `aria-disabled="true"` and no href. Icons are inline `<svg aria-hidden="true">`. Empty containers in editor mode render `<div class="ub-empty" data-ub-empty="<id>">Drop here</div>`.
- [ ] Step 1: Tests: `<script>` in a heading is escaped; `safeHref('javascript:alert(1)')==='#'` (also `' JavaScript:x'`, `data:text/html,..`); button inside card renders inside `.ub-card`; export HTML contains no `data-ub`; editor HTML contains `data-ub-id="<id>"` for every node; button variants map to classes; fullWidth adds `ub-btn--block`; image with empty src renders placeholder with `alt=""`; empty grid exports without `ub-empty`.
- [ ] Step 2: Run → FAIL. Step 3: Implement; CSS keeps the existing `--ub-*` tokens declared on `:root, :host` and adds variant/size/elevation/layout classes and `prefers-reduced-motion` guards. Step 4: PASS. Step 5: Commit.

### Task 4: Component: canvas, selection, drag and drop
**Files:** Modify `ui-builder.ts`, `ui-builder.html`, `ui-builder.scss`, `shadow-html.ts` (emit `(nodeEvent)`? no: keep directive, expose `host` shadow root via `shadowRoot` getter); Create `builder-drop.ts` + spec.
**Interfaces — Produces:** `resolveDrop(rect: {top;bottom;left;right}, point: {x;y}, isContainer: boolean, hasChildren: boolean): 'before'|'after'|'inside'` (pure; middle 50% of a container = inside, otherwise by half; leaves never inside). Component state signals: `history` (History<UbNode>), `root` (computed present), `selectedId`, `drop: {parentId; index} | null`.
- [ ] Step 1: Spec for `resolveDrop` (container middle → inside; top 25% → before; bottom 25% → after; leaf upper half → before, lower → after). Component spec: clicking `[data-ub-id]` inside the shadow root selects it; palette click inserts inside selected container else appends to root; dropping a button inside a card (simulate via component method `dropAt(parentId, index, payload)`) nests it; invalid drop leaves tree and sets status.
- [ ] Step 2: Run → FAIL. Step 3: Implement. Render whole page once via `ShadowHtml` in editor mode; selection by `event.composedPath()` delegation; DnD via HTML5 events on the host with `composedPath()` to find the node, `resolveDrop` for the zone, and a `.ub__drop` overlay positioned from the target rect; selected outline drawn with an injected `[data-ub-id="<sel>"]{outline:2px solid var(--ub-primary)}` rule. Palette items and layers are draggable too. Step 4: PASS. Step 5: Commit.

### Task 5: Properties panel and layers
**Files:** Modify `ui-builder.html/.ts/.scss`; Create `builder-props.spec.ts` if logic extracted.
- [ ] Step 1: Component tests: selecting a button shows controls for exactly the button schema (variant, size, tone, fullWidth, disabled, icon, iconPosition, href, label); changing variant to `outline` updates exported HTML class; layers list mirrors the tree with indentation (`aria-level`), clicking a layer selects; removing a selected container clears selection; Duplicate adds a sibling.
- [ ] Step 2: FAIL. Step 3: Schema-driven form from `NODE_DEFS[type].props` (`text`, `textarea`, `select`, `toggle` as `role=switch`, `number`); layers as `role="tree"`/`treeitem`; toolbar: move up/down, duplicate, delete. Step 4: PASS. Step 5: Commit.

### Task 6: Undo/redo, shortcuts, device preview, export, autosave
**Files:** Modify `ui-builder.ts/.html/.scss`; update `ui-builder.spec.ts`.
- [ ] Step 1: Tests: Cmd/Ctrl+Z undoes an insert, Shift+Z redoes; Delete removes selection; Cmd+D duplicates; typing in a properties input does NOT trigger Delete/shortcuts; device buttons set canvas width 100%/768px/375px (`aria-pressed`); export HTML equals `renderPage(root,{editor:false})`; autosave writes `portfolio.uibuilder.v2` after a change; corrupt stored JSON loads the starter page; Reset restores the starter and is undoable; text-field edits are coalesced into one history entry per focus.
- [ ] Step 2: FAIL. Step 3: Implement; storage writes in an `effect`, guarded by try/catch; status live-region messages for every action. Step 4: PASS. Step 5: Commit.

### Task 7: Cleanup, docs and verification
**Files:** Delete `builder-model.ts`, `builder-model.spec.ts`; Modify any imports; update UI Lab copy mentioning blocks.
- [ ] Step 1: `grep -rn "builder-model" src` → none left. Step 2: `npx prettier --check src/app`, `npx ng build` (0 warnings/errors, bundle within budget), `npx ng test --watch=false` all pass.
- [ ] Step 3: In the browser (desktop and 390px): build a page with a button inside a card, change button variant/size/icon, undo/redo, switch device, copy HTML (no `data-ub`), reload (autosave), Reset; test in light/dark and Glassmorphism.
- [ ] Step 4: Push branch `feat/ui-builder-v2`, open PR against `main` with the `gvsrkarthikeya` token, wait for `validate`.
