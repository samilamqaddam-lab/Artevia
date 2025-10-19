# Configuration Email et Authentification Supabase

Ce guide explique comment configurer les emails d'authentification Supabase pour Artevia.

## 🎯 Problèmes à Résoudre

1. ✅ **Message de confirmation après inscription** - Résolu dans le code
2. ⚠️ **Email personnalisé Artevia** - À configurer dans Supabase Dashboard
3. ⚠️ **Redirection vers le bon domaine** - À configurer dans Supabase Dashboard

---

## 📧 1. Personnaliser les Templates Email

### Accéder aux Templates

1. Va sur https://supabase.com/dashboard/project/qygpijoytpbxgbkaylkz
2. Clique sur **Authentication** dans le menu de gauche
3. Clique sur **Email Templates**

### Template : Confirm Signup

Clique sur **Confirm signup** et remplace le contenu par :

```html
<h2>Bienvenue sur Artevia !</h2>

<p>Bonjour,</p>

<p>Merci de vous être inscrit sur <strong>Artevia</strong>, votre plateforme de création d'objets publicitaires personnalisés.</p>

<p>Pour activer votre compte, cliquez sur le bouton ci-dessous :</p>

<p>
  <a href="{{ .ConfirmationURL }}"
     style="background-color: #F59E0B; color: #1F2937; padding: 12px 24px; text-decoration: none; border-radius: 9999px; font-weight: 600; display: inline-block;">
    Confirmer mon email
  </a>
</p>

<p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
<p style="color: #6B7280; font-size: 12px; word-break: break-all;">{{ .ConfirmationURL }}</p>

<p style="margin-top: 40px; color: #6B7280; font-size: 12px;">
  Si vous n'avez pas créé de compte sur Artevia, ignorez cet email.
</p>

<hr style="border: none; border-top: 1px solid #E5E7EB; margin: 40px 0;">

<p style="color: #9CA3AF; font-size: 11px; text-align: center;">
  © 2025 Artevia - Objets Publicitaires Personnalisés<br>
  Casablanca, Maroc
</p>
```

### Template : Magic Link (Optionnel - si tu utilises magic links)

```html
<h2>Connexion à Artevia</h2>

<p>Bonjour,</p>

<p>Cliquez sur le lien ci-dessous pour vous connecter à votre compte Artevia :</p>

<p>
  <a href="{{ .ConfirmationURL }}"
     style="background-color: #F59E0B; color: #1F2937; padding: 12px 24px; text-decoration: none; border-radius: 9999px; font-weight: 600; display: inline-block;">
    Me connecter
  </a>
</p>

<p>Si le bouton ne fonctionne pas, copiez et collez ce lien :</p>
<p style="color: #6B7280; font-size: 12px; word-break: break-all;">{{ .ConfirmationURL }}</p>

<p style="margin-top: 40px; color: #6B7280; font-size: 12px;">
  Si vous n'avez pas demandé cette connexion, ignorez cet email.
</p>

<hr style="border: none; border-top: 1px solid #E5E7EB; margin: 40px 0;">

<p style="color: #9CA3AF; font-size: 11px; text-align: center;">
  © 2025 Artevia - Objets Publicitaires Personnalisés<br>
  Casablanca, Maroc
</p>
```

### Template : Reset Password

```html
<h2>Réinitialisation de votre mot de passe</h2>

<p>Bonjour,</p>

<p>Vous avez demandé à réinitialiser votre mot de passe Artevia.</p>

<p>Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>

<p>
  <a href="{{ .ConfirmationURL }}"
     style="background-color: #F59E0B; color: #1F2937; padding: 12px 24px; text-decoration: none; border-radius: 9999px; font-weight: 600; display: inline-block;">
    Réinitialiser mon mot de passe
  </a>
</p>

<p>Si le bouton ne fonctionne pas, copiez et collez ce lien :</p>
<p style="color: #6B7280; font-size: 12px; word-break: break-all;">{{ .ConfirmationURL }}</p>

<p style="margin-top: 40px; color: #6B7280; font-size: 12px;">
  Si vous n'avez pas demandé cette réinitialisation, ignorez cet email et votre mot de passe restera inchangé.
</p>

<hr style="border: none; border-top: 1px solid #E5E7EB; margin: 40px 0;">

<p style="color: #9CA3AF; font-size: 11px; text-align: center;">
  © 2025 Artevia - Objets Publicitaires Personnalisés<br>
  Casablanca, Maroc
</p>
```

---

## 🌐 2. Configurer les URLs de Redirection

### Configuration Site URL

1. Va sur https://supabase.com/dashboard/project/qygpijoytpbxgbkaylkz
2. Clique sur **Authentication** → **URL Configuration**
3. Configure les URLs :

#### Pour Production :
```
Site URL: https://artevia.ma
```

#### Redirect URLs (à ajouter une par une) :
```
https://artevia.ma/**
https://artevia.ma/fr/auth/callback
https://artevia.ma/ar/auth/callback
https://www.artevia.ma/**
https://www.artevia.ma/fr/auth/callback
https://www.artevia.ma/ar/auth/callback
```

#### Pour Développement (Optionnel) :
```
http://localhost:3000/**
http://localhost:3000/fr/auth/callback
http://localhost:3000/ar/auth/callback
```

### Capture d'écran de la Configuration

Voici à quoi devrait ressembler ta configuration :

