# 📊 PLAN D'AMÉLIORATION DU DESIGNER

**Date**: 2025-01-13
**Status**: En cours
**Version**: 1.0

---

## 🔴 BUGS CRITIQUES IDENTIFIÉS

### **1. Styles de texte prédéfinis ne fonctionnent PAS**
**Localisation**: `src/components/editor/Sidebar/TextTab.tsx:50`

**Problème**:
```tsx
// Tous les presets appellent onAddText() sans paramètres
{TEXT_PRESETS.map(preset => (
  <button onClick={onAddText}>  {/* ❌ Pas de paramètres ! */}
    {preset.label} - {preset.fontSize}px
  </button>
))}
```

**Impact**: Impossible de différencier Titre (120px), Sous-titre (80px), Corps (50px). Tous créent le même texte à 120px.

**Solution**: Modifier `onAddText` pour accepter des paramètres (fontSize, text, fontWeight)

---

### **2. Templates sans thumbnails (images placeholder)**
**Localisation**: `src/lib/editor/templates.ts:10`

**Problème**:
```tsx
thumbnail: '/templates/logo-center.png'  // ❌ Fichier n'existe pas
```

**Impact**: Les templates affichent une icône Sparkles au lieu d'un aperçu visuel. L'utilisateur ne sait pas à quoi ressemble le template avant de cliquer.

**Solution**: Générer des thumbnails SVG inline ou créer de vraies images

---

### **3. Upload d'images dans ImagesTab ne charge PAS sur le canvas**
**Localisation**: `src/components/editor/Sidebar/ImagesTab.tsx:19`

**Problème**:
```tsx
const onDrop = useCallback((acceptedFiles: File[]) => {
  console.log('Files dropped:', acceptedFiles);  // ❌ Juste un log !
  onUploadImage();  // ❌ Appelle la fonction sans passer le fichier
}, [onUploadImage]);
```

**Impact**: Drag & drop ne fait rien. Le fichier est détecté mais jamais ajouté au canvas.

**Solution**: Passer le fichier à `onUploadImage(file)` et traiter dans CanvaEditor

---

## ⚠️ PROBLÈMES UX MAJEURS

### **4. Zones techniques incompréhensibles pour utilisateurs lambda**
**Localisation**: `src/components/editor/CanvaEditor.tsx:227-280`

**Problème actuel**:
- **"Fond perdu"** (bleed) - ligne rouge 🔴
- **"Zone de sécurité"** (safe) - ligne verte 🟢
- **"Zone d'impression"** (print) - ligne bleue 🔵

**Termes incompréhensibles** pour 95% des utilisateurs:
- Qu'est-ce qu'un "fond perdu" ?
- Pourquoi 3 zones différentes ?
- Quelle zone utiliser pour mon logo ?

**Solution**:
1. Renommer avec des termes clairs
2. Ajouter des tooltips explicatifs
3. Créer une légende visuelle

---

## 💡 PLAN D'AMÉLIORATION COMPLET

### **PHASE 1: Corriger les bugs critiques**

#### ✅ **1.1 - Réparer les styles de texte prédéfinis**

**Modifications à faire**:

**A) Mettre à jour `TextTab.tsx`**:
```tsx
interface TextTabProps {
  onAddText: (options?: {
    text?: string;
    fontSize?: number;
    fontWeight?: string | number;
  }) => void;
}

// Dans le render
{TEXT_PRESETS.map(preset => (
  <button
    onClick={() => onAddText({
      text: preset.text,
      fontSize: preset.fontSize,
      fontWeight: preset.id === 'heading' ? 'bold' : 'normal'
    })}
  >
    {preset.label}
  </button>
))}
```

**B) Mettre à jour `CanvaEditor.tsx`**:
```tsx
const addText = (options?: {
  text?: string;
  fontSize?: number;
  fontWeight?: string | number;
}) => {
  const textbox = new fabric.Textbox(options?.text || 'Votre texte ici', {
    fontSize: options?.fontSize || 120,
    fontWeight: options?.fontWeight || 'normal',
    // ... autres props
  });
  // ... rest
};
```

---

#### ✅ **1.2 - Créer des thumbnails visuels pour les templates**

**Option A**: Générer des SVG inline (rapide)
```tsx
const TEMPLATE_PREVIEWS = {
  'logo-center': `
    <svg viewBox="0 0 200 200">
      <text x="100" y="100" text-anchor="middle" font-size="40" fill="#1f2937">
        LOGO
      </text>
    </svg>
  `,
  // ... autres templates
};
```

**Option B**: Capturer automatiquement depuis le canvas (meilleur)
```tsx
// Utiliser fabric.js pour rendre et exporter en dataURL
const generateThumbnail = (template: DesignTemplate) => {
  const tempCanvas = new fabric.StaticCanvas(null, {width: 200, height: 200});
  tempCanvas.loadFromJSON(template.canvas);
  return tempCanvas.toDataURL({format: 'png', multiplier: 0.2});
};
```

