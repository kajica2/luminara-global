# LUMINARA — `luminara-global`

Marketing site for the LUMINARA ecosystem.

Stack: Next.js 14 (App Router) · TypeScript · zero runtime deps beyond React.

## Local dev

```bash
npm install
npm run dev          # http://127.0.0.1:3000
```

## Production build

```bash
npm run build
npm run start        # serves the optimized build on :3000
```

The build runs TypeScript + ESLint as gates. Both fail the build if errors exist.

## Deploy

The site is Vercel-ready out of the box. `vercel.json` declares the framework,
build command, output dir, and security headers.

```bash
npx vercel --prod --yes
```

## Lint / typecheck

```bash
npm run lint
npm run typecheck
```

## Smoke test (Playwright)

```bash
npx playwright install --with-deps
npm run test
```

## File map

```
src/
├── app/
│   ├── layout.tsx           # metadata, fonts, shell
│   ├── page.tsx             # composes 5 sections
│   ├── globals.css          # design tokens + resets
│   ├── icon.tsx             # 32×32 favicon (generated)
│   ├── opengraph-image.tsx  # 1200×630 OG image (generated)
│   ├── robots.ts            # /robots.txt
│   ├── sitemap.ts           # /sitemap.xml
│   └── not-found.tsx        # 404
└── components/
    ├── Nav.tsx              # sticky top nav
    ├── Hero.tsx             # headline + terminal visual
    ├── Pillars.tsx          # 3 product cards
    ├── LiveState.tsx        # "right now" cards
    ├── Manifesto.tsx        # 5 commitments
    ├── GetInvolved.tsx      # contact + links
    └── Footer.tsx           # site footer
```

## Wiring to the live Agent OS backend

The `LiveState` section is intentionally static at build time. To make it
dynamic, replace the static `ITEMS` array with a fetch:

```ts
const res = await fetch("http://127.0.0.1:7788/api/agents/state", { cache: "no-store" });
const data = await res.json();
```

You'll need a server component (`async function LiveState()`), CORS configured
on the Agent OS server, and a reverse proxy if you want it reachable from
Vercel. The dashboard lives at `~/agent_os/workspace/agent-os`.

## Conventions

- All copy is honest. No fake testimonials, no invented stats.
- All numbers in `LiveState` reflect real local state at the time of the
  last commit. If they're out of date, refresh by editing the component.
- No client-side tracking by default. Plausible/Fathom can be wired via
  `NEXT_PUBLIC_ANALYTICS_DOMAIN`.
- No emoji. No stock photography. The aesthetic is dark + monospace +
  restrained accent colors (cyan, purple, gold).
