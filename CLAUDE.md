# Arteva — Promotional Products E-Commerce Platform

Arteva (`arteva.ma`) is a print-on-demand promotional products platform for the Moroccan market. Users browse a catalog, configure products (quantity, printing method, colors), design custom artwork via a Fabric.js editor, and submit requests for quotes (RFQ).

## Tech Stack

- **Framework:** Next.js 14.2 (App Router) + TypeScript 5.4
- **UI:** React 18.3, Tailwind CSS 3.4, Radix UI, Framer Motion, Lucide icons
- **State:** Zustand (quote basket + editor state)
- **Design Editor:** Fabric.js 5.4 (lazy-loaded, canvas-based)
- **Database & Auth:** Supabase (PostgreSQL, RLS, JWT auth)
- **Email:** Brevo (transactional emails)
- **i18n:** next-intl — French (default) + Arabic (RTL)
- **Hosting:** Vercel
- **Testing:** Jest + React Testing Library (unit), Playwright (e2e)

## Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Jest unit tests
npm run test:e2e     # Playwright e2e tests
npm run analyze      # Bundle analysis
npm run types:generate  # Regenerate Supabase types
```

## Project Structure

```
app/
├── [locale]/                    # Locale routing (fr, ar)
│   ├── (store)/                 # Public pages
│   │   ├── page.tsx             # Home / landing
│   │   ├── catalog/             # Product listing
│   │   ├── product/[slug]/      # Product configurator + designer
│   │   ├── blog/[slug]/         # Blog articles
│   │   ├── rfq/                 # Quote checkout
│   │   ├── solutions/           # Occasion-based solutions
│   │   ├── account/             # User profile, designs, orders
│   │   └── designs/             # Saved user designs
│   ├── (auth)/                  # Auth pages (login, register, reset)
│   ├── admin/                   # Admin panel
│   │   ├── pricing/             # Price override management
│   │   └── products/            # Product image management
│   └── layout.tsx               # Locale layout with i18n provider
├── api/                         # API routes
│   ├── rfq/                     # Submit quote request
│   ├── bat/                     # Generate BAT (Bon à Tirer) PDF
│   ├── orders/                  # Fetch user orders
│   ├── admin/                   # Admin APIs (pricing, products)
│   ├── auth/                    # Auth callback
│   └── profile/                 # User profile
├── sitemap.ts                   # Dynamic sitemap
├── robots.ts                    # Robots.txt
└── manifest.ts                  # PWA manifest

src/
├── components/
│   ├── editor/                  # Fabric.js design editor
│   │   ├── DesignEditor.tsx     # Main editor wrapper
│   │   ├── CanvaEditor.tsx      # Canvas init & controls
│   │   ├── EditorSidebar.tsx    # Left panel (templates, images, text, shapes)
│   │   ├── EditorHeader.tsx     # Toolbar & save
│   │   ├── PropertyPanel.tsx    # Element properties
│   │   └── CanvasWorkspace.tsx  # Canvas rendering
│   ├── product/                 # Product pages
│   │   ├── ProductExperience.tsx  # Main product configurator
│   │   ├── CatalogView.tsx      # Product grid
│   │   ├── PersonalizationSelector.tsx  # Upload/design/none modes
│   │   └── QuoteBasketView.tsx  # Quote summary
│   ├── blog/                    # Blog list & post views
│   ├── layout/                  # Header, Footer, SiteShell, LanguageSwitcher
│   ├── seo/                     # JSON-LD schemas (Product, Article, Breadcrumb, LocalBusiness)
│   ├── auth/                    # Login, Register, Password reset forms
│   ├── account/                 # Profile, saved designs, orders
│   ├── home/                    # Landing page sections
│   ├── solutions/               # Solutions page
│   ├── shared/                  # Shared UI primitives
│   └── ui/                      # Base UI components
├── lib/
│   ├── products.ts              # Product catalog (12 products, ~879 lines)
│   ├── packs.ts                 # Product bundles with discounts
│   ├── price-overrides.ts       # Dynamic pricing from Supabase
│   ├── blog.ts                  # Blog posts definition (6 posts)
│   ├── email.ts                 # Brevo email service
│   ├── utils/index.ts           # Price calculation, formatting, helpers
│   ├── supabase/                # Supabase client, server client, types
│   ├── auth/roles.ts            # RBAC (user, admin, super_admin)
│   ├── pdf/bat.ts               # BAT PDF generation
│   ├── storage/projects.ts      # IndexedDB design project storage
│   └── logger.ts                # Logging utility
├── stores/
│   ├── quote-store.ts           # Quote basket (Zustand, persisted to localStorage)
│   └── editor-store.ts          # Editor canvas state
├── types/
│   ├── quote.ts                 # QuoteItem types
│   ├── price-overrides.ts       # PriceOverride types
│   └── api-validation.ts        # Zod schemas for API validation
├── i18n/                        # next-intl config (settings, routing, request)
└── messages/
    ├── fr.json                  # French translations (~70KB)
    └── ar.json                  # Arabic translations (~55KB)
