# Development Checklist

Use this file as the single progress tracker. Update it as work is
completed; do not mark a task complete without testing it.

## Documentation

-   [x] Initial product direction captured
-   [x] Eight design styles documented
-   [x] Independent light/dark theme requirement documented
-   [x] Static portrait and full-body animation asset rules documented
-   [ ] User reviews and approves documentation package

## Phase 1 --- Environment

-   [x] Verify Node.js version
-   [x] Verify npm and Git
-   [x] Verify Angular CLI availability or use `npx`
-   [x] Create Angular project
-   [x] Run app locally
-   [x] Initialize baseline Git commit

## Phase 2 --- Foundation

-   [x] Install Bootstrap
-   [x] Create folder structure
-   [x] Create models
-   [x] Build application shell

## Phase 3 --- Shared UI and content

-   [x] Header
-   [x] Footer
-   [x] Hero
-   [x] About
-   [x] Experience
-   [x] Skills
-   [x] Projects
-   [x] Education
-   [x] Contact

## Phase 4 --- Appearance engine

-   [x] Appearance service
-   [x] Style selector
-   [x] Theme toggle
-   [x] localStorage persistence
-   [x] Invalid storage fallback

## Phase 5 --- Design systems

-   [ ] Minimalism
-   [ ] Flat Design
-   [ ] Material Design
-   [ ] Glassmorphism
-   [ ] Neumorphism
-   [ ] Neubrutalism
-   [ ] Skeuomorphism
-   [ ] Bento Grid
-   [ ] Verify all 16 combinations

## Phase 6 --- Assets and content

-   [ ] Approve real portrait
-   [ ] Approve default avatar
-   [ ] Approve glasses alternate
-   [ ] Generate any additional poses
-   [ ] Add verified profile content
-   [ ] Add approved public links

## Phase 7 --- Quality

-   [ ] Responsive checks (mobile first: 320px upward, no horizontal scroll)
-   [ ] Accessibility checks
-   [ ] Image optimization
-   [ ] Unit tests
-   [ ] Production build

## Phase 8 --- Deployment

-   [x] Create GitHub repository
-   [ ] Configure base href
-   [ ] Add Actions workflow
-   [ ] Configure Pages
-   [ ] Verify public deployment
-   [ ] Update README with live URL

## Current checkpoint

Phases 1 and 2 are complete: the Angular app runs locally with
Bootstrap, the folder structure and typed models are in place, and CI
validates tests and the production build on every pull request. Next
up is Phase 3, starting with the header, footer and hero.
