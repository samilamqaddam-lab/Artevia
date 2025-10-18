# Analyse des Changements de Prix - Screenshot

## 📋 Méthodologie
- **Cellules ORANGE** = Changements à appliquer
- **Cellules BLANCHES** = Valeurs actuelles à conserver
- Les prix dans le screenshot sont des **PRIX TOTAUX** (quantité × prix unitaire)

---

## 1. ❌ STYLOS (pen-s1) - PAS DE CHANGEMENT DE PRIX
**Screenshot**: Quantités 30/100/500/1000 - Prix 449/990/4290/7890
**Couleurs surlignées**: Noir, blanc, rouge, bleu

### Analyse Actuelle (products.ts ligne ~192)
- MOQ actuel: 10
- Couleurs actuelles: graphite, royal, azure
- Prix unitaires calculés depuis screenshot:
  - 30 unités: 449 MAD total = 14.97 MAD/unité
  - 100 unités: 990 MAD total = 9.90 MAD/unité
  - 500 unités: 4290 MAD total = 8.58 MAD/unité
  - 1000 unités: 7890 MAD total = 7.89 MAD/unité

### ⚠️ ACTION REQUISE
- **Pas de changement de prix** (pas surligné en orange)
- **Couleurs à vérifier/ajouter**: Noir, blanc, rouge, bleu (actuellement: graphite, royal, azure)

---

## 2. 🔥 CHEMISE À RABAT (folder-standard) - CHANGEMENT MAJEUR
**Screenshot**: Quantités 100/500/1000 - Prix **1050/4750/8700** (SURLIGNÉ ORANGE)

### Analyse Actuelle (products.ts ligne ~278)
- MOQ actuel: 100
- Méthode offset-quadri actuelle: 100@9.5 / 500@6.3 / 1000@5.25 MAD/unité
- Méthode digital-short actuelle: 100@10.8 / 500@7.1 / 1000@5.9 MAD/unité

### 📊 Nouveaux Prix Unitaires (depuis screenshot)
- 100 unités: 1050 MAD total = **10.5 MAD/unité** (actuellement 9.5 ou 10.8)
- 500 unités: 4750 MAD total = **9.5 MAD/unité** (actuellement 6.3 ou 7.1) ⬆️ AUGMENTATION
- 1000 unités: 8700 MAD total = **8.7 MAD/unité** (actuellement 5.25 ou 5.9) ⬆️ AUGMENTATION

### ✅ ACTION REQUISE
**Mettre à jour les priceTiers en conservant le dégressif :**
- Méthode principale (offset-quadri) :
  - `{minQuantity: 100, unitPrice: 10.5}`
  - `{minQuantity: 500, unitPrice: 9.5}`
  - `{minQuantity: 1000, unitPrice: 8.7}`

---

## 3. ❌ MUG PERSONNALISABLE (mug-ceramique) - PAS DE CHANGEMENT
**Screenshot**: Quantités 1/10/100 - Prix 119/499/2990
**Couleurs**: Noir, blanc

### Analyse
Prix unitaires calculés: 119 / 49.9 / 29.9 MAD/unité
**Pas de surlignage orange** = pas de changement requis

---

## 4. ⚠️ CLÉ USB 16GO (usb-16go) - TITRE SURLIGNÉ ORANGE
**Screenshot**: "CLÉ USB (Personnalisé)" surligné orange
**Prix**: Quantités 10/50/100 - Prix 1299/5990/9900
**Couleurs surlignées**: Noir, blanc, rouge, bleu

### Analyse Actuelle (products.ts ligne ~446)
- Prix actuels: 10@129.9 / 50@119.8 / 100@99 MAD/unité
- Prix screenshot: 10@129.9 / 50@119.8 / 100@99 MAD/unité ✅ IDENTIQUES
- Couleurs actuelles: bamboo, black, silver

### ✅ ACTION REQUISE
- **Pas de changement de prix** (valeurs identiques)
- **Couleurs à ajouter**: Noir, blanc, rouge, bleu (remplacer bamboo, black, silver)
- **Nom à mettre à jour ?** "(Personnalisé)" mentionné dans le screenshot

---

## 5. ❌ TAPIS DE SOURIS (mousepad) - PAS DE CHANGEMENT
**Screenshot**: Quantités 10/30/100 - Prix 490/1050/2790
Prix unitaires: 49 / 35 / 27.9 MAD/unité
**Pas de surlignage orange** = pas de changement

---

## 6. ❌ T-SHIRT (tshirt-essential) - PAS DE CHANGEMENT
**Screenshot**: Quantités 20/50/100 - Prix 2300/4500/8000
**Couleurs surlignées**: Noir, blanc, rouge, bleu
Prix unitaires: 115 / 90 / 80 MAD/unité
**Pas de surlignage orange sur les prix** = pas de changement de prix
**Couleurs à vérifier/ajouter**: Noir, blanc, rouge, bleu

---

## 7. ❌ TOTE BAG - PAS DE CHANGEMENT
**Screenshot**: Quantités 50/100/300 - Prix 1750/3150/8400
Prix unitaires: 35 / 31.5 / 28 MAD/unité
**Pas de surlignage orange** = pas de changement

---

