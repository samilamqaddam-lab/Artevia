# Artevia - Project Context Documentation

## Executive Summary

**Artevia** is a print-on-demand (POD) storefront prototype focused on the Moroccan market. It provides a complete creation funnel ("Phase Création") allowing users to customize promotional products (mugs, notepads, pens, folders, USB drives, mousepads, t-shirts, tote bags) with a high-performance Fabric.js-based design editor.

**Target Market**: Moroccan businesses and organizations requiring custom-branded merchandise
**Primary Languages**: French (FR) and Arabic (AR) with full RTL support
**Architecture**: Next.js 14 App Router, Progressive Web App (PWA), offline-first design

---

## Project Metadata

- **Project Name**: Artevia
- **Version**: 0.1.0 (Prototype)
- **Framework**: Next.js 14.2.32 (App Router)
- **Node Version**: >= 18.18.0
- **Package Manager**: npm
- **Primary Languages**: TypeScript, React 18
- **Repository Structure**: Monorepo (single application)

---

## 1. Technical Architecture

### 1.1 Core Technology Stack

#### Frontend
- **React 18.3.1**: UI framework with concurrent features
- **Next.js 14.2.32**: App Router for file-based routing, SSR, and RSC
- **TypeScript 5.4.5**: Strict type safety throughout
- **Tailwind CSS 3.4.4**: Utility-first styling with custom configuration
- **Fabric.js 5.4.0**: High-performance canvas-based design editor

#### State Management
- **Zustand 4.5.2**: Lightweight state management for cart and editor
- **IndexedDB (idb 7.1.1)**: Client-side persistence for design projects
- **localStorage**: RFQ (Request for Quote) state persistence

#### UI Components
- **Radix UI**: Accessible component primitives (Dialog, Popover, Tabs, Toast)
- **Framer Motion 11.0.8**: Declarative animations and transitions
- **Lucide React 0.378.0**: Icon library

#### Internationalization
- **next-intl 3.11.0**: Locale-aware routing and message translation
- **Supported Locales**: French (fr), Arabic (ar)
- **RTL Support**: Automatic layout mirroring for Arabic

#### Backend Integration
- **Supabase 2.58.0**: Database and authentication backend
- **Auth Helpers**: Next.js and React integration for Supabase auth

#### Image Optimization
- **next/image**: Built-in optimization with remote pattern support
- **Sharp 0.33.3**: Image processing library

#### PWA Features
- **Manifest**: App manifest for installable web app
- **Service Worker**: Offline caching strategy
- **Offline Fallback**: User-facing offline mode

### 1.2 Development Tools

#### Testing
- **Jest 29.7.0**: Unit and integration testing
- **Testing Library**: React component testing
- **Playwright 1.44.1**: End-to-end testing
- **jsdom**: DOM environment for Jest

#### Code Quality
- **ESLint 8.57.0**: Linting with Next.js and TypeScript configs
- **Prettier 3.2.5**: Code formatting
- **TypeScript ESLint**: Type-aware linting rules
- **Husky 9.0.11**: Git hooks for pre-commit checks

#### Build Tools
- **PostCSS 8.4.38**: CSS transformations
- **Autoprefixer**: Vendor prefix automation
- **ts-node 10.9.2**: TypeScript execution for scripts

---

## 2. Project Structure

```
artevia/
├── app/                          # Next.js App Router (RSC + pages)
│   ├── [locale]/                # Locale-based routing (fr, ar)
│   │   ├── (store)/            # Store route group (shared layout)
│   │   │   ├── page.tsx        # Homepage
│   │   │   ├── catalog/        # Product catalog
│   │   │   ├── product/[slug]/ # Product detail pages
│   │   │   ├── designs/        # Saved projects gallery
│   │   │   └── rfq/            # RFQ (quote basket) page
│   │   ├── (auth)/             # Auth route group
│   │   │   └── auth/
│   │   │       ├── login/
│   │   │       └── register/
│   │   ├── auth/callback/      # Supabase auth callback
│   │   ├── layout.tsx          # Locale-specific layout
│   │   └── not-found.tsx       # 404 page
│   ├── api/                     # API routes
│   │   ├── rfq/route.ts        # Quote submission endpoint
│   │   └── bat/route.ts        # Design proof (BAT) generation
│   ├── globals.css              # Global Tailwind styles
│   ├── layout.tsx               # Root layout (HTML, lang, dir)
│   └── manifest.ts              # PWA manifest generator
│
├── src/
│   ├── components/              # React components
│   │   ├── auth/               # Login, register forms
│   │   ├── editor/             # Fabric.js design editor
│   │   │   └── DesignEditor.tsx # Main editor component (29k lines)
│   │   ├── home/               # Homepage components
│   │   ├── layout/             # Header, footer, navigation
│   │   ├── product/            # Product detail components
│   │   ├── shared/             # Reusable utility components
│   │   ├── ui/                 # Base UI primitives (Radix wrappers)
│   │   └── Providers.tsx       # Global providers (Toast, Auth)
│   │
│   ├── lib/                     # Library code and data
│   │   ├── editor/             # Editor utilities and configuration
│   │   ├── pdf/                # PDF generation (BAT, quote)
│   │   │   ├── bat.ts
│   │   │   └── quote.ts
│   │   ├── pwa/                # PWA service worker registration
│   │   ├── storage/            # IndexedDB helpers
│   │   │   └── projects.ts     # Project CRUD operations
│   │   ├── supabase/           # Supabase client configuration
│   │   │   ├── browser.ts      # Client-side client
│   │   │   ├── server.ts       # Server-side client
│   │   │   └── types.ts        # Generated types
│   │   ├── utils/              # Utility functions
│   │   │   └── index.ts        # Price calc, RTL detection, formatting
│   │   ├── products.ts         # Product catalog data (840 lines)
│   │   ├── packs.ts            # Predefined product packs with discounts
│   │   ├── product-image-overrides.json # Fetched product images
│   │   └── product-image-queries.json   # Google image search queries
│   │
│   ├── stores/                  # Zustand state management
│   │   ├── editor-store.ts     # Editor state (tool, zoom, guides)
│   │   └── quote-store.ts      # Cart/quote state (persisted)
│   │
│   ├── messages/                # i18n translation dictionaries
│   │   ├── fr.json             # French translations (23k)
│   │   └── ar.json             # Arabic translations (27k)
│   │
│   ├── i18n/                    # Internationalization config
│   │   ├── settings.ts         # Locale definitions, RTL config
│   │   └── request.ts          # next-intl request handler
│   │
│   ├── types/                   # TypeScript type definitions
│   │   └── quote.ts            # Quote-related types
│   │
│   ├── styles/                  # Additional styles (if any)
│   └── tests/                   # Component test utilities
│
├── public/                      # Static assets
│   ├── icons/                   # PWA icons
│   ├── offline.html             # Offline fallback page
│   └── service-worker.js        # PWA service worker
│
├── tests/                       # Test suites
│   ├── unit/                    # Jest unit tests
│   └── e2e/                     # Playwright specs
│
├── scripts/                     # Build and utility scripts
│   └── fetch-product-images.ts  # SerpAPI image fetcher
│
├── docs/                        # Documentation
│   ├── pack-prefill-plan.md    # Pack prefill feature spec
│   ├── supabase-orders.md      # Order capture setup guide
│   └── PROJECT_CONTEXT.md      # This document
│
├── .next/                       # Next.js build output
├── node_modules/                # Dependencies
│
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── next.config.mjs              # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
├── jest.config.ts               # Jest configuration
├── jest.setup.ts                # Jest setup file
├── playwright.config.ts         # Playwright configuration
├── middleware.ts                # Next.js middleware (i18n routing)
├── .eslintrc.js                 # ESLint configuration
├── .prettierrc                  # Prettier configuration
├── .gitignore                   # Git ignore rules
└── .env.local                   # Environment variables (not in git)
```

