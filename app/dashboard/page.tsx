'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (userData) {
      const user = JSON.parse(userData);
      setUser(user);
    }

    // Fetch couple info
    if (token && user) {
      fetchCoupleInfo(user.id, token);
    }
  }, []);

  const fetchCoupleInfo = async (userId: string, token: string) => {
    try {
      const response = await fetch(`http://localhost:3001/couples`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setCoupleInfo(data);
      }
    } catch (error) {
      console.error('Failed to fetch couple info:', error);
    } finally {
      setIsLoading(false);
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
            ? `Vous êtes connecté avec votre partenaire - ${coupleInfo.name}`
            : 'Invitez votre partenaire pour commencer!'}
        </p>
      </div>

      {/* Quick Actions */}
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

      {/* Recent Activity */}
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
    </div>
  );
}
