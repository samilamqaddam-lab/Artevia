# 🔌 Configuration MCP Supabase

Ce document explique comment configurer le Model Context Protocol (MCP) pour Supabase dans ce projet.

## 📋 Qu'est-ce que le MCP ?

Le Model Context Protocol (MCP) permet aux assistants IA (comme Claude) d'interagir directement avec des services externes comme Supabase. Cela permet de:
- 🔍 Explorer la structure de la base de données
- 📊 Exécuter des requêtes SQL
- 🛠️ Gérer les migrations
- ⚡ Déployer des Edge Functions
- 📝 Et plus encore...

## 🔐 Sécurité

⚠️ **IMPORTANT**: Les fichiers suivants contiennent des secrets et ne doivent JAMAIS être commitées:
- `.mcp-config.json`
- `.env.local`

Ces fichiers sont déjà dans `.gitignore` pour votre sécurité.

## 🚀 Configuration

### 1. Configuration locale (déjà faite)

Le fichier `.mcp-config.json` a déjà été créé avec vos credentials Supabase. Il contient deux serveurs MCP:

#### a) **supabase-postgrest** - Accès direct à la base de données
- Permet d'exécuter des requêtes SQL
- Lire et écrire des données
- Explorer les tables et schémas

#### b) **supabase-management** - Gestion du projet Supabase
- Déployer des Edge Functions
- Gérer les migrations
- Accès à l'API de gestion Supabase

### 2. Configuration de Claude Desktop

Pour utiliser ces serveurs MCP avec Claude Desktop:

**macOS:**
```bash
cp .mcp-config.json ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Linux:**
```bash
cp .mcp-config.json ~/.config/Claude/claude_desktop_config.json
```

**Windows:**
```powershell
copy .mcp-config.json %APPDATA%\Claude\claude_desktop_config.json
```

### 3. Redémarrer Claude Desktop

Après avoir copié la configuration, redémarrez Claude Desktop pour que les changements prennent effet.

## 🧪 Test de la configuration

Une fois configuré, vous pouvez demander à Claude de:

```
Montre-moi les tables de ma base de données Supabase
```

```
Exécute cette requête SQL: SELECT * FROM profiles LIMIT 5
```

```
Quelle est la structure de la table "projects" ?
```

## 📚 Fonctionnalités disponibles

### PostgREST MCP Server
- `postgrestRequest` - Exécuter des requêtes REST sur la base de données
- Liste automatique des tables et vues
- Introspection du schéma

### Supabase Management MCP Server
- `execute_sql` - Exécuter du SQL brut
- `apply_migration` - Appliquer des migrations DDL
- `deploy_edge_function` - Déployer des Edge Functions
- `get_project_info` - Obtenir les informations du projet

## 🔄 Mise à jour de la configuration

Si vous devez mettre à jour vos credentials:

1. Modifiez `.env.local` avec vos nouvelles clés
2. Mettez à jour `.mcp-config.json` avec les nouvelles valeurs
3. Recopiez vers Claude Desktop (voir section 2)
4. Redémarrez Claude Desktop

## 🆘 Dépannage

### Le MCP ne se connecte pas
- Vérifiez que Claude Desktop est redémarré
- Vérifiez les credentials dans `.mcp-config.json`
- Assurez-vous que les packages MCP sont installés: `npx -y @supabase/mcp-server-postgrest@latest`

### Erreur d'authentification
- Vérifiez que la `SUPABASE_SERVICE_ROLE_KEY` est correcte dans `.env.local`
- Vérifiez que le `SUPABASE_ACCESS_TOKEN` est valide

### Les outils MCP ne s'affichent pas
- Attendez quelques secondes après le démarrage de Claude Desktop
- Vérifiez la console de Claude Desktop pour les erreurs

## 📖 Documentation officielle

- [Supabase MCP Documentation](https://github.com/supabase-community/supabase-mcp)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Supabase Documentation](https://supabase.com/docs)

## 🎯 Exemples d'utilisation

### Explorer la base de données
```
Liste toutes les tables de la base de données et leurs colonnes
```

### Créer une migration
```
Crée une migration pour ajouter une colonne "description" à la table "products"
```

### Analyser les données
```
Analyse les 100 derniers projets créés et donne-moi des statistiques
```

### Déployer une fonction
```
Crée une Edge Function qui envoie un email de bienvenue aux nouveaux utilisateurs
```
