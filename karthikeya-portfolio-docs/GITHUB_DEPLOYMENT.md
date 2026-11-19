# GitHub Pages Deployment

## Target

Deploy the Angular portfolio to:
`https://<github-username>.github.io/<repository-name>/`

A custom domain is not required for the first release.

## Repository preparation

-   Create a GitHub repository.
-   Use a clear repository name such as `karthikeya-portfolio`.
-   Push the Angular source to the default branch.
-   Do not commit secrets or confidential employer material.

## Angular base href

GitHub project Pages sites are hosted under a repository subpath. Build
with the correct base href:

``` bash
ng build --configuration production --base-href /<repository-name>/
```

Replace `<repository-name>` with the exact repository name.

## GitHub Actions

Use a workflow that: 1. Checks out the repository. 2. Sets up a
compatible Node.js version. 3. Installs dependencies using the lockfile
(`npm ci`). 4. Builds Angular with the correct base href. 5. Uploads the
generated browser output using the current GitHub Pages artifact action.
6. Deploys using the current GitHub Pages deployment action.

Confirm the actual Angular build output path before configuring the
artifact upload. Do not assume it is always `dist/<project-name>`;
modern Angular application builders may emit a `browser` subdirectory.

## Repository settings

-   Open repository Settings → Pages.
-   Configure publishing through GitHub Actions.
-   Ensure workflow permissions allow Pages deployment.
-   Push to the configured branch to trigger deployment.

## Verification

-   Open the public Pages URL.
-   Confirm CSS, images, fonts and scripts load.
-   Confirm the app is not requesting assets from the domain root
    incorrectly.
-   Test refresh and navigation.
-   Test both themes and all design styles.
-   Check browser console for 404s.

## Notes

GitHub Pages is static hosting. The initial portfolio does not need a
backend. Forms that send messages require a separate service; do not
present a nonfunctional form as working.
