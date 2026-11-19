# Testing Strategy

## Unit tests

-   Appearance service defaults.
-   Valid style/theme updates.
-   Independent switching of style and theme.
-   Persistence and restoration.
-   Invalid or malformed stored values.
-   Graceful behavior when localStorage is unavailable.
-   Selector and toggle accessible state.

## Component tests

-   Header navigation links and mobile menu.
-   Style dropdown selection.
-   Theme toggle behavior.
-   Experience and project rendering from data.
-   Contact/social links.

## Visual regression/manual matrix

Test all 16 combinations: - 8 design styles × light and dark themes.

For each combination inspect: - Header/navigation - Hero - About -
Experience - Skills - Projects - Contact - Footer -
Focus/hover/active/disabled states

## Responsive viewports

At minimum: 320px, 375px, 768px, 1024px and 1440px. At every width
check for horizontal scrolling and 44x44px touch targets.

## Accessibility checks

-   Keyboard navigation.
-   Focus order and visibility.
-   Semantic landmarks and heading order.
-   Image alternative text.
-   Contrast checks.
-   Reduced-motion behavior.
-   Dropdown and toggle labels.

## Build and deployment checks

-   Production build succeeds.
-   Correct base href.
-   Assets resolve from repository subpath.
-   Public Pages URL loads.
-   Refresh does not produce a broken route.
-   No console errors or failed asset requests.
