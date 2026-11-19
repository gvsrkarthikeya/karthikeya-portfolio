# Karthikeya --- Personal Portfolio

An Angular + Bootstrap personal portfolio with eight selectable visual
design systems and independent light/dark themes. The site will be
deployed publicly through GitHub Pages.

## Product goals

-   Present a credible, recruiter-friendly professional profile.
-   Showcase frontend engineering experience, projects, skills and
    education.
-   Demonstrate frontend architecture, reusable components, theming and
    responsive design.
-   Let visitors switch between eight distinct design systems and
    light/dark modes.
-   Keep the experience accessible, fast and usable on mobile, tablet
    and desktop.

## Technology

-   Angular 22 (confirm compatible Node.js before installation)
-   TypeScript
-   SCSS and CSS custom properties
-   Bootstrap 5.3
-   Angular Router
-   GitHub Actions + GitHub Pages
-   Browser localStorage for visitor preferences

## Design modes

Minimalism, Flat Design, Material Design, Glassmorphism, Neumorphism,
Neubrutalism, Skeuomorphism and Bento Grid. Design style and color theme
are independent settings, producing 16 combinations.

## Quick start

``` bash
npx @angular/cli@22 new karthikeya-portfolio --routing --style=scss
cd karthikeya-portfolio
npm install bootstrap
npm start
```

Before creating the project, verify the Node.js version against the
Angular 22 compatibility table. Do not assume an older Node 20 release
is sufficient.

## Documentation

Read `PROJECT_REQUIREMENTS.md`, `TECHNICAL_ARCHITECTURE.md`,
`DESIGN_SYSTEMS.md` and `AVATAR_AND_ASSETS.md` before implementation.

## Deployment

The target is a public GitHub Pages URL:
`https://<github-username>.github.io/<repository-name>/`. Configure
Angular's base href for the repository path and deploy the production
build through GitHub Actions.

## Current status

Documentation and design decisions are being established. Implementation
has not started. Record actual progress in `DEVELOPMENT_CHECKLIST.md`.
