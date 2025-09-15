# Project_FormationEnligne

Plateforme de formation en ligne avec gestion des cours, vidéos, documents et espace étudiant/admin.

## Fonctionnalités principales
- Frontend React (SPA) avec Nginx pour la production
- Backend FastAPI (Python) avec base de données MySQL
- Authentification et gestion des utilisateurs (étudiants, admin)
- Lecture vidéo sécurisée, documents PDF, annonces
- Système de modules/cours, progression, statistiques

## Structure du projet
- `frontend/` : Application React (interface utilisateur)
- `backend-fastapi/` : API FastAPI (Python)
- `init_db/` : Scripts SQL d'initialisation de la base
- `scripts/` : Scripts de migration et maintenance (optionnel)
- `docker-compose.yml` : Orchestration des services (prod/dev)

## Lancement rapide (production)
1. Cloner le projet
2. Configurer les variables dans `docker-compose.yml`
3. Lancer :
   ```
   docker-compose up --build
   ```
4. Accéder à l'app :
   - Frontend : http://localhost:3000
   - Backend API : {API_URL}

## Développement
- Utiliser `docker-compose.dev.yml` pour le hot reload
- Modifier le code dans `frontend/` ou `backend-fastapi/`

## Configuration Nginx (frontend)
Voir `frontend/nginx.conf` pour la configuration recommandée.

## Sécurité
- Les vidéos sont protégées contre le téléchargement et la capture
- Authentification JWT côté backend

## Auteur
Yassine El Barni & Collaborateurs

## Licence
Projet privé, usage interne uniquement.