# Arteva - Documentation de Contexte du Projet

## Résumé Exécutif

**Arteva** est un prototype de boutique d'impression à la demande (POD) ciblant le marché marocain. Il fournit un tunnel de création complet ("Phase Création") permettant aux utilisateurs de personnaliser des produits promotionnels (mugs, blocs-notes, stylos, chemises, clés USB, tapis de souris, t-shirts, tote bags) avec un éditeur de design haute performance basé sur Fabric.js.

**Marché Cible** : Entreprises et organisations marocaines nécessitant des articles personnalisés
**Langues Principales** : Français (FR) et Arabe (AR) avec support RTL complet
**Architecture** : Next.js 14 App Router, Progressive Web App (PWA), conception offline-first

---

## Métadonnées du Projet

- **Nom du Projet** : Arteva
- **Version** : 0.1.0 (Prototype)
- **Framework** : Next.js 14.2.32 (App Router)
- **Version Node** : >= 18.18.0
- **Gestionnaire de Paquets** : npm
- **Langages Principaux** : TypeScript, React 18
- **Structure du Dépôt** : Monorepo (application unique)

---

## 1. Architecture Technique

### 1.1 Stack Technologique Principal

#### Frontend
- **React 18.3.1** : Framework UI avec fonctionnalités concurrentes
- **Next.js 14.2.32** : App Router pour routage basé fichiers, SSR et RSC
- **TypeScript 5.4.5** : Typage strict partout
- **Tailwind CSS 3.4.4** : Styling utility-first avec configuration personnalisée
- **Fabric.js 5.4.0** : Éditeur de design haute performance basé canvas

#### Gestion d'État
- **Zustand 4.5.2** : Gestion d'état légère pour panier et éditeur
- **IndexedDB (idb 7.1.1)** : Persistance côté client pour projets de design
- **localStorage** : Persistance de l'état RFQ (Demande de Devis)

#### Composants UI
- **Radix UI** : Primitives de composants accessibles (Dialog, Popover, Tabs, Toast)
- **Framer Motion 11.0.8** : Animations et transitions déclaratives
- **Lucide React 0.378.0** : Bibliothèque d'icônes

#### Internationalisation
- **next-intl 3.11.0** : Routage locale-aware et traduction de messages
- **Locales Supportées** : Français (fr), Arabe (ar)
- **Support RTL** : Miroir automatique de la mise en page pour l'arabe

#### Intégration Backend
- **Supabase 2.58.0** : Base de données et backend d'authentification
- **Auth Helpers** : Intégration Next.js et React pour auth Supabase

#### Optimisation d'Images
- **next/image** : Optimisation intégrée avec support de patterns distants
- **Sharp 0.33.3** : Bibliothèque de traitement d'images

#### Fonctionnalités PWA
- **Manifest** : Manifeste d'application pour application web installable
- **Service Worker** : Stratégie de cache hors ligne
- **Fallback Offline** : Mode hors ligne visible par l'utilisateur

### 1.2 Outils de Développement

#### Tests
- **Jest 29.7.0** : Tests unitaires et d'intégration
- **Testing Library** : Tests de composants React
- **Playwright 1.44.1** : Tests end-to-end
- **jsdom** : Environnement DOM pour Jest

#### Qualité du Code
- **ESLint 8.57.0** : Linting avec configs Next.js et TypeScript
- **Prettier 3.2.5** : Formatage du code
- **TypeScript ESLint** : Règles de linting type-aware
- **Husky 9.0.11** : Hooks Git pour vérifications pré-commit

#### Outils de Build
- **PostCSS 8.4.38** : Transformations CSS
- **Autoprefixer** : Automatisation des préfixes vendor
- **ts-node 10.9.2** : Exécution TypeScript pour scripts

---

## 2. Structure du Projet

```
arteva/
├── app/                          # Next.js App Router (RSC + pages)
│   ├── [locale]/                # Routage basé locale (fr, ar)
│   │   ├── (store)/            # Groupe de routes boutique (layout partagé)
│   │   │   ├── page.tsx        # Page d'accueil
│   │   │   ├── catalog/        # Catalogue de produits
│   │   │   ├── product/[slug]/ # Pages détail produit
│   │   │   ├── designs/        # Galerie de projets sauvegardés
│   │   │   └── rfq/            # Page RFQ (panier devis)
│   │   ├── (auth)/             # Groupe de routes auth
│   │   │   └── auth/
│   │   │       ├── login/
│   │   │       └── register/
│   │   ├── auth/callback/      # Callback auth Supabase
│   │   ├── layout.tsx          # Layout spécifique locale
│   │   └── not-found.tsx       # Page 404
│   ├── api/                     # Routes API
│   │   ├── rfq/route.ts        # Point de terminaison soumission devis
│   │   └── bat/route.ts        # Génération BAT (Bon à Tirer)
│   ├── globals.css              # Styles Tailwind globaux
│   ├── layout.tsx               # Layout racine (HTML, lang, dir)
│   └── manifest.ts              # Générateur de manifeste PWA
│
├── src/
│   ├── components/              # Composants React
│   │   ├── auth/               # Formulaires login, register
│   │   ├── editor/             # Éditeur de design Fabric.js
│   │   │   └── DesignEditor.tsx # Composant éditeur principal (29k lignes)
│   │   ├── home/               # Composants page d'accueil
│   │   ├── layout/             # Header, footer, navigation
│   │   ├── product/            # Composants détail produit
│   │   ├── shared/             # Composants utilitaires réutilisables
│   │   ├── ui/                 # Primitives UI de base (wrappers Radix)
│   │   └── Providers.tsx       # Providers globaux (Toast, Auth)
│   │
│   ├── lib/                     # Code bibliothèque et données
│   │   ├── editor/             # Utilitaires et config éditeur
│   │   ├── pdf/                # Génération PDF (BAT, devis)
│   │   │   ├── bat.ts
│   │   │   └── quote.ts
│   │   ├── pwa/                # Enregistrement service worker PWA
│   │   ├── storage/            # Helpers IndexedDB
│   │   │   └── projects.ts     # Opérations CRUD projets
│   │   ├── supabase/           # Configuration client Supabase
│   │   │   ├── browser.ts      # Client côté client
│   │   │   ├── server.ts       # Client côté serveur
│   │   │   └── types.ts        # Types générés
│   │   ├── utils/              # Fonctions utilitaires
│   │   │   └── index.ts        # Calcul prix, détection RTL, formatage
│   │   ├── products.ts         # Données catalogue produits (840 lignes)
│   │   ├── packs.ts            # Packs produits prédéfinis avec remises
│   │   ├── product-image-overrides.json # Images produits récupérées
│   │   └── product-image-queries.json   # Requêtes recherche Google Images
│   │
│   ├── stores/                  # Gestion d'état Zustand
│   │   ├── editor-store.ts     # État éditeur (outil, zoom, guides)
│   │   └── quote-store.ts      # État panier/devis (persisté)
│   │
│   ├── messages/                # Dictionnaires de traduction i18n
│   │   ├── fr.json             # Traductions françaises (23k)
│   │   └── ar.json             # Traductions arabes (27k)
│   │
│   ├── i18n/                    # Config internationalisation
│   │   ├── settings.ts         # Définitions locale, config RTL
│   │   └── request.ts          # Gestionnaire requête next-intl
│   │
│   ├── types/                   # Définitions de types TypeScript
│   │   └── quote.ts            # Types liés aux devis
│   │
│   ├── styles/                  # Styles additionnels (si applicable)
│   └── tests/                   # Utilitaires tests composants
│
├── public/                      # Ressources statiques
│   ├── icons/                   # Icônes PWA
│   ├── offline.html             # Page fallback hors ligne
│   └── service-worker.js        # Service worker PWA
│
├── tests/                       # Suites de tests
│   ├── unit/                    # Tests unitaires Jest
│   └── e2e/                     # Specs Playwright
│
├── scripts/                     # Scripts build et utilitaires
│   └── fetch-product-images.ts  # Récupérateur d'images SerpAPI
│
├── docs/                        # Documentation
│   ├── pack-prefill-plan.md    # Spec fonctionnalité préremplissage pack
│   ├── supabase-orders.md      # Guide config capture commandes
│   └── CONTEXTE_PROJET.md      # Ce document
│
├── .next/                       # Sortie build Next.js
├── node_modules/                # Dépendances
│
├── package.json                 # Dépendances et scripts
├── tsconfig.json                # Configuration TypeScript
├── next.config.mjs              # Configuration Next.js
├── tailwind.config.ts           # Configuration Tailwind CSS
├── postcss.config.js            # Configuration PostCSS
├── jest.config.ts               # Configuration Jest
├── jest.setup.ts                # Fichier setup Jest
├── playwright.config.ts         # Configuration Playwright
├── middleware.ts                # Middleware Next.js (routage i18n)
├── .eslintrc.js                 # Configuration ESLint
├── .prettierrc                  # Configuration Prettier
├── .gitignore                   # Règles ignore Git
└── .env.local                   # Variables d'environnement (pas dans git)
```

