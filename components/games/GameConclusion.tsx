'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface GameConclusionProps {
  /** Titre du message de fin (ex. "Défi relevé !") */
  title: string;
  /** Message ou résumé (ex. score, souvenir, remerciement) */
  message?: string;
  /** Score affiché (optionnel) */
  score?: number | string;
  /** Label du score (ex. "Matchs", "Points") */
  scoreLabel?: string;
  /** Sous-texte (ex. "À bientôt", "Merci d'avoir joué") */
  footer?: string;
  /** Emoji ou icône de célébration */
  icon?: string;
  /** Callback pour "Rejouer" ou "Retour" */
  onAction?: () => void;
  /** Libellé du bouton d'action */
  actionLabel?: string;
  /** Classe CSS additionnelle */
  className?: string;
  /** Variante (romantique = halo doux, intime = velours) */
  variant?: 'soft' | 'romantic' | 'intimate';
}

/**
 * Conclusion émotionnelle d'une partie : feedback, score, message, bouton.
 */
export function GameConclusion({
  title,
  message,
  score,
  scoreLabel,
  footer,
  icon = '✨',
  onAction,
  actionLabel = 'Continuer',
  className,
  variant = 'romantic',
}: GameConclusionProps) {
  const variantStyles = {
    soft: 'from-blue-50 to-indigo-50 border-blue-100',
    romantic: 'from-pink-50 to-rose-50 border-pink-200 shadow-[0_0_40px_rgba(236,72,153,0.12)]',
    intimate: 'from-rose-950/20 to-pink-950/20 border-rose-800/40',
  };

  return (
    <div
      className={cn(
        'animate-game-conclusion rounded-2xl border bg-gradient-to-br p-8 text-center',
        variantStyles[variant],
        className
      )}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h2 className="text-xl font-bold text-gray-900 md:text-2xl">{title}</h2>
      {message && <p className="mt-2 text-gray-700">{message}</p>}
      {score !== undefined && score !== null && (
        <div className="mt-4">
          <span className="text-3xl font-bold text-pink-600">{score}</span>
          {scoreLabel && (
            <span className="ml-2 text-sm text-gray-600">{scoreLabel}</span>
          )}
        </div>
      )}
      {footer && <p className="mt-4 text-sm text-gray-500">{footer}</p>}
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:bg-pink-700 active:scale-[0.98]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
