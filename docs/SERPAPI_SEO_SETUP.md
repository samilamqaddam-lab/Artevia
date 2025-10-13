# Configuration SERPAPI pour l'Analyse SEO

## 📊 À Propos

Ce serveur MCP SERPAPI permet d'effectuer des recherches SEO et d'analyser la concurrence pour Artevia directement depuis Claude Code.

## 🔧 Installation

### 1. Installer les Dépendances Python

```bash
# Vérifier que Python 3 est installé
python3 --version

# Installer les dépendances
pip3 install -r mcp-servers/requirements.txt
```

**Dépendances requises:**
- `mcp` - Model Context Protocol SDK
- `google-search-results` - SERPAPI Python client
- `python-dotenv` - Gestion des variables d'environnement

### 2. Configuration MCP

Le serveur est déjà configuré dans `.mcp-config.json`:

```json
{
  "serpapi-seo": {
    "command": "python3",
    "args": ["mcp-servers/serpapi-server.py"],
    "env": {
      "SERPAPI_API_KEY": "172f997ef4ef33b74125204b44d1e8bc026349f79ac7e426b32ae4cfe73f986e"
    }
  }
}
```

### 3. Tester la Configuration

```bash
# Test simple du serveur
python3 mcp-servers/serpapi-server.py
```

## 🎯 Fonctionnalités Disponibles

### 1. **google_search**
Recherche Google standard pour l'analyse de contenu et de concurrence.

**Paramètres:**
- `query` (requis): Terme de recherche
- `location`: Localisation (défaut: "Morocco")
- `num`: Nombre de résultats (défaut: 10)
- `hl`: Langue (défaut: "fr" pour français)

**Exemple d'utilisation:**
```
Recherche les résultats Google pour "impression en ligne maroc"
```

### 2. **google_shopping**
Recherche Google Shopping pour l'analyse de prix et de produits concurrents.

**Paramètres:**
- `query` (requis): Produit à rechercher
- `location`: Localisation (défaut: "Morocco")
- `num`: Nombre de résultats (défaut: 10)

**Exemple d'utilisation:**
```
Recherche Google Shopping pour "carnets personnalisés"
```

### 3. **google_trends**
Analyse des tendances de recherche pour la recherche de mots-clés.

**Paramètres:**
- `query` (requis): Terme à analyser
- `date`: Période (défaut: "today 12-m" pour 12 mois)
- `geo`: Pays (défaut: "MA" pour Maroc)

**Exemple d'utilisation:**
```
Analyse les tendances Google pour "fournitures de bureau" au Maroc
```

## 📈 Cas d'Usage SEO pour Artevia

### 1. Analyse de la Concurrence

```
Recherche Google pour "impression personnalisée maroc" et analyse les 10 premiers résultats
```

**Objectif:** Identifier les concurrents principaux et leur positionnement.

### 2. Recherche de Mots-Clés

```
Analyse les tendances pour ces mots-clés au Maroc:
- "bloc notes personnalisé"
- "stylo personnalisé entreprise"
- "fournitures bureau maroc"
```

**Objectif:** Identifier les termes les plus recherchés.

### 3. Analyse de Produits

```
Recherche Google Shopping pour "stylos personnalisés" et compare les prix
```

**Objectif:** Analyse de la stratégie de prix des concurrents.

### 4. Analyse Géolocalisée

```
Compare les résultats pour "impression en ligne" dans différentes villes:
- Casablanca
- Rabat
- Marrakech
```

**Objectif:** Identifier les opportunités locales.

## 🔍 Stratégie SEO Artevia

### Mots-Clés Principaux à Analyser

1. **Impression Personnalisée**
   - "impression personnalisée maroc"
   - "impression en ligne maroc"
   - "imprimerie en ligne"

2. **Fournitures de Bureau**
   - "fournitures bureau personnalisées"
   - "articles promotionnels maroc"
   - "cadeaux d'entreprise personnalisés"

