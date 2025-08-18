# Utiliser une image Python officielle
FROM python:3.12-slim

# Installer dépendances système utiles (ex: curl, nc)
RUN apt-get update && apt-get install -y curl netcat-openbsd && rm -rf /var/lib/apt/lists/*

# Définir le dossier de travail
WORKDIR /app

# Copier requirements
COPY requirements.txt .

# Installer les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code backend
COPY . .

# Exposer le port FastAPI
EXPOSE 8001

# Script d’attente pour MySQL
COPY ./wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Lancer Uvicorn en attendant que MySQL soit prêt
CMD /wait-for-it.sh db 3306 -- uvicorn app.main:app --host 0.0.0.0 --port 8001
