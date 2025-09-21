# Utiliser une image Python officielle
FROM python:3.12-slim

# Installer dépendances système utiles
RUN apt-get update && apt-get install -y curl netcat-openbsd && rm -rf /var/lib/apt/lists/*

# Définir le dossier de travail
WORKDIR /app

# Copier les requirements et installer les dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier tout le code du backend
COPY . .

# Copier le script wait-for-it.sh et le rendre exécutable
COPY ./wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Attendre que MySQL soit prêt avant d'exécuter le script
RUN /wait-for-it.sh mysql_db:3306 -- python -m app.create_super_admin

# Ajouter le répertoire de travail au PYTHONPATH
ENV PYTHONPATH="/app"

# Exposer le port FastAPI
EXPOSE 8001

# Lancer Uvicorn en attendant que MySQL soit prêt
CMD ["/wait-for-it.sh", "mysql_db", "3306", "--", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]