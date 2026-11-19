# karthikeya-portfolio

My personal portfolio website, built with Angular and Bootstrap.

**Live site:** https://gvsrkarthikeya.github.io/karthikeya-portfolio/

## Development

```bash
npm ci
npm start      # dev server at http://localhost:4200
npm test       # unit tests
npm run build  # production build
```

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`, which tests, builds with
`--base-href /karthikeya-portfolio/` and publishes to GitHub Pages.
