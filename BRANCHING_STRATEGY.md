# Branching and Release Strategy

This repository uses GitHub Flow.

## Permanent branch

- `main` is the deployable branch.
- `main` accepts changes only through reviewed pull requests.
- `main` must have a successful CI build and test run before merging.

## Working branches

Create branches from `main`:

- `feature/<short-description>` for new functionality.
- `fix/<short-description>` for bug fixes.
- `docs/<short-description>` for documentation changes.
- `chore/<short-description>` for maintenance and tooling.

Branch names use lowercase words separated by hyphens.

## Workflow

1. Update local `main` and create a short-lived branch.
2. Make small commits and run `npm test -- --watch=false` plus `npm run build` before opening a pull request.
3. Open a pull request into `main`.
4. CI must pass and the changes must receive approval before merging.
5. Merge with squash merge; delete the source branch afterward.

## Commits

Use a descriptive conventional subject:

- `feat: add appearance selector`
- `fix: correct mobile navigation`
- `docs: update branching strategy`
- `chore: update build workflow`

Do not commit credentials, private keys, confidential work details or build output.
