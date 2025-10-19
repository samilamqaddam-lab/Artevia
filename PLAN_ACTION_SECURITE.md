# Plan d'Action Sécurité - Artevia

**Date de création:** 18 octobre 2025
**Score actuel:** 7.5/10
**Score cible:** 9.5/10

---

## 🚨 ACTIONS URGENTES (24-48h)

### 1. Révoquer et Régénérer les Clés Supabase

**Priorité:** CRITIQUE
**Temps estimé:** 30 minutes
**Fichiers concernés:** `.env.local`, `.env.example`

**Étapes:**

1. Se connecter au Dashboard Supabase
2. Aller dans Settings → API
3. Cliquer sur "Reset service role key"
4. Cliquer sur "Reset anon key"
5. Mettre à jour `.env.local` avec les nouvelles clés
6. Redéployer sur Vercel avec les nouvelles variables d'environnement

**Commandes:**

```bash
# 1. Vérifier que .env.local est bien dans .gitignore
cat .gitignore | grep .env.local

# 2. Retirer .env.local de l'historique Git
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env.local" \
  --prune-empty --tag-name-filter cat -- --all

# 3. Force push (ATTENTION: coordonner avec l'équipe)
git push origin --force --all

# 4. Mettre à jour .env.example (sans les vraies valeurs)
# Garder uniquement les placeholders
```

**Vérification:**

- [ ] Nouvelles clés générées dans Supabase
- [ ] `.env.local` mis à jour localement
- [ ] Variables d'environnement mises à jour sur Vercel
- [ ] `.env.local` retiré de l'historique Git
- [ ] Application fonctionne avec les nouvelles clés
- [ ] Audit des logs Supabase pour activité suspecte

---

### 2. Implémenter la Validation des Entrées API

**Priorité:** CRITIQUE
**Temps estimé:** 2-3 heures
**Fichiers concernés:**
- `app/api/rfq/route.ts`
- `app/api/bat/route.ts`

**Étapes:**

1. Installer Zod:
```bash
npm install zod
```

2. Créer les schémas de validation dans `src/types/api-validation.ts`:

```typescript
import {z} from 'zod';

export const RFQItemSchema = z.object({
  productId: z.string().max(100),
  quantity: z.number().int().min(1).max(100000),
  methodId: z.string().max(100),
  selectedOptions: z.record(z.string(), z.string()).optional(),
  price: z.number().min(0).optional(),
  basePrice: z.number().min(0).optional(),
});

export const CheckoutSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  phone: z.string().max(20),
  company: z.string().max(200).optional(),
});

export const RFQSchema = z.object({
  items: z.array(RFQItemSchema).min(1).max(100),
  notes: z.string().max(2000).optional(),
  checkout: CheckoutSchema.optional(),
  totals: z.object({
    total: z.number().min(0),
    discount: z.number().min(0),
    quantity: z.number().int().min(0)
  }).optional(),
  discounts: z.array(z.string()).max(10),
  locale: z.enum(['fr', 'ar']).optional()
});
```

3. Appliquer la validation dans `app/api/rfq/route.ts`:

```typescript
import {RFQSchema} from '@/types/api-validation';
import {NextResponse} from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validation
    const validatedData = RFQSchema.parse(body);

    // Suite du traitement avec validatedData...

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: 'Données invalides',
          errors: error.errors
        },
        {status: 400}
      );
    }

    console.error('Erreur API RFQ:', error);
    return NextResponse.json(
      {message: 'Erreur serveur'},
      {status: 500}
    );
  }
}
```

**Vérification:**

- [ ] Schémas Zod créés
- [ ] Validation appliquée dans `/api/rfq/route.ts`
- [ ] Validation appliquée dans `/api/bat/route.ts`
- [ ] Tests manuels avec données invalides
- [ ] Messages d'erreur clairs pour l'utilisateur

---

### 3. Sécuriser les Routes Authentifiées (Server-Side)

**Priorité:** CRITIQUE
**Temps estimé:** 2 heures
**Fichiers concernés:**
- `app/[locale]/(store)/account/layout.tsx`
- `app/[locale]/(store)/account/*/page.tsx`

**Étapes:**

1. Installer les dépendances Supabase SSR (si pas déjà fait):
```bash
npm install @supabase/ssr
```

2. Créer un utilitaire serveur dans `src/lib/supabase/server.ts`:

