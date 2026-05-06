# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

- **Astro 4** (`output: "hybrid"`) with `@astrojs/cloudflare` adapter — see `astro.config.mjs`.
- Plain CSS, no JS framework, no test runner, no linter.
- TypeScript via `astro/tsconfigs/strict`.
- Deployed to Cloudflare Pages. `wrangler.jsonc` configures the Worker (`main: dist/_worker.js/index.js`, assets bound at `dist`).

## Commands

```bash
npm install
npm run dev        # Astro dev server — http://localhost:4321
npm run build      # builds to ./dist (also _worker.js for Cloudflare)
npm run preview    # build + `wrangler dev` (NOT `astro preview` — runs the Worker locally)
npm run deploy     # build + `wrangler deploy`
npm run cf-typegen # regenerate Cloudflare env types
```

There are no tests or linters configured. Verify changes by running `npm run build` (the strict tsconfig will flag type errors) and visually checking pages with `npm run dev`.

## Maintenance vs Live mode — read this before editing pages

The site has two states, switched by `scripts/toggle-maintenance.js`:

- **Maintenance mode (current default state on the deployed site):** `src/pages/index.astro` renders `maintenance.astro`, and every other top-level page (`luxury.astro`, `medspa.astro`, `salon.astro`, `wealth.astro`, `interior-design.astro`, `real-estate.astro`, `office.astro`, `spa.astro`, `travel.astro`) is a one-line stub that imports `RedirectToMaintenance`.
- **Live mode:** the same files are overwritten with the real page bodies, sourced from the `LIVE` object inside `scripts/toggle-maintenance.js`.

**Critical implication:** the script's `LIVE` constant is the source of truth for live-mode page bodies. Editing `src/pages/*.astro` directly while the repo is in maintenance mode is fine for one-off testing, but those edits will be **silently wiped** the next time someone runs the toggle to "off". To make a persistent change to a live page, edit the corresponding string in `scripts/toggle-maintenance.js` (or edit both — the script and the page file — if the repo is currently live).

Layouts, components, and `data/` are unaffected by the toggle and can be edited normally.

The toggle script also runs `git add . && git commit && git push` automatically. Do not run it as a casual side effect — only invoke it when the user explicitly asks to flip modes.

```bash
node scripts/toggle-maintenance.js status   # print mode
node scripts/toggle-maintenance.js on       # force maintenance
node scripts/toggle-maintenance.js off      # force live
node scripts/toggle-maintenance.js          # toggle
```

## Page architecture

Two layouts, picked per page based on visual register:

- `src/layouts/Layout.astro` — light theme, Inter font, teal/cyan palette. CSS custom properties (`--accent`, `--bg`, etc.) are declared here in a global `<style is:global>` block. Used by the homepage and the standard industry pages.
- `src/layouts/LuxuryLayout.astro` — dark theme, Cormorant Garamond + Inter, gold accent. Used by `luxury.astro` and the luxury vertical pages.

The marketing pages are data-driven through two shared components:

- `src/components/industries/IndustryPage.astro` — used by `office.astro`, `spa.astro`, `travel.astro`. Pages pass `employees[]` and `pains[]` arrays plus copy props (`industry`, `tagline`, `subhead`, `cta`, `seoTitle`, `seoDesc`). The same data shape is replicated in the toggle script's `LIVE` strings.
- `src/components/verticals/VerticalPage.astro` — used by the luxury verticals (`medspa`, `salon`, `wealth`, `interior-design`, `real-estate`). Generated in the toggle script via the `verticalPage(slug)` helper, which pulls from a `map` object containing each vertical's content.

The homepage in live mode composes named section components from `src/components/` (`Nav`, `Hero`, `UseCases`, `Services`, `Process`, `Contact`, `Footer`).

## Configuration touch points

- **Formspree ID** is hardcoded as the placeholder `your-formspree-id` in `src/components/Contact.astro` and `src/pages/maintenance.astro`. Both must be updated when activating the form.
- **Referral constants** live in `src/data/referral.ts` (`REFERRAL_URL`, `PARTNER_NAME`, `PARTNER_EMAIL`). Import these instead of hardcoding the partner link or email.
- **Site URL** is `https://marblism.app` in `astro.config.mjs`.
- `public/.assetsignore` excludes `_worker.js` and `_routes.json` from being served as static assets (they are Worker artifacts).

## Branch and deploy

- All work for this task should be on branch `claude/add-claude-documentation-Wt1ua` (per the active task instructions).
- Cloudflare Pages auto-deploys on push to the connected branch — be deliberate about pushing.
- `PICK-UP-HERE.md` and `README.md` contain the original handoff/setup notes (Formspree activation, Cloudflare setup, custom domain). Treat them as historical context; this file supersedes them for day-to-day guidance.
