'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Gamepad2, Dices, Brain, HelpCircle, TrendingDown, RotateCw, Sparkles } from 'lucide-react';

const games = [
  {
    id: 'memory',
    name: 'Memory',
    description: 'Trouvez les paires de cartes',
    icon: Brain,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 'truth-dare',
    name: 'Truth or Dare',
    description: 'Répondez aux questions ou relevez les défis',
    icon: HelpCircle,
    color: 'bg-pink-100 text-pink-600',
  },
  {
    id: 'quiz',
    name: 'Quiz Couple',
    description: 'Testez vos connaissances sur votre partenaire',
    icon: Gamepad2,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    id: 'daily-challenge',
    name: 'Défi Quotidien',
    description: 'Un nouveau défi chaque jour',
    icon: Sparkles,
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    id: 'more-less',
    name: 'Plus ou Moins',
    description: 'Devinez le nombre',
    icon: TrendingDown,
    color: 'bg-green-100 text-green-600',
  },
  {
    id: 'wheel',
    name: 'La Roue',
    description: 'Faites tourner la roue pour votre défi',
    icon: RotateCw,
    color: 'bg-orange-100 text-orange-600',
  },
];

interface ScoreEntry {
  playerId: string;
  score: number;
  player?: { name: string };
}

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [coupleId, setCoupleId] = useState<string | null>(null);
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};

  useEffect(() => {
    const cid = localStorage.getItem('coupleId');
    setCoupleId(cid);
    if (!cid) return;
    api.games
      .scores(cid)
      .then((data: ScoreEntry[]) => setScores(data || []))
      .catch(() => setScores([]));
  }, []);

  const handlePlayGame = (gameId: string) => {
    setSelectedGame(gameId);
    // TODO: Navigate to game page when implemented
  };

  const getPlayerLabel = (playerId: string) => {
    if (playerId === user?.id) return 'Vous';
    const s = scores.find((x) => x.playerId === playerId);
    return s?.player?.name || 'Votre partenaire';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Jeux 🎮</h1>
        <p className="text-gray-600">
          7 jeux amusants pour renforcer votre lien avec votre partenaire
        </p>
      </div>

      {/* Games Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Card
            key={game.id}
            className="p-6 hover:shadow-lg transition cursor-pointer"
            onClick={() => handlePlayGame(game.id)}
          >
            <div className={`w-12 h-12 rounded-lg ${game.color} flex items-center justify-center mb-4`}>
              <game.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{game.name}</h3>
            <p className="text-gray-600 mb-4">{game.description}</p>
            <button className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-semibold">
              Jouer
            </button>
          </Card>
        ))}
      </div>

      {/* Scoreboard */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Classement</h2>
        <Card className="p-6">
          {!coupleId ? (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">Invitez votre partenaire pour voir les scores.</p>
              <Link href="/dashboard" className="text-pink-600 font-semibold hover:underline">
                Aller à l&apos;accueil
              </Link>
            </div>
          ) : scores.length === 0 ? (
            <p className="text-center text-gray-600 py-4">Aucun score encore. Jouez pour commencer!</p>
          ) : (
            <div className="space-y-4">
              {scores.map((entry, i) => (
                <div
                  key={entry.playerId}
                  className="flex items-center justify-between pb-4 border-b last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        i === 0 ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{getPlayerLabel(entry.playerId)}</p>
                      <p className="text-sm text-gray-600">{entry.score ?? 0} points</p>
                    </div>
                  </div>
                  {i === 0 && <span className="text-2xl font-bold text-pink-600">👑</span>}
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
