# 🚀 Zyra - Quick Start (5 minutes)

## Prerequisites
```bash
node --version  # Should be 18 or higher
npm --version   # Should be 9 or higher
```

## Step 1: Setup Database (2 minutes)

### Create Neon Account
1. Go to https://neon.tech and create a free account
2. Create a new project
3. Copy your `DATABASE_URL` from the connection string
   - It looks like: `postgresql://user:pass@host/dbname`

## Step 2: Environment Configuration (1 minute)

### Backend (.env.local)
Create `server/.env.local`:
```env
DATABASE_URL=postgresql://your_neon_url_here
JWT_SECRET=your_super_secret_key_change_this
FRONTEND_URL=http://localhost:3000
PORT=3001
NODE_ENV=development
```

### Frontend (.env.local)
Create `.env.local` in root:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Step 3: Install Dependencies (1 minute)

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

## Step 4: Start the App (1 minute)

```bash
# Start both frontend and backend
npm run dev
```

You should see:
```
✓ Ready on http://localhost:3000
🚀 Zyra Server running on http://localhost:3001
```

## 🎯 First Steps

### 1. Register Account
- Go to http://localhost:3000
- Click "S'inscrire" (Sign up)
- Fill in: name, email, password
- You're logged in! 🎉

### 2. Explore Dashboard
- Click on "Games", "Chat", "Memories", "Playlist"
- All pages are interactive

### 3. Test Chat (Real-time)
- Open in another browser window
- Send messages
- See real-time updates ✨

## 📱 Testing Tips

### Test on Mobile
```bash
# Get your local IP
ipconfig getifaddr en0  # Mac
# or
hostname -I  # Linux

# Open on phone: http://YOUR_IP:3000
```

### Test Socket.io
Open DevTools (F12) → Network → WS
- Look for `/socket.io` connection
- Should show green (connected)

### Test API
```bash
# Get auth token from localStorage
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🆘 Troubleshooting

| Error | Solution |
|-------|----------|
| `Error: connect ECONNREFUSED` | Backend not running → `npm run server:dev` |
| `DATABASE_URL not found` | Add to `server/.env.local` |
| `Cannot GET /dashboard` | Login first → Visit http://localhost:3000/login |
| `Socket.io connection failed` | Check backend is on port 3001 |
| `Port 3000 already in use` | `lsof -i :3000` then kill process |

## 📚 Next Resources

- **Setup Details**: Read `STARTUP_GUIDE.md`
- **Architecture**: Read `INTEGRATION_GUIDE.md`
- **Project Overview**: Read `PROJECT_SUMMARY.md`
- **Full Summary**: Read `COMPLETION_SUMMARY.md`

## 🎮 Try These Features

### Chat (Real-time)
1. Go to `/dashboard/chat`
2. Type a message
3. See it appear instantly ⚡

### Games
1. Go to `/dashboard/games`
2. Click any game to see details
3. Scoreboard at bottom

### Memories
1. Go to `/dashboard/memories`
2. Click "Ajouter un souvenir"
3. Create your first memory

### Playlist
1. Go to `/dashboard/playlist`
2. Click "Ajouter une chanson"
3. Add your favorite songs

## 💡 Pro Tips

- Clear localStorage if having auth issues: `localStorage.clear()`
- Check backend logs for API errors
- Use DevTools Network tab to see API calls
- Socket.io status is shown in chat page ("🟢 Connecté")

## 🔧 Development Commands

```bash
# Frontend only
npm run dev

# Backend only
npm run server:dev

# Build everything
npm run build

# Start production
npm start

# Backend commands
cd server
npm run start:dev      # Dev mode
npm run build          # Build
npm run start          # Production
```

## 🌐 URLs Cheat Sheet

| Page | URL |
|------|-----|
| Landing | http://localhost:3000 |
| Login | http://localhost:3000/login |
| Register | http://localhost:3000/register |
| Dashboard | http://localhost:3000/dashboard |
| Games | http://localhost:3000/dashboard/games |
| Chat | http://localhost:3000/dashboard/chat |
| Memories | http://localhost:3000/dashboard/memories |
| Playlist | http://localhost:3000/dashboard/playlist |
| Settings | http://localhost:3000/dashboard/settings |
| API | http://localhost:3001 |
| Health Check | http://localhost:3001/health |

## ✅ Success Checklist

- [ ] Database connection working
- [ ] Frontend loads on port 3000
- [ ] Backend running on port 3001
- [ ] Can register new account
- [ ] Can login successfully
- [ ] Dashboard loads with quick actions
- [ ] Chat page connects via Socket.io
- [ ] All navigation works

## 🎉 You're Ready!

Now you have a fully functional couples app. Next steps:

1. **Customize**: Add your own features
2. **Deploy**: Follow deployment guide in STARTUP_GUIDE.md
3. **Extend**: Add game logic, integrations, etc.

---

**Questions?** Check the documentation files or console logs for errors.

**Happy coding! 💕**