## 8. 🔥 BLOC NOTE SKIN (A5) - NOUVEAU PRODUIT À CRÉER
**Screenshot**: Quantités **30/100/300** - Prix **2700/7900/21000** (SURLIGNÉ ORANGE)
**Couleurs**: Noir, blanc, rouge, bleu, jaune

### 📊 Prix Unitaires
- 30 unités: 2700 MAD total = **90 MAD/unité**
- 100 unités: 7900 MAD total = **79 MAD/unité**
- 300 unités: 21000 MAD total = **70 MAD/unité**

### ✅ ACTION REQUISE
**Créer un NOUVEAU produit "Bloc note skin (A5)"** :
- MOQ: 30
- Couleurs: Noir, blanc, rouge, bleu, jaune
- priceTiers:
  - `{minQuantity: 30, unitPrice: 90}`
  - `{minQuantity: 100, unitPrice: 79}`
  - `{minQuantity: 300, unitPrice: 70}`

---

## 9. 🔥 BLOC NOTE PERSONNALISÉ (notepad-spiral) - CHANGEMENT MAJEUR
**Screenshot**: **A4** Quantités **50/100/300** - Prix **3100/5500/14500** (SURLIGNÉ ORANGE)
**Screenshot**: **A5** Quantités **50/100/300** - Prix **2450/4600/12900** (SURLIGNÉ ORANGE)

### Analyse Actuelle (products.ts ligne ~82)
- MOQ actuel: 50
- A5 (digital-a5-100): 50@26 / 200@21 / 500@16.6 MAD/unité
- A4 (digital-a4-100): 50@36 / 200@28.5 / 500@23.4 MAD/unité

### 📊 Nouveaux Prix Unitaires A5
- 50 unités: 2450 MAD total = **49 MAD/unité** (actuellement 26) ⬆️ +88%
- 100 unités: 4600 MAD total = **46 MAD/unité** (actuellement ~22) ⬆️ +109%
- 300 unités: 12900 MAD total = **43 MAD/unité** (actuellement ~17) ⬆️ +153%

### 📊 Nouveaux Prix Unitaires A4
- 50 unités: 3100 MAD total = **62 MAD/unité** (actuellement 36) ⬆️ +72%
- 100 unités: 5500 MAD total = **55 MAD/unité** (actuellement ~30) ⬆️ +83%
- 300 unités: 14500 MAD total = **48.33 MAD/unité** (actuellement ~23) ⬆️ +110%

### ✅ ACTION REQUISE
**Mettre à jour les priceTiers en conservant le dégressif :**
- Méthode A5 (digital-a5-100):
  - `{minQuantity: 50, unitPrice: 49}`
  - `{minQuantity: 100, unitPrice: 46}`
  - `{minQuantity: 300, unitPrice: 43}`
- Méthode A4 (digital-a4-100):
  - `{minQuantity: 50, unitPrice: 62}`
  - `{minQuantity: 100, unitPrice: 55}`
  - `{minQuantity: 300, unitPrice: 48.33}`

---

## 🎯 RÉSUMÉ EXÉCUTIF DES ACTIONS

### ✅ Modifications de Prix (3 produits)
1. **CHEMISE À RABAT** : Ajuster prix unitaires (10.5 / 9.5 / 8.7 MAD)
2. **BLOC NOTE A5** : Nouveaux prix (49 / 46 / 43 MAD) - Augmentation significative
3. **BLOC NOTE A4** : Nouveaux prix (62 / 55 / 48.33 MAD) - Augmentation significative

### ➕ Création de Produit (1 nouveau)
4. **BLOC NOTE SKIN (A5)** : Nouveau produit avec MOQ 30, prix (90 / 79 / 70 MAD)

### 🎨 Modifications de Couleurs (4 produits)
5. **STYLOS** : Ajouter/vérifier Noir, blanc, rouge, bleu
6. **CLÉ USB** : Remplacer couleurs par Noir, blanc, rouge, bleu
7. **T-SHIRT** : Ajouter/vérifier Noir, blanc, rouge, bleu
8. **BLOC NOTE SKIN** : Couleurs Noir, blanc, rouge, bleu, jaune

---

## ⚠️ POINTS DE VIGILANCE

### 🔒 À NE PAS TOUCHER
- ✅ Structure des priceTiers (dégressif conservé)
- ✅ Formules de calcul de prix
- ✅ MOQ (sauf nouveau produit)
- ✅ SetupFee
- ✅ Autres produits non mentionnés

### ⚠️ Vérifications Nécessaires
1. **Augmentations importantes** : Bloc-notes +72% à +153% - Confirmer intention
2. **Nouveau produit** : Bloc note skin - Nécessite traductions, images, slug
3. **Cohérence dégressif** : Vérifier que les % de remise sont cohérents

---

## 📝 QUESTION AVANT IMPLÉMENTATION

**Confirmation requise :**
1. Les augmentations de prix des bloc-notes (+72% à +153%) sont-elles intentionnelles ?
2. Pour "Bloc note skin (A5)" : Quel slug voulez-vous ? (ex: `bloc-note-skin-a5`)
3. Les couleurs des produits existants doivent-elles REMPLACER ou S'AJOUTER aux couleurs actuelles ?

**Prêt à implémenter dès confirmation ! 🚀**
