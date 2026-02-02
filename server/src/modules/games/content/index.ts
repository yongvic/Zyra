/**
 * Index du contenu des jeux — fusionne tous les fichiers pour le seed en base.
 * Pour ajouter des centaines de phrases : éditez truth.ts, dare.ts, compliments.ts, etc.
 */

import type { SeedQuestion } from './types';
import { TRUTH_QUESTIONS } from './truth';
import { DARE_PROMPTS } from './dare';
import { COMPLIMENT_PROMPTS } from './compliments';
import { WOULD_YOU_RATHER_PROMPTS } from './would-you-rather';
import { SURPRISE_PROMPTS } from './surprise';
import { QUIZ_QUESTIONS } from './quiz';
import { MORE_LESS_PROMPTS } from './more-less';
import { DAILY_CHALLENGES } from './daily-challenges';

function withType<T extends Omit<SeedQuestion, 'type'>>(type: SeedQuestion['type'], items: T[]): SeedQuestion[] {
  return items.map((item) => ({ ...item, type }));
}

export const DEFAULT_GAME_QUESTIONS: SeedQuestion[] = [
  ...withType('truth', TRUTH_QUESTIONS),
  ...withType('dare', DARE_PROMPTS),
  ...withType('compliment', COMPLIMENT_PROMPTS),
  ...withType('would_you_rather', WOULD_YOU_RATHER_PROMPTS),
  ...withType('surprise', SURPRISE_PROMPTS),
  ...withType('quiz', QUIZ_QUESTIONS),
  ...withType('more_less', MORE_LESS_PROMPTS),
];

export { DAILY_CHALLENGES as DEFAULT_DAILY_CHALLENGES } from './daily-challenges';
export type { SeedQuestion, SeedDailyChallenge } from './types';
