# Guide de Déploiement Vercel - Artevia

Ce guide détaille la procédure complète pour déployer l'application Artevia sur Vercel.

## Table des Matières

1. [Prérequis](#prérequis)
2. [Configuration Initiale](#configuration-initiale)
3. [Variables d'Environnement](#variables-denvironnement)
4. [Déploiement](#déploiement)
5. [Vérifications Post-Déploiement](#vérifications-post-déploiement)
6. [Dépannage](#dépannage)
7. [Optimisations](#optimisations)

---

## Prérequis

### Comptes Requis

1. **Compte Vercel**
   - Créer un compte sur [vercel.com](https://vercel.com)
   - Connecter votre compte GitHub/GitLab/Bitbucket

2. **Compte Supabase** (pour capture de commandes)
   - Créer un projet sur [supabase.com](https://supabase.com)
   - Créer la table `orders` (voir `docs/supabase-orders.md`)

3. **Compte SerpAPI** (optionnel - pour récupération d'images)
   - Créer un compte sur [serpapi.com](https://serpapi.com)
   - Obtenir une clé API

### Fichiers de Configuration Vercel

Le projet inclut déjà les fichiers de configuration nécessaires :

- ✅ `vercel.json` - Configuration principale Vercel
- ✅ `.vercelignore` - Fichiers à exclure du déploiement
- ✅ `.env.example` - Exemple de variables d'environnement
- ✅ `next.config.mjs` - Configuration Next.js optimisée pour Vercel

---

## Configuration Initiale

### 1. Installer Vercel CLI (optionnel)

```bash
npm install -g vercel
```

### 2. Lier le Projet Local (optionnel)

```bash
# Se connecter à Vercel
vercel login

# Lier le projet
vercel link
```

### 3. Préparer les Variables d'Environnement

Copiez `.env.example` vers `.env.local` et remplissez les valeurs :

```bash
cp .env.example .env.local
```

Éditez `.env.local` avec vos vraies valeurs :

```env
# Supabase
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# SerpAPI (optionnel)
SERPAPI_KEY=votre-cle-serpapi
```

---

## Variables d'Environnement

### Variables Requises

#### Supabase (Capture de Commandes)

| Variable | Type | Description |
|----------|------|-------------|
| `SUPABASE_URL` | Secret | URL de votre projet Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | Clé service role (NE PAS exposer côté client) |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | URL Supabase (exposable côté client) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Clé anon (exposable côté client) |

### Variables Optionnelles

| Variable | Type | Description |
|----------|------|-------------|
| `SERPAPI_KEY` | Secret | Clé API pour récupération d'images produits |

### Variables Auto-Générées par Vercel

Ces variables sont **automatiquement** fournies par Vercel :

- `VERCEL` - Toujours `1` sur Vercel
- `VERCEL_ENV` - Environnement : `production`, `preview`, `development`
- `VERCEL_URL` - URL du déploiement (ex: `artevia-abc123.vercel.app`)
- `VERCEL_GIT_PROVIDER` - Provider Git (ex: `github`)
- `VERCEL_GIT_COMMIT_REF` - Branche Git
- `VERCEL_GIT_COMMIT_SHA` - SHA du commit
- `NEXT_PUBLIC_VERCEL_ENV` - Version publique de `VERCEL_ENV`
- `NEXT_PUBLIC_VERCEL_URL` - Version publique de `VERCEL_URL`

**⚠️ Important** : Ne définissez PAS manuellement ces variables - Vercel les gère automatiquement.

---

## Déploiement

### Méthode 1 : Déploiement via Dashboard Vercel (Recommandé)

1. **Aller sur [vercel.com/new](https://vercel.com/new)**

2. **Importer le dépôt Git**
   - Sélectionnez votre provider (GitHub, GitLab, Bitbucket)
   - Choisissez le dépôt `artevia`
   - Cliquez sur "Import"

3. **Configurer le Projet**
   - **Project Name** : `artevia` (ou nom personnalisé)
   - **Framework Preset** : Next.js (détecté automatiquement)
   - **Root Directory** : `./` (racine)
   - **Build Command** : `npm run build` (défaut)
   - **Output Directory** : `.next` (défaut)
   - **Install Command** : `npm install` (défaut)
   - **Node.js Version** : 18.x ou 20.x

4. **Ajouter les Variables d'Environnement**
   - Cliquez sur "Environment Variables"
   - Ajoutez chaque variable une par une :
     ```
     SUPABASE_URL = https://votre-projet.supabase.co
     SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     NEXT_PUBLIC_SUPABASE_URL = https://votre-projet.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```
   - **Important** : Sélectionnez les environnements appropriés :
     - ☑️ Production
     - ☑️ Preview
     - ☑️ Development (optionnel)

5. **Déployer**
   - Cliquez sur "Deploy"
   - Attendez la fin du build (≈ 2-3 minutes)

6. **Vérifier le Déploiement**
   - Cliquez sur "Visit" pour voir le site en ligne
   - Testez les fonctionnalités principales

### Méthode 2 : Déploiement via CLI

```bash
# Production
vercel --prod

# Preview (test)
vercel
```

### Méthode 3 : Déploiement Automatique (CI/CD)

Une fois le projet configuré sur Vercel :

- **Push vers `main`** → Déploiement automatique en **production**
- **Push vers autre branche** → Déploiement automatique en **preview**
- **Pull Request** → Preview automatique avec URL unique

---

## Vérifications Post-Déploiement

### 1. Vérifications Fonctionnelles

#### ✅ Pages Principales
- [ ] Page d'accueil : `https://votre-site.vercel.app/`
- [ ] Catalogue : `https://votre-site.vercel.app/fr/catalog`
- [ ] Détail produit : `https://votre-site.vercel.app/fr/product/bloc-notes-personnalises`
- [ ] Éditeur de design : `https://votre-site.vercel.app/fr/product/bloc-notes-personnalises` (cliquer "Créer")
- [ ] Panier RFQ : `https://votre-site.vercel.app/fr/rfq`

#### ✅ Fonctionnalités i18n
- [ ] Changement de locale FR ↔ AR fonctionne
- [ ] Layout RTL correct pour l'arabe
- [ ] Traductions affichées correctement

#### ✅ Fonctionnalités PWA
- [ ] Manifeste accessible : `https://votre-site.vercel.app/manifest.json`
- [ ] Service Worker enregistré (vérifier DevTools → Application → Service Workers)
- [ ] Installation PWA possible (navigateur mobile)

#### ✅ Images
- [ ] Images produits chargent correctement
- [ ] Optimisation WebP/AVIF active (vérifier Network tab)
- [ ] Pas d'erreur 403 pour images Unsplash

#### ✅ API Routes
- [ ] `POST /api/rfq` fonctionne (soumettre un devis)
- [ ] Commande enregistrée dans Supabase
- [ ] `POST /api/bat` génère un BAT (si implémenté)

### 2. Vérifications Performance

Utilisez [PageSpeed Insights](https://pagespeed.web.dev/) ou Lighthouse :

```bash
# Avec Lighthouse CLI
npm install -g lighthouse
lighthouse https://votre-site.vercel.app --view
```

**Cibles** :
- 🎯 Performance : **≥ 90**
- 🎯 Accessibility : **≥ 90**
- 🎯 Best Practices : **≥ 90**
- 🎯 SEO : **≥ 80**

### 3. Vérifications Sécurité

Testez les headers de sécurité :

```bash
curl -I https://votre-site.vercel.app
```

Vérifiez la présence de :
- ✅ `X-Frame-Options: SAMEORIGIN`
- ✅ `X-Content-Type-Options: nosniff`
- ✅ `Referrer-Policy: origin-when-cross-origin`
- ✅ `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### 4. Vérifications Monitoring

Sur le Dashboard Vercel, vérifiez :

- **Analytics** : Trafic et pages vues
- **Speed Insights** : Temps de chargement réels
- **Logs** : Pas d'erreurs dans les logs runtime
- **Functions** : Durée d'exécution des API routes

---

## Dépannage

### Problème : Build Échoue avec Erreur Husky

**Erreur** :
```
Error: .git can't be found (see https://typicode.github.io/husky/#/?id=custom-directory)
```

**Solution** : ✅ Déjà corrigé dans `package.json`

Le script `postinstall` détecte Vercel et skip Husky automatiquement.

Si le problème persiste, vérifiez que `.vercelignore` inclut `.husky/`.

---

### Problème : Images Unsplash Bloquées (403)

**Erreur** : Images ne chargent pas, erreur 403 dans console

**Cause** : Domaine non autorisé dans l'application Unsplash

**Solution** :
1. Aller sur [Unsplash Developers](https://unsplash.com/oauth/applications)
2. Éditer votre application
3. Ajouter votre domaine Vercel : `votre-site.vercel.app`
4. Sauvegarder et attendre 5-10 minutes

**Alternative** : Utiliser vos propres images ou un CDN

---

### Problème : Variables d'Environnement Non Disponibles

**Symptômes** :
- `process.env.SUPABASE_URL` est `undefined`
- Erreurs "Supabase is not configured"

**Solutions** :

1. **Vérifier dans Dashboard Vercel** :
   - Aller dans Settings → Environment Variables
   - Vérifier que toutes les variables sont définies
   - Vérifier qu'elles sont activées pour l'environnement correct (Production/Preview)

2. **Redéployer** :
   - Les changements de variables nécessitent un redéploiement
   - Aller dans Deployments → Redeploy

3. **Variables Publiques** :
   - Les variables `NEXT_PUBLIC_*` doivent être définies **avant** le build
   - Elles sont embeddées dans le bundle JavaScript

---

### Problème : Middleware i18n Cause 500 Errors

**Erreur** : Pages renvoient 500 Internal Server Error

**Solutions** :

1. **Vérifier Matcher Middleware** :
   ```typescript
   // middleware.ts
   export const config = {
     matcher: [
       '/((?!_next|_vercel|.*\\..*).*)'  // ✅ Exclut _vercel
     ]
   };
   ```

2. **Vérifier Locales** :
   - `src/i18n/settings.ts` doit exporter `locales` et `defaultLocale`
   - Messages FR et AR doivent exister dans `src/messages/`

3. **Logs Vercel** :
   - Aller dans Deployments → [votre déploiement] → Functions
   - Vérifier les logs pour détails erreur

---

### Problème : Service Worker Non Enregistré

**Symptômes** : PWA ne fonctionne pas, pas de mode offline

**Solutions** :

1. **Vérifier Headers** :
   ```bash
   curl -I https://votre-site.vercel.app/service-worker.js
   ```
   Doit inclure :
   ```
   Service-Worker-Allowed: /
   Cache-Control: public, max-age=0, must-revalidate
   ```

2. **Vérifier Fichier** :
   - `public/service-worker.js` doit exister
   - Vérifier qu'il n'est pas dans `.vercelignore`

3. **Enregistrement** :
   ```typescript
   // src/lib/pwa/register-sw.ts
   if ('serviceWorker' in navigator) {
     navigator.serviceWorker.register('/service-worker.js');
   }
   ```

---

### Problème : Build Timeout ou Out of Memory

**Erreur** :
```
Error: Build exceeded maximum duration
Error: JavaScript heap out of memory
```

**Solutions** :

1. **Optimiser Taille Bundle** :
   ```bash
   # Analyser bundle
   ANALYZE=true npm run build
   ```

2. **Réduire Dépendances** :
   - Vérifier `node_modules` pour packages lourds
   - Utiliser dynamic imports pour composants lourds (Fabric.js)

3. **Augmenter Timeout** (Pro/Enterprise) :
   - Aller dans Settings → General
   - Augmenter "Function Maximum Duration"

4. **Contacter Support Vercel** :
   - Pour projets complexes, Vercel peut augmenter les limites

---

## Optimisations

### 1. Performance

#### Edge Functions (Vercel Pro+)
Déployez les API routes en edge pour latence réduite :

```typescript
// app/api/rfq/route.ts
export const runtime = 'edge';
```

**⚠️ Limitation** : Pas de Node.js APIs complètes en edge.

#### ISR (Incremental Static Regeneration)

Pour catalogue produits statique avec revalidation :

```typescript
// app/[locale]/catalog/page.tsx
export const revalidate = 3600; // 1 heure
```

#### Image Optimization

Déjà configuré dans `next.config.mjs` :
- ✅ Formats AVIF + WebP
- ✅ Device sizes optimisés
- ✅ Cache TTL 60 secondes

### 2. Sécurité

#### Content Security Policy (CSP)

Ajouter dans `next.config.mjs` :

```typescript
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://images.unsplash.com https://images.pexels.com; font-src 'self' data:;"
}
```

**⚠️ Attention** : Fabric.js nécessite `'unsafe-eval'` et `'unsafe-inline'` pour fonctionner.

#### Rate Limiting

Pour API routes, utiliser `@vercel/edge` :

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s')
});
```

### 3. Monitoring

#### Vercel Analytics

Activer dans Dashboard Vercel :
- Settings → Analytics → Enable

#### Sentry (Error Tracking)

Installer Sentry pour tracking erreurs :

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

#### Web Vitals

Déjà supporté par Vercel Analytics, ou custom tracking :

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## Domaines Personnalisés

### Ajouter un Domaine

1. **Dans Dashboard Vercel** :
   - Aller dans Settings → Domains
   - Cliquer "Add Domain"
   - Entrer votre domaine : `artevia.ma`

2. **Configurer DNS** :
   - Ajouter un enregistrement `A` :
     ```
     Type: A
     Name: @
     Value: 76.76.21.21
     ```
   - OU un enregistrement `CNAME` :
     ```
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     ```

3. **Vérifier** :
   - Vercel vérifie automatiquement le DNS
   - Attendez propagation (jusqu'à 48h)
   - SSL/TLS automatique via Let's Encrypt

### Redirections

Déjà configuré dans `vercel.json` :
```json
{
  "redirects": [
    {"source": "/designs", "destination": "/fr/designs"}
  ]
}
```

---

## Support & Ressources

### Documentation Officielle

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel CLI](https://vercel.com/docs/cli)

### Communauté

- [Vercel Discord](https://vercel.com/discord)
- [Next.js Discord](https://nextjs.org/discord)
- [GitHub Discussions](https://github.com/vercel/next.js/discussions)

### Support Vercel

- Email : support@vercel.com
- Dashboard : Help → Contact Support
- Status : [vercel-status.com](https://www.vercel-status.com/)

---

## Checklist Finale

Avant de considérer le déploiement comme complet :

### Configuration
- [ ] Projet importé sur Vercel
- [ ] Variables d'environnement définies (Production + Preview)
- [ ] Domaine personnalisé configuré (si applicable)
- [ ] SSL/TLS actif (HTTPS)

### Fonctionnalités
- [ ] Toutes les pages accessibles
- [ ] i18n FR/AR fonctionne
- [ ] RTL correct pour arabe
- [ ] Éditeur Fabric.js charge et fonctionne
- [ ] Sauvegarde projets IndexedDB OK
- [ ] Panier RFQ persiste
- [ ] Soumission RFQ écrit dans Supabase
- [ ] PWA installable

### Performance
- [ ] Lighthouse Score ≥ 90
- [ ] Images optimisées (WebP/AVIF)
- [ ] Time to First Byte (TTFB) < 600ms
- [ ] First Contentful Paint (FCP) < 1.8s

### Sécurité
- [ ] Headers de sécurité présents
- [ ] Variables secrètes non exposées côté client
- [ ] CSP configuré pour Fabric.js
- [ ] Pas de console.log en production

### Monitoring
- [ ] Vercel Analytics activé
- [ ] Logs vérifiés (pas d'erreurs)
- [ ] Speed Insights activé
- [ ] Alertes configurées (optionnel)

---

**✅ Déploiement Terminé !**

Votre application Artevia est maintenant en ligne sur Vercel.

Pour toute question, consultez la documentation dans `docs/` ou contactez l'équipe.
