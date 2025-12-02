# Configuration des emails de confirmation de commande

Ce guide explique comment configurer l'envoi d'emails de confirmation pour les commandes Arteva.

## Service utilisé: Brevo (ex-Sendinblue)

Nous utilisons [Brevo](https://www.brevo.com) pour l'envoi des emails car:
- **300 emails/jour gratuits** (9,000/mois)
- Interface en français
- Support SMTP et API REST
- Templates HTML modernes
- Domaine personnalisé gratuit
- Analytics et tracking inclus

## Étapes de configuration

### 1. Créer un compte Brevo

1. Aller sur [https://www.brevo.com/fr/](https://www.brevo.com/fr/)
2. Créer un compte gratuit
3. Vérifier votre email

### 2. Obtenir une clé API

1. Se connecter à [https://app.brevo.com](https://app.brevo.com)
2. Aller dans **Paramètres** (icône engrenage) > **SMTP & API**
3. Dans l'onglet **Clés API**, cliquer sur **Générer une nouvelle clé API**
4. Donner un nom (ex: "Arteva Production")
5. Copier la clé API (commence par `xkeysib-`)

### 3. Configurer le domaine d'envoi

#### Option A: Utiliser le domaine Brevo (pour test)
- Par défaut, vous pouvez envoyer depuis l'email de votre compte
- Limite: fonctionnalités complètes
- Bon pour développement/test

#### Option B: Configurer votre propre domaine (RECOMMANDÉ pour production)

1. Dans Brevo dashboard, aller dans **Paramètres** > **Expéditeurs & domaines**
2. Cliquer sur **Ajouter un domaine**
3. Entrer votre domaine: `arteva.ma`
4. Ajouter les enregistrements DNS suivants chez votre hébergeur:

```
Type: TXT
Host: @
Value: [fourni par Brevo - code de vérification]

Type: TXT
Host: mail._domainkey
Value: [fourni par Brevo - DKIM]

Type: CNAME
Host: mail
Value: [fourni par Brevo]
```

5. Attendre la vérification (généralement 24-48h)
6. Une fois vérifié, vous pouvez envoyer depuis `commandes@arteva.ma` et `notifications@arteva.ma`

### 4. Ajouter les variables d'environnement

Dans votre fichier `.env.local`:

```bash
# Brevo API Key
BREVO_API_KEY=xkeysib-votre_cle_api_ici

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
   - `BREVO_API_KEY` = votre clé API Brevo
   - `ADMIN_EMAIL` = admin@arteva.ma
5. Redéployer le projet pour que les variables prennent effet

## Emails envoyés

### 1. Email de confirmation client

**Déclenché:** À chaque nouvelle commande
**Destinataire:** Email du client (saisi au checkout)
**Expéditeur:** commandes@arteva.ma
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
**Expéditeur:** notifications@arteva.ma
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
- `BREVO_API_KEY` non configurée
- Clé API invalide
- Limite d'envoi atteinte (300/jour sur plan gratuit)
- Email destinataire invalide
- Domaine non vérifié

## Tableau de bord Brevo

Dashboard: [https://app.brevo.com](https://app.brevo.com)

Vous pouvez voir:
- Tous les emails envoyés (Campagnes > Transactionnel)
- Statut de livraison (delivered, bounced, etc.)
- Taux d'ouverture et clics
- Logs détaillés
- Statistiques d'utilisation

## Plans Brevo

### Gratuit (actuel)
- 300 emails/jour
- Tracking et analytics
- Support email

### Starter (€19/mois)
- 20,000 emails/mois
- Pas de limite quotidienne
- A/B testing

### Business (€49/mois)
- 60,000 emails/mois
- Support prioritaire
- Templates avancés

Voir: [https://www.brevo.com/fr/pricing/](https://www.brevo.com/fr/pricing/)

## Support

- Documentation Brevo: [https://developers.brevo.com/](https://developers.brevo.com/)
- Support Brevo: [https://help.brevo.com/](https://help.brevo.com/)
- Code source Arteva: `src/lib/email.ts`

## Migration depuis Resend

Si vous aviez Resend configuré précédemment:
1. Supprimer `RESEND_API_KEY` de vos variables d'environnement
2. Ajouter `BREVO_API_KEY` avec votre nouvelle clé
3. Redéployer l'application

Le code a été mis à jour pour utiliser l'API Brevo. Aucune autre modification n'est nécessaire.
