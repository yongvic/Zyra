'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Card } from '@/components/ui/card';
import { MessageCircle, Gamepad2, Heart, Music } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [coupleInfo, setCoupleInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState('');

  const fetchCoupleData = async () => {
    try {
      const data = await api.couples.getMine();
      setCoupleInfo(data);
      if (data && data.id) {
        localStorage.setItem('coupleId', data.id);
      } else {
        localStorage.removeItem('coupleId');
      }
    } catch {
      setCoupleInfo(null);
      localStorage.removeItem('coupleId');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        fetchCoupleData();
      } catch {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleInvitePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviteError('');
    setInviteLoading(true);
    try {
      const data = await api.couples.inviteByEmail(inviteEmail.trim(), inviteName.trim() || 'Notre couple');
      setCoupleInfo(data);
      localStorage.setItem('coupleId', data.id);
      setInviteEmail('');
      setInviteName('');
    } catch (err: any) {
      setInviteError(err?.message || 'Échec de l\'invitation');
    } finally {
      setInviteLoading(false);
    }
  };

  const quickActions = [
    {
      icon: MessageCircle,
      label: 'Chat',
      href: '/dashboard/chat',
      color: 'bg-blue-100 text-blue-600',
      description: 'Discutez en temps réel',
    },
    {
      icon: Gamepad2,
      label: 'Jeux',
      href: '/dashboard/games',
      color: 'bg-purple-100 text-purple-600',
      description: 'Jouez ensemble',
    },
    {
      icon: Heart,
      label: 'Souvenirs',
      href: '/dashboard/memories',
      color: 'bg-pink-100 text-pink-600',
      description: 'Vos moments précieux',
    },
    {
      icon: Music,
      label: 'Playlist',
      href: '/dashboard/playlist',
      color: 'bg-green-100 text-green-600',
      description: 'Musique partagée',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">💕</div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-2xl p-8">
        <h1 className="text-4xl font-bold mb-2">
          Bienvenue, {user?.name}! 👋
        </h1>
        <p className="text-pink-100">
          {coupleInfo
            ? `Vous êtes connecté avec votre partenaire${coupleInfo.coupleName ? ` - ${coupleInfo.coupleName}` : ''}`
            : 'Invitez votre partenaire pour commencer!'}
        </p>
      </div>

      {/* Invite Partner Form - when no couple */}
      {!coupleInfo && (
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Inviter mon partenaire</h2>
          <p className="text-gray-600 mb-4">
            Entrez l&apos;email de votre partenaire. Il doit déjà avoir un compte Zyra.
          </p>
          <form onSubmit={handleInvitePartner} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email du partenaire</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="partenaire@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du couple (optionnel)</label>
              <input
                type="text"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="Notre couple"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
              />
            </div>
            {inviteError && (
              <p className="text-red-600 text-sm">{inviteError}</p>
            )}
            <button
              type="submit"
              disabled={inviteLoading}
              className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-semibold disabled:opacity-50"
            >
              {inviteLoading ? 'Envoi...' : 'Envoyer l\'invitation'}
            </button>
          </form>
        </Card>
      )}

      {/* Quick Actions - hide when no couple */}
      {coupleInfo && (
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Actions rapides</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="p-6 hover:shadow-lg transition cursor-pointer h-full">
                <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{action.label}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
      )}

      {/* Recent Activity - hide when no couple */}
      {coupleInfo && (
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Activité récente</h2>
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">
            Aucune activité pour le moment
          </p>
          <Link
            href="/dashboard/games"
            className="inline-block px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
          >
            Commencer un jeu
          </Link>
        </Card>
      </section>
      )}
    </div>
  );
}
