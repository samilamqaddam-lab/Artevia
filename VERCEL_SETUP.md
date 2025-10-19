# Configuration Vercel pour Arteva

## 🚀 Variables d'Environnement à Configurer

### Accéder aux Variables d'Environnement

1. Va sur https://vercel.com/samilamqaddam-lab/arteva (ou ton dashboard Vercel)
2. Clique sur **Settings** → **Environment Variables**

---

## 📝 Variables à Ajouter

### 1. Variables Supabase (Obligatoires)

```
SUPABASE_URL=https://qygpijoytpbxgbkaylkz.supabase.co
```
**Environnement** : Production, Preview, Development

```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5Z3Bpam95dHBieGdia2F5bGt6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTI0ODMzMiwiZXhwIjoyMDc0ODI0MzMyfQ.AoO4J7uk3yndXnIsSz7R-6QD1XB1ZdbyaJiH2TzLjzU
```
**Environnement** : Production, Preview, Development

```
NEXT_PUBLIC_SUPABASE_URL=https://qygpijoytpbxgbkaylkz.supabase.co
```
**Environnement** : Production, Preview, Development

```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5Z3Bpam95dHBieGdia2F5bGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNDgzMzIsImV4cCI6MjA3NDgyNDMzMn0.K7gHfefm4ZBdWGNatPjgpRy4gbJ78BZKSxlBmS5LlRM
```
**Environnement** : Production, Preview, Development

```
SUPABASE_ACCESS_TOKEN=sbp_49d9952aa1d2d93123de8a0204365c2394228f4b
```
**Environnement** : Production, Preview, Development

---

### 2. URL du Site (IMPORTANTE - Résout le problème localhost) 🔴

```
NEXT_PUBLIC_SITE_URL=https://arteva.ma
```
**Environnement** : Production ✅
**Note** : Cette variable contrôle l'URL de redirection dans les emails de confirmation

Pour Preview/Development (optionnel) :
```
NEXT_PUBLIC_SITE_URL=https://your-preview.vercel.app
```
**Environnement** : Preview

---

## 🎯 Configuration Complète

Voici comment ça devrait ressembler dans Vercel :

```
┌─────────────────────────────────────────────────────────────────┐
│ Variable Name                  │ Value                          │
├────────────────────────────────┼────────────────────────────────┤
│ SUPABASE_URL                   │ https://qygpijoytpbx...        │ [Production] [Preview] [Development]
│ SUPABASE_SERVICE_ROLE_KEY      │ eyJhbGciOiJIUzI1NiI...        │ [Production] [Preview] [Development]
│ NEXT_PUBLIC_SUPABASE_URL       │ https://qygpijoytpbx...        │ [Production] [Preview] [Development]
│ NEXT_PUBLIC_SUPABASE_ANON_KEY  │ eyJhbGciOiJIUzI1NiI...        │ [Production] [Preview] [Development]
│ SUPABASE_ACCESS_TOKEN          │ sbp_49d9952aa1d2d93...        │ [Production] [Preview] [Development]
│ NEXT_PUBLIC_SITE_URL           │ https://arteva.ma             │ [Production]
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Redéployer Après Configuration

**Important** : Après avoir ajouté les variables d'environnement, tu dois redéployer :

### Option 1 : Redéploiement Automatique
1. Pousse un nouveau commit :
```bash
git add .
git commit -m "chore: Update environment variables"
git push origin main
```

### Option 2 : Redéploiement Manuel
1. Va sur Vercel Dashboard
2. Clique sur **Deployments**
3. Trouve le dernier déploiement
4. Clique sur les **3 points** → **Redeploy**
5. Coche **Use existing Build Cache** (optionnel)
6. Clique **Redeploy**

---

## ✅ Vérification

Après le redéploiement, teste :

1. Va sur https://arteva.ma/fr/auth/register
2. Crée un compte
3. Vérifie l'email de confirmation
4. Le lien devrait être : `https://arteva.ma/fr/auth/callback?code=...` ✅
5. Clique dessus - tu seras redirigé vers `https://arteva.ma/fr`

---

## 🐛 Troubleshooting

### Problème : Toujours redirigé vers localhost

**Cause** : Variable `NEXT_PUBLIC_SITE_URL` non configurée ou déploiement pas fait après config

**Solution** :
1. Vérifie que `NEXT_PUBLIC_SITE_URL=https://arteva.ma` est bien dans les variables Vercel
2. Redéploie l'application (voir section ci-dessus)
3. Vide le cache Supabase en attendant 5-10 minutes

### Problème : 404 après avoir cliqué sur le lien

**Cause** : La route `/auth/callback` n'existe pas ou n'est pas déployée

**Solution** :
1. Vérifie que `app/[locale]/auth/callback/route.ts` existe dans le repo
2. Redéploie l'application
3. Vérifie les logs Vercel pour voir les erreurs

### Problème : Email toujours de Supabase

**Cause** : Templates email pas configurés dans Supabase Dashboard

**Solution** :
1. Va dans Supabase Dashboard → Authentication → Email Templates
2. Modifie les templates (voir `SUPABASE_EMAIL_CONFIG.md`)
3. Réessaye l'inscription

---

## 📊 Récapitulatif des Configurations

### ✅ Code (Déjà fait)
- [x] Ajout de `NEXT_PUBLIC_SITE_URL` dans le code
- [x] Fallback vers `window.location.origin` si variable non définie
- [x] Fichier `.env.example` créé

### ⚠️ Vercel (À faire maintenant)
- [ ] Ajouter `NEXT_PUBLIC_SITE_URL=https://arteva.ma` en Production
- [ ] Vérifier que toutes les autres variables Supabase sont là
- [ ] Redéployer l'application

### ⚠️ Supabase Dashboard (À faire)
- [ ] Configurer Site URL : `https://arteva.ma`
- [ ] Ajouter Redirect URLs
- [ ] Modifier les templates email

---

**Dernière mise à jour** : 2025-10-19