```
┌─────────────────────────────────────────────┐
│ Site URL                                    │
│ https://artevia.ma                          │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Redirect URLs                               │
│ https://artevia.ma/**                       │
│ https://artevia.ma/fr/auth/callback         │
│ https://artevia.ma/ar/auth/callback         │
│ https://www.artevia.ma/**                   │
│ https://www.artevia.ma/fr/auth/callback     │
│ https://www.artevia.ma/ar/auth/callback     │
│ http://localhost:3000/**                    │
│ http://localhost:3000/fr/auth/callback      │
│ http://localhost:3000/ar/auth/callback      │
└─────────────────────────────────────────────┘
```

---

## 📬 3. Configurer l'Expéditeur Email (SMTP Optionnel)

Par défaut, Supabase envoie les emails depuis `noreply@mail.app.supabase.io`.

### Pour utiliser votre propre domaine (Recommandé pour production) :

1. Va sur **Authentication** → **Email** → **SMTP Settings**
2. Active **Enable Custom SMTP**
3. Configure avec tes credentials SMTP :

#### Exemple avec SendGrid :
```
Host: smtp.sendgrid.net
Port: 587
User: apikey
Password: [Ton API Key SendGrid]
Sender Email: noreply@artevia.ma
Sender Name: Artevia
```

#### Exemple avec Mailgun :
```
Host: smtp.mailgun.org
Port: 587
User: postmaster@mg.artevia.ma
Password: [Ton API Key Mailgun]
Sender Email: noreply@artevia.ma
Sender Name: Artevia
```

#### Exemple avec Gmail (Dev uniquement) :
```
Host: smtp.gmail.com
Port: 587
User: votre-email@gmail.com
Password: [App Password]
Sender Email: noreply@artevia.ma
Sender Name: Artevia
```

⚠️ **Note** : Pour utiliser un email personnalisé (@artevia.ma), tu dois configurer les enregistrements DNS SPF et DKIM.

---

## ✅ 4. Test de Configuration

### Test en Local

1. Lance le serveur dev :
```bash
npm run dev
```

2. Va sur http://localhost:3000/fr/auth/register

3. Inscris-toi avec un email de test

4. Tu devrais voir l'écran de confirmation avec le message :
```
✓ Vérifiez votre email
  Nous avons envoyé un lien de confirmation à :
  votre-email@example.com
```

5. Vérifie ton email - il devrait :
   - Venir de "Artevia" (si SMTP configuré)
   - Avoir le nouveau design
   - Rediriger vers `http://localhost:3000/fr/auth/callback?code=...`

6. Clique sur le lien - tu devrais être redirigé vers la page d'accueil connecté

### Test en Production

Une fois déployé sur Vercel :

1. Va sur https://artevia.ma/fr/auth/register
2. Crée un compte
3. Vérifie l'email
4. Clique sur le lien - tu devrais être redirigé vers `https://artevia.ma/fr/auth/callback` puis `https://artevia.ma/fr`

---

## 🐛 Troubleshooting

### Problème : Redirection vers localhost

**Symptôme** : Après avoir cliqué sur le lien de confirmation, je suis redirigé vers `http://localhost:3000`

**Solution** :
1. Vérifie que **Site URL** dans Supabase est bien configuré avec ton domaine de production
2. Vérifie que les **Redirect URLs** incluent bien ton domaine
3. Si le problème persiste, vide le cache du navigateur

### Problème : Email de Supabase au lieu d'Artevia

**Symptôme** : L'email vient toujours de "Supabase Auth"

**Solution** :
1. Si tu n'as pas configuré SMTP personnalisé, c'est normal
2. Les templates HTML sont quand même appliqués
3. Pour changer l'expéditeur, configure SMTP personnalisé (section 3)

### Problème : Template non appliqué

**Symptôme** : L'email a toujours le template Supabase par défaut

**Solution** :
1. Assure-toi d'avoir cliqué sur **Save** après avoir modifié le template
2. Vérifie que tu as modifié le bon template (Confirm signup vs Magic Link vs Reset Password)
3. Les changements peuvent prendre quelques minutes

### Problème : Lien de confirmation ne fonctionne pas

**Symptôme** : Le lien de l'email ne redirige pas correctement

**Solution** :
1. Vérifie que la route `/auth/callback/route.ts` existe
2. Vérifie les logs Vercel pour voir s'il y a des erreurs
3. Vérifie que l'URL de callback est bien dans les Redirect URLs de Supabase

---

## 📊 Résumé des Changements

### Code (Déjà fait) :
- ✅ Écran de confirmation après inscription
- ✅ Traductions FR ajoutées
- ✅ Page callback configurée
- ✅ emailRedirectTo dynamique selon l'environnement

### Supabase Dashboard (À faire) :
- ⚠️ Modifier les templates email (section 1)
- ⚠️ Configurer Site URL et Redirect URLs (section 2)
- 🔵 (Optionnel) Configurer SMTP personnalisé (section 3)

---

## 🚀 Prochaines Étapes

1. **Immédiat** :
   - Modifier les templates email dans Supabase Dashboard
   - Configurer les URLs de redirection

2. **Court terme** :
   - Configurer SMTP personnalisé (SendGrid/Mailgun)
   - Configurer DNS (SPF, DKIM) pour @artevia.ma

3. **Optionnel** :
   - Ajouter traductions AR pour les templates email
   - Personnaliser le template avec le logo Artevia
   - Ajouter un footer avec réseaux sociaux

---

**Dernière mise à jour** : 2025-10-19
