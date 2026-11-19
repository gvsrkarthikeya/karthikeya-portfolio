# Coding Standards

## Angular and TypeScript

-   Use standalone components.
-   Use strict TypeScript settings.
-   Prefer explicit interfaces and union types.
-   Avoid `any`; explain unavoidable exceptions.
-   Keep components focused and reasonably small.
-   Use dependency injection for shared state and services.
-   Follow the Angular version's current recommended conventions.

## Naming

-   Components: kebab-case selectors and descriptive class names.
-   Services: `<feature>.service.ts`.
-   Interfaces/types: descriptive PascalCase names.
-   Constants: descriptive names; uppercase only for true constants
    where appropriate.
-   CSS classes: meaningful names; avoid styling by DOM position.

## SCSS/CSS

-   Use design tokens and CSS custom properties.
-   Scope design-specific rules using the root `data-design` attribute.
-   Scope color mode using `data-bs-theme`.
-   Avoid `!important` except for documented third-party overrides.
-   Avoid hardcoded color values in feature components.
-   Ensure focus, hover, active and disabled states are designed.

## Git

-   Use small, meaningful commits.
-   Suggested format: `feat: add appearance selector`,
    `fix: correct mobile navigation`, `docs: update deployment guide`.
-   Never commit credentials, private keys, personal data or
    confidential employer artifacts.
-   Keep generated build output out of source control unless the chosen
    deployment workflow explicitly requires it.

## Review checklist

-   Is the code typed?
-   Is the component reusable?
-   Does it work in all eight styles and both themes?
-   Is it responsive and keyboard accessible?
-   Does it respect reduced motion?
-   Are images optimized?
-   Are there tests for important behavior?
