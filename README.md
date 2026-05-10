# learn.msp.au — site

Free, opinionated training for MSP technicians. Static Astro site deployed to GitHub Pages at <https://learn.msp.au>.

This repository contains only the published site. Authoring source notes and reference material are kept outside this repo.

## Stack

- **Astro 6** — static-first content site
- **React 19** — interactive islands only
- **Tailwind CSS v4** — OKLCH-tokened dark/light themes
- **shadcn/ui** — copy-into-repo accessible primitives
- **MDX + Astro Content Collections** — typed lessons, glossary, quizzes
- **Mermaid** — text-to-SVG diagrams (lazy-loaded client-side on lesson pages)
- **Motion** + **Astro View Transitions** — micro-interactions and SPA-like navigation
- **Pagefind** — static, in-browser, faceted search (⌘K)
- **Cloudflare Web Analytics** — cookieless, no banner needed (optional)

## Local development

```sh
npm install
npm run dev
# open http://localhost:4321
```

The dev server doesn't generate the Pagefind index — search will display a friendly "build to search" message in dev. Run `npm run build` to test search end-to-end.

## Build & verify

```sh
npm run typecheck   # astro check
npm run build       # builds + generates Pagefind index
npm run preview     # serve the production build
```

## Deploy (GitHub Pages)

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds the site and publishes `dist/` to GitHub Pages. The custom domain `learn.msp.au` is wired via `public/CNAME`. Full first-time setup (repo creation, fine-grained PAT, Pages config, DNS) is documented in [`docs/deploy-github.md`](docs/deploy-github.md).

To enable optional Cloudflare Web Analytics, set the repo variable `PUBLIC_CF_BEACON_TOKEN` (Settings → Secrets and variables → Actions → Variables). When unset, no beacon script is emitted.

## Content

All content lives under `src/content/`:

| Collection | Format | Purpose |
|---|---|---|
| `vendors/` | JSON | Vendor metadata (name, accent, status) |
| `courses/` | JSON | Course definitions (vendor, level, lesson order, prereqs, quiz) |
| `lessons/<vendor>/<level>/` | MDX | The actual lesson content |
| `glossary/` | Markdown | Term definitions (auto-linked into lessons via remark plugin) |
| `quizzes/` | JSON | Question banks for final & checkpoint quizzes |
| `paths/` | JSON | Curated cross-vendor learning sequences |

Schemas in `src/content.config.ts` are validated at build time via Zod — broken frontmatter fails the build.

## URL scheme

- `/` — home
- `/vendors/` — vendor index
- `/vendors/<vendor>/` — vendor overview
- `/vendors/<vendor>/<level>/` — course landing
- `/vendors/<vendor>/<level>/<lesson>/` — lesson page
- `/vendors/<vendor>/<level>/quiz/` — final quiz
- `/glossary/` and `/glossary/<term>/`
- `/paths/` and `/paths/<slug>/`
- `/about/`, `/settings/`

## MDX vocabulary

Lessons can drop these components inline:

- `<Callout type="tip|info|warn|danger|success">` — note boxes
- `<Term>` — glossary hovercard (also auto-inserted by remark plugin)
- `<Kbd>` — keyboard shortcut chip
- `<AnnotatedScreenshot>` with `<Hotspot>` children — numbered hotspots over an image
- `<StepThrough>` with `<Step>` children — frame-by-frame UI walkthrough
- `<DecisionTree startId="…">` with `<Question>` / `<Choice>` / `<Outcome>` children — branching troubleshooting flow
- `<Checkpoint slug="…">` — inline 1-3 question quiz

Mermaid code fences are rendered client-side via a small lazy loader (`MermaidLoader.astro`) on lesson pages.

The standard learning-component imports are auto-prepended to every `.mdx` under `src/content/lessons/` by a Vite plugin — authors never type the import boilerplate. See `src/lib/vite-lesson-imports.mjs`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for repo layout, branch strategy, lesson authoring conventions, the quiz schema, and PR review flow.
