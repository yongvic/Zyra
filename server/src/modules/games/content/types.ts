/**
 * Types partagés pour le contenu des jeux.
 * Ajoutez des centaines d'entrées dans chaque fichier (truth.ts, dare.ts, etc.).
 */

export type GameMode = 'soft' | 'romantic' | 'hot';

export type SeedQuestion = {
  type:
    | 'truth'
    | 'dare'
    | 'quiz'
    | 'would_you_rather'
    | 'surprise'
    | 'compliment'
    | 'more_less';
  mode: GameMode;
  prompt: string;
  options?: { choices?: string[]; a?: string; b?: string };
  answer?: { correctIndex?: number };
  tags?: string[];
};

export type SeedDailyChallenge = {
  mode: GameMode;
  challengeType: 'text' | 'emoji' | 'photo' | 'voice';
  prompt: string;
  tags?: string[];
};