---

## 3. Core Features

### 3.1 Product Catalog

**8 Product Types** across 4 categories:

#### Office
1. **Notepad (bloc-notes-personnalises)**: Spiral notepads (A4/A5/A6)
   - Methods: Digital printing (100-page, 150-page premium)
   - Zones: Cover, back
   - MOQ: 50 units

2. **Pen (stylos-metal-s1)**: Metal pens
   - Methods: Laser engraving, tampo printing
   - Zones: Barrel, clip
   - MOQ: 30 units

3. **Folder (chemise-a-rabat-classique)**: Presentation folders
   - Methods: Offset printing, digital short-run
   - Zones: Front, pocket
   - MOQ: 100 units

#### Drinkware
4. **Mug (mug-personnalisable-ceramique)**: Ceramic mugs
   - Methods: Sublimation, laser engraving
   - Zones: Wrap (full), logo spot
   - MOQ: 1 unit (retail + wholesale)

#### Tech
5. **USB Drive (cle-usb-16go-bamboo)**: 16GB bamboo USB drives
   - Methods: Laser, UV printing
   - Zones: Recto, verso
   - MOQ: 10 units

6. **Mousepad (tapis-de-souris-soft-touch)**: Soft-touch mousepads
   - Methods: Sublimation, UV printing
   - Zone: Surface
   - MOQ: 10 units

#### Textile
7. **T-Shirt (tshirt-essential-coton)**: Essential cotton tees
   - Methods: Silkscreen, embroidery
   - Zones: Front, back, sleeve
   - MOQ: 20 units

8. **Tote Bag (tote-bag-coton-epais)**: Heavy cotton tote bags
   - Methods: Screen printing, digital printing
   - Zones: Front, back
   - MOQ: 50 units

### 3.2 Design Editor (DesignEditor.tsx)

**High-Performance Fabric.js Canvas** (optimized for 60fps):

#### Features
- **Tools**: Select, text, shapes, image upload
- **Zoom**: Pan and zoom controls
- **Guides**: Bleed, safe zone, print area overlays
- **Layering**: Object z-index management
- **Background**: Customizable canvas background color
- **Export**: PNG, SVG, JSON formats
- **Save/Load**: IndexedDB persistence with thumbnail previews

#### Canvas Configuration
- **DPI**: 300 for print-ready output
- **Safe Margin**: Text-safe zone (e.g., 120px for A5)
- **Bleed Margin**: Full-bleed printing (e.g., 150px for A5)
- **Dimensions**: Product-specific (e.g., 1748x2480 for notepad cover)

#### Performance Optimizations
- Debounced render updates
- Object caching
- Selective rendering
- Off-screen canvas optimization

#### State Management
- **Editor Store** (Zustand): Tool selection, zoom level, guides visibility, dirty flag
- **Local Persistence**: Auto-save to IndexedDB with project metadata

### 3.3 Quote System (RFQ - Request for Quote)

#### Quote Store (Zustand + localStorage)
- **Items**: Array of quote items with product, quantity, method, zone, lead time, color count
- **Modes**: 'logo' (simple logo placement) or 'creative' (custom design)
- **Persistence**: Survives page reloads via localStorage

