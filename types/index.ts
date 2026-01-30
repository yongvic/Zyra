// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  provider: 'local' | 'google';
  google_id?: string;
  created_at: string;
  updated_at?: string;
}

// Couple Types
export interface Couple {
  id: string;
  user1_id: string;
  user2_id: string;
  name: string;
  created_at: string;
  updated_at?: string;
}

// Chat Types
export interface ChatMessage {
  id: string;
  couple_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'emoji';
  created_at: string;
}

// Game Types
export interface Game {
  id: string;
  couple_id: string;
  game_type: string;
  data: Record<string, any>;
  created_at: string;
}

export interface GameScore {
  id: string;
  couple_id: string;
  game_type: string;
  winner_id: string;
  score: number;
  created_at: string;
}

// Memory Types
export interface Memory {
  id: string;
  couple_id: string;
  created_by: string;
  title: string;
  description: string;
  image_url?: string;
  category: string;
  created_at: string;
  updated_at?: string;
}

// Playlist Types
export interface Playlist {
  id: string;
  couple_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

export interface PlaylistSong {
  id: string;
  playlist_id: string;
  song_url: string;
  created_at: string;
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
