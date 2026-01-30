// API client for frontend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = {
  // Auth
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error('Login failed');
      return response.json();
    },

    register: async (email: string, password: string, name: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      if (!response.ok) throw new Error('Registration failed');
      return response.json();
    },

    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    getToken: () => localStorage.getItem('token'),
    getUser: () => {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    },
  },

  // Couples
  couples: {
    getByUser: async (token: string) => {
      const response = await fetch(`${API_BASE_URL}/couples`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch couple');
      return response.json();
    },

    create: async (token: string, userId2: string, coupleName: string) => {
      const response = await fetch(`${API_BASE_URL}/couples`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId2, coupleName }),
      });
      if (!response.ok) throw new Error('Failed to create couple');
      return response.json();
    },
  },

  // Chat
  chat: {
    getMessages: async (token: string, coupleId: string) => {
      const response = await fetch(`${API_BASE_URL}/chat/${coupleId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch messages');
      return response.json();
    },
  },

  // Games
  games: {
    getByCouple: async (token: string, coupleId: string) => {
      const response = await fetch(`${API_BASE_URL}/games/couple/${coupleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch games');
      return response.json();
    },

    getScores: async (token: string, coupleId: string) => {
      const response = await fetch(`${API_BASE_URL}/games/scores/${coupleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch scores');
      return response.json();
    },

    getQuestion: async (token: string, questionType: string) => {
      const response = await fetch(`${API_BASE_URL}/games/question/${questionType}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch question');
      return response.json();
    },

    updateScore: async (token: string, coupleId: string, gameType: string, winnerId: string) => {
      const response = await fetch(`${API_BASE_URL}/games/score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ coupleId, gameType, winnerId }),
      });
      if (!response.ok) throw new Error('Failed to update score');
      return response.json();
    },
  },

  // Memories
  memories: {
    getByCouple: async (token: string, coupleId: string) => {
      const response = await fetch(`${API_BASE_URL}/memories/couple/${coupleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch memories');
      return response.json();
    },

    create: async (token: string, data: any) => {
      const response = await fetch(`${API_BASE_URL}/memories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create memory');
      return response.json();
    },

    delete: async (token: string, memoryId: string) => {
      const response = await fetch(`${API_BASE_URL}/memories/${memoryId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete memory');
      return response.json();
    },

    getPlaylists: async (token: string, coupleId: string) => {
      const response = await fetch(`${API_BASE_URL}/memories/playlists/${coupleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch playlists');
      return response.json();
    },

    createPlaylist: async (token: string, coupleId: string, name: string, description?: string) => {
      const response = await fetch(`${API_BASE_URL}/memories/playlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ coupleId, name, description }),
      });
      if (!response.ok) throw new Error('Failed to create playlist');
      return response.json();
    },
  },
};