#### Quote Item Structure
```typescript
type QuoteItem = {
  id: string;                // Unique identifier
  productId: string;         // Product reference
  quantity: number;          // Order quantity
  methodId: string;          // Marking/printing method
  zoneId: string;            // Imprint zone
  leadTimeId: string;        // Lead time (standard/express)
  colorCount: number;        // Number of Pantone colors
  colorwayId: string;        // Product color variant
  mode: 'logo' | 'creative'; // Design complexity
  projectId?: string;        // Link to saved design project
  previewDataUrl?: string;   // Design thumbnail
  batUrl?: string;           // Generated proof URL
  notes?: string;            // Custom notes
};
```

#### Pricing Logic
- **Tiered Pricing**: Unit price decreases with volume
- **Interpolation**: Linear interpolation between tiers
- **Setup Fees**: One-time charge per method
- **Express Surcharge**: Percentage-based for rush orders
- **Discount System**: Pack-based automatic discounts

#### Pack System (packs.ts)
Three predefined packs with automatic discounts:
1. **Pack Onboarding Startup**: Tote bag + notepad + mug + pen (7% discount)
2. **Pack Salon Event**: Notepad + USB + t-shirt (6% discount)
3. **Pack Premium Direction**: Pen + notepad + mug (8% discount)

**Pack Prefill UX**:
- URL parameter: `/rfq?pack=<id>`
- Auto-populate quote with pack items
- Notes field prefilled
- Discount applied automatically when pack complete

### 3.4 Supabase Order Capture

**API Endpoint**: `/api/rfq` (POST)

#### Order Schema
```sql
create table orders (
  id uuid primary key,
  order_id text not null unique,
  status text default 'pending-review',
  received_at timestamptz not null,
  review_eta timestamptz,
  locale text,
  quantity_total int,
  total_amount numeric,
  discount_amount numeric,
  checkout jsonb,
  notes text,
  items jsonb not null,
  discounts jsonb,
  raw_payload jsonb not null,
  created_at timestamptz default now()
);
```

#### Order Flow
1. User completes RFQ form (company, contact, email, phone)
2. Frontend submits to `/api/rfq`
3. Server validates and writes to Supabase
4. Returns order ID and review ETA
5. Sales team manually reviews and confirms

