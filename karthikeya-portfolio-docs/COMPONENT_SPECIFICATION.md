# Angular Component Specification

## Application shell

### `AppComponent`

-   Owns the global shell.
-   Renders header, main routed/section content and footer.
-   Does not own detailed portfolio content.

### `SiteHeaderComponent`

-   Displays brand/name and section navigation.
-   Hosts style selector and theme toggle.
-   Supports keyboard and mobile navigation.

### `StyleSelectorComponent`

-   Displays all eight design styles.
-   Shows selected style.
-   Calls the appearance service; does not manipulate document
    attributes directly.

### `ThemeToggleComponent`

-   Switches light/dark mode independently of design style.
-   Exposes accessible label and pressed/checked state.

### `SiteFooterComponent`

-   Displays approved social/contact links and copyright text.

## Feature components

-   `HeroComponent`: name, professional headline, short summary, primary
    CTA and approved portrait/avatar.
-   `AboutComponent`: professional summary and selected personal
    details.
-   `ExperienceComponent`: chronological employment and contribution
    summaries.
-   `SkillsComponent`: grouped technical skills with honest proficiency
    representation.
-   `ProjectsComponent`: project cards sourced from typed data.
-   `EducationComponent`: approved education information.
-   `ContactComponent`: approved contact methods.

## Services

### `AppearanceService`

-   Owns `DesignStyle` and `ColorTheme`.
-   Validates and restores localStorage preferences.
-   Applies root attributes.
-   Exposes observable/signal state to components.
-   Does not mix style selection with theme selection.

### `PortfolioDataService`

-   Exposes typed profile, experience, skill, project and education
    data.
-   Content is static for the first release.

## Models

Create TypeScript interfaces for profile, experience, skill group,
project, education and appearance settings. Avoid `any`.

## Component acceptance

Components should be reusable, responsive, accessible and
presentation-focused. Keep business/profile content in data models
rather than duplicating it for each style.
