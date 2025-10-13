# 🚀 Intégration Supabase - Guide Complet

Ce guide vous accompagne dans l'utilisation complète de Supabase avec le MCP pour gérer votre base de données Artevia.

## 📋 Table des Matières

1. [Configuration Initiale](#configuration-initiale)
2. [Appliquer les Migrations](#appliquer-les-migrations)
3. [Utiliser le MCP](#utiliser-le-mcp)
4. [Migrer les Données](#migrer-les-données)
5. [Mettre à Jour le Code](#mettre-à-jour-le-code)
6. [Tests](#tests)

## 🔧 Configuration Initiale

### 1. Vérifier les Variables d'Environnement

Assurez-vous que `.env.local` contient:

```env
SUPABASE_URL=https://qygpijoytpbxgbkaylkz.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_SUPABASE_URL=https://qygpijoytpbxgbkaylkz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

✅ Ces fichiers sont déjà dans `.gitignore` - vos secrets sont protégés!

### 2. Configuration MCP (Déjà faite)

Le fichier `.mcp-config.json` est déjà configuré avec:
- **supabase-postgrest**: Accès direct à la base de données
- **supabase-management**: Gestion du projet Supabase

Pour l'activer dans Claude Desktop, suivez les instructions dans [MCP_SETUP.md](./MCP_SETUP.md).

## 📊 Appliquer les Migrations

### Option 1: Via MCP Supabase (Recommandé)

Une fois le MCP configuré dans Claude Desktop, vous pouvez simplement demander:

```
Applique la migration SQL du fichier supabase/migrations/001_initial_schema.sql
```

Claude utilisera le MCP pour exécuter la migration en toute sécurité.

### Option 2: Via Supabase Dashboard

1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **SQL Editor**
4. Copiez le contenu de `supabase/migrations/001_initial_schema.sql`
5. Collez et exécutez

### Option 3: Via CLI

```bash
# Installer Supabase CLI
npm install -g supabase

# Se connecter
supabase login

# Lier le projet
supabase link --project-ref qygpijoytpbxgbkaylkz

# Appliquer la migration
supabase db push
```

## 🔍 Utiliser le MCP

### Commandes Utiles via Claude Desktop

Une fois le MCP configuré, vous pouvez faire:

#### Explorer la base de données
```
Montre-moi toutes les tables de la base de données
```

```
Décris la structure de la table projects
```

#### Requêtes SQL
```
SELECT * FROM profiles LIMIT 5
```

```
Compte le nombre de projets par utilisateur
```

#### Gérer les données
```
Crée un nouveau profil de test
```

```
Supprime les projets de plus de 30 jours
```

#### Migrations
```
Crée une migration pour ajouter une colonne "featured" à la table projects
```

## 💾 Migrer les Données

### Migrer les Projets d'IndexedDB vers Supabase

Créez un script de migration dans `src/scripts/migrate-projects.ts`:

```typescript
import {createClient} from '@/lib/supabase/client';
import {listProjects} from '@/lib/storage/projects';

export async function migrateProjectsToSupabase() {
  const supabase = createClient();

  // Vérifier l'authentification
  const {data: {user}} = await supabase.auth.getUser();
  if (!user) {
    console.error('User must be logged in to migrate projects');
    return;
  }

  // Récupérer les projets IndexedDB
  const localProjects = await listProjects();

  console.log(`Found ${localProjects.length} projects to migrate`);

  // Migrer chaque projet
  for (const project of localProjects) {
    const {error} = await supabase
      .from('projects')
      .upsert({
        id: project.id,
        user_id: user.id,
        name: project.name,
        product_id: project.productId,
        canvas: project.canvas,
        preview_url: project.previewDataUrl,
        updated_at: new Date(project.updatedAt).toISOString()
      });

    if (error) {
      console.error(`Error migrating project ${project.id}:`, error);
    } else {
      console.log(`✓ Migrated project: ${project.name}`);
    }
  }

  console.log('Migration complete!');
}
```

Exécutez la migration:

```typescript
// Dans votre composant ou page
import {migrateProjectsToSupabase} from '@/scripts/migrate-projects';

// Bouton de migration
<Button onClick={migrateProjectsToSupabase}>
  Migrer mes projets vers le cloud
</Button>
```

## 🔄 Mettre à Jour le Code

### 1. Mettre à Jour les Types

Régénérez les types TypeScript:

```bash
npx supabase gen types typescript --project-id qygpijoytpbxgbkaylkz > src/lib/supabase/types.ts
```

### 2. Créer les Fonctions d'Accès

Créez `src/lib/supabase/projects.ts`:

```typescript
import {createClient} from './client';
import type {Database} from './types';

type Project = Database['public']['Tables']['projects']['Row'];
type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export async function getProjects() {
  const supabase = createClient();
  const {data, error} = await supabase
    .from('projects')
    .select('*')
    .order('updated_at', {ascending: false});

  if (error) throw error;
  return data;
}

export async function getProject(id: string) {
  const supabase = createClient();
  const {data, error} = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createProject(project: ProjectInsert) {
  const supabase = createClient();
  const {data, error} = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProject(id: string, updates: ProjectUpdate) {
  const supabase = createClient();
  const {data, error} = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProject(id: string) {
  const supabase = createClient();
  const {error} = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
```

### 3. Créer les Fonctions de Profil

Créez `src/lib/supabase/profiles.ts`:

```typescript
import {createClient} from './client';
import type {Database} from './types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export async function getProfile(userId?: string) {
  const supabase = createClient();

  // Si pas d'userId, utiliser l'utilisateur courant
  if (!userId) {
    const {data: {user}} = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    userId = user.id;
  }

  const {data, error} = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(updates: ProfileUpdate) {
  const supabase = createClient();
  const {data: {user}} = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const {data, error} = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

### 4. Mettre à Jour les Composants

Exemple: Remplacer IndexedDB par Supabase dans le ProjectsTab:

```typescript
// Avant (IndexedDB)
import {listProjects, deleteProject} from '@/lib/storage/projects';

// Après (Supabase)
import {getProjects, deleteProject} from '@/lib/supabase/projects';

// Usage reste identique!
const projects = await getProjects();
```

## 🧪 Tests

### Vérifier RLS

Testez que les policies fonctionnent:

```sql
-- En tant qu'utilisateur A
SELECT * FROM projects; -- Devrait voir seulement ses projets

-- Tenter d'accéder au projet d'un autre user
SELECT * FROM projects WHERE user_id = 'autre-user-id'; -- Devrait être vide

-- Tenter de modifier le projet d'un autre
UPDATE projects SET name = 'Hacked' WHERE user_id = 'autre-user-id'; -- Devrait échouer
```

### Tests d'Intégration

```typescript
describe('Supabase Projects', () => {
  it('should create a project', async () => {
    const project = await createProject({
      user_id: 'test-user-id',
      name: 'Test Project',
      product_id: 'tshirt-essential',
      canvas: {version: '5.3.0', objects: []}
    });

    expect(project).toBeDefined();
    expect(project.name).toBe('Test Project');
  });

  it('should list user projects', async () => {
    const projects = await getProjects();
    expect(Array.isArray(projects)).toBe(true);
  });

  it('should prevent accessing other users projects', async () => {
    // Test RLS
  });
});
```

## 📊 Monitoring

### Dashboard Supabase

Surveillez:
- **Database**: Taille, connexions, requêtes lentes
- **Auth**: Nombre d'utilisateurs, inscriptions
- **API**: Requêtes par endpoint, erreurs
- **Logs**: Erreurs, warnings

### Alertes

Configurez des alertes pour:
- Erreurs RLS
- Pics de charge
- Échecs d'authentification

## 🔐 Sécurité - Checklist

- [x] RLS activée sur toutes les tables
- [x] Policies testées pour chaque table
- [ ] Service role key jamais exposée côté client
- [ ] Rate limiting configuré
- [ ] Validation des inputs côté serveur
- [ ] Audit logs activés

## 🚨 Dépannage

### RLS bloque mes requêtes

```typescript
// Vérifier l'authentification
const {data: {user}} = await supabase.auth.getUser();
console.log('Current user:', user?.id);

// Désactiver RLS temporairement pour debug (DANGER!)
// NE JAMAIS faire en production
```

### Migration échoue

```sql
-- Vérifier les erreurs
SELECT * FROM pg_stat_statements WHERE query LIKE '%projects%';

-- Rollback manuel si nécessaire
DROP TABLE IF EXISTS public.projects CASCADE;
```

### Données perdues

```sql
-- Les données sont versionnées!
SELECT * FROM design_versions WHERE project_id = 'xxx' ORDER BY version_number DESC;
```

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [MCP Documentation](https://modelcontextprotocol.io/)
- [PostgreSQL RLS Guide](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Database Analysis](./DATABASE_ANALYSIS.md)
- [MCP Setup](./MCP_SETUP.md)

---

**Dernière mise à jour**: 2025-10-13
**Par**: Claude Code + Context7 MCP
