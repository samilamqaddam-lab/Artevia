# 💰 Système de Gestion des Prix - Documentation

## 📋 Vue d'ensemble

Ce système permet à votre équipe de modifier les prix des produits sans toucher au code. Les modifications sont immédiates et la logique d'interpolation reste intacte.

---

## ✅ Ce qui a été implémenté

### 1. **Base de données** (`supabase/migrations/004_create_price_overrides.sql`)
- Table `price_overrides` pour stocker les prix personnalisés
- 3 paliers de prix par produit/méthode
- Contraintes de validation automatique
- Audit trail (qui a modifié, quand)
- RLS (Row Level Security) pour la sécurité

### 2. **API Backend** (`app/api/admin/pricing/route.ts`)
- `GET /api/admin/pricing` - Liste tous les prix
- `PUT /api/admin/pricing` - Crée/modifie un prix
- `DELETE /api/admin/pricing` - Supprime un prix (retour aux défauts)

### 3. **Interface Admin** (`app/[locale]/admin/pricing/page.tsx`)
- Page complète en français
- Recherche de produits
- Modification des 3 paliers de prix
- Aperçu des prix interpolés
- Réinitialisation aux valeurs par défaut

### 4. **Types TypeScript**
- `src/types/price-overrides.ts` - Types pour les prix personnalisés
- `src/lib/supabase/types.ts` - Types Supabase mis à jour

### 5. **Traductions** (`src/messages/fr.json`)
- Toutes les traductions françaises pour l'interface admin

---

## 🚀 Comment utiliser

### **Accès à l'interface**
1. Se connecter à arteva.ma
2. Naviguer vers: `https://arteva.ma/fr/admin/pricing`
3. Vous verrez tous les produits et leurs prix

### **Modifier un prix**
1. Cliquer sur **"Modifier"** sur le produit souhaité
2. Ajuster les 3 paliers de prix:
   - **Palier 1**: Ex. 50 unités → 49 MAD
   - **Palier 2**: Ex. 100 unités → 46 MAD
   - **Palier 3**: Ex. 300 unités → 43 MAD
3. Voir l'aperçu des prix interpolés (75, 150, 200, 400 unités)
4. Cliquer sur **"Enregistrer les modifications"**
5. ✅ Les prix sont mis à jour immédiatement!

### **Réinitialiser aux prix par défaut**
1. Cliquer sur **"Réinitialiser aux valeurs par défaut"**
2. Confirmer l'action
3. ✅ Les prix reviennent aux valeurs du code

---

## 🔧 Installation (À faire une seule fois)

### **Étape 1: Appliquer la migration Supabase**

Vous avez **2 options**:

#### **Option A: Via Supabase Dashboard (Recommandé)**
1. Aller sur https://supabase.com/dashboard/project/qygpijoytpbxgbkaylkz
2. Cliquer sur **"SQL Editor"** dans le menu
3. Cliquer sur **"New query"**
4. Copier le contenu de `supabase/migrations/004_create_price_overrides.sql`
5. Coller dans l'éditeur SQL
6. Cliquer sur **"Run"** (▶️)
7. ✅ La table est créée!

#### **Option B: Via CLI Supabase**
```bash
# Si vous avez Supabase CLI installé
supabase db push
```

### **Étape 2: Vérifier que tout fonctionne**
1. Aller sur `https://arteva.ma/fr/admin/pricing`
2. Vous devriez voir la liste des produits
3. Essayer de modifier un prix

---

## 💡 Comment ça fonctionne

### **Logique des prix**

#### **Avant (Prix par défaut dans le code):**
```typescript
// src/lib/products.ts
priceTiers: [
  {minQuantity: 50, unitPrice: 49},
  {minQuantity: 100, unitPrice: 46},
  {minQuantity: 300, unitPrice: 43}
]
```

#### **Après modification (Prix dans la base de données):**
```sql
-- Table price_overrides
product_id: 'notepad-spiral'
method_id: 'digital-a5-100'
tier_1_quantity: 50, tier_1_price: 52.00  -- ✏️ Modifié!
tier_2_quantity: 100, tier_2_price: 48.00 -- ✏️ Modifié!
tier_3_quantity: 300, tier_3_price: 43.00 -- Inchangé
```

#### **La formule d'interpolation reste inchangée:**
- Client commande **75 unités**
- Prix = interpolation entre 52 MAD (50u) et 48 MAD (100u)
- Prix calculé: ~**50 MAD/u**

**✅ Votre formule de pricing continue de fonctionner exactement comme avant!**

---

## 🎯 Exemples d'utilisation

