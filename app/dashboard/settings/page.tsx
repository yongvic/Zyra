'use client';

import React from "react"

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Lock, Bell, Users } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [notifications, setNotifications] = useState({
    messages: true,
    games: true,
    memories: true,
  });
  const [coupleInfo, setCoupleInfo] = useState({
    partnerName: 'En attente...',
    connectedSince: null,
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setFormData({
        name: parsed.name,
        email: parsed.email,
      });
    }
  }, []);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Update via API
    setSuccessMessage('Profil mis à jour avec succès');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    // TODO: Update password via API
    setPasswords({ current: '', new: '', confirm: '' });
    setSuccessMessage('Mot de passe changé avec succès');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Paramètres ⚙️</h1>
        <p className="text-gray-600 mt-1">Gérez votre compte et vos préférences</p>
      </div>

      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Profile Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-pink-600" />
          <h2 className="text-2xl font-bold text-gray-900">Profil</h2>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom complet
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-semibold"
          >
            Mettre à jour
          </button>
        </form>
      </Card>

      {/* Security Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-6 h-6 text-pink-600" />
          <h2 className="text-2xl font-bold text-gray-900">Sécurité</h2>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe actuel
            </label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              value={passwords.new}
              onChange={(e) =>
                setPasswords({ ...passwords, new: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords({ ...passwords, confirm: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-semibold"
          >
            Changer le mot de passe
          </button>
        </form>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-pink-600" />
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
        </div>

        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <label
              key={key}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={value}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    [key]: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded border-gray-300"
              />
              <span className="text-gray-700 font-medium capitalize">
                {key === 'messages'
                  ? 'Nouveaux messages'
                  : key === 'games'
                    ? 'Invitations de jeu'
                    : 'Mises à jour de souvenirs'}
              </span>
            </label>
          ))}
        </div>
      </Card>

      {/* Couple Info */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-pink-600" />
          <h2 className="text-2xl font-bold text-gray-900">Information du couple</h2>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Partenaire</p>
            <p className="text-lg font-semibold text-gray-900">
              {coupleInfo.partnerName}
            </p>
          </div>
          {coupleInfo.connectedSince && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Connecté depuis</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(coupleInfo.connectedSince).toLocaleDateString('fr-FR')}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
