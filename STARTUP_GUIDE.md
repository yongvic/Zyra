# 🚀 Zyra - Guide de Démarrage

Bienvenue dans Zyra, l'application ultime pour les couples à distance!

## Architecture

Le projet utilise une architecture moderne avec:
- **Frontend**: Next.js 16 + React 19 (App Router)
- **Backend**: NestJS + PostgreSQL
- **Real-time**: Socket.io pour le chat
- **Database**: Neon (PostgreSQL serverless)
- **Authentication**: JWT + Google OAuth

## Configuration Initiale

### 1. Variables d'Environnement

#### Frontend (`.env.local` à la racine)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### Backend (`server/.env.local`)
```
DATABASE_URL=postgresql://user:password@host/dbname
JWT_SECRET=your_super_secret_jwt_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
FRONTEND_URL=http://localhost:3000
PORT=3001
NODE_ENV=development
```

### 2. Setup Neon Database

1. Créez un projet Neon sur https://neon.tech
2. Récupérez votre `DATABASE_URL`
3. Collez-la dans `server/.env.local`

### 3. Configuration Google OAuth (Optionnel pour le MVP)

1. Allez sur https://console.cloud.google.com
2. Créez un nouveau projet
3. Activez l'API "Google+ API"
4. Créez des identifiants OAuth 2.0
5. Ajoutez les credentials dans `server/.env.local`

## Installation et Lancement

### Option 1: Installation Globale (Recommandé)

```bash
# 1. Installer les dépendances du frontend
npm install

# 2. Installer les dépendances du backend
cd server && npm install && cd ..

# 3. Lancer l'application complète
npm run dev
```

Le script `npm run dev` lancera en parallèle:
- Next.js sur http://localhost:3000
- NestJS sur http://localhost:3001

### Option 2: Lancer les Services Séparément

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run server:dev
```

## Structure du Projet

```
.
├── /app                    # Frontend Next.js
│   ├── /dashboard         # Pages protégées
│   ├── /login            # Authentification
│   ├── /register         # Inscription
│   └── page.tsx          # Landing page
├── /server                # Backend NestJS
│   ├── /src
│   │   ├── /modules      # Modules NestJS
│   │   │   ├── /auth    # Authentification
│   │   │   ├── /chat    # Chat WebSocket
│   │   │   ├── /games   # Jeux
│   │   │   ├── /memories # Souvenirs
│   │   │   └── /couples  # Gestion couples
│   │   ├── /database    # Configuration DB
│   │   └── main.ts      # Point d'entrée
│   └── package.json
├── /scripts               # Scripts de migration DB
└── /components/ui        # Composants shadcn/ui
```

## Fonctionnalités Implémentées

### MVP Phase 1 ✅

- [x] Landing page
- [x] Authentification (Email/Password)
- [x] Dashboard
- [x] Chat temps réel (Socket.io)
- [x] Système de jeux (UI)
- [x] Mur des souvenirs
- [x] Playlist partagée
- [x] Paramètres utilisateur

### À Implémenter

- [ ] Jeux interactifs (logique complète)
- [ ] Mode adulte
- [ ] Intégration Google OAuth
- [ ] Notifications push
- [ ] Synchronisation des données
- [ ] Déploiement production

## Utilisation de l'API

### Authentification

```bash
# S'inscrire
POST /auth/register
Body: { email, password, name }

# Se connecter
POST /auth/login
Body: { email, password }

# Callback Google
GET /auth/google/callback
```

### Chat (Socket.io)

```javascript
const socket = io('http://localhost:3001');

// Rejoindre une conversation
socket.emit('join', { coupleId, userId });

// Envoyer un message
socket.emit('message', { coupleId, senderId, message });

// Écouter les messages
socket.on('message', (message) => {
  console.log('Nouveau message:', message);
});

// Signaler la dactylographie
socket.emit('typing', { coupleId, userId, isTyping });
```

### API REST

```bash
# Récupérer les jeux d'un couple
GET /games/couple/:coupleId
Headers: Authorization: Bearer {token}

# Créer un souvenir
POST /memories
Body: { coupleId, createdBy, title, description }
Headers: Authorization: Bearer {token}

# Récupérer les souvenirs
GET /memories/couple/:coupleId
Headers: Authorization: Bearer {token}
```

## Déploiement

### Frontend (Vercel)
```bash
npm run build
# Déployer via git push
```

### Backend (Railway/Render/Heroku)
```bash
cd server
npm run build
npm run start
```

Assurez-vous de configurer les variables d'environnement sur la plateforme.

## Troubleshooting

### Erreur: "Cannot GET /dashboard"
→ Assurez-vous que vous êtes authentifié (token dans localStorage)

### Erreur: "Socket.io connection failed"
→ Vérifiez que le backend (port 3001) est en cours d'exécution

### Erreur: "DATABASE_URL not found"
→ Assurez-vous que `server/.env.local` contient `DATABASE_URL`

### Erreur: "Tables not found"
→ Exécutez la migration: `npm run server:build` puis lancez le server

## Ressources

- [Next.js Docs](https://nextjs.org)
- [NestJS Docs](https://nestjs.com)
- [Socket.io Docs](https://socket.io)
- [Neon Docs](https://neon.tech/docs)
- [shadcn/ui](https://ui.shadcn.com)

## Support

Pour toute question ou problème:
1. Vérifiez le guide de troubleshooting
2. Consultez les logs du terminal
3. Ouvrez une issue sur le repo

---

**Bon développement! 💕**
