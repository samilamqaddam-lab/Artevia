# Configuration des emails de confirmation de commande

Ce guide explique comment configurer l'envoi d'emails de confirmation pour les commandes Arteva.

## Service utilisé: Brevo (ex-Sendinblue)

Nous utilisons [Brevo](https://brevo.com) pour l'envoi des emails car:
- **300 emails/jour gratuits** (9,000/mois)
- Interface disponible en français
- SMTP simple et fiable
- Pas de carte bancaire requise
- Support domaine personnalisé inclus

## Étapes de configuration

### 1. Créer un compte Brevo

1. Aller sur [https://www.brevo.com/fr/](https://www.brevo.com/fr/)
2. Cliquer sur **"S'inscrire gratuitement"**
3. Créer un compte avec votre email professionnel
4. Vérifier votre email

### 2. Obtenir les identifiants SMTP

1. Se connecter à votre dashboard Brevo
2. Aller dans **Paramètres > Clés SMTP et API**
   - URL directe: [https://app.brevo.com/settings/keys/smtp](https://app.brevo.com/settings/keys/smtp)
3. Vous verrez:
   - **Login SMTP**: votre email de connexion
   - **Clé SMTP**: cliquer sur "Générer une nouvelle clé SMTP"
4. Copier ces deux valeurs

### 3. Configurer le domaine d'envoi (RECOMMANDÉ)

#### Option A: Sans vérification (pour test)
- Utilisez votre email comme expéditeur
- Emails peuvent atterrir en spam

#### Option B: Vérifier votre domaine (PRODUCTION)

1. Dans Brevo, aller à **Paramètres > Expéditeurs et domaines**
2. Cliquer sur **"Ajouter un domaine"**
3. Entrer: `arteva.ma`
4. Ajouter les enregistrements DNS chez votre hébergeur:

```
Type: TXT
Host: @
Value: brevo-code:xxxxxxxx (fourni par Brevo)

Type: TXT
Host: mail._domainkey
Value: k=rsa; p=xxxxxxxx (fourni par Brevo)
```

5. Cliquer sur **"Vérifier"** dans Brevo
6. Une fois vérifié, vous pouvez envoyer depuis `@arteva.ma`

### 4. Ajouter les variables d'environnement

Dans votre fichier `.env.local`:

```bash
# Brevo SMTP Credentials
BREVO_SMTP_USER=votre-email@exemple.com
BREVO_SMTP_KEY=xsmtpsib-xxxxxxxxxxxxxxxxxxxxxxxx

# Email admin pour recevoir les notifications
ADMIN_EMAIL=admin@arteva.ma

# URL du site
NEXT_PUBLIC_SITE_URL=https://arteva.ma
```

### 5. Configuration dans Vercel (Production)

1. Aller sur [vercel.com](https://vercel.com)
2. Sélectionner votre projet Arteva
3. Aller dans **Settings > Environment Variables**
4. Ajouter:
   - `BREVO_SMTP_USER` = votre login SMTP Brevo
   - `BREVO_SMTP_KEY` = votre clé SMTP Brevo
   - `ADMIN_EMAIL` = admin@arteva.ma
5. Redéployer le projet

## Emails envoyés

### 1. Email de confirmation client

**Déclenché:** À chaque nouvelle commande
**Expéditeur:** `commandes@arteva.ma`
**Destinataire:** Email du client
**Langue:** Français ou Arabe (selon locale)
**Contenu:**
- Numéro de commande
- Récapitulatif des articles
- Montant total et réductions
- Informations de contact
- Délai de révision estimé (24h)

### 2. Email de notification admin

**Déclenché:** À chaque nouvelle commande
**Expéditeur:** `notifications@arteva.ma`
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
- Les couleurs (bleu #3b82f6 pour client, rouge #dc2626 pour admin)
- Le texte des emails
- La mise en page HTML
- Les traductions FR/AR

## Test des emails

### En développement:

1. Démarrer le serveur local:
```bash
npm run dev
```

2. Aller sur http://localhost:3000/fr/catalog
3. Ajouter un produit au panier
4. Remplir le formulaire de checkout avec votre email
5. Soumettre la commande
6. Vérifier votre boîte email (et spam)

### Vérifier les logs:

Les logs d'envoi apparaissent dans:
- Console serveur Next.js (développement)
- Vercel Logs (production)

## Gestion des erreurs

L'envoi d'email est **non-bloquant**:
- Si l'email échoue, la commande est quand même créée
- L'erreur est loggée mais n'affecte pas l'utilisateur

Types d'erreurs possibles:
- Credentials SMTP non configurés
- Identifiants invalides
- Limite journalière atteinte (300/jour gratuit)
- Email destinataire invalide
- Domaine non vérifié (emails en spam)

## Tableau de bord Brevo

Dashboard: [https://app.brevo.com/](https://app.brevo.com/)

Vous pouvez voir:
- Tous les emails envoyés
- Statut de livraison
- Taux d'ouverture
- Logs détaillés
- Statistiques d'utilisation

## Limites du plan gratuit

| Limite | Valeur |
|--------|--------|
| Emails/jour | 300 |
| Emails/mois | ~9,000 |
| Contacts | Illimités |
| APIs | Incluses |

## Passer au plan payant

Si vous dépassez 300 emails/jour:

**Plan Starter** (à partir de 25€/mois):
- 20,000 emails/mois
- Pas de logo Brevo
- Support email

**Plan Business** (à partir de 49€/mois):
- À partir de 20,000 emails/mois
- A/B testing
- Statistiques avancées

Voir: [https://www.brevo.com/fr/pricing/](https://www.brevo.com/fr/pricing/)

## Migration depuis Resend

Si vous utilisiez précédemment Resend:

1. Supprimer `RESEND_API_KEY` de vos variables d'environnement
2. Ajouter `BREVO_SMTP_USER` et `BREVO_SMTP_KEY`
3. Redéployer

Le code a été mis à jour automatiquement pour utiliser Brevo via SMTP.

## Support

- Documentation Brevo: [https://developers.brevo.com/](https://developers.brevo.com/)
- Support Brevo: [https://www.brevo.com/fr/contact/](https://www.brevo.com/fr/contact/)
- Code source: `src/lib/email.ts`