```typescript
import {createServerClient, type CookieOptions} from '@supabase/ssr';
import {cookies} from 'next/headers';

export async function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({name, value, ...options});
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({name, value: '', ...options});
        },
      },
    }
  );
}

export async function getServerUser() {
  const supabase = await createServerSupabaseClient();
  const {data: {user}, error} = await supabase.auth.getUser();
  return {user, error};
}
```

3. Modifier `app/[locale]/(store)/account/layout.tsx`:

```typescript
import {getServerUser} from '@/lib/supabase/server';
import {redirect} from 'next/navigation';

export default async function AccountLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  const {user, error} = await getServerUser();

  if (!user || error) {
    redirect(`/${params.locale}/auth/login`);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AccountLayoutClient user={user} params={params}>
        {children}
      </AccountLayoutClient>
    </div>
  );
}
```

4. Créer le composant client `AccountLayoutClient`:

```typescript
'use client';

import type {User} from '@supabase/supabase-js';
// ... le reste de la logique client
```

**Vérification:**

- [ ] Auth vérifiée côté serveur
- [ ] Redirection fonctionne sans JS
- [ ] Pas de flash de contenu non-authentifié
- [ ] Session valide côté serveur
- [ ] Test avec JS désactivé

---

### 4. Ajouter Rate Limiting

**Priorité:** CRITIQUE
**Temps estimé:** 1-2 heures
**Fichiers concernés:**
- `app/api/rfq/route.ts`
- `app/api/bat/route.ts`

**Étapes:**

1. Installer Upstash Redis et Rate Limit:
```bash
npm install @upstash/redis @upstash/ratelimit
```

2. Créer un compte Upstash et configurer Redis

3. Ajouter les variables d'environnement:
```bash
# .env.local
UPSTASH_REDIS_REST_URL=xxx
UPSTASH_REDIS_REST_TOKEN=xxx
```

4. Créer `src/lib/rate-limit.ts`:

```typescript
import {Ratelimit} from '@upstash/ratelimit';
import {Redis} from '@upstash/redis';

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '60 s'),
  analytics: true,
  prefix: 'artevia_ratelimit',
});

export async function checkRateLimit(identifier: string) {
  const {success, limit, reset, remaining} = await ratelimit.limit(identifier);

  return {
    success,
    limit,
    reset,
    remaining,
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': reset.toString(),
    }
  };
}
```

5. Appliquer dans les routes API:

```typescript
import {checkRateLimit} from '@/lib/rate-limit';
import {NextResponse} from 'next/server';

export async function POST(request: Request) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') ??
             request.headers.get('x-real-ip') ??
             'unknown';

  const {success, headers} = await checkRateLimit(ip);

  if (!success) {
    return NextResponse.json(
      {message: 'Trop de requêtes. Veuillez réessayer plus tard.'},
      {status: 429, headers}
    );
  }

  // Suite du traitement...
}
```

**Vérification:**

- [ ] Upstash configuré
- [ ] Rate limiting sur `/api/rfq`
- [ ] Rate limiting sur `/api/bat`
- [ ] Headers de rate limit présents
- [ ] Test: 11 requêtes en 1 min = 429

---

### 5. Auditer les Logs Supabase

**Priorité:** CRITIQUE
**Temps estimé:** 1 heure

**Étapes:**

1. Se connecter au Dashboard Supabase
2. Aller dans Logs → API Logs
3. Filtrer les dates depuis l'exposition des clés
4. Chercher des activités suspectes:
   - Connexions depuis des IPs inconnues
   - Requêtes inhabituelles
   - Tentatives de bypass RLS
   - Volumes anormaux

5. Vérifier les Tables:
   - Compter le nombre d'enregistrements
   - Vérifier les dernières modifications
   - Chercher des données anormales

6. Examiner les utilisateurs:
   - Comptes créés récemment
   - Adresses email suspectes
   - Patterns inhabituels

**Actions si compromission détectée:**

- [ ] Documenter toutes les activités suspectes
- [ ] Identifier les données affectées
- [ ] Notifier les utilisateurs si nécessaire (RGPD)
- [ ] Restaurer depuis backup si nécessaire
- [ ] Changer TOUTES les clés et secrets

---

## ⚠️ ACTIONS IMPORTANTES (Cette Semaine)

### 6. Nettoyer les Console.logs en Production

**Priorité:** HAUTE
**Temps estimé:** 2 heures
**Fichiers:** Multiples (33+ occurrences)

**Étapes:**

1. Créer `src/lib/logger.ts`:

