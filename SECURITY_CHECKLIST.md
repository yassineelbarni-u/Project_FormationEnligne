# 🔒 CHECKLIST SÉCURITÉ - GOOGLE OAUTH

## ✅ Tests de Sécurité à Effectuer

### 1. **Test des Tokens**
```bash
# Tester avec un faux token
curl -X POST http://localhost:8001/api/auth/google-login \
  -H "Content-Type: application/json" \
  -d '{"credential": "fake_token"}'
# ✅ Doit retourner 401 Unauthorized
```

### 2. **Test Email Non Autorisé**
- Se connecter avec un email Gmail non présent en BDD
- ✅ Doit retourner "Email non autorisé"

### 3. **Test Expiration JWT**
- Se connecter et attendre 1h
- ✅ Token doit expirer automatiquement

### 4. **Test CORS**
```bash
# Tester depuis un autre domaine
curl -H "Origin: http://malicious-site.com" \
     -H "Access-Control-Request-Method: POST" \
     http://localhost:8001/api/auth/google-login
# ✅ Doit être bloqué
```

## 🔐 Bonnes Pratiques Implémentées

1. **Validation côté serveur** du token Google
2. **Whitelist d'emails** en base de données
3. **JWT avec expiration courte** (1h)
4. **Variables d'environnement** pour les secrets
5. **CORS restreint** à localhost:3000
6. **Vérification de l'audience** Google

## ⚠️ Recommandations Production

1. **HTTPS OBLIGATOIRE**
2. **Rate Limiting** (max 5 tentatives/minute)
3. **Logs de sécurité** détaillés
4. **Monitoring des tentatives** de connexion
5. **Backup chiffré** de la base de données

## 🚫 Ce que Google NE peut PAS faire

- ❌ Lire vos emails Gmail
- ❌ Envoyer des emails en votre nom
- ❌ Accéder à vos contacts
- ❌ Modifier votre compte Google
- ❌ Voir vos autres applications Google

## ✅ Ce que Google fournit SEULEMENT

- ✅ Email de l'utilisateur
- ✅ Nom complet
- ✅ Photo de profil
- ✅ Confirmation que l'email est vérifié
