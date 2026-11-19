# Technical Architecture

## 1. Architectural principles

-   Standalone Angular components.
-   Feature-oriented organization with shared reusable UI.
-   Separate content data from presentation.
-   Separate design style from color theme.
-   Use design tokens rather than scattering literal colors and shadows
    through components.
-   Prefer CSS transitions and lightweight interactions over unnecessary
    animation libraries.

## 2. Proposed folder structure

``` text
src/
  app/
    core/
      services/
        appearance.service.ts
        portfolio-data.service.ts
    shared/
      components/
        site-header/
        site-footer/
        section-heading/
        social-links/
        theme-toggle/
        style-selector/
    features/
      home/
      about/
      experience/
      skills/
      projects/
      education/
      contact/
    models/
      portfolio.models.ts
    app.component.ts
    app.config.ts
    app.routes.ts
  assets/
    images/
      profile/
      avatar/
      projects/
  styles/
    _tokens.scss
    _themes.scss
    _design-minimalism.scss
    _design-flat.scss
    _design-material.scss
    _design-glassmorphism.scss
    _design-neumorphism.scss
    _design-neubrutalism.scss
    _design-skeuomorphism.scss
    _design-bento.scss
    styles.scss
```

## 3. Appearance state

Represent appearance with two independent values:

``` ts
type DesignStyle =
  | 'minimalism'
  | 'flat'
  | 'material'
  | 'glassmorphism'
  | 'neumorphism'
  | 'neubrutalism'
  | 'skeuomorphism'
  | 'bento';

type ColorTheme = 'light' | 'dark';

interface AppearanceSettings {
  designStyle: DesignStyle;
  colorTheme: ColorTheme;
}
```

Apply the values to the root element, for example:

``` html
<html data-design="minimalism" data-bs-theme="light">
```

Use a service to update the attributes and persist settings. Validate
stored values against allowed enum values before applying them.

## 4. Styling strategy

-   Bootstrap handles responsive grid and foundational utilities.
-   SCSS organizes design-specific styles.
-   CSS custom properties provide runtime-switchable tokens.
-   Avoid relying on Bootstrap component defaults where a design style
    needs a distinct visual treatment.
-   Scope design styles under `[data-design="..."]`.
-   Scope theme variables under `[data-bs-theme="light"]` and
    `[data-bs-theme="dark"]`.

## 5. Data strategy

Keep profile, experience, skills and project content in typed TypeScript
data objects. Do not hardcode the same content into multiple
design-specific templates.

## 6. Routing and GitHub Pages

For the initial single-page site, anchor navigation is sufficient. If
Angular routes are introduced, configure GitHub Pages fallback handling
or avoid deep links that return 404 on refresh. Set the correct
repository base href at build time.

## 7. Persistence and resilience

-   localStorage is a preference enhancement, not a requirement for
    rendering.
-   Handle malformed or unavailable stored values.
-   Provide a default style and theme.
-   Do not store personal or sensitive visitor data.