#### Environment Variables
```
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

### 3.5 Internationalization (i18n)

#### Locale System
- **Supported**: French (fr - default), Arabic (ar)
- **Routing**: `/fr/*`, `/ar/*` via Next.js middleware
- **RTL Support**: Automatic layout mirroring for Arabic
  - `dir="rtl"` attribute on `<html>` tag
  - Tailwind RTL utilities (`rtl:` prefix)
  - Right-to-left text flow
  - Mirrored navigation and UI elements

#### Translation Files
- **fr.json** (22,973 bytes): French translations
- **ar.json** (27,085 bytes): Arabic translations

#### Key Translation Patterns
```json
{
  "products.notepad.name": "Bloc-notes spiralé personnalisé",
  "products.notepad.methods.digitalA5_100.name": "Impression numérique A5 (100 pages)",
  "leadTimes.standard": "Délai standard",
  "currency.mad": "MAD"
}
```

#### Currency Formatting
- **MAD** (Moroccan Dirham) for all prices
- Locale-specific number formatting (ar-MA, fr-MA)

#### RTL-Aware Components
- Navigation menus
- Form layouts
- Product grids
- Editor UI panels

---

## 4. Data Models

### 4.1 Product Model

```typescript
type Product = {
  id: string;                      // Unique identifier
  slug: string;                    // URL-friendly slug
  nameKey: string;                 // i18n key for name
  descriptionKey: string;          // i18n key for description
  category: 'drinkware' | 'office' | 'textile' | 'tech';
  heroImage: string;               // Primary product image URL
  gallery: string[];               // Additional images
  moq: number;                     // Minimum order quantity
  colorways: Colorway[];           // Available colors
  brandPalette: string[];          // Suggested brand colors (hex)
  imprintZones: ImprintZone[];     // Printable areas
  methods: MarkingMethod[];        // Available printing methods
  leadTimes: LeadTimeOption[];     // Delivery options
  defaultMethodId: string;         // Default method selection
  defaultZoneId: string;           // Default zone selection
  defaultLeadTimeId: string;       // Default lead time
  creationCanvas: CanvasDimensions; // Editor canvas config
  imageAttributions?: Array<...>;  // Image credits
  imageQuery?: string;             // Google Images query
  imageFetchedAt?: string;         // Fetch timestamp
};
```

### 4.2 Marking Method Model

```typescript
type MarkingMethod = {
  id: string;                      // e.g., 'laser-s1'
  nameKey: string;                 // i18n key
  descriptionKey: string;          // i18n key
  setupFee: number;                // One-time setup cost (MAD)
  maxPantoneColors: number;        // Max color count
  compatibleZones: string[];       // Compatible zone IDs
  priceTiers: PriceTier[];         // Volume pricing
};

type PriceTier = {
  minQuantity: number;             // Tier threshold
  unitPrice: number;               // Price per unit (MAD)
};
```

### 4.3 Canvas Dimensions Model

```typescript
type CanvasDimensions = {
  width: number;                   // Canvas width (px)
  height: number;                  // Canvas height (px)
  safeMargin: number;              // Safe zone margin (px)
  bleedMargin: number;             // Bleed margin (px)
  dpi: number;                     // Target DPI (300)
};
```

### 4.4 Project Storage Model (IndexedDB)

```typescript
type ProjectStore = {
  id: string;                      // UUID
  name: string;                    // User-defined name
  productId: string;               // Associated product
  canvas: Record<string, unknown>; // Fabric.js JSON
  previewDataUrl?: string;         // Base64 thumbnail
  updatedAt: number;               // Unix timestamp
};
```

**Indexes**:
- `productId`: Query projects by product
- `updatedAt`: Sort by modification date

---

## 5. State Management

### 5.1 Editor Store (Zustand, Client-Side)

**Location**: `src/stores/editor-store.ts`

```typescript
type EditorState = {
  projectId?: string;              // Current project ID
  projectName: string;             // Display name
  productId?: string;              // Associated product
  activeTool: EditorTool;          // 'select' | 'text' | 'shape' | 'image'
  zoom: number;                    // Zoom level (1 = 100%)
  guides: EditorGuides;            // Bleed, safe, print visibility
  isDirty: boolean;                // Unsaved changes flag
  backgroundColor: string;         // Canvas background hex
  // ... setters
};
```

**Persistence**: None (session state only)

### 5.2 Quote Store (Zustand + localStorage)

**Location**: `src/stores/quote-store.ts`

```typescript
type QuoteState = {
  items: QuoteItem[];              // Quote basket items
  addItem: (payload) => QuoteItem; // Add item, returns with ID
  updateItem: (id, changes) => void;
  removeItem: (id) => void;
  clear: () => void;
  totalQuantity: () => number;     // Sum all quantities
};
```

**Persistence**: `localStorage` key `artevia-rfq`
**Hydration**: Auto-rehydrates on client mount

### 5.3 IndexedDB Project Storage

**Database**: `artevia-projects`
**Store**: `projects`
**Version**: 1

**Operations** (`src/lib/storage/projects.ts`):
- `upsertProject(project)`: Save or update
- `deleteProject(id)`: Remove project
- `getProject(id)`: Fetch by ID
- `listProjects()`: All projects, sorted by `updatedAt` DESC

---

## 6. Routing & Navigation

### 6.1 Route Structure

**Pattern**: `/[locale]/(route-group)/path`

#### Public Routes (Store Group)
- `/:locale` → Homepage (featured packs, product highlights)
- `/:locale/catalog` → Product catalog (filterable by category)
- `/:locale/product/:slug` → Product detail (specs, editor CTA)
- `/:locale/designs` → Saved projects gallery
- `/:locale/rfq` → Quote basket (with pack prefill support)

#### Auth Routes (Auth Group)
- `/:locale/auth/login` → Login form
- `/:locale/auth/register` → Registration form
- `/:locale/auth/callback` → Supabase callback handler

#### API Routes
- `/api/rfq` → POST quote submission
- `/api/bat` → POST design proof generation

### 6.2 Middleware (i18n)

**File**: `middleware.ts`

**Behavior**:
- Detects locale from URL or browser Accept-Language
- Redirects to locale-prefixed URL if missing
- Sets `dir` attribute for RTL locales
- Uses `localePrefix: 'as-needed'` (omit default 'fr' from URL)

**Matcher**: Excludes `_next`, `_vercel`, static files

---

## 7. Styling & Theming

### 7.1 Tailwind Configuration

**File**: `tailwind.config.ts`

**Key Customizations**:
- **Colors**: Extended palette with brand colors
- **Fonts**: System font stack (sans-serif default)
- **Animations**: Custom keyframes (fade-in, slide-up, etc.)
- **RTL Plugin**: Automatic RTL utilities

**Utility Pattern**:
```jsx
<div className={cn(
  "base-class",
  condition && "conditional-class",
  rtl && "rtl:text-right"
)}>
```

**Helper**: `cn()` from `lib/utils` (clsx + tailwind-merge)

### 7.2 Component Patterns

#### Radix UI Primitives
Wrapped in `src/components/ui/`:
- `Dialog` → Modal component
- `Popover` → Floating panels
- `Tabs` → Tab navigation
- `Toast` → Notification system

**Styling Approach**: Tailwind classes with Radix state classes (e.g., `data-[state=open]:animate-in`)

#### Animation (Framer Motion)
- Page transitions
- Modal enter/exit
- Product card hover effects
- Loading states

---

## 8. Image Management

### 8.1 Product Image System

**Base Images**: Defined in `products.ts` (Unsplash URLs)
**Override System**: `product-image-overrides.json`

**Structure**:
```json
{
  "bloc-notes-personnalises": {
    "heroImage": "https://...",
    "gallery": ["https://...", "https://..."],
    "attributions": [
      {"title": "...", "source": "...", "link": "..."}
    ],
    "query": "custom notepads morocco",
    "fetchedAt": "2024-09-29T21:35:00Z"
  }
}
```

**Merge Logic** (`applyProductImageOverrides`):
1. Override hero image if present
2. Sanitize gallery (remove duplicates, hero)
3. Fallback to base gallery if override empty
4. Apply attributions and metadata

### 8.2 Image Fetcher Script

**File**: `scripts/fetch-product-images.ts`

**SerpAPI Integration**:
```bash
SERPAPI_KEY=xxxxx npm run images:fetch -- --slug notepad --limit 4 --delay 1200
```

**Options**:
- `--slug <slug>`: Target specific product
- `--limit <n>`: Gallery size (default 4)
- `--delay <ms>`: Rate limiting (default 1200ms)
- `--dry-run`: Preview without writing

**Output**: Updates `product-image-overrides.json`

### 8.3 Next/Image Configuration

**Remote Patterns** (next.config.mjs):
- `images.unsplash.com`
- `plus.unsplash.com`
- `source.unsplash.com`
- `upload.wikimedia.org`
- `images.pexels.com`

**Optimization**: Automatic WebP conversion, responsive sizes

---

## 9. Testing Strategy

### 9.1 Unit Tests (Jest)

**Config**: `jest.config.ts`
**Environment**: jsdom
**Setup**: `jest.setup.ts` (Testing Library, custom matchers)

**Test Locations**: `tests/unit/`, `src/**/__tests__/`

**Key Test Areas**:
- Utility functions (price calculation, formatting)
- State management (store actions)
- Component rendering (Testing Library)

**Run Commands**:
```bash
npm run test         # Single run
npm run test:watch   # Watch mode
```

### 9.2 End-to-End Tests (Playwright)

**Config**: `playwright.config.ts`
**Base URL**: `http://127.0.0.1:3000`