---

#### ✅ **1.3 - Connecter le drag & drop d'images au canvas**

**Modifier `ImagesTab.tsx`**:
```tsx
interface ImagesTabProps {
  onUploadImage: (file: File) => void;  // ✅ Passer le fichier
}

const onDrop = useCallback((acceptedFiles: File[]) => {
  if (acceptedFiles[0]) {
    onUploadImage(acceptedFiles[0]);  // ✅ Passer le fichier
  }
}, [onUploadImage]);
```

**Modifier `CanvaEditor.tsx`**:
```tsx
const handleUploadImage = (file?: File) => {
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      fabric.Image.fromURL(reader.result as string, (img) => {
        // ... ajouter au canvas
      });
    };
    reader.readAsDataURL(file);
  } else {
    fileInputRef.current?.click();
  }
};
```

---

### **PHASE 2: Améliorer l'UX des zones**

#### ✅ **2.1 - Renommer les zones avec des termes clairs**

**Avant** ❌:
- Fond perdu (bleed)
- Zone de sécurité (safe)
- Zone d'impression (print)

**Après** ✅:
- **Zone de coupe** (rouge) - "Le papier sera coupé ici"
- **Zone protégée** (verte) - "Gardez les éléments importants ici"
- **Zone de design** (bleue) - "Votre design sera visible ici"

---

#### ✅ **2.2 - Ajouter une légende explicative**

**Créer un composant `GuidesLegend.tsx`**:
```tsx
export function GuidesLegend() {
  return (
    <div className="rounded-xl border bg-white p-4">
      <h3 className="font-semibold mb-3">📐 Guide des zones</h3>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 border-2 border-red-500" />
          <span><strong>Zone de coupe</strong> - Le papier sera coupé ici</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 border-2 border-green-500" />
          <span><strong>Zone protégée</strong> - Gardez votre texte et logo ici</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 border-2 border-blue-500" />
          <span><strong>Zone visible</strong> - Tout ce qui sera imprimé</span>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-600">
        💡 Conseil: Placez les éléments importants dans la zone verte
      </p>
    </div>
  );
}
```

---

#### ✅ **2.3 - Ajouter des tooltips au survol**

**Modifier `CanvasWorkspace.tsx`** pour afficher des tooltips au survol des zones:
```tsx
<div
  onMouseEnter={() => setActiveZone('cut')}
  onMouseLeave={() => setActiveZone(null)}
  className="absolute inset-0"
>
  {activeZone === 'cut' && (
    <div className="absolute top-4 left-4 bg-black/90 text-white px-3 py-2 rounded-lg text-sm">
      🔴 Zone de coupe - Le papier sera coupé ici
    </div>
  )}
</div>
```

---

### **PHASE 3: Améliorer les templates**

#### ✅ **3.1 - Créer des templates plus riches**

**Ajouter des templates avec logos + formes**:
```tsx
const LOGO_WITH_BADGE_TEMPLATE = {
  objects: [
    // Badge circulaire
    {type: 'circle', radius: 150, fill: '#1f6f8b', /* ... */},
    // Logo placeholder au centre
    {type: 'textbox', text: 'VOTRE LOGO', fontSize: 60, fill: '#fff'},
    // Texte en dessous
    {type: 'textbox', text: 'Votre entreprise', fontSize: 30, top: 500}
  ]
};
```

**Templates à ajouter**:
1. **Badge circulaire** (pour les logos ronds)
2. **Carte de visite** (nom + fonction + contact)
3. **Étiquette produit** (nom + prix + code barre)
4. **Sticker promotionnel** (-20%, PROMO, etc.)
5. **Logo + slogan** (2 lignes de texte stylisées)

---

### **PHASE 4: Améliorer l'expérience images**

#### ✅ **4.1 - Preview avant ajout**

**Ajouter un modal de prévisualisation**:
```tsx
const [previewFile, setPreviewFile] = useState<File | null>(null);

<Modal open={!!previewFile}>
  <img src={URL.createObjectURL(previewFile)} />
  <div className="flex gap-2">
    <Button onClick={() => addImageToCanvas(previewFile)}>
      Ajouter au canvas
    </Button>
    <Button onClick={() => setPreviewFile(null)}>
      Annuler
    </Button>
  </div>
</Modal>
```

---

#### ✅ **4.2 - Recadrage automatique intelligent**

**Détecter et proposer un recadrage**:
```tsx
fabric.Image.fromURL(imageUrl, (img) => {
  // Si l'image est trop grande, proposer de la recadrer
  if (img.width > canvasConfig.width * 0.8) {
    showCropDialog(img);
  } else {
    addToCanvas(img);
  }
});
```

