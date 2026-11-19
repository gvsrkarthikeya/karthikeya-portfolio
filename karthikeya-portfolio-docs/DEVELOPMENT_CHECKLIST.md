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

-   [x] Minimalism
-   [x] Flat Design
-   [x] Material Design
-   [x] Glassmorphism
-   [x] Neumorphism
-   [x] Neubrutalism
-   [x] Skeuomorphism
-   [x] Bento Grid
-   [x] Verify all 16 combinations

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
-   [x] Configure base href
-   [x] Add Actions workflow
-   [x] Configure Pages
-   [x] Verify public deployment
-   [x] Update README with live URL

## Update checklist --- when the job, company or position changes

Whenever the company name or position is updated in
`src/app/core/data/portfolio.data.ts` (headline, summary, experience),
the assistant must ask whether to update these too:

-   [ ] Page title in `src/index.html` (`<title>` and `og:title`)
-   [ ] Meta description and `og:description` in `src/index.html`
-   [ ] README description
-   [ ] GitHub repo About description and profile website text
-   [ ] Resume PDF in `public/resume/`

## Current checkpoint

Phases 1 to 5 are complete: all sections, the appearance engine and
all 8 design styles (verified in 16 style and theme combinations) are
built, the header is sticky on desktop with a back-to-top button, and
the site is live at https://gvsrkarthikeya.github.io/karthikeya-portfolio/
via GitHub Pages. Next up is Phase 6 (portrait, avatar and content) and
Phase 7 (quality checks).
