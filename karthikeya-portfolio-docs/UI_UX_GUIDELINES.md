# UI/UX Guidelines

## Layout

-   Use a consistent content width and spacing scale.
-   Keep the primary navigation compact.
-   Make the hero communicate role, experience and next action quickly.
-   Use clear section hierarchy and avoid overloading the homepage.
-   Use a responsive Bootstrap grid; do not force desktop bento layouts
    onto mobile.

## Navigation

-   Brand/name at the left.
-   Section links in the center or right.
-   Design style dropdown.
-   Light/dark toggle.
-   Mobile menu must be keyboard accessible and usable by touch.

## Accessibility

-   Semantic landmarks: header, nav, main, section and footer.
-   Logical heading order.
-   Keyboard access for dropdowns, toggles and links.
-   Visible focus indicators in all design styles.
-   Meaningful alt text for informative images.
-   Do not communicate state by color alone.
-   Respect reduced-motion preferences.
-   Check text and control contrast in every style/theme combination.

## Responsive behavior

Test at approximately 360px, 390px, 768px, 1024px and 1440px widths. -
No horizontal page overflow. - Navigation collapses cleanly. -
Typography scales without clipping. - Cards stack appropriately. -
Images preserve their intended crop and aspect ratio.

## Motion

Use restrained transitions for theme/style changes and component
entrance. Avoid continuous decorative motion by default. If a 3D avatar
animation is later added, provide a static fallback and reduced-motion
behavior.

## Performance

-   Prefer WebP/AVIF where supported, with suitable fallback strategy.
-   Lazy-load below-the-fold images.
-   Avoid shipping large animation files on initial page load.
-   Use poster images for video/3D animation until interaction or
    visibility requires loading.