---

## 3. Fonctionnalités Principales

### 3.1 Catalogue de Produits

**8 Types de Produits** répartis en 4 catégories :

#### Bureau
1. **Bloc-notes (bloc-notes-personnalises)** : Blocs-notes spiralés (A4/A5/A6)
   - Méthodes : Impression numérique (100 pages, 150 pages premium)
   - Zones : Couverture, dos
   - MOQ : 50 unités

2. **Stylo (stylos-metal-s1)** : Stylos métal
   - Méthodes : Gravure laser, tampographie
   - Zones : Corps, clip
   - MOQ : 30 unités

3. **Chemise (chemise-a-rabat-classique)** : Chemises de présentation
   - Méthodes : Offset, numérique court-run
   - Zones : Face, pochette
   - MOQ : 100 unités

#### Articles de Boisson
4. **Mug (mug-personnalisable-ceramique)** : Mugs céramique
   - Méthodes : Sublimation, gravure laser
   - Zones : Enveloppant (complet), logo spot
   - MOQ : 1 unité (détail + gros)

#### Tech
5. **Clé USB (cle-usb-16go-bamboo)** : Clés USB 16GB bambou
   - Méthodes : Laser, impression UV
   - Zones : Recto, verso
   - MOQ : 10 unités

6. **Tapis de souris (tapis-de-souris-soft-touch)** : Tapis de souris soft-touch
   - Méthodes : Sublimation, impression UV
   - Zone : Surface
   - MOQ : 10 unités

#### Textile
7. **T-Shirt (tshirt-essential-coton)** : T-shirts coton essentiel
   - Méthodes : Sérigraphie, broderie
   - Zones : Devant, dos, manche
   - MOQ : 20 unités

8. **Tote Bag (tote-bag-coton-epais)** : Tote bags coton épais
   - Méthodes : Sérigraphie, impression numérique
   - Zones : Devant, dos
   - MOQ : 50 unités

### 3.2 Éditeur de Design (DesignEditor.tsx)

**Canvas Fabric.js Haute Performance** (optimisé pour 60fps) :

#### Fonctionnalités
- **Outils** : Sélection, texte, formes, upload d'images
- **Zoom** : Contrôles pan et zoom
- **Guides** : Superpositions zones fond perdu, sécurité, impression
- **Calques** : Gestion z-index des objets
- **Arrière-plan** : Couleur de fond canvas personnalisable
- **Export** : Formats PNG, SVG, JSON
- **Sauvegarde/Chargement** : Persistance IndexedDB avec vignettes de prévisualisation

#### Configuration Canvas
- **DPI** : 300 pour sortie prête à imprimer
- **Marge de Sécurité** : Zone de sécurité texte (ex: 120px pour A5)
- **Marge de Fond Perdu** : Impression pleine page (ex: 150px pour A5)
- **Dimensions** : Spécifiques au produit (ex: 1748x2480 pour couverture bloc-notes)

#### Optimisations de Performance
- Mises à jour de rendu debouncées
- Cache d'objets
- Rendu sélectif
- Optimisation canvas hors écran

#### Gestion d'État
- **Editor Store** (Zustand) : Sélection outil, niveau zoom, visibilité guides, flag dirty
- **Persistance Locale** : Sauvegarde auto vers IndexedDB avec métadonnées projet

### 3.3 Système de Devis (RFQ - Request for Quote)

#### Quote Store (Zustand + localStorage)
- **Items** : Tableau d'items de devis avec produit, quantité, méthode, zone, délai, nombre couleurs
- **Modes** : 'logo' (placement logo simple) ou 'creative' (design personnalisé)
- **Persistance** : Survit aux rechargements de page via localStorage

