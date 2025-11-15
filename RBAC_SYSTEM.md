# 🔐 Système de Contrôle d'Accès Basé sur les Rôles (RBAC)

## 📋 Vue d'ensemble

Ce document décrit le système de gestion des rôles utilisateurs implémenté pour sécuriser l'accès aux fonctionnalités administratives d'Arteva.

**Date de création:** 2025-11-15
**Version:** 1.0.0
**Statut:** ✅ Implémenté

---

## 🎯 Objectif

Protéger l'accès à l'interface administratrice (gestion des prix, contenu, etc.) en s'assurant que seuls les utilisateurs autorisés peuvent effectuer des modifications sensibles.

---

## 👥 Rôles Disponibles

### **1. Super Admin** (`super_admin`)
- ✅ Accès complet au système
- ✅ Gestion des prix et du contenu
- ✅ Gestion des autres administrateurs (futur)
- ✅ Accès à toutes les fonctionnalités admin
- **Assigné à:**
  - `sami.lamqaddam@gmail.com`
  - `sami.artipel@gmail.com`

### **2. Admin** (`admin`)
- ✅ Gestion des prix et du contenu
- ✅ Accès aux fonctionnalités admin
- ❌ Ne peut pas gérer d'autres administrateurs
- **Non assigné pour le moment**

### **3. Utilisateur** (`user`)
- ✅ Accès standard au site
- ✅ Créer des devis et passer des commandes
- ❌ Aucun accès administratif
- **Rôle par défaut pour les nouveaux utilisateurs**

---

## 🚀 Installation

### **Étape 1: Appliquer la migration SQL**

Vous avez **2 options**:

#### **Option A: Via Supabase Dashboard (Recommandé)**
1. Aller sur https://supabase.com/dashboard/project/qygpijoytpbxgbkaylkz
2. Cliquer sur **"SQL Editor"** dans le menu
3. Cliquer sur **"New query"**
4. Copier le contenu de `supabase/migrations/005_create_user_roles.sql`
5. Coller dans l'éditeur SQL
6. Cliquer sur **"Run"** (▶️)
7. ✅ Le système de rôles est créé et vos comptes sont configurés en super_admin!

#### **Option B: Via CLI Supabase**
```bash
supabase db push
```

### **Étape 2: Déployer le code**

Les modifications du code seront déployées automatiquement par Vercel dès que vous pushez sur la branche `main`.

---

## 🏗️ Architecture Technique

### **Base de données**

```sql
-- Table user_roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  role TEXT CHECK (role IN ('super_admin', 'admin', 'user')),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  UNIQUE(user_id)
);
```

### **Fonctions SQL Helper**

**`public.is_admin()`** - Vérifie si l'utilisateur est admin ou super_admin
```sql
SELECT public.is_admin(); -- Returns TRUE or FALSE
```

**`public.has_role(role_name)`** - Vérifie un rôle spécifique
```sql
SELECT public.has_role('super_admin'); -- Returns TRUE or FALSE
```

### **Politiques RLS**

#### **Sur `price_overrides`:**
- ✅ Lecture: Requiert `is_admin()`
- ✅ Insertion: Requiert `is_admin()`
- ✅ Modification: Requiert `is_admin()`
- ✅ Suppression: Requiert `is_admin()`

#### **Sur `user_roles`:**
- ✅ Lecture: Utilisateur peut lire son propre rôle
- ✅ Gestion: Seuls les super_admins peuvent modifier les rôles

---

## 💻 Utilisation dans le Code

### **Vérifier le rôle côté serveur**

```typescript
import {isAdmin, isSuperAdmin, requireAdmin} from '@/lib/auth/roles';

// Dans un Server Component ou API Route
export default async function AdminPage() {
  const admin = await isAdmin();

  if (!admin) {
    redirect('/unauthorized');
  }

  // Render admin interface
}
```

### **Dans les API Routes**

```typescript
import {requireAdmin} from '@/lib/auth/roles';

export async function POST(request: Request) {
  try {
    // Lève une exception si l'utilisateur n'est pas admin
    await requireAdmin();

    // Code admin...
  } catch (error) {
    return NextResponse.json({error: 'Accès refusé'}, {status: 403});
  }
}
```

