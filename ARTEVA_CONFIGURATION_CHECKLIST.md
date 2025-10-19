# ✅ Checklist de Configuration Arteva

Ce document récapitule les étapes de configuration manuelle nécessaires après la migration de marque vers **Arteva**.

---

## 🎯 Configuration Terminée

- ✅ Code source migré (Artevia → Arteva)
- ✅ Logo mis à jour (design texte)
- ✅ Translations FR/AR mises à jour
- ✅ Documentation mise à jour
- ✅ Package.json et manifest.ts mis à jour
- ✅ Push vers GitHub effectué

---

## ⚠️ Configurations Manuelles Requises

### 1. Vercel Environment Variables

**URL:** https://vercel.com/samilamqaddam-lab/artevia/settings/environment-variables

**Actions nécessaires:**

1. **Mettre à jour `NEXT_PUBLIC_SITE_URL`:**
   ```
   Ancienne valeur: https://artevia.ma
   Nouvelle valeur: https://arteva.ma
   ```
   - Environnements: Production, Preview, Development

2. **Redéployer l'application:**
   - Option A: Attendre le prochain push Git (automatique)
   - Option B: Redéploiement manuel via Dashboard Vercel
     - Deployments → Dernier deployment → ⋯ → Redeploy

---

### 2. Vercel Domain Configuration

**URL:** https://vercel.com/samilamqaddam-lab/artevia/settings/domains

**Actions nécessaires:**

1. **Ajouter le nouveau domaine:**
   - Cliquer sur "Add Domain"
   - Ajouter: `arteva.ma`
   - Ajouter: `www.arteva.ma`

2. **Configuration DNS:**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Optionnel - Supprimer l'ancien domaine:**
   - Garder `artevia.ma` temporairement pour rediriger
   - Ou supprimer si migration complète

---

### 3. Supabase Dashboard - Authentication URLs

**URL:** https://supabase.com/dashboard/project/qygpijoytpbxgbkaylkz/auth/url-configuration

**Actions nécessaires:**

1. **Mettre à jour Site URL:**
   ```
   Ancienne valeur: https://artevia.ma
   Nouvelle valeur: https://arteva.ma
   ```

2. **Mettre à jour Redirect URLs:**

   **Remplacer:**
   ```
   https://artevia.ma/**
   https://artevia.ma/fr/auth/callback
   https://artevia.ma/ar/auth/callback
   https://www.artevia.ma/**
   https://www.artevia.ma/fr/auth/callback
   https://www.artevia.ma/ar/auth/callback
   ```

   **Par:**
   ```
   https://arteva.ma/**
   https://arteva.ma/fr/auth/callback
   https://arteva.ma/ar/auth/callback
   https://www.arteva.ma/**
   https://www.arteva.ma/fr/auth/callback
   https://www.arteva.ma/ar/auth/callback
   ```

3. **Garder localhost pour développement:**
   ```
   http://localhost:3000/**
   http://localhost:3000/fr/auth/callback
   http://localhost:3000/ar/auth/callback
   ```

---

### 4. Supabase Dashboard - Email Templates

**URL:** https://supabase.com/dashboard/project/qygpijoytpbxgbkaylkz/auth/templates

**Actions nécessaires:**

Les templates ont déjà été mis à jour dans le code, mais vérifier que les templates Supabase utilisent bien "Arteva":

1. **Confirm signup template:**
   - Remplacer toutes les occurrences de "Artevia" par "Arteva"
   - Footer: `© 2025 Arteva - Objets Publicitaires Personnalisés`

2. **Reset Password template:**
   - Remplacer "Artevia" par "Arteva"

3. **Magic Link template (si utilisé):**
   - Remplacer "Artevia" par "Arteva"

**Référence:** Voir `SUPABASE_EMAIL_CONFIG.md` pour les templates complets

---

### 5. Supabase Dashboard - SMTP Configuration (Optionnel)

**URL:** https://supabase.com/dashboard/project/qygpijoytpbxgbkaylkz/auth/email

**Actions nécessaires (si SMTP personnalisé):**

```
Sender Email: noreply@arteva.ma (au lieu de noreply@artevia.ma)
Sender Name: Arteva
```

---

### 6. DNS Records (Si SMTP personnalisé)

**Actions nécessaires:**

Si vous configurez SMTP avec `@arteva.ma`, ajouter:

```
Type: TXT
Name: @
Value: v=spf1 include:_spf.sendgrid.net ~all
(ou selon votre provider SMTP)

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@arteva.ma
```

---

## 🔍 Tests de Vérification

### Après configuration Vercel + Supabase:

1. **Test Email de Confirmation:**
   - Aller sur https://arteva.ma/fr/auth/register
   - Créer un compte test
   - Vérifier que l'email vient de "Arteva"
   - Vérifier que le lien redirige vers `https://arteva.ma/fr/auth/callback`

2. **Test Navigation:**
   - Vérifier que le logo "Arteva" s'affiche correctement
   - Vérifier Footer: `© 2025 Arteva`
   - Vérifier email: `hello@arteva.ma`

3. **Test PWA:**
   - Installer la PWA depuis le navigateur
   - Vérifier que l'icône affiche "Arteva"
   - Vérifier que le nom est "Arteva - Print-On-Demand Maroc"

---

## 📋 Résumé des URLs

| Service | Configuration | Lien |
|---------|--------------|------|
| Vercel Env Vars | Variables d'environnement | https://vercel.com/samilamqaddam-lab/artevia/settings/environment-variables |
| Vercel Domains | Configuration domaines | https://vercel.com/samilamqaddam-lab/artevia/settings/domains |
| Supabase Auth URLs | URLs de redirection | https://supabase.com/dashboard/project/qygpijoytpbxgbkaylkz/auth/url-configuration |
| Supabase Email | Templates email | https://supabase.com/dashboard/project/qygpijoytpbxgbkaylkz/auth/templates |

---

## ✨ Changements de Marque Appliqués

### Dans le Code:
- ✅ Nom de marque: "Artevia" → "Arteva"
- ✅ Email: `hello@artevia.ma` → `hello@arteva.ma`
- ✅ Package name: `artevia` → `arteva`
- ✅ Logo: Design circulaire → Texte simple "Arteva"
- ✅ PWA manifest: "Artevia" → "Arteva"
- ✅ Documentation: Tous les fichiers .md mis à jour

### Fichiers Modifiés:
- 43 files changed, 810 insertions(+), 231 deletions(-)

---

**Dernière mise à jour:** 2025-10-19
**Version:** 0.1.0
