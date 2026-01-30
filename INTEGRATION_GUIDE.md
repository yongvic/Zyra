# 🔗 Zyra - Integration Guide

Complete guide for understanding how all Zyra components work together.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (User)                          │
└──────────────────────────┬──────────────────────────────────┘
                           │
                ┌────────��─┴──────────┐
                │                     │
         ┌──────▼──────┐      ┌──────▼─────────┐
         │ HTTP/HTTPS  │      │  WebSocket     │
         │ Requests    │      │  (Socket.io)   │
         │             │      │                │
    ┌────▼─────┐   ┌───▼─────────┐
    │ Next.js   │   │ Socket.io   │
    │ Frontend  │   │ Gateway     │
    │           │   │             │
    │ - Pages   │   │ - Messages  │
    │ - Forms   │   │ - Presence  │
    │ - Chat UI │   │ - Typing    │
    └────┬─────┘   └───┬─────────┘
         │             │
         └─────────────┼─────────────┐
                       │             │
        ┌───��──────────▼──────────────▼────────┐
        │         NestJS API Server            │
        │  (http://localhost:3001)             │
        │                                      │
        │  ┌────────────────────────────────┐  │
        │  │      Authentication Module     │  │
        │  │  - JWT Strategy                │  │
        │  │  - Google OAuth Strategy       │  │
        │  │  - Login/Register/Refresh      │  │
        │  └────────────────────────────────┘  │
        │                                      │
        │  ┌────────────────────────────────┐  │
        │  │      Chat Module               │  │
        │  │  - Socket.io Gateway           │  │
        │  │  - Message Persistence         │  │
        │  │  - Presence Tracking           │  │
        │  └────────────────────────────────┘  │
        │                                      │
        │  ┌────────────────────────────────┐  │
        │  │      Games Module              │  │
        │  │  - Game Logic                  │  │
        │  │  - Scoring System              │  │
        │  │  - Leaderboards               │  │
        │  └────────────────────────────────┘  │
        │                                      │
        │  ┌────────────────────────────────┐  │
        │  │      Memories Module           │  │
        │  │  - Timeline Management         │  │
        │  │  - Photo Storage               │  │
        │  │  - Categorization              │  │
        │  └────────────────────────────────┘  │
        │                                      │
        │  ┌────────────────────────────────┐  │
        │  │      Couples Module            │  │
        │  │  - Relationship Management     │  │
        │  │  - User Pairing                │  │
        │  └────────────────────────────────┘  │
        └──────────────────────┬────────────────┘
                               │
        ┌──────────────────────▼─────────────────┐
        │   Neon PostgreSQL Database             │
        │   (serverless.postgresql.neon.tech)    │
        │                                        │
        │  ┌─────────────────────────────────┐   │
        │  │ Tables:                         │   │
        │  │  • users                        │   │
        │  │  • couples                      │   │
        │  │  • chat_messages                │   │
        │  │  • games                        │   │
        │  │  • game_scores                  │   │
        │  │  • memories                     │   │
        │  │  • playlists                    │   │
        │  │  • playlist_songs               │   │
        │  │  • activity_logs                │   │
        │  └─────────────────────────────────┘   │
        └────────────────────────────────────────┘
```

## Data Flow Examples

### 1. User Registration Flow

```
Frontend (Register Page)
  │
  ├─> User fills form: name, email, password
  │
  ├─> POST /auth/register
  │
  └─> Backend (AuthService)
       ├─> Hash password with bcryptjs
       ├─> Insert user into database
       ├─> Generate JWT token
       └─> Return { access_token, user }
  
  └─> Frontend stores token & user in localStorage
      └─> Redirect to /dashboard
```

### 2. Chat Message Flow

```
User 1 (Chat Page)
  │
  ├─> Types message
  │
  ├─> Emit 'typing' via Socket.io
  │   └─> User 2 sees "typing..." indicator
  │
  ├─> Sends message via Socket.io
  │
  └─> Backend (ChatGateway)
       ├─> Receives 'message' event
       ├─> Saves to database (chat_messages)
       ├─> Broadcasts to room 'couple_{coupleId}'
       │
       └─> User 2 (Chat Page)
           ├─> Listens to 'message' event
           ├─> Displays message in chat
           └─> Updates local state
```

### 3. Game Score Update Flow

```
Frontend (Games Page)
  │
  ├─> User wins a game
  │
  ├─> POST /games/score
  │   └─> Body: { coupleId, gameType, winnerId }
  │
  └─> Backend (GamesService)
       ├─> Update/Create game_scores row
       ├─> Increment score for winner
       └─> Return updated score
  
  └─> Frontend
      └─> Updates leaderboard display
```

### 4. Memory Creation Flow

```
Frontend (Memories Page)
  │
  ├─> User fills memory form
  │   ├─ Title
  │   ├─ Description
  │   └─ Category
  │
  ├─> POST /memories
  │
  └─> Backend (MemoriesService)
       ├─> Validate input
       ├─> Insert into memories table
       ├─> Return created memory
       │
       └─> Frontend
           ├─> Add to memories list
           └─> Update UI
```

## API Endpoints Summary

### Authentication
- `POST /auth/register` - Create new account
- `POST /auth/login` - Login with email/password
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - Google OAuth callback
- `POST /auth/refresh` - Refresh JWT token

### Users
- `GET /users/:id` - Get user profile
- `GET /users` - Get all users

### Couples
- `POST /couples` - Create couple partnership
- `GET /couples` - Get couple info for user
- `GET /couples/:id` - Get couple details

### Chat
- `GET /chat/:coupleId/messages` - Get chat history
- WebSocket events:
  - `join` - Join chat room
  - `message` - Send/receive messages
  - `typing` - Typing indicator
  - `leave` - Leave chat room

### Games
- `GET /games/couple/:coupleId` - Get games
- `POST /games` - Create game
- `POST /games/score` - Update score
- `GET /games/scores/:coupleId` - Get leaderboard
- `GET /games/question/:type` - Get random question

### Memories
- `POST /memories` - Create memory
- `GET /memories/couple/:coupleId` - Get memories
- `GET /memories/:id` - Get memory details
- `PUT /memories/:id` - Update memory
- `DELETE /memories/:id` - Delete memory
- `POST /memories/playlist` - Create playlist
- `GET /memories/playlists/:coupleId` - Get playlists
- `POST /memories/playlist/:playlistId/song` - Add song

## Authentication Flow

### JWT Token Lifecycle

```
1. User logs in
   │
   └─> POST /auth/login
       └─> AuthService.login()
           ├─> Verify credentials
           ├─> Create JWT: sign({ sub: userId, email })
           └─> Return { access_token, user }

2. Frontend stores token
   │
   └─> localStorage.setItem('token', access_token)

3. Frontend makes authenticated requests
   │
   └─> Headers: Authorization: Bearer {token}

4. Backend validates token
   │
   └─> JwtStrategy.validate(payload)
       ├─> Verify signature
       ├─> Check expiration
       └─> Return user object

5. Token expires (7 days)
   │
   └─> Frontend calls POST /auth/refresh
       └─> New token issued
```

## Socket.io Events Reference

### Connection
```javascript
socket.on('connect', () => console.log('Connected'))
socket.on('disconnect', () => console.log('Disconnected'))
```

### Join/Leave
```javascript
socket.emit('join', { coupleId, userId })
socket.emit('leave', { coupleId, userId })
```

### Chat
```javascript
socket.emit('message', {
  coupleId: 'couple-id',
  senderId: 'user-id',
  message: 'Hello!'
})

socket.on('message', (message) => {
  console.log('New message:', message)
})
```

### Typing
```javascript
socket.emit('typing', {
  coupleId: 'couple-id',
  userId: 'user-id',
  isTyping: true
})

socket.on('user_typing', ({ userId, isTyping }) => {
  if (isTyping) console.log(`${userId} is typing...`)
})
```

## Database Schema Relationships

```
users
  ├─ couples (user1_id, user2_id)
  │  ├─ chat_messages (couple_id)
  │  ├─ games (couple_id)
  │  │  └─ game_scores (couple_id)
  │  ├─ memories (couple_id, created_by)
  │  └─ playlists (couple_id)
  │     └─ playlist_songs (playlist_id)
  └─ activity_logs (user_id)
```

## Performance Considerations

### Frontend Optimization
- SWR for data fetching and caching
- Component-level code splitting
- Lazy loading of pages
- Socket.io event debouncing for typing

### Backend Optimization
- Database connection pooling
- Indexed database queries
- JWT caching with Passport
- Room-based Socket.io broadcasts

### Database Optimization
- Proper indexing on foreign keys
- Connection pooling with pg
- Query optimization for timeline queries

## Security Measures

### Frontend
- JWT tokens in localStorage (secure for development)
- Protected routes with authentication check
- Input validation on forms
- CORS configured

### Backend
- Password hashing with bcryptjs (10 rounds)
- JWT signature verification
- SQL parameterized queries
- Request validation with class-validator
- CORS headers configured
- Rate limiting ready (can be added)

### Database
- Prepared statements via pg library
- User data isolation (users only see couple data)
- Timestamps for audit trail

## Deployment Checklist

### Before Production
- [ ] Set secure JWT_SECRET
- [ ] Configure Google OAuth credentials
- [ ] Setup production database (Neon)
- [ ] Update FRONTEND_URL and API endpoints
- [ ] Enable HTTPS
- [ ] Setup environment variables
- [ ] Configure CORS for production domain
- [ ] Setup logging and monitoring
- [ ] Implement rate limiting
- [ ] Setup automated backups

### Post-Deployment
- [ ] Monitor error logs
- [ ] Track performance metrics
- [ ] Setup uptime monitoring
- [ ] Configure alerting
- [ ] Regular security audits

## Troubleshooting Checklist

| Issue | Cause | Solution |
|-------|-------|----------|
| "Cannot connect to database" | DATABASE_URL invalid | Verify Neon connection string |
| "Socket.io connection failed" | Backend not running | Check if `npm run server:dev` is running |
| "401 Unauthorized" | Missing/invalid token | Check localStorage and JWT_SECRET |
| "CORS error" | Frontend/Backend URL mismatch | Verify FRONTEND_URL and API_URL |
| "User not found after login" | Login bug | Check auth.service.ts logic |

---

**Last Updated**: January 30, 2026
