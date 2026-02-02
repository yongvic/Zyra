'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface GameIntroProps {
  /** Titre du jeu */
  title: string;
  /** Sous-titre ou courte description */
  subtitle?: string;
  /** Emoji ou icône (ex. "❤️", "🎡") */
  icon?: string;
  /** Durée d'affichage en ms avant d'appeler onComplete (0 = pas d'auto-dismiss) */
  duration?: number;
  /** Callback quand l'intro est terminée (utilisateur clique ou durée écoulée) */
  onComplete?: () => void;
  /** Classe CSS additionnelle */
  className?: string;
  /** Variante visuelle (romantique = rose doux, intime = velours) */
  variant?: 'soft' | 'romantic' | 'intimate';
}

/**
 * Introduction animée pour chaque jeu premium.
 * Affiche titre + sous-titre + icône avec fondu et léger scale, puis disparaît ou attend un tap.
 */
export function GameIntro({
  title,
  subtitle,
  icon,
  duration = 2000,
  onComplete,
  className,
  variant = 'romantic',
}: GameIntroProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!onComplete || duration <= 0) return;
    const t = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, duration);
    return () => clearTimeout(t);
  }, [duration, onComplete]);

  const handleClick = () => {
    if (!onComplete) return;
    setVisible(false);
    onComplete();
  };

  const variantStyles = {
    soft: 'from-blue-50 to-indigo-50 border-blue-100',
    romantic: 'from-pink-50 to-rose-50 border-pink-200',
    intimate: 'from-rose-950/20 to-pink-950/20 border-rose-800/40',
  };

  if (!visible) return null;

  return (
    <div
      role="presentation"
      onClick={handleClick}
      className={cn(
        'cursor-pointer select-none rounded-2xl border bg-gradient-to-br p-8 text-center shadow-lg',
        'animate-game-intro',
        variantStyles[variant],
        className
      )}
    >
      {icon && (
        <div
          className={cn(
            'mx-auto mb-4 text-5xl animate-game-intro-glow inline-flex items-center justify-center rounded-full p-4',
            variant === 'intimate' ? 'bg-rose-900/30' : 'bg-white/80'
          )}
        >
          {icon}
        </div>
      )}
      <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{title}</h1>
      {subtitle && (
        <p className="mt-2 text-sm text-gray-600 md:text-base">{subtitle}</p>
      )}
      {duration > 0 && (
        <p className="mt-4 text-xs text-gray-500">Touchez pour commencer</p>
      )}
    </div>
  );
}
