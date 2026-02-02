'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

export interface GameProgressProps {
  /** Valeur actuelle (ex. nombre de réponses) */
  value: number;
  /** Valeur max (ex. objectif) — optionnel pour afficher seulement value */
  max?: number;
  /** Label (ex. "Réponses", "Matchs") */
  label?: string;
  /** Affichage compact */
  compact?: boolean;
  className?: string;
}

/**
 * Barre de progression ou indicateur pour les jeux.
 */
export function GameProgress({ value, max, label, compact, className }: GameProgressProps) {
  const percent = max && max > 0 ? Math.min(100, (value / max) * 100) : 0;

  return (
    <div className={cn('space-y-1', className)}>
      {(label || (max != null && !compact)) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-gray-600">{label}</span>}
          {max != null && !compact && (
            <span className="font-semibold text-pink-600">
              {value} / {max}
            </span>
          )}
          {max == null && !compact && <span className="font-semibold text-pink-600">{value}</span>}
        </div>
      )}
      {max != null && max > 0 && (
        <Progress value={percent} className="h-2 rounded-full" />
      )}
    </div>
  );
}
