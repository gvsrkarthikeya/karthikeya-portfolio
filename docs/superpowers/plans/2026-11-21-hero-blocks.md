# Hero Blocks Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an isometric, cursor-reactive block background behind the home hero only.

**Architecture:** A pure function computes each cube's cursor lift; the `Hero` component renders a fixed grid of cubes in `.hero__bg` and feeds pointer position (hero-local, normalised 0..1) into it. Wave animation and cube faces are pure CSS using theme tokens.

**Tech Stack:** Angular (signals, OnPush), SCSS, Karma/Jasmine-style specs via `ng test`.

**Spec:** docs/superpowers/specs/2026-11-21-hero-blocks-design.md

## Global Constraints

- Grid is 7 columns x 5 rows.
- Colours only from `--color-primary`, `--color-accent`, `--color-surface-raised`, `--color-border`; no hardcoded colours.
- Cube opacity about 15–25%; layer is `aria-hidden` with `pointer-events: none`.
- `prefers-reduced-motion: reduce` disables wave and cursor reaction.
- No new dependencies.

## Review Focus

- Pointer leaves hero: all lifts return to 0.
- Pointer exactly on a cube / at corners (0,0) and (1,1): lift stays within 0..1, no NaN.
- Zero-size hero rect (width/height 0): no division by zero, no lift.
- Reduced motion: no pointer updates, static cubes.
- Narrow mobile viewport: cubes do not overflow horizontally (hero `overflow: hidden` on the bg layer).

---

### Task 1: Lift model

**Files:**
- Create: `src/app/features/home/hero/hero-blocks.ts`
- Test: `src/app/features/home/hero/hero-blocks.spec.ts`

**Interfaces:**
- Produces: `export const BLOCK_COLS = 7; export const BLOCK_ROWS = 5;`
  `export interface Pointer { x: number; y: number }` (normalised 0..1 within hero)
  `export function blockLift(col: number, row: number, pointer: Pointer | null): number` returns 0..1.
  `export function normalisePointer(clientX: number, clientY: number, rect: { left: number; top: number; width: number; height: number }): Pointer | null` returns null for zero-size rects, otherwise clamped 0..1.

- [ ] **Step 1: Write failing tests**: `blockLift` returns 0 for null pointer; returns 1 for the cube whose centre equals the pointer (col 3, row 2 with pointer {x:0.5,y:0.5}); is strictly lower for a cube 3 columns away; stays within [0,1] at pointer {0,0} and {1,1}. `normalisePointer` returns null for width 0, clamps out-of-rect coords, and maps centre to {0.5,0.5}.
- [ ] **Step 2: Run** `npx ng test --watch=false` — Expected: FAIL (module missing).
- [ ] **Step 3: Implement** both functions. Cube centre is `((col+0.5)/BLOCK_COLS, (row+0.5)/BLOCK_ROWS)`; lift = `max(0, 1 - dist/0.35)` squared-smooth, with dist Euclidean in normalised space.
- [ ] **Step 4: Run tests** — Expected: PASS.
- [ ] **Step 5: Commit** `feat(hero): add block lift model`

### Task 2: Render blocks in Hero

**Files:**
- Modify: `src/app/features/home/hero/hero.ts`, `hero.html`, `hero.scss`
- Test: `src/app/features/home/hero/hero.spec.ts`

**Interfaces:**
- Consumes: `BLOCK_COLS`, `BLOCK_ROWS`, `blockLift`, `normalisePointer`, `Pointer` from Task 1.
- Produces: in `Hero`: `protected readonly blocks: readonly { col: number; row: number }[]` (35 items), `protected readonly pointer = signal<Pointer | null>(null)`, `protected lift(col: number, row: number): number`, `protected onBlocksMove(event: MouseEvent): void`, `protected onBlocksLeave(): void`.

- [ ] **Step 1: Write failing tests** in `hero.spec.ts`: renders 35 `.hero__block` elements inside `.hero__bg[aria-hidden="true"]`; dispatching `mousemove` on `section#home` (with a mocked `getBoundingClientRect` returning 0,0,700,500 and clientX/Y 350/250) sets `--lift` of the centre cube (`.hero__block[data-col="3"][data-row="2"]`) to `1`; dispatching `mouseleave` sets every `--lift` back to `0`.
- [ ] **Step 2: Run** `npx ng test --watch=false` — Expected: FAIL.
- [ ] **Step 3: Implement** TS: handlers on the `section#home` (`(mousemove)`, `(mouseleave)`); `onBlocksMove` returns early when `prefers-reduced-motion: reduce` matches (same check as `onTilt`); pointer uses `normalisePointer` against the section's rect. Template: inside `.hero__bg`, `@for (b of blocks; track $index)` rendering `<span class="hero__block" [attr.data-col]="b.col" [attr.data-row]="b.row" [style.--col]="b.col" [style.--row]="b.row" [style.--lift]="lift(b.col, b.row)">` with three child spans `.hero__face--top/--left/--right`.
- [ ] **Step 4: SCSS**: `.hero__bg` gets `overflow: hidden`; blocks container is an isometric-rotated grid (`rotateX(55deg) rotateZ(-45deg)`) centred right of the text; each cube's height = `calc(var(--base-h) + var(--wave-h) * wave + var(--lift) * 1.2rem)` with `translateZ` transition 0.25s; wave via `@keyframes hero-wave` with `animation-delay: calc((var(--col) + var(--row)) * 180ms)`; faces use `color-mix` of `--color-primary` / `--color-surface-raised` at lighter/darker shades, 15–25% opacity; fewer/smaller cubes under 576px (hide cols/rows beyond 4x3 via `[data-col='4']`... selectors); in the existing reduced-motion block disable the wave and transitions.
- [ ] **Step 5: Run tests and `npx ng build`** — Expected: all PASS, no budget warnings.
- [ ] **Step 6: Visual check** in the browser at `http://localhost:4300/`: light and dark, at least three design styles, mobile width 375px, hover reaction only inside the hero, text still readable.
- [ ] **Step 7: Commit** `feat(hero): isometric block background`
