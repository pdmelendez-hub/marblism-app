# Pick up here — marblism.app

Quick handoff so future-you can resume cold.

## What exists now

- **Repo**: https://github.com/pdmelendez-hub/marblism-app (branch: `main`)
- **Local path**: `C:\Users\pd_me\OneDrive\Desktop\marblism-app`
- **Stack**: Astro 4, plain CSS, no JS framework
- **Domain**: `marblism.app` already added to your Cloudflare account
- **Status**: Site is built, committed, pushed. **Not yet deployed to Cloudflare Pages.**

## Where we left off

The site is fully designed and aligned with Marblism's brand:
- Teal/cyan palette matching marblism.com
- 6 AI Employees featured (Penny, Eva, Sonny, Stan, Rachel, Linda) with the framing "AI Employees clock in. You cash out."
- Custom SVG logo + favicon
- Contact form wired to Formspree (placeholder ID — needs swapping)
- Production build runs clean

## Three things to finish (in order)

### 1. Activate the contact form (5 min)

1. Sign up at https://formspree.io (free tier — 50 submissions/month)
2. Create a new form, copy the form ID (the bit after `/f/` in its URL)
3. Open `src/components/Contact.astro`, line ~4
4. Replace `your-formspree-id` with your real ID
5. In Formspree dashboard, set the notification email (where leads go)

### 2. Deploy to Cloudflare Pages (5–10 min)

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Authorize GitHub (if not already), select repo `marblism-app`
3. Build settings:
   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Environment variable**: add `NODE_VERSION` = `20`
4. **Save and Deploy** → you'll get a `*.pages.dev` URL within ~2 minutes

### 3. Point marblism.app at the deployment

1. In the Pages project → **Custom domains** → **Set up a custom domain**
2. Add `marblism.app` — Cloudflare auto-creates the DNS record since the domain is already in your account
3. Repeat for `www.marblism.app` (recommended)
4. SSL is automatic; allow ~5 min for certificate provisioning

## Things you may still want to tweak

- **Brand name**: currently "Marblism Partners" — change in `src/components/Nav.astro` (logo SVG text) and `src/components/Footer.astro`. Logo file is `public/logo.svg`.
- **Contact email**: `hello@marblism.app` appears in `Contact.astro` and `Footer.astro` — search-and-replace.
- **Calendly link**: not currently surfaced (form replaced the booking button). If you want a "Book a call" button back, ask and I'll add it.
- **Hero subhead** lists Penny/Eva/Sonny/Stan/Rachel/Linda by name — fine if you're a Marblism partner; remove if you ever decouple.
- **OG/social share image**: not yet created. The favicon and logo SVGs exist but no `og-image.png`. Worth adding before any social sharing.
- **Marblism trademark line** in the footer — adjust wording if your partnership has specific branding requirements.

## File map

```
marblism-app/
├── src/
│   ├── pages/index.astro        ← page composition
│   ├── layouts/Layout.astro     ← global CSS, color vars, fonts
│   └── components/
│       ├── Nav.astro            ← top nav + logo
│       ├── Hero.astro           ← "AI Employees clock in. You cash out."
│       ├── Services.astro       ← 6 AI Employees grid (id="team")
│       ├── UseCases.astro       ← SMB use cases (id="use-cases")
│       ├── Process.astro        ← 3-step process (id="process")
│       ├── Contact.astro        ← Formspree form (id="contact")
│       └── Footer.astro
├── public/
│   ├── logo.svg                 ← header/footer logo
│   └── favicon.svg              ← tab icon
├── astro.config.mjs             ← site URL set to https://marblism.app
├── package.json
└── README.md                    ← dev + deploy instructions
```

## Dev commands

```bash
cd "C:\Users\pd_me\OneDrive\Desktop\marblism-app"
npm install      # only needed once
npm run dev      # http://localhost:4321 (Astro picks the port)
npm run build    # outputs to ./dist
npm run preview  # serve the production build locally
```

## Open questions to resolve later

- Do you want the **Calendly booking button** added back alongside the form?
- Should the contact form use **Cloudflare Pages Functions + Resend** instead of Formspree? (more setup, no per-submission limit, leads go straight to your email via your own domain)
- Add **case studies / testimonials** section once you have client wins?
- Add a **partner referral page** at `/affiliate` mirroring marblism.com/affiliate's structure (for businesses you'd send to Marblism with your link)?

Sleep well. 🌙
