'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Lock, Bell, Users } from 'lucide-react';
import api from '@/lib/api'; // Import the API client

interface UserProfile {
  id: string;
  name: string;
  email: string;
  provider: 'local' | 'google';
}

interface CoupleInfo {
  id: string;
  coupleName?: string | null;
  createdAt: string;
  userOneId: string;
  userTwoId: string;
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
  const [coupleInfo, setCoupleInfo] = useState<CoupleInfo | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [partnerEmail, setPartnerEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettingsData = async () => {
      setErrorMessage('');
      try {
        const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        if (userData) {
          const parsedUser: UserProfile = JSON.parse(userData);
          setUser(parsedUser);
          setFormData({
            name: parsedUser.name,
            email: parsedUser.email,
          });

          // Fetch fresh user data from API
          const fetchedUser = await api.users.me();
          setUser(fetchedUser);
          setFormData({
            name: fetchedUser.name,
            email: fetchedUser.email,
          });
          localStorage.setItem('user', JSON.stringify(fetchedUser)); // Update local storage

          // Fetch couple info
          const fetchedCoupleInfo = await api.couples.getMine();
          setCoupleInfo(fetchedCoupleInfo);
        } else {
          // Redirect to login if no user data
          // router.push('/login');
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to load settings data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettingsData();
  }, []);

  useEffect(() => {
    const fetchPartner = async () => {
      if (!coupleInfo || !user) {
        setPartnerEmail(null);
        return;
      }

      const partnerId =
        coupleInfo.userOneId === user.id ? coupleInfo.userTwoId : coupleInfo.userOneId;

      try {
        const partner = await api.users.getById(partnerId);
        setPartnerEmail(partner.email);
      } catch {
        setPartnerEmail(null);
      }
    };

    fetchPartner();
  }, [coupleInfo?.id, user?.id]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    if (!user) {
      setErrorMessage('User not found.');
      return;
    }
    try {
      const updatedUser = await api.users.updateMe({
        name: formData.name,
        email: formData.email,
      });
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser)); // Update local storage
      setSuccessMessage('Profil mis à jour avec succès');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Échec de la mise à jour du profil.');
      console.error(err);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    if (passwords.new !== passwords.confirm) {
      setErrorMessage('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }
    if (!user) {
      setErrorMessage('User not found.');
      return;
    }

    try {
      await api.auth.changePassword(passwords.current, passwords.new);
      setPasswords({ current: '', new: '', confirm: '' });
      setSuccessMessage('Mot de passe changé avec succès');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Échec du changement de mot de passe.');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">💕</div>
          <p className="text-gray-600">Chargement des paramètres...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
        <p>{errorMessage}</p>
      </div>
    );
  }

  const partnerName = partnerEmail || (coupleInfo ? 'Votre partenaire' : 'En attente...');
  const connectedSince = coupleInfo?.createdAt
    ? new Date(coupleInfo.createdAt).toLocaleDateString('fr-FR')
    : 'N/A';


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
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {errorMessage}
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
              {partnerName}
            </p>
          </div>
          {coupleInfo?.createdAt && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Connecté depuis</p>
              <p className="text-lg font-semibold text-gray-900">
                {connectedSince}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
