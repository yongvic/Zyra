'use client';

import { useState } from 'react';
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

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const handlePlayGame = (gameId: string) => {
    setSelectedGame(gameId);
    // Navigate to game page
    // router.push(`/dashboard/games/${gameId}`);
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
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center font-bold text-pink-600">
                  1
                </div>
                <div>
                  <p className="font-bold text-gray-900">Vous</p>
                  <p className="text-sm text-gray-600">42 points</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-pink-600">👑</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                  2
                </div>
                <div>
                  <p className="font-bold text-gray-900">Votre partenaire</p>
                  <p className="text-sm text-gray-600">38 points</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
