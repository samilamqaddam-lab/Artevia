# 🔧 Appliquer la Migration Supabase - Guide Rapide

## ⚡ Méthode Simple (Recommandée)

### Étape 1: Ouvrir Supabase Dashboard

1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Connectez-vous si nécessaire
3. Sélectionnez le projet **Arteva** (qygpijoytpbxgbkaylkz)

### Étape 2: Ouvrir SQL Editor

1. Dans la barre latérale gauche, cliquez sur **SQL Editor**
2. Cliquez sur **New Query** (ou **+ New**)

### Étape 3: Copier/Coller la Migration

1. Ouvrez le fichier `supabase/migrations/001_initial_schema.sql`
2. **Copiez tout le contenu** (Cmd+A puis Cmd+C)
3. **Collez** dans le SQL Editor (Cmd+V)

### Étape 4: Exécuter

1. Cliquez sur **Run** (ou appuyez sur Cmd+Enter)
2. Attendez quelques secondes...
3. Vous devriez voir "Success" avec le message "Query executed successfully"

### Étape 5: Vérifier

Vérifiez que les tables ont été créées:

```sql
-- Copier/coller ceci dans une nouvelle query
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Vous devriez voir:
- ✅ `orders` (existante, maintenant sécurisée)
- ✅ `profiles` (nouvelle)
- ✅ `projects` (nouvelle)
- ✅ `design_versions` (nouvelle)
- ✅ `shared_projects` (nouvelle)

## 🔍 Vérification Détaillée

### Vérifier les Profiles

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
```

### Vérifier les Projects

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'projects'
ORDER BY ordinal_position;
```

### Vérifier RLS (Row Level Security)

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'projects', 'orders', 'design_versions', 'shared_projects');
```

Toutes les tables devraient avoir `rowsecurity = true`.

### Vérifier les Policies

```sql
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

## ✅ Succès!

Si tout est bon, vous devriez avoir:
- 5 tables créées
- RLS activée sur toutes
- Plusieurs policies par table
- Triggers actifs (auto-create profile, auto-version projects)

## 🎯 Prochaines Étapes

### 1. Régénérer les Types TypeScript

```bash
npx supabase gen types typescript --project-id qygpijoytpbxgbkaylkz > src/lib/supabase/types.ts
```

### 2. Tester la Création de Profile

Créez un compte de test ou utilisez un existant:

```sql
-- Vérifier les profiles
SELECT id, email, full_name, created_at FROM profiles;
```

Un profile devrait avoir été créé automatiquement pour chaque utilisateur existant.

### 3. Tester la Sécurité RLS

Connectez-vous avec un compte utilisateur (pas service_role) et essayez:

```javascript
// Dans la console du navigateur
const {data, error} = await supabase.from('profiles').select('*');
console.log(data); // Devrait voir seulement SON profile
```

## ⚠️ En Cas d'Erreur

### "relation already exists"

C'est normal si vous réexécutez la migration. Les `CREATE TABLE IF NOT EXISTS` protègent contre ça.

### "permission denied"

Vérifiez que vous êtes bien sur le projet Arteva et que vous avez les droits admin.

### Autres erreurs

1. Vérifiez le message d'erreur exact
2. Copiez la section SQL qui pose problème
3. Exécutez-la séparément pour identifier le problème
4. Consultez `docs/DATABASE_ANALYSIS.md` pour plus de détails

## 🔄 Rollback (Si Nécessaire)

Si vous devez tout supprimer et recommencer:

```sql
-- ⚠️ ATTENTION: Ceci supprime TOUTES les données!
-- À utiliser UNIQUEMENT en développement

DROP TABLE IF EXISTS public.shared_projects CASCADE;
DROP TABLE IF EXISTS public.design_versions CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Ne pas supprimer orders si vous avez des données importantes!
-- DROP TABLE IF EXISTS public.orders CASCADE;

DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.version_project() CASCADE;
```

Puis réexécutez la migration depuis le début.

---

**Besoin d'aide?** Consultez:
- `docs/DATABASE_ANALYSIS.md` - Analyse détaillée
- `docs/SUPABASE_INTEGRATION.md` - Guide complet d'intégration
- `docs/MCP_SETUP.md` - Configuration MCP
