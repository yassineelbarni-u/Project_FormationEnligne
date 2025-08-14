# Images pour la Section Annonces

## Images nécessaires dans `public/images/` :

1. **preparation_examane.png** - ✅ Déjà existant
2. **setien.png** - À ajouter (cours de soutien)
3. **cours-physique-chimie.png** - À ajouter 
4. **cours-informatique.png** - À ajouter

## Images alternatives temporaires :

Si vous n'avez pas ces images, vous pouvez utiliser :
- Des images placeholder
- Des images similaires que vous avez déjà
- Modifier le tableau `annonceImages` dans `Annonce.js` pour utiliser vos images existantes

## Modification du carrousel :

Pour utiliser vos propres images, modifiez le tableau dans `/components/sections/Annonce.js` :

```javascript
const annonceImages = [
  {
    src: "/images/votre-image-1.png",
    alt: "Description de votre cours",
  },
  {
    src: "/images/votre-image-2.png", 
    alt: "Description de votre cours",
  },
  // ... ajoutez plus d'images selon vos besoins
]
```

## Caractéristiques :

- **Auto-rotation** : 4 secondes comme demandé
- **Navigation manuelle** : Flèches gauche/droite
- **Indicateurs** : Points en bas pour navigation directe
- **Compteur** : Affiche image actuelle / total
- **Pause au survol** : L'auto-rotation s'arrête quand on survole
- **Bouton WhatsApp** : Contact direct pour inscription