**Test Locations**: `tests/e2e/`

**Key Scenarios**:
- Product browsing and detail views
- Editor load and basic operations
- Quote basket CRUD
- Pack prefill flow
- Locale switching and RTL layout

**Run Commands**:
```bash
npm run dev           # Terminal 1: Start dev server
npm run test:e2e      # Terminal 2: Run tests
npm run test:e2e:ui   # Interactive mode
```

**Note**: Playwright requires dev server running

### 9.3 Testing Coverage Goals

**Target Coverage** (not yet enforced):
- **Utilities**: 90%+ (critical business logic)
- **Stores**: 80%+ (state transitions)
- **Components**: 70%+ (user interactions)
- **API Routes**: 80%+ (request validation, responses)

---

## 10. Build & Deployment

### 10.1 Build Process

**Production Build**:
```bash
npm run build    # Next.js build (SSR + SSG)
npm run start    # Production server (port 3000)
```

**Outputs**:
- `.next/` directory (build artifacts)
- Static pages (SSG) for locale roots
- Server-side rendered pages for dynamic routes
- API route handlers

### 10.2 Environment Variables

**Required for Production**:
```bash
# Supabase (order capture)
SUPABASE_URL=https://<ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<key>
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>

# Optional: Image fetcher
SERPAPI_KEY=<key>
```

**File**: `.env.local` (not in git)

### 10.3 Performance Optimizations

#### Next.js Features
- **App Router**: React Server Components (RSC) by default
- **Incremental Static Regeneration (ISR)**: Not yet implemented (future)
- **Image Optimization**: Automatic with next/image
- **Code Splitting**: Automatic route-based splitting
- **Font Optimization**: Not yet implemented (future: next/font)

#### Custom Optimizations
- **Fabric.js**: Object caching, selective rendering
- **IndexedDB**: Batch operations, index-based queries
- **Zustand**: Minimal re-renders via selector pattern
- **Tailwind**: PurgeCSS removes unused styles

#### Bundle Analysis
```bash
# Install analyzer
npm install --save-dev @next/bundle-analyzer

# Analyze bundles
ANALYZE=true npm run build
```

### 10.4 Deployment Targets

**Recommended Platforms**:
1. **Vercel** (optimal for Next.js)
   - Zero-config deployment
   - Edge functions for API routes
   - Automatic preview deployments
   - CDN + caching

2. **Netlify**
   - Next.js plugin support
   - Edge handlers
   - Build hooks

3. **Docker** (self-hosted)
   - Dockerfile not included (needs creation)
   - Standalone output mode
   - Reverse proxy (nginx/caddy) recommended

**Deployment Checklist**:
- [ ] Set environment variables
- [ ] Configure Supabase RLS policies
- [ ] Test PWA manifest and service worker
- [ ] Verify RTL layout on production domain
- [ ] Run Lighthouse audit (target: 90+ performance)
- [ ] Test offline mode
- [ ] Verify image optimization
- [ ] Check CSP headers for Fabric.js canvas

---

## 11. PWA Configuration

### 11.1 Manifest (app/manifest.ts)

**Generated Manifest** (dynamic):
```json
{
  "name": "Artevia",
  "short_name": "Artevia",
  "description": "Print-on-demand creation experience",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "icons": [
    {"src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png"},
    {"src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png"}
  ]
}
```

### 11.2 Service Worker (public/service-worker.js)

**Caching Strategy**:
- **Cache-first**: Static assets (JS, CSS, images)
- **Network-first**: API routes
- **Stale-while-revalidate**: HTML pages

**Offline Fallback**: `/offline.html` for navigation requests

**Registration**: `src/lib/pwa/register-sw.ts` (client-side)

### 11.3 Offline Experience

**Offline Capabilities**:
- View cached catalog pages
- Edit designs (Fabric.js works offline)
- Save projects to IndexedDB
- View saved projects
- Quote basket (localStorage)

**Limitations** (require online):
- Submit RFQ
- Generate BAT PDF
- Fetch new product images
- Supabase authentication

---

## 12. Key Dependencies Deep Dive

### 12.1 Fabric.js (5.4.0)

**Purpose**: High-performance HTML5 canvas library for design editor

**Key Features Used**:
- Object manipulation (move, scale, rotate)
- Text rendering with custom fonts
- Image uploads and filters
- SVG import/export
- JSON serialization (save/load projects)
- Event handling (selection, modification)
- Z-index layering

**Performance Considerations**:
- Enable object caching: `object.set({ objectCaching: true })`
- Use `canvas.renderOnAddRemove = false` during batch operations
- Debounce render calls (requestAnimationFrame)
- Limit max canvas size (handle high-DPI separately)

**Customizations**:
- Custom grid overlays (bleed, safe, print guides)
- Keyboard shortcuts (Delete, Undo, Redo)
- Export with custom DPI scaling

### 12.2 Zustand (4.5.2)

**Purpose**: Minimal state management without boilerplate

**Why Zustand over Redux**:
- Simpler API (no actions, reducers, dispatch)
- Better TypeScript inference
- Smaller bundle size
- No Provider wrapper required
- Built-in persistence middleware

