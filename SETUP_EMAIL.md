# Configuration des emails de confirmation de commande

Ce guide explique comment configurer l'envoi d'emails de confirmation pour les commandes Arteva.

## Service utilisé: Resend

Nous utilisons [Resend](https://resend.com) pour l'envoi des emails car:
- Simple à configurer
- Excellent support React/Next.js
- Templates HTML modernes
- API simple et fiable
- Plan gratuit généreux (100 emails/jour)

## Étapes de configuration

### 1. Créer un compte Resend

1. Aller sur [https://resend.com/signup](https://resend.com/signup)
2. Créer un compte avec votre email professionnel
3. Vérifier votre email

### 2. Obtenir une clé API

1. Se connecter à [https://resend.com/api-keys](https://resend.com/api-keys)
2. Cliquer sur **"Create API Key"**
3. Donner un nom (ex: "Arteva Production")
4. Sélectionner **"Full Access"** comme permission
5. Copier la clé API (commence par `re_`)

### 3. Configurer le domaine d'envoi

#### Option A: Utiliser le domaine Resend (pour test)
- Par défaut, vous pouvez utiliser `onboarding@resend.dev`
- Limite: 100 emails/jour
- Bon pour développement/test

#### Option B: Configurer votre propre domaine (RECOMMANDÉ pour production)

1. Dans Resend dashboard, aller à **Domains**
2. Cliquer sur **Add Domain**
3. Entrer votre domaine: `arteva.ma`
4. Ajouter les enregistrements DNS suivants chez votre hébergeur DNS:

```
Type: TXT
Host: @
Value: [fourni par Resend]

Type: CNAME
Host: resend._domainkey
Value: [fourni par Resend]

Type: MX
Host: @
Priority: 10
Value: feedback-smtp.us-east-1.amazonses.com
```

5. Attendre la vérification (peut prendre jusqu'à 48h)
6. Une fois vérifié, vous pouvez envoyer depuis `commandes@arteva.ma` et `notifications@arteva.ma`

### 4. Ajouter les variables d'environnement

Dans votre fichier `.env.local`:

```bash
# Resend API Key
RESEND_API_KEY=re_votre_cle_api_ici

# Email admin pour recevoir les notifications
ADMIN_EMAIL=admin@arteva.ma

# URL du site (déjà configuré normalement)
NEXT_PUBLIC_SITE_URL=https://arteva.ma
```

### 5. Configuration dans Vercel (Production)

1. Aller sur [vercel.com](https://vercel.com)
2. Sélectionner votre projet Arteva
3. Aller dans **Settings > Environment Variables**
4. Ajouter:
   - `RESEND_API_KEY` = votre clé API Resend
   - `ADMIN_EMAIL` = admin@arteva.ma
5. Redéployer le projet pour que les variables prennent effet

## Emails envoyés

### 1. Email de confirmation client

**Déclenché:** À chaque nouvelle commande
**Destinataire:** Email du client (saisi au checkout)
**Langue:** Français ou Arabe (selon locale de la commande)
**Contenu:**
- Numéro de commande
- Récapitulatif des articles commandés
- Montant total et réductions
- Informations de contact
- Délai de révision estimé (24h)

### 2. Email de notification admin

**Déclenché:** À chaque nouvelle commande
**Destinataire:** Email configuré dans `ADMIN_EMAIL`
**Langue:** Français
**Contenu:**
- Alerte de nouvelle commande
- Informations client complètes
- Détails de la commande
- Lien vers l'interface admin
- Notes spéciales du client

## Personnalisation des emails

Les templates d'email se trouvent dans:
```
src/lib/email.ts
```

Vous pouvez personnaliser:
- Les couleurs (actuellement: bleu #3b82f6 pour client, rouge #dc2626 pour admin)
- Le texte des emails
- La mise en page HTML
- Les traductions (dans les objets `translations`)

## Test des emails

### En développement:

1. Démarrer le serveur local:
```bash
npm run dev
```

2. Aller sur http://localhost:3000/rfq
3. Ajouter un produit au panier
4. Remplir le formulaire de checkout avec votre email
5. Soumettre la commande
6. Vérifier votre boîte email

### Vérifier les logs:

Les logs d'envoi d'email apparaissent dans:
- Console serveur Next.js (développement)
- Vercel Logs (production)

Format des logs:
```
✓ Customer confirmation email sent for order CMD-20251117-A1B2
✓ Admin notification email sent for order CMD-20251117-A1B2
```

## Gestion des erreurs

L'envoi d'email est **non-bloquant**:
- Si l'email échoue, la commande est quand même créée
- L'erreur est loggée mais n'affecte pas l'utilisateur
- Vous pouvez voir les erreurs dans les logs Vercel

Types d'erreurs possibles:
- `RESEND_API_KEY` non configurée
- Clé API invalide
- Limite d'envoi atteinte (100/jour sur plan gratuit)
- Email destinataire invalide
- Domaine non vérifié

## Tableau de bord Resend

Dashboard: [https://resend.com/emails](https://resend.com/emails)

Vous pouvez voir:
- Tous les emails envoyés
- Statut de livraison (delivered, bounced, etc.)
- Taux d'ouverture
- Logs détaillés
- Statistiques d'utilisation

## Passer au plan payant

Si vous dépassez 100 emails/jour:

Plan **Pro** ($20/mois):
- 50,000 emails/mois
- Support prioritaire
- Domaines personnalisés illimités
- Analytics avancés

Voir: [https://resend.com/pricing](https://resend.com/pricing)

## Support

- Documentation Resend: [https://resend.com/docs](https://resend.com/docs)
- Support Resend: [https://resend.com/support](https://resend.com/support)
- Code source Arteva: `src/lib/email.ts`

## Emails de domaine personnalisé (arteva.ma)

Une fois votre domaine vérifié dans Resend, mettez à jour les adresses d'envoi dans `src/lib/email.ts`:

```typescript
// Email client
from: 'Arteva <commandes@arteva.ma>'

// Email admin
from: 'Arteva <notifications@arteva.ma>'
```

Actuellement configuré pour utiliser ces adresses. Si le domaine n'est pas vérifié, utilisez `onboarding@resend.dev` temporairement.
