# Plan de Migration : Arteva → Arteva

## 📊 Analyse Complète

**Statistiques** :
- 146 occurrences de "Arteva" (majuscule)
- 90 occurrences de "arteva" (minuscule)
- **Total : ~236 changements** à effectuer

---

## 🎯 Impact et Priorisation

### Impact Critique (Blocage utilisateur) 🔴
- Nom de marque dans l'interface
- URLs et domaines
- Emails de confirmation

### Impact Majeur (Expérience dégradée) 🟠
- SEO et metadata
- Templates email
- Documentation

### Impact Mineur (Cosmétique) 🟡
- Comments dans le code
- Fichiers de documentation internes
- Exemples dans les docs

---

## 📋 Plan de Migration Structuré

### Phase 1 : Préparation (1h)
**Objectif** : Préparer l'environnement sans casser le site actuel

#### 1.1 Création de la Branche
```bash
git checkout -b migration/arteva
```

#### 1.2 Backup de Sécurité
- [ ] Créer un backup de la base de données Supabase
- [ ] Exporter les templates email actuels
- [ ] Sauvegarder la config Vercel actuelle

---

### Phase 2 : Code Source (2-3h)

#### 2.1 Package.json et Metadata
**Fichiers** : 1
**Impact** : Mineur

- [ ] `package.json` :
  ```json
  - "name": "arteva"
  + "name": "arteva"

  - "description": "Arteva Print-On-Demand..."
  + "description": "Arteva Print-On-Demand..."
  ```

#### 2.2 Traductions FR (~80 occurrences)
**Fichiers** : `src/messages/fr.json`
**Impact** : Critique 🔴

Remplacements à faire :
```json
- "brand": "Arteva"
+ "brand": "Arteva"

- "Arteva nous a livré..."
+ "Arteva nous a livré..."

- "email": "bonjour@arteva.ma"
+ "email": "bonjour@arteva.ma"

- "Devis Arteva"
+ "Devis Arteva"

- "Pourquoi Choisir Arteva"
+ "Pourquoi Choisir Arteva"

[etc. pour toutes les occurrences]
```

**Méthode recommandée** : Rechercher/Remplacer global
```bash
# Dans src/messages/fr.json
Arteva → Arteva
arteva.ma → arteva.ma
```

#### 2.3 Traductions AR (~20 occurrences)
**Fichiers** : `src/messages/ar.json`
**Impact** : Critique 🔴

```json
- "brand": "Arteva"
+ "brand": "Arteva"

- "Arteva ترافق"
+ "Arteva ترافق"

[etc.]
```

#### 2.4 Composants React (~10 occurrences)
**Fichiers** :
- `src/components/layout/Footer.tsx`
- `src/components/product/ProductExperience.tsx`
- `app/[locale]/(store)/solutions/kit-bienvenue-employe/page.tsx`

**Exemples** :
```tsx
// Footer.tsx
- <a href="mailto:hello@arteva.ma">
+ <a href="mailto:hello@arteva.ma">

- hello@arteva.ma
+ hello@arteva.ma

// ProductExperience.tsx
- url: `https://arteva.ma/${locale}/product/${product.slug}`
+ url: `https://arteva.ma/${locale}/product/${product.slug}`
```

#### 2.5 Configuration MCP
**Fichiers** :
- `.mcp-config.json`
- `.mcp-config.example.json`

```json
- "arteva-management": { ... }
+ "arteva-management": { ... }
```

---

### Phase 3 : Documentation (1h)

#### 3.1 Fichiers Markdown (15 fichiers)

**Liste des fichiers à mettre à jour** :

1. `README.md` (si existe)
2. `IMPLEMENTATION_SUMMARY.md`
3. `SUPABASE_EMAIL_CONFIG.md` (~30 occurrences)
   - Templates email : "Bienvenue sur Arteva" → "Bienvenue sur Arteva"
   - URLs : `https://arteva.ma` → `https://arteva.ma`
   - Emails : `noreply@arteva.ma` → `noreply@arteva.ma`

4. `VERCEL_SETUP.md` (~10 occurrences)
5. `STRATEGIE_SEO_B2B.md`
6. `OPTIMISATIONS_SEO_PAGES_PRODUITS.md`
7. `ANALYSE_UX_SEO_EXPERT.md`
8. `docs/CHANGEMENTS_VERCEL.md`
9. `docs/SERPAPI_SEO_SETUP.md`
10. `docs/MCP_SECURITY.md`
11. `docs/DEPLOIEMENT_VERCEL.md`
12. `.env.example`

