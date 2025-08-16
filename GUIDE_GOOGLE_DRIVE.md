# Guide d'utilisation des vidéos Google Drive

Ce guide vous explique comment utiliser Google Drive pour héberger et partager vos vidéos de formation sur notre plateforme.

## Pourquoi Google Drive ?

Google Drive offre plusieurs avantages par rapport à YouTube :
- Contrôle total sur vos vidéos
- Protection de la propriété intellectuelle
- Pas de publicités
- Pas de recommandations automatiques
- Limitations réduites concernant la durée des vidéos

## Préparation de vos vidéos sur Google Drive

### 1. Organiser vos dossiers

1. **Créez un dossier principal** pour votre formation dans Google Drive
   - Exemple : "Formation Python Débutant"

2. **Structurez vos vidéos** à l'intérieur de ce dossier (optionnel)
   - Vous pouvez créer des sous-dossiers par module ou par thème

### 2. Configurer le partage des vidéos

Pour chaque vidéo que vous souhaitez utiliser dans la plateforme :

1. **Cliquez avec le bouton droit** sur le fichier vidéo
2. Sélectionnez **Partager**
3. Cliquez sur **"Tous les utilisateurs disposant du lien"**
4. Définissez les permissions sur **"Visionneur"**
5. Cliquez sur **"Copier le lien"**

### 3. Récupérer l'ID du dossier (pour les cours)

Pour ajouter l'ID du dossier Google Drive à votre cours :

1. Ouvrez le dossier Google Drive contenant vos vidéos
2. Observez l'URL dans votre navigateur
3. L'ID du dossier est la partie après "/folders/" dans l'URL
   - Exemple : `https://drive.google.com/drive/folders/`**`1ABCxyz123456789`**

## Ajout de vidéos dans la plateforme

### Ajouter un cours avec dossier Google Drive

1. Dans la section admin, cliquez sur **"Ajouter un cours"**
2. Remplissez les informations du cours
3. Dans le champ **"ID Dossier Google Drive"**, collez l'ID du dossier Google Drive
4. Cliquez sur **"Créer le cours"**

### Ajouter des vidéos depuis Google Drive

1. Accédez à un cours existant
2. Cliquez sur **"Ajouter Vidéo"**
3. Remplissez le titre et la description de la vidéo
4. Dans le champ **"URL Google Drive"**, collez le lien de partage de votre vidéo
   - Format : `https://drive.google.com/file/d/VOTRE_ID_FICHIER/view?usp=sharing`
5. Cliquez sur **"Ajouter"**

## Résolution des problèmes courants

### La vidéo ne s'affiche pas

- Vérifiez que le lien de partage est correctement configuré (accessible à tous les utilisateurs disposant du lien)
- Assurez-vous que l'URL est au format correct
- Essayez de copier à nouveau le lien de partage depuis Google Drive

### Message "URL Google Drive invalide"

- Assurez-vous d'utiliser un lien direct vers un fichier vidéo (commençant par `https://drive.google.com/file/d/`)
- Les liens vers des dossiers ou d'autres types de documents ne fonctionneront pas pour les vidéos individuelles

### Problème de lecture des vidéos

- Certains formats vidéo peuvent ne pas être compatibles avec la lecture dans le navigateur
- Formats recommandés : MP4 avec codec H.264
- Taille maximale recommandée : 2 Go par vidéo

## Astuces pour une meilleure expérience

- Utilisez des vidéos de résolution 720p ou 1080p pour un bon équilibre entre qualité et performance
- Compressez vos vidéos avant de les télécharger sur Drive pour réduire les temps de chargement
- Donnez des noms clairs à vos fichiers vidéo pour faciliter leur organisation
- Créez une miniature personnalisée pour chaque vidéo et ajoutez-la dans la plateforme
