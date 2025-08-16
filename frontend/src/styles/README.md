# Architecture CSS du projet

Ce document explique comment les styles CSS sont organisés dans le projet pour éviter les conflits.

## Hiérarchie des fichiers CSS

Les fichiers CSS sont chargés dans un ordre spécifique pour éviter les conflits :

1. **reset.css** - Réinitialise tous les styles par défaut des navigateurs
2. **variables.css** - Définit toutes les variables CSS globales
3. **index.css** - Styles généraux pour toute l'application
4. **globals.css** - Styles partagés entre composants
5. **App.css** - Styles spécifiques à App.js
6. **Component.css** - Styles spécifiques aux composants

## Bonnes pratiques pour éviter les conflits

1. **Ne pas dupliquer les réinitialisations** - Utilisez uniquement les réinitialisations dans reset.css
2. **Utiliser les variables CSS** - Référencez les variables de variables.css au lieu de hardcoder les valeurs
3. **Nommage spécifique** - Préfixez vos classes CSS pour éviter les collisions (ex: login-container, admin-panel)
4. **Classes CSS modulaires** - Utilisez des noms de classes spécifiques et évitez les sélecteurs génériques

## Conflits courants et comment les éviter

1. **Reset CSS dupliqués** - N'ajoutez pas de resets dans les fichiers CSS des composants
2. **Styles génériques** - Évitez de styler directement les éléments HTML comme "div", "p", "a" sans classe
3. **Variables dupliquées** - N'utilisez que les variables définies dans variables.css
4. **Ordre d'importation** - Respectez l'ordre d'importation des CSS (du plus générique au plus spécifique)
