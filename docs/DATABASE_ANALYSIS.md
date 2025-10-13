# 📊 Analyse de la Base de Données Supabase

## 🔍 État Actuel

### Architecture de Stockage

```
┌─────────────────────────────────────────────────┐
│              ARTEVIA STACK                      │
├─────────────────────────────────────────────────┤
│ Auth         → Supabase Auth (✅ Configuré)    │
│ Projects     → IndexedDB Local (⚠️ Non-sync)   │
│ Orders       → Supabase Table (✅ Configuré)   │
│ Products     → Hard-codé (✅ OK pour l'instant)│
│ Users/Profiles → ❌ Manquant                   │
└─────────────────────────────────────────────────┘
```

### Tables Existantes

#### 1. **orders** ✅
```typescript
{
  id: string;                    // UUID
  order_id: string;              // ID commande unique
  status: string;                // Statut de la commande
  received_at: string;           // Date de réception
  review_eta: string | null;     // ETA pour révision
  locale: string | null;         // Langue (fr/ar)
  quantity_total: number | null; // Quantité totale
  total_amount: number | null;   // Montant total
  discount_amount: number | null;// Montant remise
  checkout: Json | null;         // Infos checkout
  notes: string | null;          // Notes
  items: Json[];                 // Articles commandés
  discounts: Json[] | null;      // Remises appliquées
  raw_payload: Json;             // Payload brut
  created_at: string;            // Date création
}
```

**Utilisation**: Stocke les demandes de devis/commandes des clients.

**RLS**: ⚠️ Non vérifié - À configurer selon les besoins.

## ⚠️ Problèmes Identifiés

### 1. **Projets non synchronisés**
- ❌ Les designs sont stockés uniquement en IndexedDB local
- ❌ Pas de backup automatique
- ❌ Impossible de récupérer les designs sur un autre appareil
- ❌ Pas de collaboration possible
- ❌ Perdus si le cache navigateur est effacé

### 2. **Pas de table profiles**
- ❌ Informations utilisateur limitées aux données Supabase Auth
- ❌ Impossible d'ajouter des métadonnées custom (entreprise, préférences, etc.)
- ❌ Pas de relation entre users et orders

### 3. **Sécurité RLS non vérifiée**
- ⚠️ Row Level Security (RLS) non confirmée sur la table orders
- ⚠️ Risque d'accès non autorisé aux commandes d'autres utilisateurs

### 4. **Pas d'historique des designs**
- ❌ Impossible de voir l'historique des modifications
- ❌ Pas de versionning des designs

## ✅ Recommandations

### Priorité 1 - Critique

#### A. Ajouter une table `profiles`

**Bénéfices**:
- Stockage des infos entreprise (nom, secteur, etc.)
- Préférences utilisateur (langue, thème, etc.)
- Relation avec les commandes

**Migration SQL**:
```sql
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  company_name TEXT,
  phone TEXT,
  locale TEXT DEFAULT 'fr' CHECK (locale IN ('fr', 'ar')),
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Index for faster lookups
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

#### B. Migrer `projects` vers Supabase

**Bénéfices**:
- Synchronisation multi-appareils
- Backup automatique
- Collaboration possible
- Partage de designs

**Migration SQL**:
```sql
-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  product_id TEXT NOT NULL,
  canvas JSONB NOT NULL,
  preview_url TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own projects
CREATE POLICY "Users can view own projects"
  ON public.projects
  FOR SELECT
  USING (auth.uid() = user_id OR is_public = TRUE);

-- Policy: Users can create projects
CREATE POLICY "Users can create projects"
  ON public.projects
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own projects
CREATE POLICY "Users can update own projects"
  ON public.projects
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own projects
CREATE POLICY "Users can delete own projects"
  ON public.projects
  FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_product_id ON public.projects(product_id);
CREATE INDEX idx_projects_updated_at ON public.projects(updated_at DESC);
CREATE INDEX idx_projects_public ON public.projects(is_public) WHERE is_public = TRUE;

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

#### C. Sécuriser la table `orders`

**Migration SQL**:
```sql
-- Add user_id to orders if not exists
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own orders
CREATE POLICY "Users can view own orders"
  ON public.orders
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Authenticated users can create orders
CREATE POLICY "Authenticated users can create orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Admin can view all orders (optional)
-- CREATE POLICY "Admin can view all orders"
--   ON public.orders
--   FOR SELECT
--   USING (auth.jwt()->>'role' = 'admin');

-- Index for user_id
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
```

### Priorité 2 - Importantes

#### D. Ajouter une table `design_versions`

**Bénéfices**:
- Historique des modifications
- Possibilité de revenir en arrière
- Audit trail

