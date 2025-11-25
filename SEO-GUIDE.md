# 🎯 Arteva.ma - Guide SEO & Stratégie

**Arteva.ma** est un site e-commerce B2B spécialisé dans la vente et personnalisation de produits promotionnels pour entreprises au Maroc.

- **URL**: https://arteva.ma
- **Marché**: Maroc (Google.ma, audience marocaine)
- **Langue**: Français (dialecte et contexte marocain)
- **Secteur**: Produits promotionnels B2B (goodies, cadeaux d'entreprise, objets publicitaires personnalisés)
- **Public cible**: Entreprises marocaines, services marketing, départements communication, RH
- **Type de site**: E-commerce + personnalisation en ligne
- **Stack**: Next.js 14 (App Router), TypeScript, Supabase, Tailwind CSS

---

## 📦 Catalogue Produits Actuel

### Catégories (4)
| Catégorie | Clé | Produits |
|-----------|-----|----------|
| Bureau/Papeterie | `office` | Bloc-notes, Carnets, Chemises, Stylos |
| Mugs & Drinkware | `drinkware` | Mugs céramique personnalisables |
| Textiles | `textile` | T-shirts, Tote bags |
| Tech | `tech` | Clés USB, Tapis de souris |

### Produits (9)
| Produit | Slug URL | MOQ | Catégorie |
|---------|----------|-----|-----------|
| Bloc-notes personnalisés | `/product/bloc-notes-personnalises` | 50 | office |
| Bloc-note Skin A5 | `/product/bloc-note-skin-a5` | 50 | office |
| Stylos métal S1 | `/product/stylos-metal-s1` | 100 | office |
| Chemise à rabat classique | `/product/chemise-a-rabat-classique` | 100 | office |
| Mug céramique | `/product/mug-personnalisable-ceramique` | 50 | drinkware |
| Clé USB 16Go Bamboo | `/product/cle-usb-16go-bamboo` | 50 | tech |
| Tapis de souris | `/product/mousepad-soft` | 50 | tech |
| T-shirt Essential | `/product/tshirt-essential-coton` | 25 | textile |
| Tote bag Canvas | `/product/totebag-canvas` | 50 | textile |

### Solutions/Packs
- Kit Bienvenue Employé: `/solutions/kit-bienvenue-employe`

---

## 🗺️ Structure du Site

### Pages Publiques
```
/fr                          → Accueil
/fr/catalog                  → Catalogue complet
/fr/product/[slug]           → Fiche produit (9 produits)
/fr/solutions                → Solutions/Packs
/fr/solutions/kit-bienvenue-employe → Kit onboarding
/fr/rfq                      → Demande de devis
/fr/designs                  → Designer en ligne
```

### Pages Auth
```
/fr/auth/login               → Connexion
/fr/auth/register            → Inscription
/fr/auth/forgot-password     → Mot de passe oublié
/fr/auth/reset-password      → Réinitialisation
```

### Pages Compte Client
```
/fr/account/profile          → Profil
/fr/account/designs          → Mes designs
/fr/account/orders           → Mes commandes
```

### Pages Admin
```
/fr/admin/products           → Gestion produits
/fr/admin/products/[id]/photos → Photos produit
/fr/admin/pricing            → Gestion prix
```

---

## 📊 État Actuel

**Dernière mise à jour**: 25 novembre 2025

### Métriques SEO
- Lighthouse SEO Score: [À auditer]
- Lighthouse Performance: [À auditer]
- Core Web Vitals: [À mesurer]
- Pages indexées: ~20 pages (9 produits + pages statiques)

### Compétiteurs Identifiés (Maroc) - Analysés le 25/11/2025

| Rang | Site | Forces | Faiblesses |
|------|------|--------|------------|
| 1 | **publiimport.ma** | Leader depuis 1961, légitimité historique, 9 catégories | SEO basique, pas de schema markup |
| 2 | **lepublicitaire.com** | "Livraison rapide 48h" (promesse délai) | - |
| 3 | **imagia.ma** | Large gamme | - |
| 4 | **cadeauxcollections.com** | Importateur | - |
| 5 | **objetpublicitaire.ma** | Schema markup, blog SEO, "devis 4h", ROI stats | Promesses délais |
| 6 | **progift-maroc.com** | Focus Casablanca | - |
| 7 | **clic-kado.com** | 11 ans expérience | - |
| 8 | **kado-pro.com** | Prix affichés | - |
| 9 | **myprogift.com** | International (Afrique, Europe, MENA) | - |
| 10 | **maroc-objet.com** | Variété produits | - |

**Autres**: kalmaz.ma, maroc-promos.com, inewgadgets.com

### Insights Concurrence
- **Publiimport.ma** (N°1): Magento, "depuis 1961", pas de schema structuré
- **Objetpublicitaire.ma** (N°5): WordPress/WooCommerce, schema BreadcrumbList, blog actif, stats ROI ("81% retiennent la marque")
- **Pattern commun**: Promesses de délais (48h, 4h) - ce qu'on évite
- **Opportunité**: Schema markup avancé, contenu qualité sans promesses irréalistes

### Mots-clés Cibles - Recherche 25/11/2025

**Principal** (volume élevé):
- "objets publicitaires Maroc" → Forte concurrence (publiimport #1)
- "objets publicitaires personnalisés Maroc"
- "goodies entreprise Maroc"

**Secondaires** (opportunités):
- "cadeaux entreprise Casablanca" → progift-maroc.com #1
- "fournisseur goodies Maroc"
- "objet publicitaire Casablanca"
- "cadeau personnalisé entreprise Maroc"

**Niche "Onboarding/Welcome Pack"** (faible concurrence locale):
- "kit bienvenue employé Maroc" → Peu de résultats locaux
- "welcome pack entreprise Maroc" → styletexfactory seul résultat local
- "onboarding kit Maroc" → Opportunité!
- "pack nouvel employé Maroc"

**Longue traîne**:
- "mug personnalisé logo entreprise Maroc"
- "bloc-notes personnalisés entreprise Casablanca"
- "t-shirt entreprise personnalisé Maroc"
- "stylos publicitaires gravure Maroc"
- "clé USB personnalisée logo Maroc"

**Opportunité SEO identifiée**:
Le segment "welcome pack / kit bienvenue" est peu concurrencé au Maroc.
Artevia a déjà une page `/solutions/kit-bienvenue-employe` → À optimiser!

---

## 🎯 Objectifs SEO

### Court Terme (Mois 1)
- [ ] Score Lighthouse SEO > 90
- [ ] Core Web Vitals tous en vert
- [ ] Structured data complet (Organization, Product, LocalBusiness)
- [ ] Indexation complète Google.ma

### Moyen Terme (Mois 2-3)
- [ ] Top 5 pour "objets publicitaires Maroc"
- [ ] Visibilité dans recherche locale Casablanca
- [ ] Optimisation fiches produits (rich snippets)

### Long Terme (Mois 3-6)
- [ ] Autorité dans le secteur produits promotionnels Maroc
- [ ] Présence dans AI search (ChatGPT, Perplexity)
- [ ] Conversion organique croissante

---

## 🛠️ Outils MCP Disponibles

### Installés
- **Supabase MCP**: Base de données, migrations, types
- **SerpAPI**: Recherche images/web
- **Chrome DevTools**: Tests performance
- **web_search**: Recherche compétiteurs
- **web_fetch**: Analyse contenu

### À Installer (Optionnel)
- [ ] Google Search Console MCP (données réelles)
- [ ] Lighthouse MCP (audits automatisés)

---

## 📋 Plan d'Action

### Phase 1: Audit Initial
**Actions**:
- [ ] Audit Lighthouse complet (mobile + desktop)
- [ ] Analyse top 5 compétiteurs Maroc
- [ ] Vérifier indexation Google.ma
- [ ] Identification quick wins

### Phase 2: Optimisation Technique
**Actions**:
- [ ] Meta tags optimisés (titres < 60 chars, descriptions < 160)
- [ ] Schema markup LocalBusiness (adresse Casablanca)
- [ ] Schema Product sur les 9 fiches produits
- [ ] Core Web Vitals optimization
- [ ] Images: alt text, lazy loading, WebP

### Phase 3: Optimisation Contenu
**Actions**:
- [ ] Fiches produits: descriptions uniques, H1 optimisés
- [ ] Page catalog: catégories structurées
- [ ] Page solutions: contenu riche pour onboarding kits
- [ ] Internal linking entre produits similaires

### Phase 4: Visibilité & Conversion
**Actions**:
- [ ] Google Business Profile (si applicable)
- [ ] Rich snippets produits (prix, dispo)
- [ ] FAQ schema sur pages clés
- [ ] Monitoring positions mots-clés

---

## 🚀 Commandes Rapides

### Audits
- `"Lance l'audit SEO complet Arteva.ma"` → Diagnostic initial
- `"Vérifie les Core Web Vitals"` → Performance mobile/desktop
- `"Analyse la concurrence au Maroc"` → Top compétiteurs locaux

### Recherche
- `"Recherche mots-clés produits promotionnels Maroc"` → Keywords local
- `"Analyse goodies.ma"` → Étude concurrent principal
- `"Compare Arteva vs goodies.ma"` → Gap analysis

### Optimisation
- `"Optimise la fiche produit bloc-notes-personnalises"` → Meta + schema
- `"Génère schema Product pour mug-personnalisable-ceramique"` → JSON-LD
- `"Améliore la page /catalog"` → Suggestions SEO

### Monitoring
- `"Génère rapport hebdomadaire"` → Status + progrès
- `"Update CLAUDE.md avec résultats"` → Log automatique

---

## 📝 Standards & Conventions

### SEO Maroc Spécifiques
- **Google.ma**: Priorité (pas Google.fr)
- **Langage**: Français marocain (MAD, références locales)
- **Local SEO**: Schema LocalBusiness avec adresse Casablanca
- **Devise**: MAD (Dirham marocain)
- **Marché**: B2B entreprises marocaines

### E-commerce Best Practices
- **Fiches produits**: Images HD, descriptions détaillées, prix visible (MAD)
- **Schema Product**: Prix, disponibilité, MOQ
- **UX**: Mobile-first, devis simple, designer intuitif
- **Trust signals**: Qualité produits, accompagnement, transparence processus

### Core Web Vitals (E-commerce)
- **LCP** < 2.5s (images produits optimisées)
- **FID** < 100ms (interactivité designer)
- **CLS** < 0.1 (layout stable, images sized)

---

## 💡 Différenciateurs Clés (USP)

À mettre en avant pour le SEO:
1. **Designer en ligne** - Personnalisation autonome, visualisation avant commande
2. **Accompagnement personnalisé** - Chef de projet dédié, support réactif
3. **Qualité premium** - Production soignée, matériaux durables
4. **Flexibilité** - Adaptation aux besoins spécifiques de chaque entreprise
5. **Transparence** - Devis clair, pas de frais cachés

### À éviter dans la communication
- ❌ Promesses de délais stricts (ex: "BAT 24h", "livraison 48h")
- ❌ Références clients fictives ou aspirationnelles
- ❌ Engagements qu'on ne peut pas garantir à 100%

### Trust signals à développer (futur)
- Témoignages clients réels (quand on en aura)
- Certifications qualité
- Portfolio de réalisations
- Garanties produits

---

## 🗒️ Journal des Actions

### Instructions pour Claude Code
**Comment enrichir ce document:**
1. Après chaque audit: ajouter résultats dans section appropriée
2. Après analyse: compléter listes compétiteurs/mots-clés
3. Après optimisation: documenter changements + impact
4. Hebdomadaire: mettre à jour métriques et KPIs

**Format recommandé pour les entrées**:
```
### [Date] - [Action]
**Quoi**: Description courte
**Résultats**: Métriques avant → après
**Décisions**: Ce qu'on a appris/décidé
**Next**: Prochaines actions
```

---

### 2025-11-25 - Setup Initial + Analyse SEO
**Quoi**: CLAUDE.md créé, fr.json corrigé, analyse concurrence complète

**Actions réalisées**:
1. ✅ Créé CLAUDE.md avec contexte projet complet
2. ✅ Corrigé fr.json: supprimé promesses délais ("BAT 24h", délais livraison)
3. ✅ Remplacé testimonials fictifs par section "Notre engagement qualité"
4. ✅ Analysé 10+ concurrents marocains via SerpAPI
5. ✅ Identifié mots-clés et opportunités (niche welcome pack)

**Modifications fr.json**:
- Tagline: "Qualité & Accompagnement" au lieu de "BAT 24h"
- Badges: "Qualité premium garantie" au lieu de "BAT PDF sous 24h"
- Section trust: valeurs (qualité, support, flexibilité) au lieu de logos clients fictifs
- Packs: délais génériques au lieu de "7 jours", "10 jours"
- Stats: "100% personnalisation" au lieu de "24h" et "98% satisfaits"

**Insights clés**:
- 10 concurrents identifiés, publiimport.ma leader (#1)
- Opportunité: niche "welcome pack/onboarding" peu concurrencée
- Pattern concurrent: tous promettent des délais → notre différenciation = qualité/accompagnement

**Next**:
- Déployer site pour audit Lighthouse
- Optimiser page `/solutions/kit-bienvenue-employe` pour SEO onboarding
- Implémenter schema markup (Product, LocalBusiness)

---

## 📚 Ressources Techniques

### Fichiers Clés SEO
- `src/lib/products.ts` - Définitions produits (879 lignes)
- `src/messages/fr.json` - Traductions FR
- `app/[locale]/(store)/product/[slug]/page.tsx` - Pages produits
- `app/[locale]/(store)/catalog/page.tsx` - Page catalogue

### API Routes
- `/api/rfq` - Demandes de devis
- `/api/bat` - Bons à tirer

### Images Dynamiques
- Supabase Storage: `product-images` bucket
- Table: `product_hero_images`
- Admin: `/admin/products/[id]/photos`

---

## 🎯 Quick Wins Potentiels

### Technique SEO
1. **Schema Product** - Ajouter sur les 9 fiches (prix, disponibilité)
2. **Schema LocalBusiness** - Présence locale Casablanca
3. **Alt text images** - Descriptions produits avec mots-clés
4. **Breadcrumbs** - Navigation claire + schema BreadcrumbList
5. **Internal linking** - Lier produits complémentaires

### Contenu à valoriser
1. **Accompagnement** - Mettre en avant le support et suivi projet
2. **Qualité** - Détailler les matériaux, finitions, durabilité
3. **Personnalisation** - Expliquer le processus de design en ligne
4. **Flexibilité** - Montrer les options d'adaptation aux besoins
5. **FAQ** - Questions sur le processus, pas sur les délais

### Ton de communication
- ✅ "Accompagnement personnalisé"
- ✅ "Qualité garantie"
- ✅ "Support réactif"
- ✅ "Produits durables"
- ❌ "Livraison express"
- ❌ "BAT sous 24h"
- ❌ "Délai garanti"