**Store Pattern**:
```typescript
export const useStore = create<State>()(
  persist(
    (set, get) => ({
      // state
      items: [],
      // actions
      addItem: (item) => set({ items: [...get().items, item] }),
    }),
    { name: 'store-key', storage: createJSONStorage(() => localStorage) }
  )
);
```

### 12.3 next-intl (3.11.0)

**Purpose**: Type-safe internationalization for Next.js

**Why next-intl over next-i18next**:
- App Router support (RSC-compatible)
- Automatic locale routing
- TypeScript message keys
- Smaller runtime
- Better DX with auto-completion

**Usage Pattern**:
```tsx
// Server component
import {getTranslations} from 'next-intl/server';
const t = await getTranslations('products');

// Client component
import {useTranslations} from 'next-intl';
const t = useTranslations('products');

// Both
<h1>{t('notepad.name')}</h1>
```

### 12.4 Supabase (2.58.0)

**Purpose**: Backend-as-a-Service (PostgreSQL + Auth + Storage)

**Used Features**:
- PostgreSQL database (orders table)
- Service role client (server-side)
- Anon key client (client-side, if needed for auth)

**Not Yet Used** (future scope):
- Authentication (login/register implemented but not enforced)
- Row-level security (RLS)
- Storage (design file uploads)
- Realtime (order status updates)

**Client Pattern**:
```typescript
// Server-side (API routes)
import { createServerClient } from '@/lib/supabase/server';
const supabase = createServerClient();
await supabase.from('orders').insert(payload);

// Client-side
import { createBrowserClient } from '@/lib/supabase/browser';
const supabase = createBrowserClient();
const { data, error } = await supabase.auth.signIn(credentials);
```

### 12.5 idb (7.1.1)

**Purpose**: IndexedDB wrapper with Promise API

**Why idb**:
- Cleaner API than raw IndexedDB
- Promise-based (vs callbacks)
- TypeScript support
- Small bundle size

**Database Schema**:
```typescript
const db = await openDB('artevia-projects', 1, {
  upgrade(db) {
    const store = db.createObjectStore('projects', { keyPath: 'id' });
    store.createIndex('productId', 'productId');
    store.createIndex('updatedAt', 'updatedAt');
  }
});
```

---

## 13. Code Patterns & Conventions

### 13.1 TypeScript Patterns

#### Strict Mode Enabled
- `strict: true` in tsconfig.json
- No implicit any
- Strict null checks
- No unused locals/parameters (enforced by ESLint)

#### Type Imports
```typescript
import type {Product} from '@/lib/products';  // Type-only import
```

#### Const Assertions
```typescript
export const locales = ['fr', 'ar'] as const;
export type Locale = (typeof locales)[number];  // 'fr' | 'ar'
```

### 13.2 Component Patterns

#### Server Components (Default)
```tsx
// app/[locale]/page.tsx
import {getTranslations} from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations('home');
  return <h1>{t('title')}</h1>;
}
```

#### Client Components
```tsx
'use client';

import {useState} from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

#### Compound Components
```tsx
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

### 13.3 Naming Conventions

#### Files
- **Components**: PascalCase (`ProductCard.tsx`)
- **Utilities**: kebab-case (`price-calculator.ts`)
- **Stores**: kebab-case (`editor-store.ts`)
- **Types**: kebab-case (`quote.ts`)

#### Variables
- **Constants**: UPPER_SNAKE_CASE (`const MAX_ZOOM = 5`)
- **Variables**: camelCase (`const productId = '...'`)
- **Types**: PascalCase (`type Product = {...}`)
- **Interfaces**: PascalCase (`interface IProduct {...}`)

#### Functions
- **Utilities**: camelCase (`formatPrice()`)
- **Components**: PascalCase (`ProductCard()`)
- **Hooks**: camelCase with `use` prefix (`useEditorStore()`)

### 13.4 Import Aliases

**Configured in tsconfig.json**:
```typescript
import {Product} from '@/lib/products';          // @/* → src/*
import {Button} from '@components/ui/button';    // @components/* → src/components/*
import {formatPrice} from '@lib/utils';          // @lib/* → src/lib/*
import {useEditorStore} from '@stores/editor';   // @stores/* → src/stores/*
```

### 13.5 Error Handling

