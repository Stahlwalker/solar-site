# solar-site

Marketing homepage for [Solar](https://docs.solarbuild.dev/) — a runtime UI framework built for AI-generated code. Lives at [solarbuild.dev](https://solarbuild.dev) and links out to the docs.

## Stack

- **[Solar](https://docs.solarbuild.dev/)** — runtime-only UI framework, no build step
- **Prism.js** — syntax highlighting in the code example
- Static files, served as-is

## Project structure

```
my-site/
├── index.html          # Shell, design system CSS, ambient effects
├── main.js             # Mounts the root Solar component
├── components/
│   ├── HomePage.js     # Root page assembler
│   ├── Nav.js          # Top nav with logo and docs link
│   ├── Hero.js         # Headline, tagline, CTAs
│   ├── Features.js     # 4-card feature grid
│   ├── CodeExample.js  # Syntax-highlighted code block
│   └── SiteFooter.js   # Footer with documentation link
└── solar/              # Solar framework runtime (from create-solarbuild)
docs/
└── build-notes.md      # Friction points and feedback for the Solar repo
```

## Running locally

```bash
cd my-site
npx serve .
```

Then open [http://localhost:3000](http://localhost:3000) (or whichever port `serve` picks).

## Deploying

No build step needed — deploy the `my-site/` directory to any static host (Vercel, Netlify, Cloudflare Pages, etc.) and point your domain at it.

## Feedback for the Solar framework

See [`docs/build-notes.md`](./docs/build-notes.md) for issues and workarounds encountered during development — intended as upstream feedback for the Solar repo.
