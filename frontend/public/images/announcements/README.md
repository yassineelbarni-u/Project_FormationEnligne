# Dossier des Annonces

Ce dossier contient les images des annonces uploadées par les super admins.

## Comment ça fonctionne :

1. **Super Admin** : Upload une image via l'interface admin
2. **Backend** : Sauvegarde l'image dans `backend-fastapi/frontend/public/images/announcements/`
3. **Frontend** : Affiche l'image via l'URL `http://localhost:3000/images/announcements/nom-fichier.jpg`

## Types de fichiers acceptés :
- JPG/JPEG
- PNG
- GIF
- WebP

## Utilisé dans :
- Page d'accueil (carrousel)
- Page "Nos Cours" (grille de cartes)
- Interface d'administration
