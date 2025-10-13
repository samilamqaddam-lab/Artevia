# ⚡ DÉMARRAGE RAPIDE - Migration Supabase

## 🎯 Ce qu'il faut faire (2 minutes)

### Étape 1: Appliquer la Migration SQL

1. **Ouvrez** [Supabase Dashboard](https://supabase.com/dashboard/project/qygpijoytpbxgbkaylkz)
2. Cliquez sur **SQL Editor** dans la barre latérale
3. Cliquez sur **+ New query**
4. **Copiez TOUT** le contenu du fichier: `supabase/migrations/001_initial_schema.sql`
5. **Collez** dans l'éditeur SQL
6. Cliquez sur **RUN** (ou Cmd/Ctrl + Enter)
7. Attendez ~5 secondes
8. Vous devriez voir "Success ✓"

### Étape 2: Vérifier (30 secondes)

Dans le même SQL Editor, exécutez:

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Vous devriez voir ces tables:
- ✅ design_versions
- ✅ orders
- ✅ profiles
- ✅ projects
- ✅ shared_projects

### Étape 3: Régénérer les Types (automatique)

Revenez dans votre terminal et exécutez:

```bash
npm run types:generate
```

## ✅ C'est Tout!

Votre base de données est prête. Les prochaines étapes pour intégrer dans le code seront expliquées après.

---

**Besoin d'aide?** Consultez `APPLY_MIGRATION.md` pour plus de détails.
