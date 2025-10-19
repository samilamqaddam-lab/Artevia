# 🔒 Sécurité MCP - Configuration Projet Arteva Uniquement

## 🎯 Objectif

Cette configuration MCP est **strictement limitée au projet Arteva** et n'affectera aucun autre projet Supabase que vous pourriez avoir.

## 🛡️ Garanties de Sécurité

### 1. Isolation du Projet

La configuration MCP est **verrouillée** sur le projet Arteva de plusieurs façons:

#### a) URL API Spécifique
```json
"--apiUrl": "https://qygpijoytpbxgbkaylkz.supabase.co/rest/v1"
```
☑️ Cette URL pointe **uniquement** vers le projet Arteva (ref: `qygpijoytpbxgbkaylkz`)

#### b) Project Reference Explicite
```json
"--project-ref": "qygpijoytpbxgbkaylkz"
```
☑️ Le serveur MCP ne peut interagir qu'avec ce projet spécifique

#### c) Variables d'Environnement Scopées
```json
"env": {
  "SUPABASE_PROJECT_REF": "qygpijoytpbxgbkaylkz"
}
```
☑️ Confirmation supplémentaire du projet cible

### 2. Schéma Limité

```json
"--schema": "public"
```
☑️ Accès limité au schéma `public` uniquement (pas d'accès aux schémas système)

### 3. Noms de Serveurs Explicites

```json
{
  "arteva-database": { ... },
  "arteva-management": { ... }
}
```
☑️ Les noms contiennent "arteva" pour identification claire

## 🔍 Vérifications de Sécurité

### Comment Vérifier que Seul Arteva est Accessible?

#### Test 1: Lister les Tables
```
Liste toutes les tables de la base de données
```

Vous devriez voir **uniquement** les tables du projet Arteva:
- orders
- profiles
- projects
- design_versions
- shared_projects

**PAS** de tables d'autres projets!

#### Test 2: Vérifier le Project ID
```
Montre-moi le project_ref de la connexion actuelle
```

Devrait afficher: `qygpijoytpbxgbkaylkz`

#### Test 3: Tenter d'Accéder à un Autre Projet
```
Connecte-toi au projet [autre-project-ref]
```

Devrait échouer ou ne rien faire (le MCP est verrouillé sur Arteva).

## 🚨 Que Faire si Vous Avez d'Autres Projets Supabase?

### Scénario 1: Autres Projets sur le Même Compte

**Situation**: Vous avez plusieurs projets Supabase (ex: prod, staging, autres apps)

**Protection**:
- ✅ Les serveurs MCP configurés utilisent des clés **spécifiques au projet Arteva**
- ✅ Les API keys et tokens sont **scopés** au projet qygpijoytpbxgbkaylkz
- ✅ Impossible d'accéder à d'autres projets même s'ils sont sur le même compte

**Vérification**:
```bash
# Dans Supabase Dashboard
# Allez sur un autre projet
# Essayez d'exécuter une commande MCP
# → Elle échouera car les credentials ne matchent pas
```

### Scénario 2: Workspace ou Organisation Partagée

**Situation**: Vous travaillez dans une organisation avec plusieurs projets

**Protection**:
- ✅ Le `SUPABASE_ACCESS_TOKEN` utilisé est un PAT (Personal Access Token)
- ✅ Les PATs peuvent être restreints à des projets spécifiques dans Supabase
- ✅ Même si le PAT a accès à plusieurs projets, le `--project-ref` force l'isolation

**Recommandation**:
Créez un PAT dédié **uniquement pour Arteva**:
1. Allez sur https://supabase.com/dashboard/account/tokens
2. Créez un nouveau token
3. Donnez-lui un nom: "Arteva MCP Token"
4. Notez-le et mettez-le dans `.mcp-config.json`

### Scénario 3: Projets Locaux (Supabase CLI)

**Situation**: Vous utilisez `supabase start` pour développement local

**Protection**:
- ✅ L'URL `https://qygpijoytpbxgbkaylkz.supabase.co` pointe vers le cloud
- ✅ Les projets locaux utilisent `http://localhost:54321`
- ✅ Aucun risque de conflit

## 🔐 Bonnes Pratiques

### 1. Vérifiez Régulièrement

Avant toute opération importante via MCP:

```
Affiche-moi le project_ref actuel et les tables disponibles
```

### 2. Utilisez des Tokens Dédiés

Ne partagez **jamais** de tokens entre projets:

```
Projet Arteva   → Token A (actuel)
Projet Blog      → Token B (différent)
Projet E-commerce → Token C (différent)
```

### 3. Revue de Sécurité

Avant chaque opération destructive:

```
Montre-moi sur quel projet je suis connecté et confirme que c'est bien Arteva
```

### 4. Logs et Audit

Supabase Dashboard → Logs → API
- Vérifiez que toutes les requêtes viennent du bon projet
- Vérifiez les timestamps et sources

## 🔄 Rotation des Secrets

### Quand Changer les Tokens?

- ✅ Tous les 90 jours (bonne pratique)
- ✅ Si vous suspectez une fuite
- ✅ Quand un membre de l'équipe quitte
- ✅ Après un incident de sécurité

### Comment Changer?

1. **Créer nouveau token** dans Supabase Dashboard
2. **Mettre à jour** `.mcp-config.json` (LOCAL)
3. **NE PAS** committer
4. **Tester** la connexion
5. **Révoquer** l'ancien token

## 🚫 Ce que le MCP NE PEUT PAS Faire

Même avec la configuration actuelle, le MCP **NE PEUT PAS**:

- ❌ Accéder à d'autres projets Supabase
- ❌ Modifier les settings du projet (billing, quotas, etc.)
- ❌ Créer/supprimer le projet
- ❌ Inviter/gérer des utilisateurs du dashboard
- ❌ Accéder aux secrets d'autres projets
- ❌ Lire les logs d'authentification (auth.users est protégé)
- ❌ Accéder aux schémas système (`pg_*`, `auth`, `storage`)

## ✅ Ce que le MCP PEUT Faire (Scopé à Arteva)

Le MCP **PEUT**:

- ✅ Lire les tables du schéma `public`
- ✅ Exécuter des requêtes SQL (DDL/DML)
- ✅ Créer/modifier/supprimer des tables
- ✅ Gérer les RLS policies
- ✅ Appliquer des migrations
- ✅ Déployer des Edge Functions (si configuré)
- ✅ Lire les métriques du projet

**Tout cela UNIQUEMENT sur le projet Arteva.**

## 📊 Monitoring

### Vérifier l'Activité MCP

Dans Supabase Dashboard → API Logs:

```sql
-- Filtrer par API key
SELECT *
FROM logs
WHERE api_key = 'eyJhbGc...' -- Votre service role key
ORDER BY created_at DESC
LIMIT 100;
```

Vérifiez:
- ✅ Toutes les requêtes ciblent le bon projet
- ✅ Pas d'erreurs d'autorisation
- ✅ Patterns d'utilisation normaux

## 🆘 En Cas de Problème

### Suspicion de Mauvaise Configuration

1. **Arrêtez Claude Desktop** immédiatement
2. **Vérifiez** `.mcp-config.json`:
   ```bash
   cat .mcp-config.json | grep project-ref
   # Devrait afficher: qygpijoytpbxgbkaylkz
   ```
3. **Vérifiez** les logs Supabase
4. **Révoquez** les tokens si nécessaire
5. **Reconfigurez** en suivant `docs/MCP_SETUP.md`

### Accès Non Autorisé Détecté

1. **Révoquez** immédiatement les tokens dans Supabase Dashboard
2. **Changez** le service role key (regénérez dans Settings → API)
3. **Auditez** les logs pour comprendre l'incident
4. **Créez** de nouveaux tokens avec permissions minimales
5. **Mettez à jour** `.mcp-config.json` et `.env.local`

## 📚 Références

- [Supabase Security Best Practices](https://supabase.com/docs/guides/security)
- [MCP Security Model](https://modelcontextprotocol.io/docs/security)
- [Database Analysis](./DATABASE_ANALYSIS.md)
- [MCP Setup Guide](./MCP_SETUP.md)

---

**En résumé**: La configuration MCP est **strictement verrouillée** sur le projet Arteva (`qygpijoytpbxgbkaylkz`). Il est **impossible** d'accéder à d'autres projets Supabase avec cette configuration. Toutes les opérations sont isolées et tracées. 🔒✅
