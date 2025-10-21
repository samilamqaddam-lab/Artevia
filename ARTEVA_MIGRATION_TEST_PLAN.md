# 🧪 Plan de Test - Migration Arteva

## ✅ Configurations Complétées

Avant de tester, vérifions ce qui a été fait:

### Code & Branding
- ✅ Migration complète Artevia → Arteva (236 changements)
- ✅ Logo texte "Arteva" dans Header
- ✅ Email: hello@arteva.ma
- ✅ Traductions FR/AR mises à jour
- ✅ PWA manifest: "Arteva"

### Supabase (Automatique via API)
- ✅ Site URL: https://arteva.ma
- ✅ Redirect URLs: Toutes les variantes arteva.ma configurées
- ✅ Email templates: Branding Arteva complet

### Vercel
- ✅ Domaine arteva.ma lié
- ⚠️ À vérifier: Variable `NEXT_PUBLIC_SITE_URL=https://arteva.ma`

---

## 🎯 Tests à Effectuer

### Test 1: Accessibilité du Domaine

**Objectif:** Vérifier que le site est accessible sur arteva.ma

**Steps:**
1. Ouvrir un navigateur en navigation privée
2. Aller sur: `https://arteva.ma`
3. Vérifier que le site se charge correctement

**Résultat attendu:**
- ✅ Site accessible sans erreur
- ✅ Certificat SSL valide (cadenas vert)
- ✅ Pas de redirection vers artevia.ma

**Status:** [ ] À tester

---

### Test 2: Branding Visuel

**Objectif:** Vérifier que le branding Arteva est partout

**Steps:**
1. Sur `https://arteva.ma/fr`
2. Vérifier le Header (logo)
3. Vérifier le Footer
4. Vérifier le titre de l'onglet

**Résultat attendu:**
- ✅ Logo Header: "Arteva" en texte simple
- ✅ Footer: "© 2025 Arteva · Objets Publicitaires..."
- ✅ Email footer: "hello@arteva.ma"
- ✅ Titre onglet: "Arteva - Print-On-Demand Maroc"

**Status:** [ ] À tester

---

### Test 3: PWA (Progressive Web App)

**Objectif:** Vérifier que la PWA utilise le nouveau nom

**Steps:**
1. Sur `https://arteva.ma/fr`
2. Ouvrir DevTools (F12)
3. Aller dans Application → Manifest
4. Vérifier le manifest

**Résultat attendu:**
- ✅ Name: "Arteva - Print-On-Demand Maroc"
- ✅ Short name: "Arteva"
- ✅ Start URL: "/fr"

**Status:** [ ] À tester

---

### Test 4: Inscription Utilisateur (CRITIQUE)

**Objectif:** Vérifier le flow complet d'inscription avec email de confirmation

**Steps:**
1. Aller sur: `https://arteva.ma/fr/auth/register`
2. Remplir le formulaire:
   - Email: `test.arteva.$(date +%s)@example.com` (ou ton email)
   - Mot de passe: `Test123!`
   - Confirmer mot de passe: `Test123!`
3. Cliquer sur "S'inscrire"

**Résultat attendu - Écran de confirmation:**
- ✅ Message: "Vérifiez votre email"
- ✅ Texte: "Nous avons envoyé un lien de confirmation à : [ton email]"
- ✅ Icône email verte
- ✅ Bouton "Retour à la connexion"

**Status:** [ ] À tester

---

### Test 5: Email de Confirmation (CRITIQUE)

**Objectif:** Vérifier que l'email utilise le branding Arteva

**Steps:**
1. Après l'inscription (Test 4), vérifier ta boîte email
2. Chercher l'email de confirmation
3. Vérifier le contenu

