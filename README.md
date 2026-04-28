# marblism.app

Strategic-partner landing page for Marblism AI referrals & sales to small businesses. Built with [Astro](https://astro.build), deployed to [Cloudflare Pages](https://pages.cloudflare.com/).

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to ./dist
npm run preview  # preview the production build
```

## Editing copy

- Brand name: `src/components/Nav.astro`, `src/components/Footer.astro`
- Hero headline & subhead: `src/components/Hero.astro`
- Services: `src/components/Services.astro` (`services` array)
- Use cases: `src/components/UseCases.astro` (`cases` array)
- Process: `src/components/Process.astro` (`steps` array)
- Contact email & Calendly link: `src/components/Contact.astro`
- Page metadata / SEO: `src/layouts/Layout.astro`

## Deploy to Cloudflare Pages

1. Push to GitHub (already connected if you used `gh repo create`).
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Pick the `marblism-app` repo. Configure:
   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node version**: 20 (env var `NODE_VERSION=20`)
4. Save & deploy. Cloudflare gives you a `*.pages.dev` URL.
5. **Custom domain**: project → **Custom domains** → add `marblism.app` and `www.marblism.app`. Since the domain is already on your Cloudflare account, DNS records are added automatically.
