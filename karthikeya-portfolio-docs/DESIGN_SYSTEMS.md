# Design Systems and Theme Engine

## 1. Core rule

Design style and color theme are independent. Eight styles × two themes
= sixteen combinations. A style changes the visual language; a theme
changes the color mode.

## 2. Style specifications

### Minimalism

-   Generous whitespace, restrained palette, clear typography.
-   Thin or absent borders; minimal shadows.
-   Focus on content hierarchy and readability.
-   Example treatments: simple timeline; clean project list.

### Flat Design

-   Solid fills, crisp edges, simple geometry.
-   Avoid simulated depth and gradients as the main visual language.
-   Example treatments: color-blocked skills; geometric project tiles.

### Material Design

-   Layered surfaces, clear elevation hierarchy, deliberate interaction
    feedback.
-   Use shadows sparingly and consistently.
-   Example treatments: elevated cards; structured navigation and
    buttons.

### Glassmorphism

-   Translucent surfaces, background blur and layered color fields.
-   Preserve sufficient text contrast; provide solid fallbacks where
    backdrop-filter is unsupported.
-   Example treatments: frosted navigation; translucent hero information
    panel.

### Neumorphism

-   Soft raised/inset surfaces on related background colors.
-   Critical risk: low contrast and unclear control boundaries.
-   Ensure text contrast, visible focus states and clear interactive
    affordances.
-   Example treatments: inset theme control; soft skill tiles.

### Neubrutalism

-   Strong outlines, bold typography, high-contrast colors and hard
    offset shadows.
-   Keep spacing and alignment disciplined so the interface remains
    usable.
-   Example treatments: thick-bordered project cards; offset-shadow
    buttons.

### Skeuomorphism

-   Subtle material cues inspired by physical objects.
-   Avoid excessive texture, realism or visual clutter.
-   Example treatments: paper/notebook experience panel; folder-inspired
    project cards.

### Bento Grid

-   Modular grid with varied card sizes and clear grouping.
-   Responsive layout must reflow naturally to one column on narrow
    screens.
-   Example treatments: profile dashboard; featured project card beside
    skills and experience tiles.

## 3. Token categories

Each design system should define or map: - `--color-bg` -
`--color-surface` - `--color-surface-raised` - `--color-text` -
`--color-text-muted` - `--color-primary` - `--color-accent` -
`--color-border` - `--shadow-card` - `--shadow-control` -
`--radius-card` - `--radius-control` - `--font-heading` -
`--font-body` - `--focus-ring`

## 4. Theme behavior

Light/dark mode must be available in every design style. Do not
implement dark mode by simply inverting colors. Define intentional dark
surfaces, readable muted text, borders, shadows and focus indicators for
each style.

## 5. Selector UX

-   Put the design-style selector in the main navigation as a dropdown.
-   Use clear names and indicate the active style.
-   Keep light/dark toggle separate and easily discoverable.
-   On mobile, expose both controls in the collapsed navigation.
-   Announce changes accessibly where practical.

## 6. Acceptance criteria

-   Every style is visibly distinguishable beyond a background-color
    change.
-   All eight styles work in both themes.
-   Switching style does not reset the selected theme.
-   Switching theme does not reset the selected style.
-   No combination makes text or controls unreadable.