```typescript
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isDevelopment = process.env.NODE_ENV === 'development';

class Logger {
  private log(level: LogLevel, ...args: any[]) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case 'debug':
        if (isDevelopment) console.debug(prefix, ...args);
        break;
      case 'info':
        if (isDevelopment) console.info(prefix, ...args);
        break;
      case 'warn':
        console.warn(prefix, ...args);
        break;
      case 'error':
        console.error(prefix, ...args);
        // TODO: Envoyer à Sentry
        break;
    }
  }

  debug(...args: any[]) {
    this.log('debug', ...args);
  }

  info(...args: any[]) {
    this.log('info', ...args);
  }

  warn(...args: any[]) {
    this.log('warn', ...args);
  }

  error(...args: any[]) {
    this.log('error', ...args);
  }
}

export const logger = new Logger();
```

2. Remplacer tous les `console.log` par `logger.debug`:

```bash
# Trouver tous les console.log
grep -r "console\." src/ app/ --exclude-dir=node_modules

# Remplacer manuellement ou avec sed
```

3. Fichiers prioritaires:
- `src/lib/supabase/migrate-projects.ts:64`
- `src/components/auth/LoginView.tsx:43`
- `src/components/editor/DesignEditor.tsx`
- `src/components/product/ProductExperience.tsx`

**Vérification:**

- [ ] Logger créé et fonctionnel
- [ ] Tous les console.log remplacés
- [ ] Logs désactivés en production
- [ ] Build vérifié (pas d'erreurs)

---

### 7. Valider les Uploads de Fichiers

**Priorité:** HAUTE
**Temps estimé:** 1 heure
**Fichier:** `src/components/product/ProductExperience.tsx:284-294`

**Étapes:**

1. Ajouter la validation dans `handleFileUpload`:

```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/svg+xml',
  'application/pdf'
];

const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.svg', '.pdf'];

const handleFileUpload = (file: File | null) => {
  // Nettoyer l'ancien URL
  if (uploadedFileUrl) {
    URL.revokeObjectURL(uploadedFileUrl);
  }

  if (!file) {
    setUploadedFile(null);
    setUploadedFileUrl(null);
    return;
  }

  // Validation type MIME
  if (!ALLOWED_TYPES.includes(file.type)) {
    pushToast({
      title: 'Type de fichier non autorisé',
      description: 'Seuls les fichiers PNG, JPEG, SVG et PDF sont acceptés',
      type: 'error'
    });
    return;
  }

  // Validation extension (sécurité supplémentaire)
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
    pushToast({
      title: 'Extension de fichier non autorisée',
      description: 'Fichier suspect détecté',
      type: 'error'
    });
    return;
  }

  // Validation taille
  if (file.size > MAX_FILE_SIZE) {
    pushToast({
      title: 'Fichier trop volumineux',
      description: `La taille maximale est de ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
      type: 'error'
    });
    return;
  }

  // Validation nom de fichier
  if (file.name.length > 255) {
    pushToast({
      title: 'Nom de fichier trop long',
      description: 'Le nom du fichier ne peut pas dépasser 255 caractères',
      type: 'error'
    });
    return;
  }

  setUploadedFile(file);
  const url = URL.createObjectURL(file);
  setUploadedFileUrl(url);
};

// Cleanup au démontage
useEffect(() => {
  return () => {
    if (uploadedFileUrl) {
      URL.revokeObjectURL(uploadedFileUrl);
    }
  };
}, [uploadedFileUrl]);
```

**Vérification:**

- [ ] Types de fichiers validés
- [ ] Taille maximale respectée
- [ ] Extensions vérifiées
- [ ] Nom de fichier validé
- [ ] Memory leaks évités (revokeObjectURL)
- [ ] Messages d'erreur clairs

---

### 8. Ajouter des Error Boundaries

**Priorité:** HAUTE
**Temps estimé:** 1 heure

**Étapes:**

1. Créer `app/error.tsx` (global):

```typescript
'use client';

import {useEffect} from 'react';
import {Button} from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  useEffect(() => {
    // Log vers service de monitoring
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
          Une erreur s'est produite
        </h2>
        <p className="mb-6 text-slate-600 dark:text-slate-400">
          Nous nous excusons pour ce désagrément. Notre équipe a été notifiée.
        </p>
        <Button onClick={reset}>
          Réessayer
        </Button>
      </div>
    </div>
  );
}
```

2. Créer `app/[locale]/(store)/account/error.tsx`:

```typescript
'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {Button} from '@/components/ui/button';

