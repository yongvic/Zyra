'use client';

import { useCallback, useRef } from 'react';

type SoundKind = 'tap' | 'success' | 'match' | 'celebration' | 'ambient';

/**
 * Hook pour l'ambiance sonore des jeux (micro-feedback).
 * Pour l'instant sans fichiers audio : prêt à brancher des sons plus tard.
 * Utilisation : playSound('success') après un match, etc.
 */
export function useGameSound(enabled = true) {
  const ambientRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback(
    (kind: SoundKind) => {
      if (!enabled || typeof window === 'undefined') return;
      // Optionnel : créer des Audio() et jouer des fichiers /public/sounds/game-*.mp3
      // const audio = new Audio(`/sounds/game-${kind}.mp3`);
      // audio.volume = 0.3;
      // audio.play().catch(() => {});
      switch (kind) {
        case 'tap':
        case 'success':
        case 'match':
        case 'celebration':
          // Placeholder : pas de son par défaut (évite erreurs 404)
          break;
        case 'ambient':
          // Boucle douce optionnelle
          break;
        default:
          break;
      }
    },
    [enabled]
  );

  const startAmbient = useCallback(() => {
    if (!enabled) return;
    // const audio = new Audio('/sounds/game-ambient.mp3');
    // audio.loop = true;
    // audio.volume = 0.15;
    // audio.play().catch(() => {});
    // ambientRef.current = audio;
  }, [enabled]);

  const stopAmbient = useCallback(() => {
    if (ambientRef.current) {
      ambientRef.current.pause();
      ambientRef.current = null;
    }
  }, []);

  return { playSound, startAmbient, stopAmbient };
}