**Commande de remplacement global** :
```bash
# Remplacer dans tous les fichiers .md
find . -name "*.md" -not -path "*/node_modules/*" -exec sed -i '' 's/Arteva/Arteva/g' {} +
find . -name "*.md" -not -path "*/node_modules/*" -exec sed -i '' 's/arteva\.ma/arteva.ma/g' {} +
find . -name "*.md" -not -path "*/node_modules/*" -exec sed -i '' 's/arteva-/arteva-/g' {} +
```

---

### Phase 4 : Variables d'Environnement (30 min)

#### 4.1 Fichiers Locaux
- [ ] `.env.local` :
  ```bash
  - NEXT_PUBLIC_SITE_URL=http://localhost:3000
  + NEXT_PUBLIC_SITE_URL=http://localhost:3000
  # (Pas de changement nécessaire en local)
  ```

- [ ] `.env.example` :
  ```bash
  - # Production: https://arteva.ma
  + # Production: https://arteva.ma
  ```

#### 4.2 Vercel (À faire manuellement)
- [ ] `NEXT_PUBLIC_SITE_URL` : `https://arteva.ma` → `https://arteva.ma`

---

### Phase 5 : Assets et Design (2h)

#### 5.1 Favicon et Icons
**Impact** : Majeur 🟠

- [ ] `public/favicon.ico` - **À recréer avec nouveau logo**
- [ ] `public/icons/icon.svg` - **À recréer**
- [ ] PWA icons (si existantes)

#### 5.2 Logo
**À vérifier** :
- [ ] Y a-t-il un fichier `public/logo.png` ou `public/logo.svg` ?
- [ ] Le logo "Arteva" est-il hardcodé dans des SVG ?

**Action** :
- Créer nouveau logo "Arteva"
- Remplacer tous les fichiers logo

#### 5.3 Manifest PWA (si existe)
- [ ] `public/manifest.json` :
  ```json
  - "name": "Arteva"
  + "name": "Arteva"

  - "short_name": "Arteva"
  + "short_name": "Arteva"
  ```

---

### Phase 6 : Configuration Externe (1h)

#### 6.1 Supabase Dashboard
**Site URL** :
- [ ] https://supabase.com/dashboard/project/qygpijoytpbxgbkaylkz
- [ ] **Authentication** → **URL Configuration**
- [ ] Site URL : `https://arteva.ma` → `https://arteva.ma`
- [ ] Redirect URLs :
  ```
  - https://arteva.ma/**
  + https://arteva.ma/**

  - https://arteva.ma/fr/auth/callback
  + https://arteva.ma/fr/auth/callback

  - https://www.arteva.ma/**
  + https://www.arteva.ma/**
  ```

**Email Templates** :
- [ ] **Confirm signup** :
  ```html
  - <h2>Bienvenue sur Arteva !</h2>
  + <h2>Bienvenue sur Arteva !</h2>

  - votre plateforme Arteva
  + votre plateforme Arteva

  - © 2025 Arteva - Objets Publicitaires
  + © 2025 Arteva - Objets Publicitaires
  ```

- [ ] **Magic Link** (si utilisé)
- [ ] **Reset Password**

**SMTP (si configuré)** :
- [ ] Sender Email : `noreply@arteva.ma` → `noreply@arteva.ma`
- [ ] Sender Name : `Arteva` → `Arteva`

#### 6.2 Vercel
- [ ] Variables d'environnement :
  - `NEXT_PUBLIC_SITE_URL` → `https://arteva.ma`
- [ ] **Domaine personnalisé** :
  - Ajouter `arteva.ma`
  - Ajouter `www.arteva.ma`
  - (Garder `arteva.ma` temporairement pour redirection)

#### 6.3 DNS / Domaine
**IMPORTANT** : Tu dois avoir acheté `arteva.ma` !

- [ ] Acheter le domaine `arteva.ma` (chez ton registrar)
- [ ] Configurer les DNS :
  ```
  Type: A
  Name: @
  Value: 76.76.21.21 (Vercel IP)

  Type: CNAME
  Name: www
  Value: cname.vercel-dns.com
  ```

- [ ] Configurer email (si SMTP personnalisé) :
  ```
  MX records pour arteva.ma
  SPF: v=spf1 include:_spf.google.com ~all
  DKIM: [selon ton provider]
  ```

---

### Phase 7 : SEO et Metadata (1h)

#### 7.1 Metadata Next.js
**Fichiers à vérifier** :
- [ ] `app/layout.tsx` (metadata global)
- [ ] `app/[locale]/layout.tsx`
- [ ] Toutes les pages avec metadata

