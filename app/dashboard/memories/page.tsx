'use client';

import React from "react"

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Heart, Plus, Trash2 } from 'lucide-react';

interface Memory {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  category: string;
  created_at: string;
}

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([
    {
      id: '1',
      title: 'Notre première rencontre',
      description: 'Le jour où nous nous sommes rencontrés au café',
      image_url: '',
      category: 'spécial',
      created_at: '2024-01-15',
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'général',
  });

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    const newMemory: Memory = {
      id: Date.now().toString(),
      ...formData,
      created_at: new Date().toISOString(),
    };
    setMemories([newMemory, ...memories]);
    setFormData({ title: '', description: '', category: 'général' });
    setShowForm(false);
  };

  const handleDeleteMemory = (id: string) => {
    setMemories(memories.filter((m) => m.id !== id));
  };

  const categories = ['général', 'spécial', 'anniversaire', 'voyage', 'autre'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Souvenirs 💕</h1>
          <p className="text-gray-600 mt-1">Collectionnez vos moments précieux</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-semibold"
        >
          <Plus className="w-5 h-5" />
          Ajouter un souvenir
        </button>
      </div>

      {/* Add Memory Form */}
      {showForm && (
        <Card className="p-6">
          <form onSubmit={handleAddMemory} className="space-y-4">
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
                placeholder="Donnez un titre à votre souvenir"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                placeholder="Décrivez ce souvenir..."
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-semibold"
              >
                Enregistrer
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Annuler
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Memories Timeline */}
      <div className="space-y-4">
        {memories.length === 0 ? (
          <Card className="p-12 text-center">
            <Heart className="w-12 h-12 text-pink-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Aucun souvenir pour le moment</p>
            <p className="text-gray-400">Créez votre premier souvenir!</p>
          </Card>
        ) : (
          memories.map((memory) => (
            <Card key={memory.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {memory.title}
                  </h3>
                  <p className="text-gray-600 mb-2">{memory.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="inline-block px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold">
                      {memory.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(memory.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteMemory(memory.id)}
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
