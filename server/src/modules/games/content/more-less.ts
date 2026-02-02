/**
 * Plus ou Moins — un seul type de prompt (le nombre est géré en session).
 */

import type { SeedQuestion } from './types';

export const MORE_LESS_PROMPTS: Omit<SeedQuestion, 'type'>[] = [
  {
    mode: 'soft',
    prompt: 'Plus ou moins : devine le nombre secret entre 1 et 100.',
    tags: ['jeu'],
  },
];