**Exemple** :
```tsx
export const metadata = {
  - title: "Arteva - Objets Publicitaires",
  + title: "Arteva - Objets Publicitaires",

  - description: "Arteva, plateforme de...",
  + description: "Arteva, plateforme de...",

  openGraph: {
    - siteName: "Arteva",
    + siteName: "Arteva",

    - url: "https://arteva.ma",
    + url: "https://arteva.ma",
  }
}
```

#### 7.2 Structured Data (JSON-LD)
**Fichiers** :
- `STRATEGIE_SEO_B2B.md` (exemples)
- Composants avec schema.org

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  - "name": "Arteva",
  + "name": "Arteva",

  - "url": "https://arteva.ma",
  + "url": "https://arteva.ma",

  - "logo": "https://arteva.ma/logo.png"
  + "logo": "https://arteva.ma/logo.png"
}
```

---

### Phase 8 : Git et GitHub (30 min)

#### 8.1 Repository
- [ ] GitHub Repository Description :
  - `Arteva - Print-On-Demand platform`
  → `Arteva - Print-On-Demand platform`

- [ ] Topics/Tags (si configurés)

- [ ] README.md (si existe)

#### 8.2 Commit Messages
**Pas besoin de changer l'historique** - juste pour les nouveaux commits

---

## 🧪 Phase 9 : Tests (2-3h)

### 9.1 Tests Locaux
- [ ] `npm run build` → Pas d'erreurs TypeScript
- [ ] `npm run dev` → Application démarre
- [ ] Tester toutes les pages :
  - [ ] Page d'accueil (`/`)
  - [ ] Catalogue (`/catalog`)
  - [ ] Page produit (`/product/[slug]`)
  - [ ] Solutions (`/solutions`)
  - [ ] Inscription (`/auth/register`)
  - [ ] Connexion (`/auth/login`)
  - [ ] Profil (`/account/profile`)
  - [ ] Commandes (`/account/orders`)

### 9.2 Tests Inscription
- [ ] S'inscrire avec nouveau compte
- [ ] Vérifier email de confirmation contient "Arteva"
- [ ] Cliquer sur le lien → Redirection vers `https://arteva.ma`

### 9.3 Tests SEO
- [ ] Vérifier balises `<title>` contiennent "Arteva"
- [ ] Vérifier Open Graph `og:site_name` = "Arteva"
- [ ] Vérifier JSON-LD contient "Arteva"

---

## 🚀 Phase 10 : Déploiement (1h)

### 10.1 Pre-Déploiement
- [ ] Merger la branche migration vers `main`
- [ ] Créer un tag git : `v1.0.0-arteva`

### 10.2 Déploiement Vercel
- [ ] Push vers `main` → Vercel auto-deploy
- [ ] Configurer domaine `arteva.ma` dans Vercel
- [ ] Attendre propagation DNS (5-48h)

### 10.3 Redirection Ancien Domaine
**Important** : Garder `arteva.ma` actif pendant 3-6 mois

- [ ] Configurer redirection 301 :
  ```
  arteva.ma → arteva.ma
  www.arteva.ma → www.arteva.ma
  ```

---

## 📊 Checklist Complète par Catégorie

### Code Source
- [x] `package.json` (nom + description)
- [ ] `src/messages/fr.json` (~80 occurrences)
- [ ] `src/messages/ar.json` (~20 occurrences)
- [ ] `src/components/layout/Footer.tsx`
- [ ] `src/components/product/ProductExperience.tsx`
- [ ] `app/[locale]/(store)/solutions/kit-bienvenue-employe/page.tsx`
- [ ] `.mcp-config.json`
- [ ] `.mcp-config.example.json`
- [ ] Tous les fichiers `layout.tsx` (metadata)

### Documentation
- [ ] `IMPLEMENTATION_SUMMARY.md`
- [ ] `SUPABASE_EMAIL_CONFIG.md`
- [ ] `VERCEL_SETUP.md`
- [ ] `STRATEGIE_SEO_B2B.md`
- [ ] `OPTIMISATIONS_SEO_PAGES_PRODUITS.md`
- [ ] `ANALYSE_UX_SEO_EXPERT.md`
- [ ] `docs/CHANGEMENTS_VERCEL.md`
- [ ] `docs/SERPAPI_SEO_SETUP.md`
- [ ] `docs/MCP_SECURITY.md`
- [ ] `docs/DEPLOIEMENT_VERCEL.md`
- [ ] `.env.example`
- [ ] `README.md` (si existe)

### Assets
- [ ] `public/favicon.ico` (recréer)
- [ ] `public/icons/icon.svg` (recréer)
- [ ] `public/logo.png` (si existe - recréer)
- [ ] `public/manifest.json` (si existe)
- [ ] PWA icons (si existent)