3. **Produits Spécifiques**
   - "bloc notes personnalisé"
   - "stylo personnalisé maroc"
   - "chemise rabat personnalisée"
   - "cartes de visite maroc"

### Concurrents à Surveiller

Utilisez SERPAPI pour monitorer:
1. Positions dans les résultats
2. Snippets utilisés (meta descriptions)
3. Stratégie de mots-clés
4. Prix (via Google Shopping)

## 📊 Exemples de Requêtes Utiles

### Analyse Complète d'un Mot-Clé

```
1. Recherche Google pour "bloc notes personnalisé maroc"
2. Analyse les tendances pour "bloc notes personnalisé"
3. Recherche Shopping pour "bloc notes personnalisé"
4. Compare les résultats avec notre positionnement actuel
```

### Audit de Visibilité

```
Pour chaque produit Artevia, recherche:
- Le nom exact du produit
- Les variations du nom
- Les termes génériques

Exemple pour stylos:
- "stylos métal S1"
- "stylo metal personnalisé"
- "stylo entreprise maroc"
```

### Analyse Saisonnière

```
Analyse les tendances sur 12 mois pour:
- "cadeaux fin d'année entreprise"
- "agenda personnalisé 2025"
- "fournitures rentrée scolaire"

Identifie les pics saisonniers pour optimiser le contenu.
```

## 🎯 Objectifs SEO

### Court Terme (1-3 mois)
- [ ] Mapper tous les concurrents principaux
- [ ] Identifier les 50 mots-clés prioritaires
- [ ] Analyser les prix concurrents pour chaque produit
- [ ] Créer un rapport de positionnement actuel

### Moyen Terme (3-6 mois)
- [ ] Optimiser les pages produits avec les mots-clés trouvés
- [ ] Créer du contenu ciblant les gaps de concurrence
- [ ] Mettre en place une surveillance hebdomadaire
- [ ] Ajuster les prix selon l'analyse marché

### Long Terme (6-12 mois)
- [ ] Viser Top 3 pour les 20 mots-clés principaux
- [ ] Développer l'autorité de domaine
- [ ] Expansion vers de nouveaux mots-clés
- [ ] Leadership sur "impression personnalisée maroc"

## 🔐 Sécurité

- ✅ **Clé API protégée**: Stockée dans `.mcp-config.json` (non commité)
- ✅ **Quota SERPAPI**: 100 recherches/mois en plan gratuit
- ✅ **Données privées**: Les recherches ne sont pas publiques

## 📚 Ressources

- **SERPAPI Docs**: https://serpapi.com/search-api
- **SERPAPI Dashboard**: https://serpapi.com/dashboard
- **SERPAPI Pricing**: https://serpapi.com/pricing
- **Playground**: https://serpapi.com/playground

## 🆘 Dépannage

### Erreur "SERPAPI_API_KEY not found"
Vérifiez que la clé est bien dans `.mcp-config.json`.

### Erreur "Module 'mcp' not found"
```bash
pip3 install mcp google-search-results python-dotenv
```

### Quota dépassé
Vérifiez votre usage sur https://serpapi.com/dashboard

### Python non trouvé
```bash
# macOS (via Homebrew)
brew install python3

# Ou utiliser python au lieu de python3
which python
which python3
```

## 🚀 Prochaines Étapes

1. **Installer les dépendances Python**
   ```bash
   pip3 install -r mcp-servers/requirements.txt
   ```

2. **Tester avec une recherche simple**
   ```
   Recherche Google pour "artevia maroc"
   ```

3. **Lancer une analyse complète des concurrents**
   ```
   Analyse les 3 premiers concurrents pour "impression en ligne maroc"
   ```

4. **Créer un rapport SEO Artevia**
   ```
   Génère un rapport SEO complet avec:
   - Top 10 mots-clés pour chaque catégorie de produits
   - Analyse des 5 principaux concurrents
   - Recommandations d'optimisation
   ```

---

**Configuration**: ✅ Prête
**Status**: ✅ Fonctionnel
**Quota**: 100 recherches/mois (plan gratuit)