#### Structure Quote Item
```typescript
type QuoteItem = {
  id: string;                // Identifiant unique
  productId: string;         // Référence produit
  quantity: number;          // Quantité commande
  methodId: string;          // Méthode marquage/impression
  zoneId: string;            // Zone d'impression
  leadTimeId: string;        // Délai (standard/express)
  colorCount: number;        // Nombre de couleurs Pantone
  colorwayId: string;        // Variante couleur produit
  mode: 'logo' | 'creative'; // Complexité design
  projectId?: string;        // Lien vers projet design sauvegardé
  previewDataUrl?: string;   // Vignette design
  batUrl?: string;           // URL BAT généré
  notes?: string;            // Notes personnalisées
};
```

#### Logique de Tarification
- **Tarification par Paliers** : Prix unitaire diminue avec volume
- **Interpolation** : Interpolation linéaire entre paliers
- **Frais de Montage** : Frais unique par méthode
- **Supplément Express** : Basé pourcentage pour commandes urgentes
- **Système de Remise** : Remises automatiques basées packs

#### Système de Packs (packs.ts)
Trois packs prédéfinis avec remises automatiques :
1. **Pack Onboarding Startup** : Tote bag + bloc-notes + mug + stylo (remise 7%)
2. **Pack Salon Event** : Bloc-notes + USB + t-shirt (remise 6%)
3. **Pack Premium Direction** : Stylo + bloc-notes + mug (remise 8%)

**UX Préremplissage Pack** :
- Paramètre URL : `/rfq?pack=<id>`
- Auto-population du devis avec items du pack
- Champ notes prérempli
- Remise appliquée automatiquement quand pack complet

### 3.4 Capture de Commandes Supabase

**Point de Terminaison API** : `/api/rfq` (POST)

#### Schéma Commande
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

#### Flux de Commande
1. L'utilisateur complète le formulaire RFQ (entreprise, contact, email, téléphone)
2. Le frontend soumet vers `/api/rfq`
3. Le serveur valide et écrit vers Supabase
4. Retourne ID commande et ETA de révision
5. L'équipe commerciale révise et confirme manuellement

