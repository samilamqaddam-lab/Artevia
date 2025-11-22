# 🚀 Instructions de Configuration Supabase - Système de Gestion des Photos

## ⚡ Actions Requises dans le Dashboard Supabase

### 1️⃣ Créer le Storage Bucket (2 minutes)

1. **Ouvrez votre Dashboard Supabase** : https://supabase.com/dashboard/project/qygpijoytpbxgbkaylkz
2. **Allez dans Storage** (icône dossier dans le menu de gauche)
3. **Cliquez sur "New bucket"**
4. **Configurez le bucket** :
   - **Name**: `product-images`
   - **Public bucket**: ✅ Activé (cochez la case)
   - **File size limit**: `10MB`
   - **Allowed MIME types**: Cliquez "Add MIME type" et ajoutez :
     - `image/jpeg`
     - `image/jpg`
     - `image/png`
     - `image/webp`
     - `image/gif`
5. **Cliquez sur "Create bucket"**

### 2️⃣ Créer la Table product_images (3 minutes)

1. **Allez dans SQL Editor** (icône terminal dans le menu)
2. **Cliquez sur "New query"**
3. **Copiez et collez ce SQL** :

```sql
-- Create product_images table
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  image_type TEXT NOT NULL DEFAULT 'uploaded' CHECK (image_type IN ('local', 'external', 'uploaded')),
  storage_path TEXT,
  is_hero BOOLEAN DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  alt_text TEXT,
  attribution JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  CONSTRAINT unique_hero_per_product EXCLUDE (product_id WITH =) WHERE (is_hero = true)
);

-- Create indexes
CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_images_order ON product_images(product_id, display_order);
CREATE INDEX idx_product_images_hero ON product_images(product_id) WHERE is_hero = true;

-- Enable RLS
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Public can view product images"
  ON product_images FOR SELECT
  USING (true);

CREATE POLICY "Admin can insert product images"
  ON product_images FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE email IN (
        'admin@arteva.ma',
        'sami@arteva.ma',
        'samilamqaddam@gmail.com'
      )
    )
  );

CREATE POLICY "Admin can update product images"
  ON product_images FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE email IN (
        'admin@arteva.ma',
        'sami@arteva.ma',
        'samilamqaddam@gmail.com'
      )
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE email IN (
        'admin@arteva.ma',
        'sami@arteva.ma',
        'samilamqaddam@gmail.com'
      )
    )
  );

CREATE POLICY "Admin can delete product images"
  ON product_images FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE email IN (
        'admin@arteva.ma',
        'sami@arteva.ma',
        'samilamqaddam@gmail.com'
      )
    )
  );

-- Create update trigger
CREATE OR REPLACE FUNCTION update_product_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_images_timestamp
  BEFORE UPDATE ON product_images
  FOR EACH ROW
  EXECUTE FUNCTION update_product_images_updated_at();
```

4. **Cliquez sur "Run"** (bouton vert)
5. **Vérifiez** : Vous devriez voir "Success. No rows returned"

### 3️⃣ Ajouter les Fonctions Helper (2 minutes)

1. **Toujours dans SQL Editor**
2. **Créez une nouvelle query**
3. **Copiez et collez** :