```

## Path Aliases

```
@/*           → src/
@components/* → src/components/
@lib/*        → src/lib/
@stores/*     → src/stores/
@styles/*     → src/styles/
@tests/*      → tests/
```

## Core Systems

### 1. Product Catalog (`src/lib/products.ts`)

12 products across 4 categories: `drinkware`, `office`, `textile`, `tech`.

Each product defines:
- `slug` — URL identifier
- `nameKey` / `descriptionKey` — i18n translation keys
- `heroImage` / `gallery[]` — product imagery
- `moq` — minimum order quantity
- `colorways[]` — available colors (name, hex)
- `imprintZones[]` — printable areas with dimensions (width, height, safeMargin, bleedMargin, dpi=300)
- `methods[]` — printing techniques, each with `setupFee` and `priceTiers[]` ({minQuantity, unitPrice})
- `leadTimes[]` — delivery options with optional `surchargePercent`
- `creationCanvas` — design canvas dimensions

### 2. Pricing System (Three Tiers)

**Base prices** — defined per method in `products.ts` as `priceTiers` (quantity breakpoints → unit price) plus `setupFee`.

**Price overrides** — admin can override via Supabase `price_overrides` table, fetched in `src/lib/price-overrides.ts` with `noStore()` for freshness.

**Pack discounts** — bundles in `src/lib/packs.ts` (e.g., "Pack Onboarding Startup" = totebag + notepad + mug + pen at 7% discount). Discount applies only when ALL pack products are in cart with matching quantities/methods.

**Price calculation** (`src/lib/utils/index.ts`):
- `getUnitPrice(method, qty)` — interpolates between price tiers
- `calculateQuoteTotals()` — unitPrice × qty + setupFee + surcharge (lead time surcharge %)

### 3. Product Designer (Fabric.js)

Located in `src/components/editor/`. Users can:
- Add text, shapes, images, use templates
- Canvas dynamically sized to selected imprint zone at 300 DPI
- Safe margin & bleed margin guides displayed
- Save projects to IndexedDB (`src/lib/storage/projects.ts`)
- Export PNG/SVG/JSON
- Generate BAT (Bon à Tirer / print approval) PDF via `/api/bat`

Three personalization modes: `upload` (user uploads file), `creative` (use editor), `none` (no design).

### 4. Quote / RFQ Flow

1. User configures product (quantity, method, colors, design) in `ProductExperience.tsx`
2. Adds to quote basket (Zustand store, persisted to localStorage as `arteva-rfq`)
3. Reviews in `QuoteBasketView.tsx`
4. Submits via `POST /api/rfq` — validated with Zod, creates order in Supabase, sends emails via Brevo

### 5. Blog (`src/lib/blog.ts`)

6 articles defined in code. Content stored as i18n keys in `fr.json`/`ar.json` (rendered with `t.raw()` for HTML). Categories: guide, tendances, conseils, cas-client.

### 6. Auth & RBAC

Supabase Auth with three roles defined in `src/lib/auth/roles.ts`:
- `user` — regular user
- `admin` — manage pricing & products
- `super_admin` — full access

Admin pages at `/admin/pricing` and `/admin/products`.

### 7. Internationalization

- Locales: `fr` (default), `ar` (RTL)
- Config in `src/i18n/settings.ts`
- Timezone: `Africa/Casablanca`
- All user-facing text uses `useTranslations()` / `getTranslations()` with keys from `src/messages/*.json`

### 8. SEO

- JSON-LD schemas in `src/components/seo/`: ProductSchema, ArticleSchema, BreadcrumbSchema, LocalBusinessSchema
- Dynamic sitemap (`app/sitemap.ts`) covering all products, blog posts, and static pages per locale
- Canonical URLs, OpenGraph, Twitter cards
- Product-specific meta tags with SEO-optimized titles/descriptions

## Environment Variables

Required (set in Vercel / `.env.local`):
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role (server-side only)
- `BREVO_API_KEY` — Brevo email API key
- `NEXT_PUBLIC_SITE_URL` — Production site URL (`https://arteva.ma`)

## Key Conventions

- All product/UI text uses i18n keys — never hardcode user-facing strings
- Prices are in MAD (Moroccan Dirham), formatted via `formatPrice(value, locale)`
- Product slugs are used as URL identifiers and must match across products.ts, translations, and SEO configs
- The editor is lazy-loaded to avoid Fabric.js impacting initial bundle size
- API routes validate input with Zod schemas from `src/types/api-validation.ts`
- Email sending is fire-and-forget (non-blocking)
- Supabase queries use `noStore()` where fresh data is needed (pricing)

## Database Tables (Supabase)

| Table | Purpose |
|-------|---------|
| `orders` | RFQ orders with JSON items |
| `price_overrides` | Admin-managed dynamic pricing |
| `product_images` | Hero/gallery images per product |
| `projects` | Saved design projects |
| `design_versions` | Design version history |
| `profiles` | User profile data |

## Brand Note

The project was rebranded from "Artevia" to "Arteva". The GitHub repo is still named `Artevia` but the brand, domain (`arteva.ma`), and all user-facing references use "Arteva".
