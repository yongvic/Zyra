// lib/api.ts

const getApiBaseUrl = () => {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:3001'
  );
};

async function request(endpoint: string, options: RequestInit = {}) {
  const url = `${getApiBaseUrl()}${endpoint}`;
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 204) return null;

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const payload = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const message =
        typeof payload === 'object' && payload && 'message' in payload
          ? (payload as any).message
          : 'Request failed';
      return Promise.reject({ ...(payload as any), message });
    }

    return payload;
  } catch (error: any) {
    console.error('API request error:', error);
    return Promise.reject({ message: error.message || 'Network error' });
  }
}

const get = (endpoint: string, options?: RequestInit) =>
  request(endpoint, { ...options, method: 'GET' });

const post = (endpoint: string, body: any, options?: RequestInit) =>
  request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });

const put = (endpoint: string, body: any, options?: RequestInit) =>
  request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });

const del = (endpoint: string, options?: RequestInit) =>
  request(endpoint, { ...options, method: 'DELETE' });

const api = {
  request,
  get,
  post,
  put,
  delete: del,

  auth: {
    login: (email: string, password: string) => post('/auth/login', { email, password }),
    register: (email: string, password: string, name: string) =>
      post('/auth/register', { email, password, name }),
    changePassword: (current: string, newPassword: string) =>
      post('/auth/change-password', { current, new: newPassword }),
    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('coupleId');
      }
    },
  },

  users: {
    me: () => get('/users/me'),
    list: () => get('/users'),
    getById: (id: string) => get(`/users/${id}`),
    updateMe: (data: { name?: string; email?: string }) => put('/users/me', data),
  },

  couples: {
    getMine: () => get('/couples'),
    create: (userId2: string, coupleName: string) => post('/couples', { userId2, coupleName }),
    inviteByEmail: (partnerEmail: string, coupleName: string) =>
      post('/couples/invite', { partnerEmail, coupleName }),
    getById: (id: string) => get(`/couples/${id}`),
  },

  chat: {
    getMessages: (coupleId: string) => get(`/chat/${coupleId}/messages`),
  },

  games: {
    listByCouple: (coupleId: string) => get(`/games/couple/${coupleId}`),
    create: (coupleId: string, gameType: string, gameData: any) =>
      post('/games', { coupleId, gameType, gameData }),
    updateScore: (coupleId: string, gameType: string, winnerId: string) =>
      post('/games/score', { coupleId, gameType, winnerId }),
    scores: (coupleId: string) => get(`/games/scores/${coupleId}`),
  },

  memories: {
    listByCouple: (coupleId: string) => get(`/memories/couple/${coupleId}`),
    create: (data: {
      coupleId: string;
      title: string;
      description?: string;
      imageUrl?: string;
      category?: string;
    }) => post('/memories', data),
    update: (id: string, data: any) => put(`/memories/${id}`, data),
    delete: (id: string) => del(`/memories/${id}`),

    playlists: (coupleId: string) => get(`/memories/playlists/${coupleId}`),
    createPlaylist: (data: { coupleId: string; title: string; description?: string }) =>
      post('/memories/playlist', data),
    addSong: (
      playlistId: string,
      data: { songUrl: string; title?: string; artist?: string },
    ) => post(`/memories/playlist/${playlistId}/song`, data),
    songs: (playlistId: string) => get(`/memories/playlist/${playlistId}/songs`),
    deleteSong: (songId: string) => del(`/memories/playlist/song/${songId}`),
  },
};

export default api;