### **Fonctions disponibles**

```typescript
// Récupérer le rôle de l'utilisateur actuel
const role = await getCurrentUserRole(); // 'super_admin' | 'admin' | 'user' | null

// Vérifier si l'utilisateur a un rôle spécifique
const isSuperAdmin = await hasRole('super_admin'); // boolean

// Vérifier si l'utilisateur est admin (admin ou super_admin)
const isAdmin = await isAdmin(); // boolean

// Vérifier si l'utilisateur est super admin
const isSuperAdmin = await isSuperAdmin(); // boolean

// Requérir le rôle admin (lève une exception si pas admin)
await requireAdmin(); // throws Error if not admin

// Requérir le rôle super admin (lève une exception si pas super_admin)
await requireSuperAdmin(); // throws Error if not super_admin
```

---

## 🧪 Tests

### **Test 1: Accès non autorisé**

1. **Se déconnecter** du site
2. Essayer d'accéder à `https://arteva.ma/fr/admin/pricing`
3. **Résultat attendu:** Redirection vers la page de connexion

### **Test 2: Accès avec compte utilisateur standard**

1. **Se connecter** avec un compte qui n'a pas de rôle admin (par exemple `ahmed.agh21@gmail.com`)
2. Essayer d'accéder à `https://arteva.ma/fr/admin/pricing`
3. **Résultat attendu:** Redirection vers la page d'accueil avec message d'erreur

### **Test 3: Accès avec compte super admin**

1. **Se connecter** avec `sami.lamqaddam@gmail.com` ou `sami.artipel@gmail.com`
2. Accéder à `https://arteva.ma/fr/admin/pricing`
3. **Résultat attendu:** Interface admin s'affiche correctement
4. Essayer de modifier un prix
5. **Résultat attendu:** La modification est sauvegardée avec succès

### **Test 4: Vérification des politiques RLS**

Exécuter cette requête SQL dans Supabase:

```sql
-- En tant qu'utilisateur non-admin (devrait échouer)
SET request.jwt.claims.sub TO 'd6ffede4-d6ce-4042-96b6-7b37dbd6f21f'; -- ahmed.agh21@gmail.com
SELECT * FROM price_overrides; -- Devrait retourner 0 résultats

-- En tant que super admin (devrait réussir)
SET request.jwt.claims.sub TO '9cbccf4e-aa2b-4d6e-bd5e-5260b59f9957'; -- sami.lamqaddam@gmail.com
SELECT * FROM price_overrides; -- Devrait retourner les résultats
```

---

## 🔒 Sécurité

### **Niveaux de protection**

Le système RBAC protège à **3 niveaux**:

#### **1. Layout Protection** (`app/[locale]/admin/layout.tsx`)
```typescript
// Vérifie l'authentification ET le rôle admin
const admin = await isAdmin();
if (!admin) {
  redirect(`/${locale}?error=unauthorized`);
}
```

#### **2. API Protection** (`app/api/admin/*/route.ts`)
```typescript
// Chaque route API vérifie le rôle
await requireAdmin(); // Lève une exception si pas admin
```

#### **3. Database Protection** (RLS Policies)
```sql
-- Les politiques RLS empêchent l'accès direct aux données
CREATE POLICY "Admins can read price overrides"
  ON price_overrides FOR SELECT
  USING (public.is_admin());
```

### **Pourquoi 3 niveaux?**

- **Layout:** Empêche l'affichage de l'interface
- **API:** Empêche les appels API directs
- **Database:** Empêche l'accès direct aux données même si les deux premiers niveaux sont contournés

---

## 👤 Gestion des Rôles

### **Ajouter un nouvel administrateur**

```sql
-- Récupérer l'ID de l'utilisateur
SELECT id, email FROM auth.users WHERE email = 'nouveau.admin@example.com';

-- Assigner le rôle admin (copiez l'ID de l'étape précédente)
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID_ICI', 'admin');
```

### **Changer le rôle d'un utilisateur**

