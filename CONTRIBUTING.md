# Contributing to learn.msp.au

Welcome. This site is open for vendor- and community-authored training content.

> **For coursework authors:** every PR that touches `src/content/lessons/` or `src/content/quizzes/` must pass a copyright/voice review and follow the content authoring conventions below. The PR template includes a checkbox confirming both. See [Why the content rules exist](#why-the-content-rules-exist).

## Repository layout

| Path | What lives here |
|---|---|
| `src/content/vendors/` | One JSON per vendor (metadata, accent, status) |
| `src/content/courses/` | One JSON per `<vendor>-l1`/`l2`/`l3` (lesson order, prereqs, quiz) |
| `src/content/lessons/<vendor>/<level>/` | Lesson MDX files |
| `src/content/quizzes/` | Question banks (final per course + inline checkpoints) |
| `src/content/glossary/` | Glossary terms, auto-linked into lessons |
| `src/content/paths/` | Curated cross-vendor learning sequences |
| `src/components/learning/` | The MDX vocabulary (`<Callout>`, `<StepThrough>`, etc.) |
| `src/components/curate/` | Stack-curation UI |
| `src/lib/` | Helpers (progress, quiz, curation, glossary remark) |
| `src/pages/` | Astro routes |
| `docs/` | Deployment + workflow docs |

Schemas in `src/content.config.ts` are validated at build time via Zod — broken frontmatter fails the build.

## Branch strategy

- **`main`** — production. GitHub Pages auto-deploys on merge.
- **`vendor/<slug>`** — vendor content branches. One per vendor product. Examples: `vendor/dnsfilter`, `vendor/huntress`, `vendor/threatlocker`, `vendor/printix`, `vendor/exclaimer`. All lessons, quizzes, and course JSON for that vendor live here until merged.
- **`feat/<short>`** — platform features (e.g. `feat/curation-multi-language`).
- **`fix/<short>`** — bug fixes (e.g. `fix/quiz-shuffle-seed`).
- **`docs/<short>`** — pure documentation changes.

Vendors and community contributors should fork or branch off `main`, push, and open a PR back into `main`.

## Workflow

```sh
# 1. Clone and install
git clone git@github.com:<org>/learn.git
cd learn
npm install

# 2. Branch
git checkout -b vendor/<slug>     # for content
# or
git checkout -b feat/<short>      # for platform changes

# 3. Local dev
npm run dev                       # http://localhost:4321 — hot reload
npm run typecheck                 # astro check — schemas + TS
npm run build                     # full build + Pagefind index

# 4. Commit + push
git add .
git commit -m "content(<vendor>): add L1 lesson 03 — <topic>"
git push -u origin vendor/<slug>

# 5. Open PR on GitHub
```

## Commit messages

Conventional Commits-lite. The first word is one of: `content`, `feat`, `fix`, `docs`, `chore`, `refactor`, `style`, `test`. Optional scope in parens. Imperative mood. Examples:

- `content(huntress): add L1 portal-tour lesson`
- `feat(curate): allow per-level filtering inside vendor pages`
- `fix(quiz): handle empty draw on a single-question pool`
- `docs: add rollback note to GitHub Pages deploy guide`

Keep messages descriptive of the change itself. Refer to internal authoring tooling generically — describe what the pass *does*, not the tool that did it. For example, write "copyright/voice review pass" rather than naming a specific in-house script or skill, and "verified vendor source" rather than naming the system the source was retrieved from. The same applies to PR descriptions.

## Authoring lessons

### MDX vocabulary

Every lesson file under `src/content/lessons/` automatically gets these components imported (via `src/lib/vite-lesson-imports.mjs`) — drop them inline:

- `<Callout type="tip|info|warn|danger|success">` — note boxes
- `<Term>` — glossary hovercard. Most known terms auto-link via the glossary remark plugin; explicit `<Term>` tagging is rarely needed.
- `<Kbd>` — keyboard chip
- `<AnnotatedScreenshot src="..." alt="...">` with `<Hotspot x="..." y="..." label="...">...</Hotspot>` children
- `<StepThrough>` with `<Step title="...">...</Step>` children
- `<DecisionTree startId="...">` with `<Question id prompt>...<Choice label next /></Question>` and `<Outcome id label tone>...</Outcome>` children
- `<Checkpoint slug="<vendor>-<level>-checkpoint-<topic>" />`
- Mermaid code fences (` ```mermaid ... ``` `) — render client-side in the lesson page

### Lesson frontmatter

```yaml
---
slug: 01-what-is-x                       # kebab-case, unique within vendor+level
vendor: dnsfilter                        # references vendors/<slug>.json
level: l1                                # l1 | l2 | l3
title: What X is and where it sits
summary: A 5-minute mental model of how X works.
estimatedMinutes: 6
order: 1                                 # display order within course
topics: [networking, fundamentals]
updated: 2026-05-08
draft: true                              # OMIT or set false when verified
draftReason: ""                          # optional reviewer note shown in banner
---
```

### Layered no-repetition rule

L3 builds on L2 builds on L1 with **no repetition**. When authoring an L2 lesson, do not re-teach concepts already covered in the relevant L1 lesson — link to it instead. Same for L3 → L2.

The scope per level is defined in the per-vendor course-source notes maintained outside this repo. If you don't have access to those, ask a maintainer for the relevant excerpts before writing.

## Quizzes

Each course gets one final quiz; lessons can also embed inline `<Checkpoint>` quizzes.

```json
{
  "slug": "<vendor>-<level>-final",
  "course": "<vendor>-<level>",
  "kind": "final",
  "title": "Vendor L1 — Final check",
  "drawCount": 8,
  "passThreshold": 0.7,
  "questions": [
    { "id": "q-x", "type": "mcq", "prompt": "...", "choices": [...], "correct": 0, "explanation": "..." }
  ]
}
```

Question types: `mcq`, `multi`, `tf`, `hotspot`, `order`. See `src/lib/quiz.ts` for the full discriminated union.

## Curation interaction

The MSP-stack curation system filters which vendors and levels a learner sees. As an author, you don't need to think about it — write the lesson normally. The curation filter is purely client-side and applies to your content automatically based on the vendor slug in frontmatter.

## Why the content rules exist

This site's first attempt at vendor content was authored from general knowledge. Plausible-sounding details — retention windows, installer flag syntax, role names — turned out to be reconstructions, not facts. The content read as confident MSP training but was wrong in specifics that an actual technician would notice.

Two rules came out of that:

- **Copyright/voice review pass.** Removes generic LLM filler, hedge-words, vague claims, padded structure. Catches the smell before it ships.
- **Verified-source rule.** Every factual claim — version numbers, default values, UI labels, retention windows, flag syntax — must trace back to an authoritative vendor source (official docs, vendor knowledge base, release notes) or another verifiable reference cited in the PR description.

If your PR touches lesson MDX or quiz JSON, the PR template includes:

```
- [ ] Copyright/voice review pass complete.
- [ ] Content authoring conventions followed (no-repetition rule, MDX vocabulary, quiz schema).
- [ ] All factual claims trace back to a verified vendor source or another cited verifiable reference.
```

PRs without these checked are not merged.

## Pull request review

1. CI runs typecheck + build on every push to a PR branch.
2. A maintainer (or peer) reviews the rendered build and the source.
3. Squash-merge to `main` triggers production deploy.

Time-to-merge for content PRs is typically same-day if the review checklist is satisfied and the build is green.

## Reporting issues

- **Site bug or platform issue** — open an issue with reproduction steps.
- **Wrong factual claim in a lesson** — open an issue, label `content`, link to the lesson URL, quote the wrong claim, link the source that contradicts it. PRs welcome.
- **Vendor request (new product)** — open an issue, label `vendor-request`. Include the product's docs URL.

## Code of conduct

Be helpful and direct. Disagreement is fine; rudeness isn't. The site exists for techs trying to learn — keep that audience in mind in tone and content.