export default function AccountError({
  error,
  reset,
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error('Account error:', error);
  }, [error]);

  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center p-4">
      <h2 className="mb-4 text-xl font-bold">Erreur de chargement</h2>
      <p className="mb-6 text-slate-600 dark:text-slate-400">
        Impossible de charger vos informations
      </p>
      <div className="flex gap-4">
        <Button onClick={reset}>
          Réessayer
        </Button>
        <Button variant="outline" onClick={() => router.push('/')}>
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
}
```

3. Créer `app/[locale]/(store)/product/[id]/error.tsx` pour les pages produits

**Vérification:**

- [ ] Error boundary global créé
- [ ] Error boundary account créé
- [ ] Error boundary produit créé
- [ ] Test en forçant une erreur
- [ ] Bouton "Réessayer" fonctionne

---

## 📅 ACTIONS MOYEN TERME (Ce Mois)

### 9. Refactoriser les Gros Composants

**Priorité:** MOYENNE
**Temps estimé:** 4-6 heures

**Fichiers:**
- `src/lib/products.ts` (879 lignes)
- `src/components/editor/DesignEditor.tsx` (850 lignes)
- `src/components/product/ProductExperience.tsx` (771 lignes)

**Plan de refactoring - products.ts:**

```
src/lib/products/
├── index.ts                    # Exports principaux
├── base-products.ts            # Définitions des produits
├── image-overrides.ts          # Logique des overrides
├── product-helpers.ts          # Fonctions utilitaires
└── types.ts                    # Types TypeScript
```

**Plan de refactoring - DesignEditor.tsx:**

```
src/components/editor/
├── DesignEditor.tsx            # Composant principal (~200 lignes)
├── hooks/
│   ├── useCanvas.ts            # Logique canvas Fabric.js
│   ├── useGuides.ts            # Guides d'alignement
│   ├── useProjects.ts          # Gestion projets
│   └── useEditorState.ts       # État global éditeur
├── toolbar/
│   ├── EditorToolbar.tsx       # Barre d'outils
│   ├── ZoomControls.tsx        # Contrôles zoom
│   └── HistoryControls.tsx     # Undo/Redo
├── panels/
│   ├── LayersPanel.tsx         # Panneau calques
│   ├── PropertiesPanel.tsx     # Propriétés objet
│   └── TemplatesPanel.tsx      # Templates
└── canvas/
    ├── CanvasRenderer.tsx      # Rendu canvas
    └── GuideLines.tsx          # Lignes de guide
```

**Vérification:**

- [ ] Fichiers < 400 lignes
- [ ] Responsabilités séparées
- [ ] Tests toujours passants
- [ ] Pas de régression fonctionnelle

---

### 10. Corriger les Règles ESLint Désactivées

**Priorité:** MOYENNE
**Temps estimé:** 3 heures
**Fichier:** `src/components/editor/DesignEditor.tsx:1-5`

**Règles à corriger:**

```typescript
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/ban-ts-comment */
```

**Étapes:**

1. **Corriger exhaustive-deps:**
   - Identifier les dépendances manquantes
   - Utiliser useCallback/useMemo si nécessaire
   - Documenter les suppressions légitimes

2. **Remplacer `any` par des types:**
```typescript
// Avant
const editorApiRef = useRef<any>(null);

// Après
interface EditorApi {
  capture: (format?: 'jpeg' | 'png') => string | null;
  export: (format: 'json') => DesignData;
  import: (data: DesignData) => void;
}
const editorApiRef = useRef<EditorApi | null>(null);
```

3. **Supprimer variables inutilisées**

4. **Remplacer <img> par <Image>:**
```typescript
import Image from 'next/image';

// Si taille dynamique
<Image
  src={project.previewDataUrl}
  alt={project.name}
  width={0}
  height={0}
  sizes="100vw"
  style={{ width: '100%', height: 'auto' }}
/>
```

5. **Corriger les @ts-expect-error:**
   - Mettre à jour les types
   - Documenter si vraiment nécessaire

**Vérification:**

- [ ] Aucune règle ESLint désactivée
- [ ] Types stricts partout
- [ ] Images optimisées
- [ ] Pas de variables inutilisées

---

### 11. Implémenter un Service de Monitoring

**Priorité:** MOYENNE
**Temps estimé:** 2 heures

**Étapes:**

1. Choisir un service (recommandé: Sentry)

2. Installer Sentry:
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

3. Configurer `.env.local`:
```bash
NEXT_PUBLIC_SENTRY_DSN=xxx
SENTRY_AUTH_TOKEN=xxx
```

4. Intégrer avec le logger:

```typescript
// src/lib/logger.ts
import * as Sentry from '@sentry/nextjs';