### Configuration Externe
- [ ] Supabase : Site URL
- [ ] Supabase : Redirect URLs
- [ ] Supabase : Email template "Confirm signup"
- [ ] Supabase : Email template "Magic Link"
- [ ] Supabase : Email template "Reset Password"
- [ ] Supabase : SMTP Sender (si configuré)
- [ ] Vercel : `NEXT_PUBLIC_SITE_URL`
- [ ] Vercel : Ajouter domaine `arteva.ma`
- [ ] DNS : Acheter `arteva.ma`
- [ ] DNS : Configurer A/CNAME records
- [ ] DNS : Configurer email (MX, SPF, DKIM)

### Git/GitHub
- [ ] Repository description
- [ ] Repository topics/tags
- [ ] README.md

### Tests
- [ ] Build sans erreurs
- [ ] Toutes les pages fonctionnent
- [ ] Inscription + email de confirmation
- [ ] SEO metadata correctes

---

## ⚠️ Points d'Attention

### 1. Domaine Non Acheté
**Si `arteva.ma` n'est pas encore acheté** :
- ⚠️ **ACHETER LE DOMAINE EN PRIORITÉ**
- Temps de propagation DNS : 5 min à 48h
- Réserver aussi `arteva.com` si possible

### 2. Emails Personnalisés
**Si tu utilises des emails @arteva.ma** :
- Tu devras configurer @arteva.ma (MX, SPF, DKIM)
- Ou utiliser un service tiers (SendGrid, Mailgun)

### 3. Ancien Domaine
**Ne PAS supprimer arteva.ma** :
- Garder actif 3-6 mois minimum
- Configurer redirections 301
- Important pour SEO et utilisateurs existants

### 4. Assets Design
**Tu dois créer** :
- Nouveau logo "Arteva"
- Nouveau favicon
- Nouvelles icônes PWA

---

## 📈 Estimation Temps Total

| Phase | Temps Estimé |
|-------|-------------|
| 1. Préparation | 1h |
| 2. Code Source | 2-3h |
| 3. Documentation | 1h |
| 4. Variables Env | 30 min |
| 5. Assets Design | 2h |
| 6. Config Externe | 1h |
| 7. SEO Metadata | 1h |
| 8. Git/GitHub | 30 min |
| 9. Tests | 2-3h |
| 10. Déploiement | 1h |
| **TOTAL** | **12-15h** |

---

## 🎯 Ordre de Priorité Recommandé

### Semaine 1 : Préparation
1. Acheter domaine `arteva.ma`
2. Créer nouveau logo/favicon
3. Créer branche `migration/arteva`

### Semaine 2 : Code
4. Remplacer dans `src/messages/` (80% du travail)
5. Remplacer dans composants React
6. Remplacer dans documentation

### Semaine 3 : Configuration
7. Configurer Supabase (URLs + emails)
8. Configurer Vercel (domaine + variables)
9. Configurer DNS

### Semaine 4 : Tests & Deploy
10. Tests complets en staging
11. Déploiement production
12. Monitoring 48h

---

## 🔄 Script d'Automatisation (Optionnel)

Pour accélérer le processus :

```bash
#!/bin/bash
# migration-arteva.sh

echo "🚀 Migration Arteva → Arteva"
echo "================================"

# Backup
echo "📦 Création backup..."
cp -r . ../arteva-backup-$(date +%Y%m%d)

# Remplacements dans messages
echo "📝 Remplacement dans traductions..."
sed -i '' 's/Arteva/Arteva/g' src/messages/fr.json
sed -i '' 's/Arteva/Arteva/g' src/messages/ar.json

# Remplacements dans documentation
echo "📚 Remplacement dans documentation..."
find . -name "*.md" -not -path "*/node_modules/*" -exec sed -i '' 's/Arteva/Arteva/g' {} +
find . -name "*.md" -not -path "*/node_modules/*" -exec sed -i '' 's/arteva\.ma/arteva.ma/g' {} +

# Remplacements URLs
echo "🌐 Remplacement URLs..."
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' 's/arteva\.ma/arteva.ma/g' {} +

# Package.json
echo "📦 Mise à jour package.json..."
sed -i '' 's/"name": "arteva"/"name": "arteva"/g' package.json
sed -i '' 's/Arteva Print-On-Demand/Arteva Print-On-Demand/g' package.json

echo "✅ Migration automatique terminée !"
echo "⚠️  Vérifier manuellement les changements avant commit"
```

---

**Dernière mise à jour** : 2025-10-19
**Créé par** : Claude Code