```sql
-- Function to get all images for a product
CREATE OR REPLACE FUNCTION get_product_images(p_product_id UUID)
RETURNS TABLE (
  id UUID,
  image_url TEXT,
  image_type TEXT,
  storage_path TEXT,
  is_hero BOOLEAN,
  display_order INTEGER,
  alt_text TEXT,
  attribution JSONB,
  metadata JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    pi.id,
    pi.image_url,
    pi.image_type,
    pi.storage_path,
    pi.is_hero,
    pi.display_order,
    pi.alt_text,
    pi.attribution,
    pi.metadata
  FROM product_images pi
  WHERE pi.product_id = p_product_id
  ORDER BY pi.is_hero DESC, pi.display_order ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to reorder images
CREATE OR REPLACE FUNCTION reorder_product_images(
  p_product_id UUID,
  p_image_ids UUID[]
) RETURNS BOOLEAN AS $$
DECLARE
  i INTEGER;
BEGIN
  FOR i IN 1..array_length(p_image_ids, 1) LOOP
    UPDATE product_images
    SET display_order = i
    WHERE id = p_image_ids[i] AND product_id = p_product_id;
  END LOOP;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to set hero image
CREATE OR REPLACE FUNCTION set_hero_image(
  p_product_id UUID,
  p_image_id UUID
) RETURNS BOOLEAN AS $$
BEGIN
  UPDATE product_images
  SET is_hero = false
  WHERE product_id = p_product_id AND is_hero = true;

  UPDATE product_images
  SET is_hero = true
  WHERE id = p_image_id AND product_id = p_product_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_product_images(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION reorder_product_images(UUID, UUID[]) TO authenticated;
GRANT EXECUTE ON FUNCTION set_hero_image(UUID, UUID) TO authenticated;
```

4. **Cliquez sur "Run"**

### 4️⃣ Configurer les Politiques du Bucket Storage (2 minutes)

1. **Retournez dans Storage** > **Cliquez sur `product-images`**
2. **Allez dans l'onglet "Policies"**
3. **Cliquez sur "New Policy"** pour chaque politique :

#### Politique 1 : Lecture Publique
- **Policy name**: `Public Read`
- **Target roles**: `anon` et `authenticated`
- **WITH CHECK expression**: Laissez vide
- **USING expression**: `true`
- **Allowed operations**: ✅ SELECT seulement

#### Politique 2 : Admin Upload
- **Policy name**: `Admin Upload`
- **Target roles**: `authenticated`
- **WITH CHECK expression**:
```sql
(auth.uid() IN (
  SELECT id FROM auth.users
  WHERE email IN ('admin@arteva.ma', 'sami@arteva.ma', 'samilamqaddam@gmail.com')
))
```
- **USING expression**: Même chose
- **Allowed operations**: ✅ INSERT

#### Politique 3 : Admin Update
- **Policy name**: `Admin Update`
- **Target roles**: `authenticated`
- **Expressions**: Même que ci-dessus
- **Allowed operations**: ✅ UPDATE

#### Politique 4 : Admin Delete
- **Policy name**: `Admin Delete`
- **Target roles**: `authenticated`
- **Expressions**: Même que ci-dessus
- **Allowed operations**: ✅ DELETE

### ✅ Vérification

Pour vérifier que tout est bien configuré :

1. **Storage** : Vous devriez voir le bucket `product-images` avec un cadenas ouvert (public)
2. **Table Editor** : Vous devriez voir la table `product_images` dans la liste
3. **SQL Editor** : Exécutez cette requête de test :
```sql
SELECT * FROM product_images LIMIT 1;
```
Résultat attendu : "Success. No rows returned" (table vide mais créée)

### 🎉 Configuration Terminée !

Une fois ces étapes complétées, l'application pourra :
- ✅ Uploader des images vers Supabase Storage
- ✅ Stocker les métadonnées dans la base de données
- ✅ Gérer les permissions admin
- ✅ Afficher les images publiquement

## 📝 Notes Importantes

- **Bucket Public** : Les images produits sont publiques pour que les visiteurs puissent les voir
- **RLS Activé** : Seuls les admins peuvent modifier les images
- **Taille Max** : 10MB par image
- **Formats** : JPEG, PNG, WebP, GIF supportés

## 🚨 En Cas de Problème

Si vous rencontrez une erreur :

1. **Vérifiez les emails admin** : Les emails dans les politiques doivent correspondre exactement
2. **Vérifiez RLS** : La table doit avoir RLS activé (cadenas fermé dans Table Editor)
3. **Testez les permissions** : Connectez-vous avec votre compte admin et testez

---

**Temps Total Estimé : 10 minutes**

Pendant que vous faites cette configuration, je continue le développement de l'interface admin.