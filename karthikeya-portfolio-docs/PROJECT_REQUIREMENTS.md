# Project Requirements

## 1. Product summary

Build a personal portfolio website for Karthikeya, a frontend engineer
with [X] years of professional experience across [Experience 1] and
[Experience 2]. All career details are placeholders until supplied.

## 2. Primary audiences

-   Recruiters and hiring managers evaluating experience and skills.
-   Engineering peers reviewing projects and technical interests.
-   Professional contacts looking for contact and social links.

## 3. Core pages/sections

-   Home / Hero
-   About
-   Experience
-   Skills
-   Projects
-   Education
-   Contact
-   Optional writing/blog section (later phase)

A single-page portfolio with anchored sections is acceptable for the
first release. Use Angular routing only where it adds clear value.

## 4. Functional requirements

-   Visitors can select one of eight design styles from the navigation.
-   Visitors can independently switch between light and dark themes.
-   Selected style and theme persist across refreshes using
    localStorage.
-   The site works without localStorage; use safe defaults if storage is
    unavailable.
-   Navigation works on desktop and mobile.
-   Resume link is configurable and only shown when a real resume file
    is supplied.
-   Email, LinkedIn and GitHub links are configurable and must not be
    invented.
-   Project cards support title, summary, technologies,
    role/contribution and a verified project link when available.
-   Images have meaningful alt text; decorative images use empty alt
    text.

## 5. Non-functional requirements

-   Responsive at common mobile, tablet and desktop widths.
-   Keyboard operable; visible focus indicators.
-   Adequate contrast in every style/theme combination.
-   Avoid motion that causes discomfort; respect
    `prefers-reduced-motion`.
-   Optimize images and lazy-load below-the-fold media.
-   No secrets, private work code or confidential employer information
    in the repository.
-   Keep initial release static; no backend is required.

## 6. Content accuracy

Use only confirmed user-provided career details. Do not invent
employers, dates, metrics, project names, URLs, awards or
certifications. Employer project descriptions must be generalized where
confidentiality requires it.

## 7. Explicit visual asset rule

-   Static portrait assets: head-and-shoulders framing with the full
    neck and both shoulders naturally visible. Do not use face-only
    crops or artificial head/body composites.
-   3D animation assets: full-body source assets are preferred to
    support believable body movement and gestures.
-   Keep the real photograph and stylized avatar as separate assets.
-   Maintain consistent facial likeness, hairstyle, beard, skin tone and
    proportions across avatar poses.
