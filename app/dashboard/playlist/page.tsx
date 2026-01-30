'use client';

import React from "react"

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Music, Plus, Play, Trash2 } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  addedBy: string;
  addedAt: string;
}

export default function PlaylistPage() {
  const [songs, setSongs] = useState<Song[]>([
    {
      id: '1',
      title: 'Perfect',
      artist: 'Ed Sheeran',
      url: '',
      addedBy: 'Vous',
      addedAt: '2024-01-15',
    },
    {
      id: '2',
      title: 'Love Story',
      artist: 'Taylor Swift',
      url: '',
      addedBy: 'Votre partenaire',
      addedAt: '2024-01-10',
    },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    url: '',
  });

  const handleAddSong = (e: React.FormEvent) => {
    e.preventDefault();
    const newSong: Song = {
      id: Date.now().toString(),
      ...formData,
      addedBy: 'Vous',
      addedAt: new Date().toISOString(),
    };
    setSongs([newSong, ...songs]);
    setFormData({ title: '', artist: '', url: '' });
    setShowAddForm(false);
  };

  const handleDeleteSong = (id: string) => {
    setSongs(songs.filter((song) => song.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Playlist 🎵</h1>
          <p className="text-gray-600 mt-1">Votre musique partagée</p>
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
                placeholder="Titre de la chanson"
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
                placeholder="Nom de l'artiste"
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
                placeholder="Lien Spotify, Apple Music, etc."
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
                  Ajouté par {song.addedBy}
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
