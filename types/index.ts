// Shared types aligned with the NestJS API + Prisma model field names (camelCase)

export interface User {
  id: string;
  email: string;
  name: string;
  provider: 'local' | 'google';
  googleId?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  birthDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Couple {
  id: string;
  userOneId: string;
  userTwoId: string;
  anniversaryDate?: string | null;
  coupleName?: string | null;
  coupleAvatarUrl?: string | null;
  inviteCode?: string | null;
  inviteAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  coupleId: string;
  senderId: string;
  content: string;
  messageType: 'text' | 'image' | 'emoji';
  mediaUrl?: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface Game {
  id: string;
  coupleId: string;
  gameType: string;
  currentRound: number;
  isActive: boolean;
  gameData?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}

export interface GameScore {
  id: string;
  gameId: string;
  coupleId: string;
  playerId: string;
  score?: number | null;
  answers?: any | null;
  completedAt?: string | null;
  createdAt: string;
}

export interface Memory {
  id: string;
  coupleId: string;
  creatorId: string;
  title: string;
  description?: string | null;
  memoryDate?: string | null;
  mediaUrls: string[];
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Playlist {
  id: string;
  coupleId: string;
  title: string;
  description?: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlaylistSong {
  id: string;
  playlistId: string;
  spotifyId?: string | null;
  songTitle: string;
  artistName: string;
  albumName?: string | null;
  durationMs?: number | null;
  addedBy: string;
  addedAt: string;
}

// Auth Types
export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// Socket.io Events
export interface SocketMessage {
  coupleId: string;
  senderId: string;
  message: string;
}

export interface SocketTyping {
  coupleId: string;
  userId: string;
  isTyping: boolean;
}

export interface SocketJoin {
  coupleId: string;
  userId: string;
}