#### Variables d'Environnement
```
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

### 3.5 Internationalisation (i18n)

#### Système de Locale
- **Supportées** : Français (fr - par défaut), Arabe (ar)
- **Routage** : `/fr/*`, `/ar/*` via middleware Next.js
- **Support RTL** : Miroir automatique de mise en page pour l'arabe
  - Attribut `dir="rtl"` sur balise `<html>`
  - Utilitaires Tailwind RTL (préfixe `rtl:`)
  - Flux de texte droite-à-gauche
  - Navigation et éléments UI miroirs

#### Fichiers de Traduction
- **fr.json** (22 973 octets) : Traductions françaises
- **ar.json** (27 085 octets) : Traductions arabes

#### Patterns de Clés de Traduction
```json
{
  "products.notepad.name": "Bloc-notes spiralé personnalisé",
  "products.notepad.methods.digitalA5_100.name": "Impression numérique A5 (100 pages)",
  "leadTimes.standard": "Délai standard",
  "currency.mad": "MAD"
}
```

#### Formatage de Devise
- **MAD** (Dirham Marocain) pour tous les prix
- Formatage numérique spécifique locale (ar-MA, fr-MA)

#### Composants RTL-Aware
- Menus de navigation
- Layouts de formulaires
- Grilles de produits
- Panneaux UI éditeur

---

## 4. Modèles de Données

### 4.1 Modèle Produit

```typescript
type Product = {
  id: string;                      // Identifiant unique
  slug: string;                    // Slug URL-friendly
  nameKey: string;                 // Clé i18n pour nom
  descriptionKey: string;          // Clé i18n pour description
  category: 'drinkware' | 'office' | 'textile' | 'tech';
  heroImage: string;               // URL image principale produit
  gallery: string[];               // Images additionnelles
  moq: number;                     // Quantité minimum commande
  colorways: Colorway[];           // Couleurs disponibles
  brandPalette: string[];          // Couleurs marque suggérées (hex)
  imprintZones: ImprintZone[];     // Zones imprimables
  methods: MarkingMethod[];        // Méthodes d'impression disponibles
  leadTimes: LeadTimeOption[];     // Options de livraison
  defaultMethodId: string;         // Sélection méthode par défaut
  defaultZoneId: string;           // Sélection zone par défaut
  defaultLeadTimeId: string;       // Délai par défaut
  creationCanvas: CanvasDimensions; // Config canvas éditeur
  imageAttributions?: Array<...>;  // Crédits images
  imageQuery?: string;             // Requête Google Images
  imageFetchedAt?: string;         // Timestamp récupération
};
```

### 4.2 Modèle Méthode de Marquage

```typescript
type MarkingMethod = {
  id: string;                      // ex: 'laser-s1'
  nameKey: string;                 // Clé i18n
  descriptionKey: string;          // Clé i18n
  setupFee: number;                // Frais montage unique (MAD)
  maxPantoneColors: number;        // Nombre max couleurs
  compatibleZones: string[];       // IDs zones compatibles
  priceTiers: PriceTier[];         // Tarification volume
};

type PriceTier = {
  minQuantity: number;             // Seuil palier
  unitPrice: number;               // Prix par unité (MAD)
};
```

### 4.3 Modèle Dimensions Canvas

```typescript
type CanvasDimensions = {
  width: number;                   // Largeur canvas (px)
  height: number;                  // Hauteur canvas (px)
  safeMargin: number;              // Marge zone sécurité (px)
  bleedMargin: number;             // Marge fond perdu (px)
  dpi: number;                     // DPI cible (300)
};
```

### 4.4 Modèle Stockage Projet (IndexedDB)

```typescript
type ProjectStore = {
  id: string;                      // UUID
  name: string;                    // Nom défini utilisateur
  productId: string;               // Produit associé
  canvas: Record<string, unknown>; // JSON Fabric.js
  previewDataUrl?: string;         // Vignette Base64
  updatedAt: number;               // Timestamp Unix
};
```

**Index** :
- `productId` : Requête projets par produit
- `updatedAt` : Tri par date modification

---

## 5. Gestion d'État

### 5.1 Editor Store (Zustand, Côté Client)

**Emplacement** : `src/stores/editor-store.ts`

```typescript
type EditorState = {
  projectId?: string;              // ID projet actuel
  projectName: string;             // Nom d'affichage
  productId?: string;              // Produit associé
  activeTool: EditorTool;          // 'select' | 'text' | 'shape' | 'image'
  zoom: number;                    // Niveau zoom (1 = 100%)
  guides: EditorGuides;            // Visibilité fond perdu, sécurité, impression
  isDirty: boolean;                // Flag modifications non sauvegardées
  backgroundColor: string;         // Hex arrière-plan canvas
  // ... setters
};
```

**Persistance** : Aucune (état session uniquement)

### 5.2 Quote Store (Zustand + localStorage)

**Emplacement** : `src/stores/quote-store.ts`

```typescript
type QuoteState = {
  items: QuoteItem[];              // Items panier devis
  addItem: (payload) => QuoteItem; // Ajouter item, retourne avec ID
  updateItem: (id, changes) => void;
  removeItem: (id) => void;
  clear: () => void;
  totalQuantity: () => number;     // Somme toutes quantités
};
```

**Persistance** : clé `localStorage` `arteva-rfq`
**Hydratation** : Auto-rehydratation au montage client

### 5.3 Stockage Projet IndexedDB

**Base de Données** : `arteva-projects`
**Store** : `projects`
**Version** : 1

**Opérations** (`src/lib/storage/projects.ts`) :
- `upsertProject(project)` : Sauvegarder ou mettre à jour
- `deleteProject(id)` : Supprimer projet
- `getProject(id)` : Récupérer par ID
- `listProjects()` : Tous projets, triés par `updatedAt` DESC

---

## 6. Routage & Navigation

### 6.1 Structure des Routes

**Pattern** : `/[locale]/(route-group)/path`

#### Routes Publiques (Groupe Store)
- `/:locale` → Page d'accueil (packs vedettes, produits phares)
- `/:locale/catalog` → Catalogue produits (filtrable par catégorie)
- `/:locale/product/:slug` → Détail produit (specs, CTA éditeur)
- `/:locale/designs` → Galerie projets sauvegardés
- `/:locale/rfq` → Panier devis (avec support préremplissage pack)

#### Routes Auth (Groupe Auth)
- `/:locale/auth/login` → Formulaire connexion
- `/:locale/auth/register` → Formulaire inscription
- `/:locale/auth/callback` → Gestionnaire callback Supabase

#### Routes API
- `/api/rfq` → POST soumission devis
- `/api/bat` → POST génération BAT design

### 6.2 Middleware (i18n)

**Fichier** : `middleware.ts`

**Comportement** :
- Détecte locale depuis URL ou Accept-Language navigateur
- Redirige vers URL préfixée locale si manquante
- Définit attribut `dir` pour locales RTL
- Utilise `localePrefix: 'as-needed'` (omet 'fr' par défaut de l'URL)

**Matcher** : Exclut `_next`, `_vercel`, fichiers statiques

---

## 7. Styling & Thématisation

### 7.1 Configuration Tailwind

**Fichier** : `tailwind.config.ts`

**Personnalisations Clés** :
- **Couleurs** : Palette étendue avec couleurs marque
- **Polices** : Stack polices système (sans-serif par défaut)
- **Animations** : Keyframes personnalisées (fade-in, slide-up, etc.)
- **Plugin RTL** : Utilitaires RTL automatiques

**Pattern Utilitaire** :
```jsx
<div className={cn(
  "base-class",
  condition && "conditional-class",
  rtl && "rtl:text-right"
)}>
```

**Helper** : `cn()` depuis `lib/utils` (clsx + tailwind-merge)

### 7.2 Patterns de Composants

#### Primitives Radix UI
Enveloppées dans `src/components/ui/` :
- `Dialog` → Composant modal
- `Popover` → Panneaux flottants
- `Tabs` → Navigation onglets
- `Toast` → Système notifications

**Approche Styling** : Classes Tailwind avec classes d'état Radix (ex: `data-[state=open]:animate-in`)

#### Animation (Framer Motion)
- Transitions de pages
- Entrée/sortie modales
- Effets hover cartes produits
- États de chargement

---

## 8. Gestion d'Images

### 8.1 Système d'Images Produits

**Images de Base** : Définies dans `products.ts` (URLs Unsplash)
**Système Override** : `product-image-overrides.json`

**Structure** :
```json
{
  "bloc-notes-personnalises": {
    "heroImage": "https://...",
    "gallery": ["https://...", "https://..."],
    "attributions": [
      {"title": "...", "source": "...", "link": "..."}
    ],
    "query": "blocs-notes personnalisés maroc",
    "fetchedAt": "2024-09-29T21:35:00Z"
  }
}
```

**Logique de Fusion** (`applyProductImageOverrides`) :
1. Override image héro si présente
2. Sanitiser galerie (supprimer doublons, héro)
3. Fallback vers galerie base si override vide
4. Appliquer attributions et métadonnées

### 8.2 Script Récupérateur d'Images

**Fichier** : `scripts/fetch-product-images.ts`

**Intégration SerpAPI** :
```bash
SERPAPI_KEY=xxxxx npm run images:fetch -- --slug notepad --limit 4 --delay 1200
```

**Options** :
- `--slug <slug>` : Cibler produit spécifique
- `--limit <n>` : Taille galerie (défaut 4)
- `--delay <ms>` : Limitation débit (défaut 1200ms)
- `--dry-run` : Prévisualiser sans écrire

**Sortie** : Met à jour `product-image-overrides.json`

### 8.3 Configuration Next/Image

**Patterns Distants** (next.config.mjs) :
- `images.unsplash.com`
- `plus.unsplash.com`
- `source.unsplash.com`
- `upload.wikimedia.org`
- `images.pexels.com`

**Optimisation** : Conversion WebP automatique, tailles responsives

---

## 9. Stratégie de Tests

### 9.1 Tests Unitaires (Jest)

**Config** : `jest.config.ts`
**Environnement** : jsdom
**Setup** : `jest.setup.ts` (Testing Library, matchers personnalisés)

**Emplacements Tests** : `tests/unit/`, `src/**/__tests__/`

**Zones de Tests Clés** :
- Fonctions utilitaires (calcul prix, formatage)
- Gestion d'état (actions store)
- Rendu composants (Testing Library)

**Commandes d'Exécution** :
```bash
npm run test         # Exécution unique
npm run test:watch   # Mode watch
```

### 9.2 Tests End-to-End (Playwright)

**Config** : `playwright.config.ts`
**URL de Base** : `http://127.0.0.1:3000`

**Emplacements Tests** : `tests/e2e/`

**Scénarios Clés** :
- Navigation produits et vues détails
- Chargement éditeur et opérations basiques
- CRUD panier devis
- Flux préremplissage pack
- Changement locale et layout RTL