#### API Routes
```typescript
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // validate
    if (!body.email) {
      return Response.json({ error: 'Email required' }, { status: 400 });
    }
    // process
    return Response.json({ success: true });
  } catch (error) {
    console.error('RFQ submission failed:', error);
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

#### Client-Side
```typescript
const handleSubmit = async () => {
  try {
    const response = await fetch('/api/rfq', { method: 'POST', body: JSON.stringify(data) });
    if (!response.ok) throw new Error('Submission failed');
    toast.success('Quote submitted!');
  } catch (error) {
    console.error(error);
    toast.error('Submission failed. Please try again.');
  }
};
```

---

## 14. Known Limitations & Technical Debt

### 14.1 Current Limitations

1. **No Real Backend**
   - Mock pricing (no API integration)
   - Manual order processing
   - No payment gateway

2. **Authentication Not Enforced**
   - Login/register forms exist but not required
   - No protected routes
   - Supabase auth configured but optional

3. **Editor Constraints**
   - No image filters (Fabric.js supports, not implemented)
   - No curved text
   - No template library
   - Single undo/redo level (Fabric.js limitation)

4. **Pack System Incomplete**
   - Pack prefill logic documented but not fully tested
   - Discount calculation exists but not validated in production
   - No UI for pack editing

5. **Product Image Management**
   - Manual fetcher script (not automated)
   - No image CDN (Unsplash rate limits)
   - Attribution display not implemented in UI

6. **Testing Coverage**
   - Basic smoke tests only
   - No integration tests for editor
   - No visual regression tests

7. **SEO Not Optimized**
   - No metadata tags (title, description)
   - No structured data (Product schema)
   - No sitemap generation

8. **Accessibility Gaps**
   - Fabric.js canvas not keyboard-accessible
   - No ARIA labels on editor tools
   - Focus management incomplete

### 14.2 Technical Debt

1. **DesignEditor.tsx Size**
   - 29,881 lines (monolithic component)
   - Should be split into smaller components
   - Difficult to test and maintain

2. **Type Safety Gaps**
   - `any` used in editor canvas serialization
   - Fabric.js typings incomplete
   - Missing types for some Radix UI props

3. **Performance Bottlenecks**
   - Large product data file (26KB products.ts)
   - No pagination on project gallery
   - No lazy loading for editor tools

4. **Hardcoded Values**
   - DPI values (300) in multiple places
   - Color palette hex codes
   - Lead time multipliers

5. **Missing Validation**
   - Client-side form validation incomplete
   - No zod or yup schemas
   - API route validation minimal

---

## 15. Future Roadmap

### 15.1 Phase 2: Backend Integration

**Goals**:
- Real pricing API with live inventory
- Payment gateway (Stripe, PayPal, local Moroccan payment)
- Order management dashboard for sales team
- Email notifications (order confirmation, status updates)

**Technologies**:
- Supabase Functions (TypeScript edge functions)
- Stripe or CMI (local Moroccan payment)
- SendGrid or Resend for email
- Supabase Realtime for order status

### 15.2 Phase 3: Advanced Editor

**Goals**:
- Image filters (brightness, contrast, saturation)
- Curved text along path
- Template library (starter designs)
- Multi-layer export (separate proofs per zone)
- Design collaboration (share link, comments)

**Technologies**:
- Fabric.js filters
- Custom path rendering
- WebRTC for real-time collaboration (future)

### 15.3 Phase 4: Production Workflow

**Goals**:
- Printer integration (auto-export to print shop API)
- Color management (ICC profiles, Pantone matching)
- Preflight checks (resolution, bleed, color space)
- Production scheduling and tracking

**Technologies**:
- Print shop API integration (custom or standard like PrintAPI)
- Sharp for image processing
- PDF/X-1a export for print-ready files

### 15.4 Phase 5: Marketplace Features

**Goals**:
- User accounts with saved designs
- Public design gallery (community templates)
- Design marketplace (buy/sell templates)
- Affiliate system for designers

**Technologies**:
- Supabase Auth + RLS
- Stripe Connect for payouts
- S3-compatible storage for design files

---

## 16. Troubleshooting Guide

### 16.1 Common Issues

#### Build Errors

**Issue**: `Error: Cannot find module '@/lib/products'`
**Solution**: Check `tsconfig.json` paths configuration and restart TypeScript server

**Issue**: `Type error: Property 'xxx' does not exist on type 'YYY'`
**Solution**: Rebuild types with `npm run build` or `npx tsc --noEmit`

#### Runtime Errors

**Issue**: Fabric.js canvas not rendering
**Solution**:
- Check browser console for errors
- Verify `<canvas>` element exists in DOM
- Ensure Fabric.js loaded (check network tab)
- Clear browser cache

**Issue**: IndexedDB quota exceeded
**Solution**:
- Clear browser data for localhost:3000
- Reduce preview thumbnail size in `projects.ts`
- Implement project cleanup (delete old projects)

**Issue**: Locale switching not working
**Solution**:
- Verify middleware.ts is not excluded in next.config.mjs
- Check browser cookies (Next-Locale)
- Clear .next cache: `rm -rf .next`

#### API Route Errors

**Issue**: `/api/rfq` returns 500
**Solution**:
- Check `.env.local` for Supabase credentials
- Verify Supabase orders table exists (see supabase-orders.md)
- Check server logs: `npm run dev` output

**Issue**: CORS errors on API routes
**Solution**:
- Add CORS headers to route handlers
- Verify request origin matches allowed domains

### 16.2 Development Tips

**Tip**: Use `npm run dev -- --turbo` for faster HMR (experimental Turbopack)

**Tip**: Enable React DevTools profiler to identify re-render bottlenecks

**Tip**: Use `console.log(JSON.stringify(object, null, 2))` for debugging IndexedDB data

**Tip**: Test RTL layout by adding `?locale=ar` to URL

**Tip**: Use Playwright in headed mode for debugging: `npx playwright test --headed`

---

## 17. Contributing Guidelines (Internal)

### 17.1 Code Review Checklist

- [ ] TypeScript strict mode compliance
- [ ] ESLint/Prettier checks pass
- [ ] Components use proper RSC/Client boundaries
- [ ] Translations added for both FR and AR
- [ ] Accessibility: keyboard navigation, ARIA labels
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] RTL layout tested for Arabic
- [ ] Tests added for new features (unit + e2e)
- [ ] No console.log or debugger statements
- [ ] Performance: no unnecessary re-renders

### 17.2 Git Workflow

**Branch Naming**:
- `feature/pack-prefill-ux`
- `fix/editor-zoom-bug`
- `refactor/split-design-editor`
- `docs/update-readme`

**Commit Messages** (Conventional Commits):
```
feat(editor): add curved text support
fix(rfq): validate email format
refactor(products): extract pricing logic
docs(context): add troubleshooting guide
test(quote): add pack discount tests
```

### 17.3 Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Refactor
- [ ] Documentation

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Translations added (FR + AR)
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes

## Screenshots (if applicable)
```

---

