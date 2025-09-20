# Étape 1 : Build React
FROM node:18 AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : Serveur Nginx pour les fichiers statiques
FROM nginx:alpine

# Copier les fichiers buildés dans nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copier le nginx.conf personnalisé (prod avec HTTPS)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80 (HTTP interne) - Nginx redirige vers HTTPS via Certbot
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