---

#### ✅ **4.3 - Suggestion de position**

**Proposer des positions intelligentes**:
```tsx
const suggestPosition = (img: fabric.Image) => {
  // Centrer par défaut
  const center = {
    left: canvasWidth / 2,
    top: canvasHeight / 2
  };

  // Si c'est un logo (petit), suggérer le haut
  if (img.width < canvasWidth * 0.3) {
    return {left: canvasWidth / 2, top: 150};
  }

  return center;
};
```

---

## 📋 RÉSUMÉ DES ACTIONS PRIORITAIRES

| Priorité | Action | Impact | Effort | Status |
|----------|--------|--------|--------|--------|
| 🔴 **P0** | Réparer styles de texte prédéfinis | ⭐⭐⭐⭐⭐ Critique | 30 min | ⏳ TODO |
| 🔴 **P0** | Connecter drag & drop images | ⭐⭐⭐⭐⭐ Critique | 20 min | ⏳ TODO |
| 🟠 **P1** | Renommer les zones (termes clairs) | ⭐⭐⭐⭐ Très important | 1h | ⏳ TODO |
| 🟠 **P1** | Ajouter légende des zones | ⭐⭐⭐⭐ Très important | 45 min | ⏳ TODO |
| 🟡 **P2** | Créer thumbnails templates | ⭐⭐⭐ Important | 2h | ⏳ TODO |
| 🟡 **P2** | Ajouter 5 templates riches | ⭐⭐⭐ Important | 3h | ⏳ TODO |
| 🟢 **P3** | Tooltips zones au survol | ⭐⭐ Utile | 30 min | ⏳ TODO |
| 🟢 **P3** | Preview images avant ajout | ⭐⭐ Utile | 1h | ⏳ TODO |

---

## 📅 PLANNING D'EXÉCUTION

### **Sprint 1: Bugs critiques (P0)**
**Durée estimée**: 1h
**Objectif**: Rendre les fonctionnalités de base opérationnelles

- [ ] 1.1 Réparer styles de texte prédéfinis
- [ ] 1.3 Connecter drag & drop images au canvas

### **Sprint 2: UX des zones (P1)**
**Durée estimée**: 2h
**Objectif**: Rendre les guides compréhensibles pour tous

- [ ] 2.1 Renommer les zones avec termes clairs
- [ ] 2.2 Créer et intégrer la légende des zones

### **Sprint 3: Templates visuels (P2)**
**Durée estimée**: 5h
**Objectif**: Donner des points de départ inspirants

- [ ] 1.2 Générer thumbnails pour templates existants
- [ ] 3.1 Créer 5 nouveaux templates riches

### **Sprint 4: Polish UX (P3)**
**Durée estimée**: 2h
**Objectif**: Améliorer l'expérience globale

- [ ] 2.3 Ajouter tooltips au survol
- [ ] 4.1 Preview images avant ajout
- [ ] 4.2 Recadrage intelligent
- [ ] 4.3 Suggestions de position

---

## 🎯 CRITÈRES DE SUCCÈS

### **Bugs critiques résolus**
- ✅ Cliquer sur "Titre" crée un texte à 120px en gras
- ✅ Cliquer sur "Sous-titre" crée un texte à 80px normal
- ✅ Cliquer sur "Corps" crée un texte à 50px normal
- ✅ Drag & drop d'une image l'ajoute instantanément au canvas

### **UX améliorée**
- ✅ Un utilisateur lambda comprend immédiatement où placer son logo
- ✅ La légende explique clairement chaque zone
- ✅ Les templates ont des aperçus visuels clairs
- ✅ L'upload d'image est fluide et intuitif

---

## 📝 NOTES DE DÉVELOPPEMENT

### **Dépendances**
- `fabric.js` - Canvas manipulation
- `framer-motion` - Animations
- `react-dropzone` - Drag & drop
- `lucide-react` - Icônes

### **Fichiers principaux**
- `src/components/editor/CanvaEditor.tsx` - Composant principal
- `src/components/editor/Sidebar/TextTab.tsx` - Onglet texte
- `src/components/editor/Sidebar/ImagesTab.tsx` - Onglet images
- `src/components/editor/Sidebar/TemplatesTab.tsx` - Onglet templates
- `src/lib/editor/templates.ts` - Définition des templates

### **Tests à effectuer**
1. Tester chaque style de texte prédéfini
2. Tester drag & drop sur différents formats d'image
3. Vérifier la clarté des guides avec un utilisateur non-technique
4. Tester le chargement des templates sur tous les produits

---

**Dernière mise à jour**: 2025-01-13
**Responsable**: Claude Code
**Status**: En cours d'implémentation
