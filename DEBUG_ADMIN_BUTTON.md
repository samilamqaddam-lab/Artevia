# 🔍 Guide de Diagnostic - Bouton Admin

## Étape 1: Vérifier que vous êtes connecté

1. Allez sur `https://arteva.ma`
2. Vérifiez que vous voyez "Mon compte" et "Déconnexion" dans le header
3. Si vous ne voyez pas ces boutons, vous n'êtes pas connecté

## Étape 2: Déconnexion et Reconnexion

**C'EST LA SOLUTION LA PLUS COURANTE**

1. Cliquez sur "Déconnexion" dans le header
2. Cliquez sur "Se connecter"
3. Connectez-vous avec `sami.lamqaddam@gmail.com`
4. Une fois connecté, le bouton "Admin" devrait apparaître

**Pourquoi?** Le rôle est vérifié à la connexion. Si vous étiez déjà connecté avant le déploiement du système RBAC, votre session ne contient pas encore l'information du rôle.

## Étape 3: Vider le Cache du Navigateur

Si la déconnexion/reconnexion ne fonctionne pas:

**Chrome/Edge:**
- `Ctrl+Shift+Delete` (Windows) ou `Cmd+Shift+Delete` (Mac)
- Sélectionner "Images et fichiers en cache"
- Cliquer sur "Effacer les données"
- OU simplement: `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac)

**Firefox:**
- `Ctrl+Shift+Delete` (Windows) ou `Cmd+Shift+Delete` (Mac)
- Cocher "Cache"
- Cliquer sur "Effacer maintenant"
- OU simplement: `Ctrl+F5` (Windows) / `Cmd+Shift+R` (Mac)

## Étape 4: Tester l'API Directement

Pour diagnostiquer si le problème vient de l'API ou de l'UI:

1. Ouvrez `https://arteva.ma/api/auth/role` dans un nouvel onglet
2. **Si vous voyez:**
   ```json
   {"role":"super_admin","isAdmin":true,"userId":"..."}
   ```
   ✅ L'API fonctionne! Le problème vient du cache du navigateur.

3. **Si vous voyez:**
   ```json
   {"role":null,"isAdmin":false}
   ```
   ❌ Vous n'êtes pas connecté OU votre session n'a pas encore le rôle.
   → Solution: Déconnectez-vous et reconnectez-vous

## Étape 5: Vérifier le Déploiement Vercel

1. Allez sur https://vercel.com/samilamqaddam-labs-projects/artevia/deployments
2. Vérifiez que le dernier déploiement (commit `7ee36f3` ou plus récent) est marqué "Ready"
3. Si le déploiement est encore "Building", attendez qu'il soit terminé

## Étape 6: Mode Navigation Privée (Test Ultime)

Si rien ne fonctionne:

1. Ouvrez une fenêtre de navigation privée
2. Allez sur `https://arteva.ma`
3. Connectez-vous avec `sami.lamqaddam@gmail.com`
4. Le bouton "Admin" devrait apparaître

**Si ça fonctionne en navigation privée**, le problème était le cache. Videz le cache de votre navigateur normal.

## À Quoi Ressemble le Bouton Admin

Le bouton devrait apparaître entre l'icône panier et "Mon compte":

```
[🛒] [Admin] [Mon compte] [Déconnexion]
        ↑
   Bouton orange
```

## Besoin d'Aide?

Si après toutes ces étapes le bouton n'apparaît toujours pas:

1. Partagez le résultat de: `https://arteva.ma/api/auth/role`
2. Partagez une capture d'écran du header
3. Indiquez avec quel email vous êtes connecté
