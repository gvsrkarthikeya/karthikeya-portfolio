# Implementation Roadmap

Work one phase at a time. Do not skip a checkpoint if the preceding
phase is failing.

## Phase 0 --- Documentation and decisions

-   Review all Markdown specifications.
-   Confirm Angular version and Node.js compatibility.
-   Confirm public profile content and image usage.

Exit criteria: requirements and scope are understood.

## Phase 1 --- Environment and project setup

-   Verify Node, npm and Git.
-   Create Angular standalone application with routing and SCSS.
-   Run the default application locally.
-   Initialize Git and make the baseline commit.

Exit criteria: app runs locally and baseline is committed.

## Phase 2 --- Bootstrap and folder structure

-   Install a compatible Bootstrap 5.3 release.
-   Import Bootstrap CSS and optional JS only where needed.
-   Create folders and shared models.
-   Confirm responsive Bootstrap utilities work.

Exit criteria: clean app shell and folder structure.

## Phase 3 --- Content model and shared components

-   Define profile/experience/project/skill/education models.
-   Build header, footer, section heading and social links.
-   Build first content sections using one baseline visual style.

Exit criteria: complete content skeleton with reusable components.

## Phase 4 --- Appearance engine

-   Define design-style and theme types.
-   Implement appearance service.
-   Apply root data attributes.
-   Persist and restore validated settings.
-   Build style selector and theme toggle.

Exit criteria: independent style/theme switching and persistence work.

## Phase 5 --- Eight design systems

Implement and test each style individually: - Minimalism - Flat Design -
Material Design - Glassmorphism - Neumorphism - Neubrutalism -
Skeuomorphism - Bento Grid

Exit criteria: each style is distinct and readable in light and dark
modes.

## Phase 6 --- Profile content and assets

-   Add approved profile photograph.
-   Add approved avatar assets.
-   Add experience, skills, projects and education.
-   Verify all public claims and links.

Exit criteria: content is accurate and all assets are approved.

## Phase 7 --- Responsive/accessibility polish

-   Test mobile, tablet and desktop.
-   Test keyboard-only navigation.
-   Check focus visibility and contrast.
-   Respect reduced-motion settings.
-   Optimize image loading.

Exit criteria: no blocking responsive or accessibility defects.

## Phase 8 --- Testing

-   Unit test appearance service and components.
-   Test all 16 appearance combinations.
-   Test persistence and invalid localStorage values.
-   Test navigation and links.
-   Run production build.

Exit criteria: tests pass and production build succeeds.

## Phase 9 --- GitHub Pages deployment

-   Create public GitHub repository.
-   Configure base href for repository path.
-   Add GitHub Actions workflow.
-   Configure Pages source/permissions.
-   Deploy and verify public URL.

Exit criteria: public site loads over HTTPS and refresh/navigation work.

## Phase 10 --- Final review

-   Test on a real mobile device.
-   Check metadata, page title and social preview.
-   Check broken links and image loading.
-   Update README with final URL.

Exit criteria: release-ready portfolio.
