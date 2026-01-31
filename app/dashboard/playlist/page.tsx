'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Music, Plus, Play, Trash2 } from 'lucide-react';
import api from '@/lib/api'; // Import the API client

interface Song {
  id: string; // This will be the playlist_song ID from backend, or a temp ID for client-side display
  title: string;
  artist: string;
  url: string; // Stored in backend as spotifyId for now
  addedBy: string; // Client-side for display, not directly from backend yet
  addedAt: string; // From backend addedAt for playlist_song
}

interface Playlist {
  id: string;
  coupleId: string;
  title: string;
  description?: string | null;
  createdAt: string;
}

export default function PlaylistPage() {
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    url: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const coupleId = typeof window !== 'undefined' ? localStorage.getItem('coupleId') : null;
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};

  // Fetch playlists and initialize/create a default one
  useEffect(() => {
    const initPlaylist = async () => {
      if (!coupleId) {
        setError('Couple ID not found. Please ensure you are paired with a partner.');
        setIsLoading(false);
        return;
      }

      try {
        const playlists = await api.memories.playlists(coupleId);
        let playlistToUse: Playlist;

        if (playlists && playlists.length > 0) {
          // Use the first playlist found, or implement logic to choose a specific one
          playlistToUse = playlists[0];
          console.log('Using existing playlist:', playlistToUse);
        } else {
          // No playlists found, create a default one
          playlistToUse = await api.memories.createPlaylist({
            coupleId,
            title: 'Ma Playlist de Couple',
            description: 'Notre playlist partagée par défaut',
          });
          console.log('Created new default playlist:', playlistToUse);
        }
        setCurrentPlaylist(playlistToUse);
        localStorage.setItem('currentPlaylistId', playlistToUse.id); // Store for future use

        // Fetch songs for the selected playlist
        const playlistSongs = await api.memories.songs(playlistToUse.id);
        setSongs(
          (playlistSongs || []).map((s: any) => ({
            id: s.id,
            title: s.songTitle,
            artist: s.artistName,
            url: s.spotifyId || '',
            addedBy: s.addedBy === user.id ? 'Vous' : 'Votre partenaire',
            addedAt: s.addedAt,
          })),
        );
        
      } catch (err: any) {
        setError(err.message || 'Failed to initialize playlist.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    initPlaylist();
  }, [coupleId]);


  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPlaylist || !formData.url.trim()) {
      setError('Veuillez fournir un lien de chanson valide et assurer qu\'une playlist est sélectionnée.');
      return;
    }

    try {
      // Backend only expects songUrl. Title, artist, addedBy, addedAt will be client-side only.
      const addedSong = await api.memories.addSong(currentPlaylist.id, {
        songUrl: formData.url,
        title: formData.title,
        artist: formData.artist,
      });

      // Add to client-side state for immediate display
      setSongs((prev) => [
        {
          id: addedSong.id, // Use ID from backend for the playlist_song entry
          title: addedSong.songTitle || formData.title || 'Titre inconnu',
          artist: addedSong.artistName || formData.artist || 'Artiste inconnu',
          url: addedSong.spotifyId || formData.url,
          addedBy: 'Vous',
          addedAt: addedSong.addedAt,
        },
        ...prev,
      ]);

      setFormData({ title: '', artist: '', url: '' });
      setShowAddForm(false);
    } catch (err: any) {
      setError(err.message || 'Échec de l\'ajout de la chanson.');
      console.error(err);
    }
  };

  const handleDeleteSong = async (id: string) => {
    try {
      await api.memories.deleteSong(id);
      setSongs((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      setError(err.message || 'Échec de la suppression de la chanson.');
      console.error(err);
    }
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">💕</div>
          <p className="text-gray-600">Chargement de la playlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Playlist 🎵</h1>
          <p className="text-gray-600 mt-1">Votre musique partagée</p>
          {currentPlaylist && (
            <p className="text-gray-500 text-sm">Playlist: {currentPlaylist.title}</p>
          )}
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-semibold"
        >
          <Plus className="w-5 h-5" />
          Ajouter une chanson
        </button>
      </div>

      {/* Add Song Form */}
      {showAddForm && (
        <Card className="p-6">
          <form onSubmit={handleAddSong} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                placeholder="Titre de la chanson (affiché localement)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Artiste
              </label>
              <input
                type="text"
                value={formData.artist}
                onChange={(e) =>
                  setFormData({ ...formData, artist: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                placeholder="Nom de l'artiste (affiché localement)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL ou Plateforme
              </label>
              <input
                type="text"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                placeholder="Lien Spotify, Apple Music, etc. (enregistré)"
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-semibold"
              >
                Ajouter
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Annuler
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Songs List */}
      <div className="space-y-3">
        {songs.length === 0 ? (
          <Card className="p-12 text-center">
            <Music className="w-12 h-12 text-pink-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Aucune chanson pour le moment</p>
            <p className="text-gray-400">Ajoutez votre première chanson!</p>
          </Card>
        ) : (
          songs.map((song, index) => (
            <Card key={song.id} className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{song.title}</h3>
                <p className="text-sm text-gray-600">{song.artist}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Ajouté par {song.addedBy} le {new Date(song.addedAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-pink-600 hover:text-pink-700 transition">
                  <Play className="w-5 h-5 fill-current" />
                </button>
                <button
                  onClick={() => handleDeleteSong(song.id)}
                  className="text-red-600 hover:text-red-700 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
