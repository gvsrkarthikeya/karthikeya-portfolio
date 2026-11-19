# AI Coding Context --- Karthikeya Portfolio

Use this file when continuing the project in another ChatGPT
conversation or with an AI coding assistant.

## Project objective

Build and deploy a professional personal portfolio using Angular +
Bootstrap to GitHub Pages.

## Confirmed decisions

-   Framework: Angular 22 target; verify Node.js compatibility before
    setup.
-   Styling: SCSS and CSS custom properties.
-   Responsive foundation: Bootstrap 5.3.
-   Hosting: GitHub Pages.
-   Initial domain: free `github.io` URL.
-   Eight selectable design styles: Minimalism, Flat Design, Material
    Design, Glassmorphism, Neumorphism, Neubrutalism, Skeuomorphism and
    Bento Grid.
-   Light and dark themes must work independently of design style.
-   Persist visitor appearance preferences with localStorage, with safe
    defaults.
-   Keep content data separate from presentation.
-   Build incrementally and verify each phase before moving forward.

## Visual identity

The user supplied three personal photos as likeness references. The
avatar direction is realistic stylized 3D, smart-casual developer
appearance, navy-blue polo. Glasses should be an alternate version;
no-glasses is the default. Preserve recognizable facial features,
side-swept dark hair, full dark beard and natural proportions.

### Critical image framing requirement

-   Static portfolio images must be head-and-shoulders portraits with
    the neck and both shoulders visible and naturally connected.
-   Avoid face-only images and avoid a detached-head/body-composite
    appearance.
-   For genuine 3D animation, use full-body assets.
-   Keep real photographs and stylized avatar assets separate.
-   Do not claim that generated still images are a rigged 3D model.

## Known professional content

All career details are placeholders (dummy values) until the user
supplies real ones:

-   [X] years total experience.
-   Experience 1: [Company 1], [Role 1], [dates].
-   Experience 2: [Company 2], [Role 2], [dates].
-   Skill 1, Skill 2, Skill 3 ... (grouped, with honest proficiency).
-   Project 1, Project 2 ... (generalized; no confidential details).
-   Education 1: [Degree], [Institution], [dates].

## Working method

1.  Ask for or inspect the current repository state before changing
    existing code.
2.  Work in small steps.
3.  Explain why a technical decision is being made.
4.  Provide exact commands and complete file contents where useful.
5.  Ask the user to run/test the step and share errors before
    continuing.
6.  Update `DEVELOPMENT_CHECKLIST.md` as actual progress is made.
7.  Never claim code was run, tested, committed or deployed unless that
    action was actually performed.
8.  Do not invent profile facts, project metrics, social links or
    credentials.
9.  Keep all eight design styles and both themes in the test plan.

## First implementation task

Ask the user to run:

``` bash
node -v
npm -v
git --version
ng version
```

Check Angular 22's supported Node.js range against the actual Node
version. Then create the Angular application with routing and SCSS, run
it locally, and confirm the first checkpoint before installing
additional packages.
