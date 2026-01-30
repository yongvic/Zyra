# 💕 Zyra - Project Summary

## Overview

Zyra is a comprehensive web application designed for long-distance couples. It combines real-time communication, interactive games, memory management, and shared playlists into one cohesive platform.

## What's Been Built

### ✅ Completed

#### 1. Backend Infrastructure
- **NestJS API Server** - Modular architecture with controllers, services, and middleware
- **PostgreSQL Database** - Neon serverless database with complete schema
- **JWT Authentication** - Secure token-based auth with Google OAuth strategy
- **Socket.io Integration** - Real-time communication gateway
- **Database Modules**:
  - Users & Authentication
  - Couples Management
  - Chat Messages
  - Games & Scoring
  - Memories & Timelines
  - Playlists

#### 2. Frontend Application (Next.js 16)
- **Landing Page** - Engaging homepage with features overview
- **Authentication Pages**:
  - Login page with email/password
  - Registration page with validation
- **Dashboard System**:
  - Protected routes with authentication
  - Responsive sidebar navigation
  - Mobile-friendly menu
- **Core Pages**:
  - Dashboard home with quick actions
  - Games page with all 7 game types
  - Chat page with Socket.io integration
  - Memories/Timeline page
  - Playlist management page
  - User settings page

#### 3. Type Safety
- Complete TypeScript types for all entities
- Centralized API client with typed responses
- Type-safe Socket.io events

#### 4. Database Schema
Complete Neon PostgreSQL schema with:
- Users table with OAuth support
- Couples table for partnerships
- Chat messages with timestamps
- Games with scoring system
- Memories with categories
- Playlists with songs
- Activity logs

## Architecture

```
Frontend (Next.js 16 + React 19)
├── Landing Page (Public)
├── Auth Pages (Login/Register)
├── Dashboard (Protected)
│   ├── Home
│   ├── Games
│   ├── Chat (Socket.io)
│   ├── Memories
│   ├── Playlist
│   └── Settings
└── API Client

Backend (NestJS)
├── Auth Module (JWT + Google OAuth)
├── Users Module
├── Couples Module
├── Chat Module (Socket.io Gateway)
├── Games Module
├── Memories Module
└── Database Service

Database (Neon PostgreSQL)
├── users
├── couples
├── chat_messages
├── games
├── game_scores
├── memories
├── playlists
├── playlist_songs
└── activity_logs
```

## Key Features

### 1. Real-time Chat
- Socket.io WebSocket connection
- Message persistence in database
- Typing indicators
- User presence tracking

### 2. Game System
- 7 different games implemented (UI)
- Scoring system with leaderboard
- Question database integration
- Game history tracking

### 3. Memories & Timeline
- Create and organize memories
- Category-based organization
- Photo support (ready for image upload)
- Chronological timeline view

### 4. Shared Playlist
- Add songs from any platform
- Track who added each song
- Music discovery together
- Playlist persistence

### 5. User Management
- Profile editing
- Password management
- Notification preferences
- Couple information display

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + shadcn/ui + Tailwind CSS v4
- **Real-time**: Socket.io Client
- **State**: SWR for data fetching
- **Icons**: Lucide React
- **Type System**: TypeScript

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL (Neon)
- **Authentication**: JWT + Passport
- **Real-time**: Socket.io
- **Validation**: Class Validator
- **Password**: bcryptjs

### Database
- **Provider**: Neon (PostgreSQL Serverless)
- **Migration**: Manual SQL scripts
- **Backup**: Built-in Neon backups

## Environment Configuration

### Frontend
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend
```
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
FRONTEND_URL=http://localhost:3000
PORT=3001
NODE_ENV=development
```

## Running the Application

### Development
```bash
# Install dependencies
npm install
cd server && npm install && cd ..

# Start both frontend and backend
npm run dev

# Or separately:
# Terminal 1: npm run dev (frontend)
# Terminal 2: npm run server:dev (backend)
```

### Production
```bash
# Build frontend
npm run build

# Build backend
cd server && npm run build

# Start
npm start
```

## What's Next

### Phase 2 (Games Implementation)
- [ ] Memory matching game logic
- [ ] Truth or Dare question system
- [ ] Couple quiz with scoring
- [ ] Daily challenge system
- [ ] Number guessing game
- [ ] Spinner wheel game
- [ ] Compliments game

### Phase 3 (Enhancements)
- [ ] Google OAuth completion
- [ ] Image upload for memories
- [ ] Spotify integration for playlist
- [ ] Push notifications
- [ ] Adult mode (consensual content)
- [ ] Micro-animations & transitions
- [ ] Dark mode support

### Phase 4 (Deployment)
- [ ] Frontend deployment (Vercel)
- [ ] Backend deployment (Railway/Render)
- [ ] Database production setup
- [ ] CI/CD pipeline
- [ ] Monitoring & logging

## File Structure

```
.
├── /app                      # Next.js frontend
│   ├── layout.tsx
│   ├── page.tsx             # Landing page
│   ├── /login
│   ├── /register
│   └── /dashboard           # Protected routes
├── /server                  # NestJS backend
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   └── /modules
│   ├── package.json
│   └── tsconfig.json
├── /scripts                 # Database migrations
│   └── 01_init_schema.sql
├── /types                   # TypeScript types
├── /lib                     # Utilities
│   └── api.ts              # API client
├── /components/ui          # shadcn components
├── next.config.mjs
├── package.json
└── STARTUP_GUIDE.md        # Setup instructions
```

## Notes for Development

1. **Database Migrations**: Run SQL scripts in `/scripts` folder before starting backend
2. **Socket.io**: Ensure backend is running on port 3001 for real-time features
3. **Authentication**: JWT tokens stored in localStorage (secure for production needed)
4. **CORS**: Configured for localhost development
5. **Hot Reload**: Both frontend and backend support hot reload in dev mode

## Contributing

When adding new features:
1. Update database schema if needed
2. Create corresponding backend modules
3. Build frontend pages/components
4. Add TypeScript types
5. Update API client
6. Test authentication flow

## Resources

- [Setup Guide](./STARTUP_GUIDE.md)
- [Next.js Docs](https://nextjs.org/docs)
- [NestJS Docs](https://nestjs.com)
- [Socket.io Docs](https://socket.io/docs)
- [Neon Documentation](https://neon.tech/docs)

---

**Status**: MVP Phase 1 Complete ✅
**Next Steps**: Game Logic Implementation
**Last Updated**: January 30, 2026
