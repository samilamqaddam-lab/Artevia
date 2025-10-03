# Artevia – Frontend Print-On-Demand Experience

Artevia is a Next.js 14 (App Router) storefront prototype focused on the Moroccan print-on-demand market. It ships the full creation funnel for Phase “Création”: public pages, bilingual FR/AR interface with RTL support, a high-performance Fabric.js based editor, local persistence (IndexedDB), offline-first PWA setup, and basic Jest/Playwright tests.

## Stack

- Next.js 14 + React 18 + TypeScript
- Tailwind CSS + Radix UI + Framer Motion
- Fabric.js design editor with safe/bleed guides
- Zustand stores (cart + editor); IndexedDB (`idb`) storage
- next-intl for FR/AR localisation and dynamic RTL handling
- PWA (manifest + service worker) and Next/Image optimisation
- Jest + Testing Library + Playwright smoke tests

## Scripts

```bash
npm run dev          # Start the dev server
npm run build        # Build production bundle
npm run start        # Start production server
npm run lint         # Run Next/ESLint
npm run test         # Run unit tests (Jest)
npm run test:e2e     # Run Playwright tests (requires `npm run dev` in another tab)
```

## Project Structure

```
app/                 # Next.js App Router routes (locale-aware)
src/components/      # UI, layout, editor, and feature components
src/lib/             # Products data, utilities, IndexedDB helpers
src/stores/          # Zustand slices for editor + cart state
src/messages/        # FR & AR translation dictionaries
public/              # PWA assets, service worker, offline fallback
tests/               # Jest unit tests & Playwright e2e specs
```

## Product Imagery Refresh

- `src/lib/product-image-queries.json` contient les requêtes Google Images (FR) par slug produit.
- `src/lib/product-image-overrides.json` stocke les visuels consolidés (héros + galerie) ainsi que les attributs de crédit.
- Exécuter `SERPAPI_KEY=xxxxx npm run images:fetch -- --dry-run` pour tester sans écrire le fichier; supprimer `--dry-run` pour enregistrer les résultats.
- Le script accepte `--slug <slug>` (cibler un produit), `--limit <n>` (taille de galerie, défaut 4) et `--delay <ms>` (1200 ms par défaut) pour rester dans les quotas SerpAPI.
- Les overrides sont appliqués automatiquement lors de l'import `@/lib/products`; les attributs sont exposés via `product.imageAttributions`, `product.imageQuery` et `product.imageFetchedAt`.

## Key Features

- **Design Editor**: Fabric.js canvas tuned for 60fps with bleed/safe guides, zoom, text, shapes, image uploads, layering, exports (PNG/SVG/JSON), and project saving/loading.
- **Local Projects**: IndexedDB persistence with miniature previews, quick load from product or saved projects gallery.
- **FR/AR Localisation**: Locale-aware routing, RTL layout, currency formatting, and UI copy in French & Arabic.
- **PWA Ready**: Manifest, service worker with offline caching, user toasts for offline/updates, responsive mobile-first UI optimised for mid-range devices.
- **Mock Commerce**: Catalogue, product detail, mock cart with local store, and shareable links preserving design context.

## Testing Notes

- Jest configuration uses `next/jest` with jsdom.
- Playwright base URL targets `http://127.0.0.1:3000`; run `npm run dev` before executing Playwright specs.

## Supabase Order Capture (MCP)

The RFQ API writes orders to Supabase when the environment is configured. Add the credentials to `.env.local`:

```
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

Then create the `orders` table using the SQL described in `docs/supabase-orders.md`. Each row stores totals, checkout information, and the full payload so the team can valider les visuels, stock et paiement manuellement.

## Next Steps (Out of Scope)

- Real backend APIs (pricing, auth, fulfilment) and payment integration.
- Advanced design tooling (image filters, curved text, templates).
- Production-grade design export pipeline and printer integration.