class Logger {
  error(...args: any[]) {
    console.error(...args);

    // Envoyer à Sentry
    if (args[0] instanceof Error) {
      Sentry.captureException(args[0]);
    } else {
      Sentry.captureMessage(JSON.stringify(args));
    }
  }
}
```

5. Configurer les Error Boundaries pour envoyer à Sentry

**Vérification:**

- [ ] Sentry configuré
- [ ] Erreurs loggées
- [ ] Source maps uploadés
- [ ] Alertes configurées

---

### 12. Augmenter la Couverture de Tests

**Priorité:** MOYENNE
**Temps estimé:** 8-10 heures

**Objectif:** Passer de 25 tests à ~100 tests

**Tests prioritaires:**

1. **API Routes (20 tests):**
   - `/api/rfq` - validation, success, errors
   - `/api/bat` - validation, success, errors
   - Rate limiting
   - Auth checks

2. **Authentication (15 tests):**
   - Login flow
   - Register flow
   - Session persistence
   - Logout
   - Protected routes

3. **Product Configuration (20 tests):**
   - Price calculations
   - Options selection
   - Quote generation
   - Discounts

4. **Upload de Fichiers (10 tests):**
   - Validation type
   - Validation taille
   - Validation extension
   - Success flow

5. **Design Editor (15 tests):**
   - Canvas operations
   - Save/Load project
   - Export
   - Undo/Redo

6. **E2E Critical Paths (10 tests):**
   - Complete quote flow
   - Complete purchase
   - User registration
   - Design creation

**Commandes:**

```bash
# Exécuter les tests
npm test

# Avec couverture
npm test -- --coverage

# E2E
npm run test:e2e
```

**Vérification:**

- [ ] ~100 tests créés
- [ ] Couverture > 60%
- [ ] Tests API > 80%
- [ ] Tests Auth > 80%
- [ ] E2E critical paths > 90%

---

## 📊 ACTIONS LONG TERME (Trimestre)

### 13. Audit de Sécurité Externe

**Priorité:** MOYENNE
**Temps estimé:** Budget à définir

- [ ] Choisir un prestataire de pentest
- [ ] Effectuer audit de sécurité
- [ ] Corriger les vulnérabilités trouvées
- [ ] Obtenir certification

---

### 14. Optimisation des Performances

**Priorité:** BASSE
**Temps estimé:** 6-8 heures

- [ ] Bundle analysis
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Image optimization
- [ ] CDN configuration
- [ ] Database indexing

---

### 15. Documentation Complète

**Priorité:** BASSE
**Temps estimé:** 4-6 heures

- [ ] Architecture documentation
- [ ] API documentation
- [ ] Component documentation
- [ ] Security guidelines
- [ ] Deployment guides

---

## 📈 Métriques de Succès

### Sécurité

- [ ] Score sécurité: 7.5/10 → 9.5/10
- [ ] Zéro secrets exposés
- [ ] 100% routes protégées server-side
- [ ] Rate limiting sur toutes les API
- [ ] Monitoring actif

### Qualité du Code

- [ ] 0 règles ESLint désactivées
- [ ] Composants < 400 lignes
- [ ] Couverture tests > 70%
- [ ] TypeScript strict partout

### Performance

- [ ] Lighthouse Score > 90
- [ ] Bundle size < 300KB (gzipped)
- [ ] FCP < 1.5s
- [ ] TTI < 3s

---

## 🔄 Routine de Maintenance

### Hebdomadaire
- [ ] Review logs Supabase
- [ ] Check erreurs Sentry
- [ ] Mise à jour dépendances mineures

### Mensuel
- [ ] Audit sécurité des dépendances (`npm audit`)
- [ ] Review des accès Supabase
- [ ] Rotation des secrets (si applicable)
- [ ] Tests de charge

### Trimestriel
- [ ] Audit de sécurité complet
- [ ] Review architecture
- [ ] Performance audit
- [ ] Update majeure dépendances

---

## 📞 Support et Ressources

### Documentation
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/security)
- [Supabase Security](https://supabase.com/docs/guides/platform/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

### Outils
- [Snyk](https://snyk.io/) - Analyse vulnérabilités
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

**Dernière mise à jour:** 18 octobre 2025
**Prochaine révision:** 25 octobre 2025