## 18. References & Resources

### 18.1 Official Documentation

- **Next.js 14**: https://nextjs.org/docs
- **React 18**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Fabric.js**: http://fabricjs.com/docs/
- **Zustand**: https://zustand-demo.pmnd.rs/
- **next-intl**: https://next-intl-docs.vercel.app/
- **Supabase**: https://supabase.com/docs
- **Radix UI**: https://www.radix-ui.com/
- **Framer Motion**: https://www.framer.com/motion/

### 18.2 Internal Documents

- `README.md`: Quick start guide
- `docs/pack-prefill-plan.md`: Pack prefill feature specification
- `docs/supabase-orders.md`: Supabase setup guide
- `docs/PROJECT_CONTEXT.md`: This document

### 18.3 External Tools

- **Vercel**: Deployment platform
- **SerpAPI**: Google Images fetcher API
- **Unsplash**: Stock photos
- **Playwright**: E2E testing
- **Jest**: Unit testing

---

## 19. Glossary

**App Router**: Next.js 13+ routing system using `app/` directory (vs. Pages Router with `pages/`)

**BAT (Bon à Tirer)**: French term for "print proof" - final design approval before production

**Bleed**: Print area extending beyond final trim size to ensure no white borders

**Canvas Dimensions**: Width, height, safe margin, bleed margin, DPI for print-ready designs

**Client Component**: React component marked with `'use client'` directive, runs in browser

**Colorway**: Product color variant (e.g., "graphite", "silver", "royal")

**i18n**: Internationalization (locale-aware text and formatting)

**Imprint Zone**: Printable area on a product (e.g., mug wrap, pen barrel)

**IndexedDB**: Browser database API for client-side structured data storage

**Lead Time**: Production and delivery duration (standard vs. express)

**Marking Method**: Printing/branding technique (laser, sublimation, silkscreen, etc.)

**MOQ (Minimum Order Quantity)**: Smallest order size allowed for a product

**Pack**: Predefined bundle of products with automatic discount

**Price Tier**: Volume-based pricing bracket (e.g., 50-199 units @ $10, 200+ @ $8)

**PWA (Progressive Web App)**: Web app with native-app features (offline, installable)

**RFQ (Request for Quote)**: Quote/cart system for custom orders (vs. e-commerce checkout)

**RSC (React Server Component)**: Server-rendered component (default in App Router)

**RTL (Right-to-Left)**: Text direction for Arabic, Hebrew, etc.

**Safe Zone**: Area inside imprint zone where critical elements (text, logos) must stay

**Server Action**: Next.js 13+ server-side function callable from client via RPC

**Setup Fee**: One-time charge per printing method (film, plates, laser calibration)

**Supabase**: Open-source Firebase alternative (PostgreSQL + Auth + Storage)

**Zustand**: Lightweight state management library (alternative to Redux)

---

## 20. Appendix

### 20.1 Quick Command Reference

```bash
# Development
npm run dev                      # Start dev server (localhost:3000)
npm run build                    # Production build
npm run start                    # Start production server
npm run lint                     # Run ESLint
npm run test                     # Run Jest tests
npm run test:watch               # Jest watch mode
npm run test:e2e                 # Run Playwright tests
npm run test:e2e:ui              # Playwright UI mode

# Image fetcher
npm run images:fetch             # Fetch all product images
npm run images:fetch -- --slug notepad --limit 4 --dry-run

# Utilities
npx tsc --noEmit                 # TypeScript type check only
npx next build --debug           # Debug build process
npx next info                    # Display Next.js environment info
```

### 20.2 Environment Variable Reference

```bash
# Supabase (required for order capture)
SUPABASE_URL=https://<ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<key>
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>

# Image fetcher (optional)
SERPAPI_KEY=<key>

# Next.js (auto-set by framework)
NODE_ENV=development|production
NEXT_PUBLIC_VERCEL_URL=<auto-set-on-vercel>
```

### 20.3 File Size Reference

**Large Files** (consider optimization):
- `src/lib/products.ts`: 26,281 bytes (840 lines)
- `src/components/editor/DesignEditor.tsx`: 29,881 bytes (single file)
- `src/messages/fr.json`: 22,973 bytes
- `src/messages/ar.json`: 27,085 bytes
- `src/lib/product-image-overrides.json`: 14,495 bytes

**Total Project Size** (excluding node_modules):
- ~500-600 KB source code
- ~50 MB node_modules (production dependencies only: ~15 MB)

### 20.4 Browser Compatibility

**Tested Browsers**:
- Chrome 120+ (desktop + mobile)
- Firefox 120+ (desktop)
- Safari 17+ (macOS, iOS)
- Edge 120+ (desktop)

**Known Issues**:
- Safari < 16: IndexedDB issues with nested transactions
- Firefox: Fabric.js text rendering slightly different (font metrics)

**Required Browser Features**:
- ES2022 syntax (optional chaining, nullish coalescing)
- CSS Grid + Flexbox
- Canvas API (Fabric.js)
- IndexedDB v2
- Service Worker (for PWA)

### 20.5 License & Credits

**Project License**: Private (not open source)

**Open Source Dependencies**:
- See `package.json` for full dependency list
- All dependencies use permissive licenses (MIT, Apache 2.0, ISC)

**Image Credits**:
- Product photos: Unsplash (free to use)
- Icons: Lucide (ISC license)
- Attributions stored in `product-image-overrides.json`

---

## Document Metadata

**Version**: 1.0.0
**Last Updated**: 2025-10-12
**Author**: Automated documentation generation via Claude Code
**Scope**: Full project architecture and implementation details
**Audience**: Development team, technical stakeholders