**Résultat attendu - Email:**
- ✅ **Sujet:** "Bienvenue sur Arteva"
- ✅ **Titre H2:** "Bienvenue sur Arteva !"
- ✅ **Texte:** Mention "Arteva" (pas "Artevia")
- ✅ **Bouton:** Orange (#F59E0B), texte "Confirmer mon email"
- ✅ **Footer:** "© 2025 Arteva - Objets Publicitaires Personnalisés"
- ✅ **Footer:** "Casablanca, Maroc"

**Status:** [ ] À tester

---

### Test 6: Redirection Email (CRITIQUE)

**Objectif:** Vérifier que le lien de confirmation redirige vers arteva.ma

**Steps:**
1. Dans l'email de confirmation, regarder l'URL du bouton
2. Cliquer sur le bouton "Confirmer mon email"
3. Observer la redirection

**Résultat attendu:**
- ✅ **URL du lien:** `https://arteva.ma/fr/auth/callback?code=...`
- ✅ **Redirection vers:** `https://arteva.ma/fr`
- ✅ **Status:** Connecté automatiquement
- ✅ **Pas de redirection** vers localhost ou artevia.ma

**Status:** [ ] À tester

---

### Test 7: Navigation Connecté

**Objectif:** Vérifier que l'utilisateur connecté peut naviguer

**Steps:**
1. Après confirmation (Test 6), vérifier le Header
2. Cliquer sur "Mon compte" dans le Header
3. Vérifier les pages account

**Résultat attendu:**
- ✅ Header affiche "Mon compte" et "Déconnexion"
- ✅ Accès à `/account/designs`
- ✅ Accès à `/account/profile`
- ✅ Accès à `/account/orders`
- ✅ Pas d'erreur d'authentification

**Status:** [ ] À tester

---

### Test 8: Réinitialisation Mot de Passe

**Objectif:** Vérifier l'email de reset password

**Steps:**
1. Se déconnecter
2. Aller sur: `https://arteva.ma/fr/auth/login`
3. Cliquer sur "Mot de passe oublié?" (si disponible)
4. Ou utiliser l'API Supabase pour trigger un reset

**Résultat attendu - Email:**
- ✅ **Sujet:** "Réinitialiser votre mot de passe Arteva"
- ✅ **Titre:** "Réinitialisation de votre mot de passe"
- ✅ **Texte:** Mention "Arteva"
- ✅ **Bouton:** "Réinitialiser mon mot de passe"
- ✅ **Footer:** Branding Arteva

**Status:** [ ] À tester

---

### Test 9: Multi-Langue (FR/AR)

**Objectif:** Vérifier que le branding fonctionne en arabe

**Steps:**
1. Sur `https://arteva.ma/fr`
2. Changer la langue vers AR (via LanguageSwitcher)
3. Vérifier: `https://arteva.ma/ar`

**Résultat attendu:**
- ✅ Logo: "Arteva" (même en arabe)
- ✅ Layout RTL fonctionne
- ✅ Traductions arabes affichées
- ✅ Email footer reste: "hello@arteva.ma"

**Status:** [ ] À tester

---

### Test 10: SEO & Metadata

**Objectif:** Vérifier les métadonnées

**Steps:**
1. Sur `https://arteva.ma/fr`
2. Ouvrir DevTools → Elements
3. Vérifier les balises `<head>`

**Résultat attendu:**
- ✅ `<title>`: Contient "Arteva"
- ✅ `<meta name="description">`: Contient "Arteva"
- ✅ `<meta property="og:title">`: Contient "Arteva"
- ✅ `<meta property="og:site_name">`: "Arteva"

**Status:** [ ] À tester

---

## 🐛 Problèmes Potentiels & Solutions

### Problème 1: Email redirige vers localhost

**Symptôme:**
Le lien de confirmation pointe vers `http://localhost:3000/...`

**Cause:**
Variable `NEXT_PUBLIC_SITE_URL` pas configurée sur Vercel en Production

**Solution:**
1. Aller sur: https://vercel.com/samilamqaddam-lab/artevia/settings/environment-variables
2. Vérifier/ajouter:
   ```
   NEXT_PUBLIC_SITE_URL=https://arteva.ma
   ```
   Environnement: Production
3. Redéployer l'application

---

### Problème 2: Email encore "Artevia"

**Symptôme:**
L'email contient encore "Artevia" au lieu de "Arteva"

**Cause:**
Cache Supabase ou templates pas mis à jour

**Solution:**
Vérifier dans Supabase Dashboard:
https://supabase.com/dashboard/project/qygpijoytpbxgbkaylkz/auth/templates

Les templates devraient déjà être configurés automatiquement via API.

---

### Problème 3: Logo ne s'affiche pas

**Symptôme:**
Le logo "Arteva" ne s'affiche pas dans le Header

**Cause:**
Build cache ou CSS pas rechargé

**Solution:**
1. Hard refresh: Ctrl+Shift+R (ou Cmd+Shift+R sur Mac)
2. Vider le cache du navigateur
3. Tester en navigation privée

---

### Problème 4: Certificat SSL invalide

**Symptôme:**
Erreur de certificat HTTPS

**Cause:**
DNS pas encore propagé ou certificat Vercel en cours de génération

**Solution:**
1. Attendre 5-10 minutes (génération certificat SSL)
2. Vérifier DNS propagation: https://www.whatsmydns.net/#A/arteva.ma
3. Si problème persiste après 1h, vérifier configuration domaine Vercel

---

## ✅ Checklist Complète

**Avant les Tests:**
- [ ] Vérifier que `NEXT_PUBLIC_SITE_URL=https://arteva.ma` est sur Vercel Production
- [ ] Vérifier que l'application a été redéployée après changement de variable
- [ ] Vider le cache du navigateur

**Tests Fonctionnels:**
- [ ] Test 1: Accessibilité du domaine
- [ ] Test 2: Branding visuel
- [ ] Test 3: PWA
- [ ] Test 4: Inscription utilisateur
- [ ] Test 5: Email de confirmation (branding)
- [ ] Test 6: Redirection email (URL correcte)
- [ ] Test 7: Navigation connecté
- [ ] Test 8: Email reset password
- [ ] Test 9: Multi-langue FR/AR
- [ ] Test 10: SEO & Metadata

**Validation Finale:**
- [ ] Aucune mention de "Artevia" visible sur le site
- [ ] Aucune mention de "artevia.ma" dans les URLs
- [ ] Tous les emails utilisent le branding "Arteva"
- [ ] Certificat SSL valide

---

## 📊 Rapport de Test

### Résultats

| Test | Status | Notes |
|------|--------|-------|
| Test 1: Domaine | ⏳ Pending | |
| Test 2: Branding | ⏳ Pending | |
| Test 3: PWA | ⏳ Pending | |
| Test 4: Inscription | ⏳ Pending | |
| Test 5: Email branding | ⏳ Pending | |
| Test 6: Redirection | ⏳ Pending | |
| Test 7: Navigation | ⏳ Pending | |
| Test 8: Reset password | ⏳ Pending | |
| Test 9: Multi-langue | ⏳ Pending | |
| Test 10: SEO | ⏳ Pending | |

### Bugs Trouvés

(À remplir pendant les tests)

### Notes

(Observations pendant les tests)

---

**Date du test:** _______________
**Testeur:** _______________
**Environnement:** Production (https://arteva.ma)

---

**Dernière mise à jour:** 2025-10-19
