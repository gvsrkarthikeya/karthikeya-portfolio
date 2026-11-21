# Hero isometric blocks background — design

**Intent:** a subtle isometric block background that makes the home hero feel "built" without competing with text.

**Goals:** blocks only behind the hero section; cursor reaction only while the pointer is inside the hero; follows all 8 design styles and light/dark via existing theme tokens.

**Non-goals:** no libraries/canvas, no other sections, no change to the initials tilt.

**Approaches considered (user picked 1):** (1) isometric 3D blocks; (2) Tetris falling blocks; (3) bento grid; (4) Lego bricks.

**Design:**
- Rendered inside the existing `.hero__bg` layer (z-index -1), gradient stays underneath.
- 7x5 grid of CSS isometric cubes (3 faces from `--color-primary` / `--color-surface-raised` mixes, ~15-25% opacity). Fewer/smaller on mobile.
- Slow wave: per-cube delayed CSS animation of height.
- Cursor: pointer over the hero lifts nearby cubes with distance falloff; leaving eases back.
- `aria-hidden`, `pointer-events: none`; `prefers-reduced-motion` disables wave and cursor reaction.
