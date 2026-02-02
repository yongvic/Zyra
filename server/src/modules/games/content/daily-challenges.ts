/**
 * Défis quotidiens — un défi par jour pour le couple
 * challengeType : text, emoji, photo, voice
 */

import type { SeedDailyChallenge } from './types';

export const DAILY_CHALLENGES: SeedDailyChallenge[] = [
  { mode: 'soft', challengeType: 'emoji', prompt: 'Envoie à ton/ta partenaire un emoji qui résume ton humeur, puis une phrase.', tags: ['mood', 'communication'] },
  { mode: 'romantic', challengeType: 'text', prompt: 'Écris 3 choses que tu as appréciées chez ton/ta partenaire cette semaine.', tags: ['gratitude', 'amour'] },
  { mode: 'hot', challengeType: 'voice', prompt: 'Envoie un message vocal doux (5–10 s), flirt élégant, sans explicite.', tags: ['flirt', 'vocal'] },
  { mode: 'soft', challengeType: 'photo', prompt: 'Envoie une photo “petit moment du quotidien” (un café, un ciel, un détail).', tags: ['partage'] },
  { mode: 'soft', challengeType: 'text', prompt: 'Dis à ton/ta partenaire une qualité que tu admires chez lui/elle.', tags: ['compliment'] },
  { mode: 'romantic', challengeType: 'text', prompt: 'Écris “Je t’aime parce que…” et termine par une raison précise.', tags: ['amour'] },
  { mode: 'soft', challengeType: 'emoji', prompt: 'Envoie 3 emojis qui décrivent votre journée idéale ensemble.', tags: ['fun'] },
  { mode: 'romantic', challengeType: 'photo', prompt: 'Envoie une photo d’un endroit où tu aimerais l’embrasser.', tags: ['romantique'] },
  { mode: 'hot', challengeType: 'text', prompt: 'Écris une phrase de flirt élégante (soft) pour ton/ta partenaire.', tags: ['flirt'] },
  { mode: 'soft', challengeType: 'voice', prompt: 'Enregistre un message vocal de 10 s pour dire bonjour ou bonne nuit.', tags: ['vocal'] },
  { mode: 'romantic', challengeType: 'text', prompt: 'Propose un mini rituel de couple à faire cette semaine (5 min/jour).', tags: ['rituel'] },
  { mode: 'soft', challengeType: 'text', prompt: 'Remercie ton/ta partenaire pour une chose précise qu’il/elle a faite récemment.', tags: ['gratitude'] },
  { mode: 'romantic', challengeType: 'emoji', prompt: 'Envoie un emoji cœur + une phrase qui dit “tu me manques”.', tags: ['manque'] },
  { mode: 'hot', challengeType: 'voice', prompt: 'Envoie un vocal de 5 s : un soupir + “J’ai hâte de te voir”.', tags: ['désir'] },
  { mode: 'soft', challengeType: 'photo', prompt: 'Envoie une photo de ton environnement avec le message “Pensée pour toi”.', tags: ['attention'] },
];