**Commandes d'Exécution** :
```bash
npm run dev           # Terminal 1: Démarrer serveur dev
npm run test:e2e      # Terminal 2: Lancer tests
npm run test:e2e:ui   # Mode interactif
```

**Note** : Playwright nécessite serveur dev en cours d'exécution

### 9.3 Objectifs de Couverture Tests

**Couverture Cible** (pas encore appliquée) :
- **Utilitaires** : 90%+ (logique métier critique)
- **Stores** : 80%+ (transitions d'état)
- **Composants** : 70%+ (interactions utilisateur)
- **Routes API** : 80%+ (validation requêtes, réponses)

---

## 10. Build & Déploiement

### 10.1 Processus de Build

**Build Production** :
```bash
npm run build    # Build Next.js (SSR + SSG)
npm run start    # Serveur production (port 3000)
```

**Sorties** :
- Répertoire `.next/` (artefacts build)
- Pages statiques (SSG) pour racines locale
- Pages rendues côté serveur pour routes dynamiques
- Gestionnaires routes API

### 10.2 Variables d'Environnement

**Requis pour Production** :
```bash
# Supabase (capture commandes)
SUPABASE_URL=https://<ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<key>
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>

# Optionnel: Récupérateur images
SERPAPI_KEY=<key>
```

**Fichier** : `.env.local` (pas dans git)

### 10.3 Optimisations de Performance

#### Fonctionnalités Next.js
- **App Router** : React Server Components (RSC) par défaut
- **Regeneration Statique Incrémentale (ISR)** : Pas encore implémenté (futur)
- **Optimisation Image** : Automatique avec next/image
- **Code Splitting** : Découpage automatique basé routes
- **Optimisation Police** : Pas encore implémenté (futur: next/font)

#### Optimisations Personnalisées
- **Fabric.js** : Cache objets, rendu sélectif
- **IndexedDB** : Opérations par lots, requêtes basées index
- **Zustand** : Re-rendus minimaux via pattern selector
- **Tailwind** : PurgeCSS supprime styles non utilisés

#### Analyse Bundle
```bash
# Installer analyzer
npm install --save-dev @next/bundle-analyzer

# Analyser bundles
ANALYZE=true npm run build
```

### 10.4 Cibles de Déploiement

**Plateformes Recommandées** :
1. **Vercel** (optimal pour Next.js)
   - Déploiement zero-config
   - Fonctions edge pour routes API
   - Déploiements preview automatiques
   - CDN + cache

2. **Netlify**
   - Support plugin Next.js
   - Gestionnaires edge
   - Build hooks

3. **Docker** (auto-hébergé)
   - Dockerfile non inclus (nécessite création)
   - Mode sortie standalone
   - Proxy inverse (nginx/caddy) recommandé

**Checklist Déploiement** :
- [ ] Définir variables d'environnement
- [ ] Configurer politiques RLS Supabase
- [ ] Tester manifeste PWA et service worker
- [ ] Vérifier layout RTL sur domaine production
- [ ] Lancer audit Lighthouse (cible: 90+ performance)
- [ ] Tester mode hors ligne
- [ ] Vérifier optimisation images
- [ ] Vérifier headers CSP pour canvas Fabric.js

---

## 11. Configuration PWA

### 11.1 Manifeste (app/manifest.ts)

**Manifeste Généré** (dynamique) :
```json
{
  "name": "Arteva",
  "short_name": "Arteva",
  "description": "Expérience création print-on-demand",
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

**Stratégie de Cache** :
- **Cache-first** : Ressources statiques (JS, CSS, images)
- **Network-first** : Routes API
- **Stale-while-revalidate** : Pages HTML

**Fallback Hors Ligne** : `/offline.html` pour requêtes navigation

**Enregistrement** : `src/lib/pwa/register-sw.ts` (côté client)

### 11.3 Expérience Hors Ligne

**Capacités Hors Ligne** :
- Voir pages catalogue cachées
- Éditer designs (Fabric.js fonctionne hors ligne)
- Sauvegarder projets vers IndexedDB
- Voir projets sauvegardés
- Panier devis (localStorage)

**Limitations** (nécessitent en ligne) :
- Soumettre RFQ
- Générer PDF BAT
- Récupérer nouvelles images produits
- Authentification Supabase

---

## 12. Dépendances Clés en Détail

### 12.1 Fabric.js (5.4.0)

**Objectif** : Bibliothèque canvas HTML5 haute performance pour éditeur design

**Fonctionnalités Clés Utilisées** :
- Manipulation objets (déplacer, échelle, rotation)
- Rendu texte avec polices personnalisées
- Uploads et filtres images
- Import/export SVG
- Sérialisation JSON (sauvegarde/chargement projets)
- Gestion événements (sélection, modification)
- Calques z-index

**Considérations Performance** :
- Activer cache objets: `object.set({ objectCaching: true })`
- Utiliser `canvas.renderOnAddRemove = false` pendant opérations par lots
- Debounce appels render (requestAnimationFrame)
- Limiter taille max canvas (gérer high-DPI séparément)

**Personnalisations** :
- Superpositions grille personnalisées (guides fond perdu, sécurité, impression)
- Raccourcis clavier (Suppr, Annuler, Refaire)
- Export avec mise à l'échelle DPI personnalisée

### 12.2 Zustand (4.5.2)

**Objectif** : Gestion d'état minimale sans boilerplate

**Pourquoi Zustand plutôt que Redux** :
- API plus simple (pas d'actions, reducers, dispatch)
- Meilleure inférence TypeScript
- Taille bundle plus petite
- Pas de wrapper Provider requis
- Middleware persistance intégré

**Pattern Store** :
```typescript
export const useStore = create<State>()(
  persist(
    (set, get) => ({
      // état
      items: [],
      // actions
      addItem: (item) => set({ items: [...get().items, item] }),
    }),
    { name: 'store-key', storage: createJSONStorage(() => localStorage) }
  )
);
```

### 12.3 next-intl (3.11.0)

**Objectif** : Internationalisation type-safe pour Next.js

**Pourquoi next-intl plutôt que next-i18next** :
- Support App Router (compatible RSC)
- Routage locale automatique
- Clés messages TypeScript
- Runtime plus petit
- Meilleure DX avec auto-complétion

**Pattern d'Utilisation** :
```tsx
// Composant serveur
import {getTranslations} from 'next-intl/server';
const t = await getTranslations('products');

// Composant client
import {useTranslations} from 'next-intl';
const t = useTranslations('products');

// Les deux
<h1>{t('notepad.name')}</h1>
```

### 12.4 Supabase (2.58.0)

**Objectif** : Backend-as-a-Service (PostgreSQL + Auth + Storage)

**Fonctionnalités Utilisées** :
- Base de données PostgreSQL (table orders)
- Client service role (côté serveur)
- Client anon key (côté client, si nécessaire pour auth)

**Pas Encore Utilisé** (scope futur) :
- Authentification (login/register implémenté mais pas forcé)
- Row-level security (RLS)
- Storage (uploads fichiers design)
- Realtime (mises à jour statut commande)

**Pattern Client** :
```typescript
// Côté serveur (routes API)
import { createServerClient } from '@/lib/supabase/server';
const supabase = createServerClient();
await supabase.from('orders').insert(payload);

// Côté client
import { createBrowserClient } from '@/lib/supabase/browser';
const supabase = createBrowserClient();
const { data, error } = await supabase.auth.signIn(credentials);
```

### 12.5 idb (7.1.1)

**Objectif** : Wrapper IndexedDB avec API Promise

**Pourquoi idb** :
- API plus propre que IndexedDB brut
- Basé Promise (vs callbacks)
- Support TypeScript
- Taille bundle petite

**Schéma Base de Données** :
```typescript
const db = await openDB('arteva-projects', 1, {
  upgrade(db) {
    const store = db.createObjectStore('projects', { keyPath: 'id' });
    store.createIndex('productId', 'productId');
    store.createIndex('updatedAt', 'updatedAt');
  }
});
```

---

## 13. Patterns de Code & Conventions

### 13.1 Patterns TypeScript

#### Mode Strict Activé
- `strict: true` dans tsconfig.json
- Pas d'any implicite
- Vérifications null strictes
- Pas de locales/paramètres non utilisés (forcé par ESLint)

#### Imports de Types
```typescript
import type {Product} from '@/lib/products';  // Import type uniquement
```

#### Assertions Const
```typescript
export const locales = ['fr', 'ar'] as const;
export type Locale = (typeof locales)[number];  // 'fr' | 'ar'
```

### 13.2 Patterns de Composants

#### Composants Serveur (Par Défaut)
```tsx
// app/[locale]/page.tsx
import {getTranslations} from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations('home');
  return <h1>{t('title')}</h1>;
}
```

#### Composants Client
```tsx
'use client';

