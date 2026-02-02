'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface GameCardProps {
  /** Titre court (ex. "VÉRITÉ", "ACTION", "Compliment") */
  title?: string;
  /** Couleur du badge / thème */
  variant?: 'truth' | 'dare' | 'compliment' | 'surprise' | 'quiz' | 'neutral';
  /** Contenu principal (phrase, question) */
  children: React.ReactNode;
  /** Animation d'entrée */
  animate?: boolean;
  /** Classe additionnelle */
  className?: string;
}

const variantStyles = {
  truth: 'from-violet-50 to-purple-50 border-violet-200 shadow-[0_0_24px_rgba(139,92,246,0.12)]',
  dare: 'from-rose-50 to-pink-50 border-rose-200 shadow-[0_0_24px_rgba(236,72,153,0.12)]',
  compliment: 'from-amber-50 to-orange-50 border-amber-200 shadow-[0_0_24px_rgba(245,158,11,0.12)]',
  surprise: 'from-cyan-50 to-blue-50 border-cyan-200 shadow-[0_0_24px_rgba(6,182,212,0.12)]',
  quiz: 'from-emerald-50 to-teal-50 border-emerald-200 shadow-[0_0_24px_rgba(16,185,129,0.12)]',
  neutral: 'from-gray-50 to-slate-50 border-gray-200',
};

const badgeStyles = {
  truth: 'bg-violet-600 text-white',
  dare: 'bg-rose-600 text-white',
  compliment: 'bg-amber-500 text-white',
  surprise: 'bg-cyan-600 text-white',
  quiz: 'bg-emerald-600 text-white',
  neutral: 'bg-gray-600 text-white',
};

/**
 * Carte de jeu avec badge et contenu — apparition animée, micro-interactions.
 */
export function GameCard({
  title,
  variant = 'neutral',
  children,
  animate = true,
  className,
}: GameCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border-2 bg-gradient-to-br p-6 text-center',
        variantStyles[variant],
        animate && 'animate-game-card-in',
        className
      )}
    >
      {title && (
        <span
          className={cn(
            'inline-block rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-wide',
            badgeStyles[variant]
          )}
        >
          {title}
        </span>
      )}
      <div className="mt-4 text-gray-900 font-medium leading-relaxed">{children}</div>
    </div>
  );
}
