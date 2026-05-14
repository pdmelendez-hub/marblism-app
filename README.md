# marblism-app — Redirect Worker

A tiny Cloudflare Worker whose only job is to 301-redirect every request
to `marblism.app` (and `www.marblism.app`) over to
`https://offthegridsolutions.app`, preserving the path and query string.

The actual site lives in **[`pdmelendez-hub/offthegridsolutions-app`](https://github.com/pdmelendez-hub/offthegridsolutions-app)** (private).

## Why this exists

`marblism.app` was the original domain for this affiliate site. To avoid
trademark confusion with Marblism Inc., the site moved to
`offthegridsolutions.app` in May 2026. This Worker keeps any old
inbound links (bookmarks, social posts, search results) working by
forwarding them to the new home.

## What it does

```
marblism.app/                       → 301 → offthegridsolutions.app/
marblism.app/industries             → 301 → offthegridsolutions.app/industries
marblism.app/spa?utm=email          → 301 → offthegridsolutions.app/spa?utm=email
www.marblism.app/security           → 301 → offthegridsolutions.app/security
```

## Deploy

```bash
npm install -g wrangler   # if not already installed
npx wrangler login        # auth with your Cloudflare account
npx wrangler deploy
```

The Worker is bound to `marblism.app` and `www.marblism.app` as custom
domains via `wrangler.jsonc`. Cloudflare auto-provisions SSL.

## Verify

```bash
curl -sI https://marblism.app | grep -i location
# Expected: location: https://offthegridsolutions.app/
```

## When to decommission

Once analytics show ~0 traffic hitting `marblism.app` (typical timeline:
6–12 months after the 301s are in place), you can:
1. Let the domain registration lapse
2. Delete this Worker from Cloudflare
3. Archive this repo on GitHub

Until then, leave the redirect running — it's free, low-maintenance,
and protects you from broken inbound links.