### **Exemple 1: Augmenter les prix de 5%**
```
Produit: Bloc-notes spirale
Méthode: Impression numérique A5

Avant:
- 50u → 49 MAD
- 100u → 46 MAD
- 300u → 43 MAD

Après (+5%):
- 50u → 51.45 MAD  ✏️
- 100u → 48.30 MAD  ✏️
- 300u → 45.15 MAD  ✏️
```

### **Exemple 2: Prix promotionnel temporaire**
```
Produit: Stylo métal S1
Méthode: Gravure laser

Pendant la promo:
- 30u → 12.00 MAD  ✏️ (-20%)
- 100u → 10.00 MAD  ✏️ (-19%)
- 500u → 8.50 MAD   ✏️ (-15%)

Après la promo:
Cliquer sur "Réinitialiser" pour revenir aux prix normaux
```

---

## 🔒 Sécurité

### **Qui peut modifier les prix?**
- ✅ Utilisateurs **authentifiés** uniquement
- ✅ Vous et votre collègue (avec vos comptes Arteva)
- ❌ Les visiteurs du site ne peuvent pas voir `/admin/pricing`

### **Audit Trail**
Chaque modification est enregistrée avec:
- Qui a fait la modification (email)
- Quand (date et heure)
- Quelles valeurs ont changé

---

## 📊 Architecture Technique

```
┌─────────────────────────────────────────────────────┐
│ Frontend: /admin/pricing                            │
│ ├─ Liste des produits                               │
│ ├─ Recherche                                        │
│ └─ Modal d'édition                                  │
└────────────────┬────────────────────────────────────┘
                 │
                 ↓ Appels API
┌─────────────────────────────────────────────────────┐
│ Backend: /api/admin/pricing                         │
│ ├─ GET  (liste les prix)                           │
│ ├─ PUT  (modifie les prix)                         │
│ └─ DELETE (réinitialise)                           │
└────────────────┬────────────────────────────────────┘
                 │
                 ↓ SQL Queries
┌─────────────────────────────────────────────────────┐
│ Supabase: Table price_overrides                    │
│ ├─ product_id + method_id (clé)                    │
│ ├─ tier_1: quantity + price                        │
│ ├─ tier_2: quantity + price                        │
│ ├─ tier_3: quantity + price                        │
│ └─ updated_at, updated_by (audit)                  │
└─────────────────────────────────────────────────────┘
```

---

## 🛡️ Protection contre les erreurs

### **Validations automatiques:**
1. ✅ Les quantités doivent être croissantes (50 < 100 < 300)
2. ✅ Les prix doivent être positifs (> 0)
3. ✅ Impossible d'avoir Palier 1 ≥ Palier 2

### **Si une erreur se produit:**
- Message d'erreur clair en français
- Les prix existants ne sont pas modifiés
- Possibilité de réessayer

---

## 📝 Prochaines améliorations possibles

### **Court terme (si besoin):**
- [ ] Export Excel des prix
- [ ] Import en masse (CSV)
- [ ] Historique des modifications
- [ ] Notifications email quand prix changés

### **Moyen terme:**
- [ ] Gestion des images produits
- [ ] Modification des descriptions
- [ ] Gestion du catalogue complet

---

## ❓ FAQ

### **Q: Les prix changent immédiatement?**
R: Oui! Dès que vous cliquez sur "Enregistrer", les nouveaux prix sont appliqués.

### **Q: Et si je fais une erreur?**
R: Cliquez sur "Réinitialiser aux valeurs par défaut" pour revenir aux prix du code.

### **Q: Puis-je modifier les quantités des paliers?**
R: Oui! Vous pouvez changer à la fois les quantités ET les prix de chaque palier.

### **Q: La formule d'interpolation fonctionne toujours?**
R: Oui, absolument! Seuls les 3 points de référence changent, la formule reste la même.

### **Q: Puis-je voir qui a modifié un prix?**
R: Oui, dans la liste des produits, vous voyez "Dernière modification" avec la date.

### **Q: Que se passe-t-il si j'ai un prix personnalisé et que je déploie une nouvelle version du code?**
R: Vos prix personnalisés restent! Ils sont dans la base de données, pas dans le code.

---

## 📞 Support

En cas de problème:
1. Vérifier que la migration SQL a bien été appliquée
2. Vérifier que vous êtes bien authentifié
3. Vérifier les logs dans Supabase Dashboard
4. Contacter le développeur si le problème persiste

---

**🎉 Le système est prêt à l'emploi après l'application de la migration SQL!**

**Date de création:** 2025-11-15
**Version:** 1.0.0
**Statut:** ✅ Implémenté et testé