import {useState} from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

#### Composants Composés
```tsx
<Dialog>
  <DialogTrigger>Ouvrir</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Titre</DialogTitle>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

### 13.3 Conventions de Nommage

#### Fichiers
- **Composants** : PascalCase (`ProductCard.tsx`)
- **Utilitaires** : kebab-case (`price-calculator.ts`)
- **Stores** : kebab-case (`editor-store.ts`)
- **Types** : kebab-case (`quote.ts`)

#### Variables
- **Constantes** : UPPER_SNAKE_CASE (`const MAX_ZOOM = 5`)
- **Variables** : camelCase (`const productId = '...'`)
- **Types** : PascalCase (`type Product = {...}`)
- **Interfaces** : PascalCase (`interface IProduct {...}`)

#### Fonctions
- **Utilitaires** : camelCase (`formatPrice()`)
- **Composants** : PascalCase (`ProductCard()`)
- **Hooks** : camelCase avec préfixe `use` (`useEditorStore()`)

### 13.4 Alias d'Imports

**Configuré dans tsconfig.json** :
```typescript
import {Product} from '@/lib/products';          // @/* → src/*
import {Button} from '@components/ui/button';    // @components/* → src/components/*
import {formatPrice} from '@lib/utils';          // @lib/* → src/lib/*
import {useEditorStore} from '@stores/editor';   // @stores/* → src/stores/*
```

### 13.5 Gestion d'Erreurs

#### Routes API
```typescript
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // valider
    if (!body.email) {
      return Response.json({ error: 'Email requis' }, { status: 400 });
    }
    // traiter
    return Response.json({ success: true });
  } catch (error) {
    console.error('Échec soumission RFQ:', error);
    return Response.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
```

#### Côté Client
```typescript
const handleSubmit = async () => {
  try {
    const response = await fetch('/api/rfq', { method: 'POST', body: JSON.stringify(data) });
    if (!response.ok) throw new Error('Échec soumission');
    toast.success('Devis soumis!');
  } catch (error) {
    console.error(error);
    toast.error('Échec soumission. Veuillez réessayer.');
  }
};
```

---

## 14. Limitations Connues & Dette Technique

### 14.1 Limitations Actuelles

1. **Pas de Vrai Backend**
   - Tarification mock (pas d'intégration API)
   - Traitement manuel des commandes
   - Pas de passerelle paiement

2. **Authentification Non Forcée**
   - Formulaires login/register existent mais non requis
   - Pas de routes protégées
   - Auth Supabase configurée mais optionnelle

3. **Contraintes Éditeur**
   - Pas de filtres images (Fabric.js supporte, non implémenté)
   - Pas de texte courbé
   - Pas de bibliothèque templates
   - Un seul niveau annuler/refaire (limitation Fabric.js)

4. **Système Pack Incomplet**
   - Logique préremplissage pack documentée mais pas complètement testée
   - Calcul remise existe mais pas validé en production
   - Pas d'UI pour édition pack

5. **Gestion Images Produits**
   - Script récupérateur manuel (pas automatisé)
   - Pas de CDN images (limites débit Unsplash)
   - Affichage attributions pas implémenté dans UI

6. **Couverture Tests**
   - Tests smoke basiques uniquement
   - Pas de tests intégration pour éditeur
   - Pas de tests régression visuelle

7. **SEO Non Optimisé**
   - Pas de balises metadata (title, description)
   - Pas de données structurées (schéma Product)
   - Pas de génération sitemap

8. **Lacunes Accessibilité**
   - Canvas Fabric.js pas accessible clavier
   - Pas de labels ARIA sur outils éditeur
   - Gestion focus incomplète

### 14.2 Dette Technique

1. **Taille DesignEditor.tsx**
   - 29 881 lignes (composant monolithique)
   - Devrait être divisé en composants plus petits
   - Difficile à tester et maintenir

2. **Lacunes Sécurité Type**
   - `any` utilisé dans sérialisation canvas éditeur
   - Typages Fabric.js incomplets
   - Types manquants pour certaines props Radix UI

3. **Goulots Performance**
   - Gros fichier données produits (26KB products.ts)
   - Pas de pagination sur galerie projets
   - Pas de chargement lazy pour outils éditeur

4. **Valeurs Codées en Dur**
   - Valeurs DPI (300) à plusieurs endroits
   - Codes hex palette couleurs
   - Multiplicateurs délais

5. **Validation Manquante**
   - Validation formulaires côté client incomplète
   - Pas de schémas zod ou yup
   - Validation routes API minimale

---

## 15. Feuille de Route Future

### 15.1 Phase 2 : Intégration Backend

**Objectifs** :
- API tarification réelle avec inventaire live
- Passerelle paiement (Stripe, PayPal, paiement local marocain)
- Dashboard gestion commandes pour équipe commerciale
- Notifications email (confirmation commande, mises à jour statut)

**Technologies** :
- Supabase Functions (fonctions edge TypeScript)
- Stripe ou CMI (paiement local marocain)
- SendGrid ou Resend pour email
- Supabase Realtime pour statut commande

### 15.2 Phase 3 : Éditeur Avancé

**Objectifs** :
- Filtres images (luminosité, contraste, saturation)
- Texte courbé le long chemin
- Bibliothèque templates (designs démarrage)
- Export multi-calques (BATs séparés par zone)
- Collaboration design (lien partage, commentaires)

**Technologies** :
- Filtres Fabric.js
- Rendu chemin personnalisé
- WebRTC pour collaboration temps réel (futur)

### 15.3 Phase 4 : Workflow Production

**Objectifs** :
- Intégration imprimeur (auto-export vers API atelier impression)
- Gestion couleur (profils ICC, correspondance Pantone)
- Vérifications preflight (résolution, fond perdu, espace couleur)
- Planification et suivi production

**Technologies** :
- Intégration API atelier impression (personnalisée ou standard comme PrintAPI)
- Sharp pour traitement images
- Export PDF/X-1a pour fichiers prêts impression

### 15.4 Phase 5 : Fonctionnalités Marketplace

**Objectifs** :
- Comptes utilisateurs avec designs sauvegardés
- Galerie designs publique (templates communauté)
- Marketplace design (acheter/vendre templates)
- Système affiliation pour designers

**Technologies** :
- Supabase Auth + RLS
- Stripe Connect pour paiements
- Stockage compatible S3 pour fichiers design

---

## 16. Guide de Dépannage

### 16.1 Problèmes Courants

#### Erreurs Build

**Problème** : `Error: Cannot find module '@/lib/products'`
**Solution** : Vérifier configuration paths `tsconfig.json` et redémarrer serveur TypeScript

**Problème** : `Type error: Property 'xxx' does not exist on type 'YYY'`
**Solution** : Reconstruire types avec `npm run build` ou `npx tsc --noEmit`

#### Erreurs Runtime

**Problème** : Canvas Fabric.js ne rend pas
**Solution** :
- Vérifier console navigateur pour erreurs
- Vérifier élément `<canvas>` existe dans DOM
- Assurer Fabric.js chargé (vérifier onglet réseau)
- Vider cache navigateur

**Problème** : Quota IndexedDB dépassé
**Solution** :
- Vider données navigateur pour localhost:3000
- Réduire taille vignette preview dans `projects.ts`
- Implémenter nettoyage projet (supprimer vieux projets)

**Problème** : Changement locale ne fonctionne pas
**Solution** :
- Vérifier middleware.ts pas exclu dans next.config.mjs
- Vérifier cookies navigateur (Next-Locale)
- Vider cache .next: `rm -rf .next`

#### Erreurs Routes API

**Problème** : `/api/rfq` retourne 500
**Solution** :
- Vérifier `.env.local` pour credentials Supabase
- Vérifier table orders Supabase existe (voir supabase-orders.md)
- Vérifier logs serveur: sortie `npm run dev`

**Problème** : Erreurs CORS sur routes API
**Solution** :
- Ajouter headers CORS aux gestionnaires routes
- Vérifier origine requête correspond domaines autorisés

### 16.2 Conseils Développement

**Conseil** : Utiliser `npm run dev -- --turbo` pour HMR plus rapide (Turbopack expérimental)

**Conseil** : Activer profiler React DevTools pour identifier goulots re-rendu

**Conseil** : Utiliser `console.log(JSON.stringify(object, null, 2))` pour déboguer données IndexedDB

**Conseil** : Tester layout RTL en ajoutant `?locale=ar` à l'URL

**Conseil** : Utiliser Playwright en mode headed pour débogage: `npx playwright test --headed`

---

## 17. Guides de Contribution (Interne)

### 17.1 Checklist Revue Code

- [ ] Conformité mode strict TypeScript
- [ ] Vérifications ESLint/Prettier passent
- [ ] Composants utilisent frontières RSC/Client appropriées
- [ ] Traductions ajoutées pour FR et AR
- [ ] Accessibilité: navigation clavier, labels ARIA
- [ ] Design responsive testé (mobile, tablette, desktop)
- [ ] Layout RTL testé pour arabe
- [ ] Tests ajoutés pour nouvelles fonctionnalités (unit + e2e)
- [ ] Pas d'instructions console.log ou debugger
- [ ] Performance: pas de re-rendus inutiles

### 17.2 Workflow Git

**Nommage Branches** :
- `feature/pack-prefill-ux`
- `fix/editor-zoom-bug`
- `refactor/split-design-editor`
- `docs/update-readme`

**Messages Commit** (Conventional Commits) :
```
feat(editor): ajouter support texte courbé
fix(rfq): valider format email
refactor(products): extraire logique tarification
docs(context): ajouter guide dépannage
test(quote): ajouter tests remise pack
```

### 17.3 Template Pull Request

```markdown
## Description
Brève description des changements

## Type de Changement
- [ ] Correction bug
- [ ] Nouvelle fonctionnalité
- [ ] Refactorisation
- [ ] Documentation

## Checklist
- [ ] Code suit guidelines style
- [ ] Auto-révision complétée
- [ ] Traductions ajoutées (FR + AR)
- [ ] Tests ajoutés/mis à jour
- [ ] Documentation mise à jour
- [ ] Pas de changements cassants

## Captures d'écran (si applicable)
```

---

## 18. Références & Ressources

### 18.1 Documentation Officielle

- **Next.js 14** : https://nextjs.org/docs
- **React 18** : https://react.dev/
- **TypeScript** : https://www.typescriptlang.org/docs/
- **Tailwind CSS** : https://tailwindcss.com/docs
- **Fabric.js** : http://fabricjs.com/docs/
- **Zustand** : https://zustand-demo.pmnd.rs/
- **next-intl** : https://next-intl-docs.vercel.app/
- **Supabase** : https://supabase.com/docs
- **Radix UI** : https://www.radix-ui.com/
- **Framer Motion** : https://www.framer.com/motion/

### 18.2 Documents Internes

- `README.md` : Guide démarrage rapide
- `docs/pack-prefill-plan.md` : Spécification fonctionnalité préremplissage pack
- `docs/supabase-orders.md` : Guide configuration Supabase
- `docs/CONTEXTE_PROJET.md` : Ce document

### 18.3 Outils Externes

- **Vercel** : Plateforme déploiement
- **SerpAPI** : API récupérateur Google Images
- **Unsplash** : Photos stock
- **Playwright** : Tests E2E
- **Jest** : Tests unitaires

---

## 19. Glossaire

**App Router** : Système routage Next.js 13+ utilisant répertoire `app/` (vs Pages Router avec `pages/`)

**BAT (Bon à Tirer)** : Terme français pour "épreuve impression" - approbation design finale avant production

**Fond Perdu** : Zone impression s'étendant au-delà taille coupe finale pour assurer pas de bordures blanches

**Dimensions Canvas** : Largeur, hauteur, marge sécurité, marge fond perdu, DPI pour designs prêts impression

**Composant Client** : Composant React marqué avec directive `'use client'`, s'exécute dans navigateur

**Coloris** : Variante couleur produit (ex: "graphite", "argent", "royal")

**i18n** : Internationalisation (texte et formatage locale-aware)

**Zone d'Impression** : Zone imprimable sur produit (ex: enveloppant mug, corps stylo)

**IndexedDB** : API base de données navigateur pour stockage données structurées côté client

**Délai** : Durée production et livraison (standard vs express)

**Méthode de Marquage** : Technique impression/marquage (laser, sublimation, sérigraphie, etc.)

**MOQ (Quantité Minimum Commande)** : Plus petite taille commande autorisée pour produit

**Pack** : Bundle prédéfini de produits avec remise automatique

**Palier Prix** : Tranche tarification basée volume (ex: 50-199 unités @ 10$, 200+ @ 8$)

**PWA (Progressive Web App)** : Application web avec fonctionnalités app native (hors ligne, installable)

**RFQ (Demande de Devis)** : Système devis/panier pour commandes personnalisées (vs checkout e-commerce)

**RSC (React Server Component)** : Composant rendu serveur (par défaut dans App Router)

**RTL (Droite-à-Gauche)** : Direction texte pour arabe, hébreu, etc.

**Zone de Sécurité** : Zone à l'intérieur zone impression où éléments critiques (texte, logos) doivent rester

**Server Action** : Fonction côté serveur Next.js 13+ appelable depuis client via RPC

**Frais de Montage** : Frais unique par méthode impression (film, plaques, calibration laser)

**Supabase** : Alternative Firebase open-source (PostgreSQL + Auth + Storage)

**Zustand** : Bibliothèque gestion d'état légère (alternative à Redux)

---

## 20. Annexe

### 20.1 Référence Rapide Commandes

```bash
# Développement
npm run dev                      # Démarrer serveur dev (localhost:3000)
npm run build                    # Build production
npm run start                    # Démarrer serveur production
npm run lint                     # Lancer ESLint
npm run test                     # Lancer tests Jest
npm run test:watch               # Mode watch Jest
npm run test:e2e                 # Lancer tests Playwright
npm run test:e2e:ui              # Mode UI Playwright

# Récupérateur images
npm run images:fetch             # Récupérer toutes images produits
npm run images:fetch -- --slug notepad --limit 4 --dry-run

# Utilitaires
npx tsc --noEmit                 # Vérification type TypeScript uniquement
npx next build --debug           # Déboguer processus build
npx next info                    # Afficher info environnement Next.js
```

### 20.2 Référence Variables d'Environnement

```bash
# Supabase (requis pour capture commandes)
SUPABASE_URL=https://<ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<key>
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>

# Récupérateur images (optionnel)
SERPAPI_KEY=<key>

# Next.js (défini auto par framework)
NODE_ENV=development|production
NEXT_PUBLIC_VERCEL_URL=<défini-auto-sur-vercel>
```

### 20.3 Référence Taille Fichiers

**Gros Fichiers** (considérer optimisation) :
- `src/lib/products.ts` : 26 281 octets (840 lignes)
- `src/components/editor/DesignEditor.tsx` : 29 881 octets (fichier unique)
- `src/messages/fr.json` : 22 973 octets
- `src/messages/ar.json` : 27 085 octets
- `src/lib/product-image-overrides.json` : 14 495 octets

**Taille Totale Projet** (excluant node_modules) :
- ~500-600 KB code source
- ~50 MB node_modules (dépendances production uniquement: ~15 MB)

### 20.4 Compatibilité Navigateurs

**Navigateurs Testés** :
- Chrome 120+ (desktop + mobile)
- Firefox 120+ (desktop)
- Safari 17+ (macOS, iOS)
- Edge 120+ (desktop)

**Problèmes Connus** :
- Safari < 16: Problèmes IndexedDB avec transactions imbriquées
- Firefox: Rendu texte Fabric.js légèrement différent (métriques police)

**Fonctionnalités Navigateur Requises** :
- Syntaxe ES2022 (optional chaining, nullish coalescing)
- CSS Grid + Flexbox
- API Canvas (Fabric.js)
- IndexedDB v2
- Service Worker (pour PWA)

### 20.5 Licence & Crédits

**Licence Projet** : Privé (pas open source)

**Dépendances Open Source** :
- Voir `package.json` pour liste complète dépendances
- Toutes dépendances utilisent licences permissives (MIT, Apache 2.0, ISC)

**Crédits Images** :
- Photos produits : Unsplash (libre utilisation)
- Icônes : Lucide (licence ISC)
- Attributions stockées dans `product-image-overrides.json`

---

## Métadonnées Document

**Version** : 1.0.0
**Dernière Mise à Jour** : 2025-10-12
**Auteur** : Génération documentation automatisée via Claude Code
**Portée** : Architecture projet complète et détails implémentation
**Audience** : Équipe développement, parties prenantes techniques