**Migration SQL**:
```sql
-- Create design_versions table
CREATE TABLE public.design_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  canvas JSONB NOT NULL,
  preview_url TEXT,
  change_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (project_id, version_number)
);

-- Enable RLS
ALTER TABLE public.design_versions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view versions of their projects
CREATE POLICY "Users can view own project versions"
  ON public.design_versions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = design_versions.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Index
CREATE INDEX idx_design_versions_project_id ON public.design_versions(project_id, version_number DESC);

-- Function to auto-version on project update
CREATE OR REPLACE FUNCTION version_project()
RETURNS TRIGGER AS $$
DECLARE
  next_version INTEGER;
BEGIN
  -- Get next version number
  SELECT COALESCE(MAX(version_number), 0) + 1
  INTO next_version
  FROM public.design_versions
  WHERE project_id = NEW.id;

  -- Insert new version
  INSERT INTO public.design_versions (project_id, version_number, canvas, preview_url)
  VALUES (NEW.id, next_version, NEW.canvas, NEW.preview_url);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-version
CREATE TRIGGER on_project_updated
  AFTER UPDATE OF canvas ON public.projects
  FOR EACH ROW
  WHEN (OLD.canvas IS DISTINCT FROM NEW.canvas)
  EXECUTE FUNCTION version_project();
```

#### E. Ajouter une table `shared_projects`

**Bénéfices**:
- Partage de designs entre utilisateurs
- Collaboration

**Migration SQL**:
```sql
-- Create shared_projects table
CREATE TABLE public.shared_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  shared_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  shared_with_email TEXT NOT NULL,
  permission TEXT CHECK (permission IN ('view', 'edit')) DEFAULT 'view',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (project_id, shared_with_email)
);

-- Enable RLS
ALTER TABLE public.shared_projects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view shares of their projects
CREATE POLICY "Users can view project shares"
  ON public.shared_projects
  FOR SELECT
  USING (auth.uid() = shared_by);

-- Policy: Users can create shares for their projects
CREATE POLICY "Users can share their projects"
  ON public.shared_projects
  FOR INSERT
  WITH CHECK (
    auth.uid() = shared_by
    AND EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = shared_projects.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Index
CREATE INDEX idx_shared_projects_email ON public.shared_projects(shared_with_email);
CREATE INDEX idx_shared_projects_project_id ON public.shared_projects(project_id);
```

### Priorité 3 - Nice to Have

#### F. Analytics et statistiques

```sql
-- Create analytics table
CREATE TABLE public.project_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_analytics_project_id ON public.project_analytics(project_id);
CREATE INDEX idx_analytics_event_type ON public.project_analytics(event_type);
CREATE INDEX idx_analytics_created_at ON public.project_analytics(created_at DESC);
```

## 📝 Plan d'Implémentation

### Phase 1 - Fondations (Semaine 1)
1. ✅ Configurer MCP Supabase
2. 🔲 Créer la table `profiles`
3. 🔲 Ajouter le trigger de création automatique
4. 🔲 Sécuriser `orders` avec RLS

### Phase 2 - Migration Projets (Semaine 2)
1. 🔲 Créer la table `projects`
2. 🔲 Implémenter les fonctions de migration IndexedDB → Supabase
3. 🔲 Mettre à jour le code pour utiliser Supabase au lieu d'IndexedDB
4. 🔲 Tester la synchronisation

### Phase 3 - Fonctionnalités Avancées (Semaine 3)
1. 🔲 Ajouter `design_versions`
2. 🔲 Implémenter le système de partage
3. 🔲 Ajouter les analytics

## 🧪 Tests Nécessaires

### Tests Manuels
- [ ] Créer un compte
- [ ] Vérifier que le profile est créé automatiquement
- [ ] Créer un projet
- [ ] Modifier un projet
- [ ] Partager un projet
- [ ] Accéder à un projet partagé
- [ ] Créer une commande
- [ ] Vérifier RLS (tenter d'accéder aux données d'un autre user)

### Tests de Migration
- [ ] Exporter les projets IndexedDB existants
- [ ] Importer dans Supabase
- [ ] Vérifier l'intégrité des données

## 📚 Documentation à Mettre à Jour

1. **README.md** - Ajouter section database
2. **types.ts** - Régénérer avec Supabase CLI
3. **API Docs** - Documenter les nouvelles tables

## 🔧 Commandes Utiles

### Générer les types TypeScript
```bash
npx supabase gen types typescript --project-id qygpijoytpbxgbkaylkz > src/lib/supabase/types.ts
```

### Appliquer les migrations
Via MCP Supabase ou:
```bash
# Connexion
psql "postgresql://postgres:[YOUR-PASSWORD]@db.qygpijoytpbxgbkaylkz.supabase.co:5432/postgres"

# Ou via SQL Editor dans Supabase Dashboard
```

## 🔐 Sécurité

### Checklist Sécurité
- [ ] RLS activée sur toutes les tables
- [ ] Policies testées et vérifiées
- [ ] Service role key sécurisée (ne jamais exposer côté client)
- [ ] Validation des inputs côté serveur
- [ ] Rate limiting sur les API sensibles
- [ ] Audit logs pour actions critiques

## 📊 Métriques de Succès

- **Performance**: Temps de chargement < 200ms
- **Fiabilité**: 0 perte de données
- **UX**: Synchronisation transparente
- **Sécurité**: 0 violation RLS

---

**Dernière mise à jour**: 2025-10-13
**Analysé par**: Claude Code + Context7 MCP