```sql
-- Promouvoir un admin en super_admin
UPDATE public.user_roles
SET role = 'super_admin', updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');

-- Rétrograder un admin en utilisateur standard
UPDATE public.user_roles
SET role = 'user', updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');
```

### **Retirer l'accès admin**

```sql
-- Option 1: Changer le rôle en 'user'
UPDATE public.user_roles
SET role = 'user', updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'ancien.admin@example.com');

-- Option 2: Supprimer complètement le rôle (l'utilisateur n'aura aucun accès admin)
DELETE FROM public.user_roles
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'ancien.admin@example.com');
```

### **Lister tous les administrateurs**

```sql
SELECT
  u.email,
  r.role,
  r.created_at as role_assigned_at,
  r.updated_at as role_updated_at
FROM auth.users u
JOIN public.user_roles r ON r.user_id = u.id
WHERE r.role IN ('admin', 'super_admin')
ORDER BY r.role DESC, u.email ASC;
```

---

## 📊 Audit Trail

Chaque rôle assigné ou modifié est enregistré avec:

- ✅ Date de création (`created_at`)
- ✅ Date de dernière modification (`updated_at`)
- ✅ Utilisateur concerné (`user_id`)
- ✅ Rôle actuel (`role`)

Pour voir l'historique complet:

```sql
SELECT
  u.email,
  r.role,
  r.created_at,
  r.updated_at
FROM public.user_roles r
JOIN auth.users u ON u.id = r.user_id
ORDER BY r.updated_at DESC;
```

---

## ❓ FAQ

### **Q: Que se passe-t-il si un utilisateur n'a pas de rôle assigné?**
R: Par défaut, si un utilisateur n'a pas d'entrée dans `user_roles`, il sera traité comme un utilisateur standard sans accès admin.

### **Q: Puis-je avoir plusieurs super admins?**
R: Oui! Vous pouvez assigner le rôle `super_admin` à autant d'utilisateurs que nécessaire.

### **Q: Comment savoir si je suis admin?**
R: Essayez d'accéder à `/fr/admin/pricing`. Si vous êtes redirigé vers la page d'accueil, vous n'avez pas les permissions.

### **Q: Un admin peut-il créer d'autres admins?**
R: Pour le moment, seuls les super admins peuvent modifier les rôles (via SQL). Une interface de gestion des rôles peut être ajoutée dans le futur.

### **Q: Que se passe-t-il si je supprime accidentellement mon propre rôle super_admin?**
R: Vous pouvez le restaurer directement via l'interface SQL de Supabase en tant qu'administrateur de la base de données.

---

## 🛠️ Fichiers Modifiés

### **Migration SQL**
- `supabase/migrations/005_create_user_roles.sql`

### **Code Backend**
- `src/lib/auth/roles.ts` - Helper functions pour vérifier les rôles
- `app/[locale]/admin/layout.tsx` - Protection du layout admin
- `app/api/admin/pricing/route.ts` - Protection des API routes

### **Types TypeScript**
- Les types pour `UserRole` et `UserRoleData` sont définis dans `src/lib/auth/roles.ts`

---

## 🚨 Important

**⚠️ CRITIQUE:** Après avoir appliqué la migration SQL, seuls les comptes suivants auront accès admin:

- ✅ `sami.lamqaddam@gmail.com` (super_admin)
- ✅ `sami.artipel@gmail.com` (super_admin)

**Tous les autres utilisateurs** (incluant `ahmed.agh21@gmail.com` et `sami.lamqaddam.sl@gmail.com`) n'auront **AUCUN** accès administratif tant qu'un rôle ne leur est pas assigné manuellement.

---

## 📞 Support

En cas de problème:

1. Vérifier que la migration SQL a bien été appliquée
2. Vérifier votre rôle avec cette requête SQL:
   ```sql
   SELECT role FROM public.user_roles
   WHERE user_id = (SELECT id FROM auth.users WHERE email = 'VOTRE_EMAIL');
   ```
3. Vérifier les logs d'erreur dans Supabase Dashboard
4. Contacter le développeur si le problème persiste

---

**🎉 Le système RBAC est prêt à l'emploi après l'application de la migration SQL!**
