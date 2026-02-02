/**
 * Surprises — Roue du destin / wheel
 * Défis courts : compliment, action surprise, mini mission.
 */

import type { SeedQuestion } from './types';

export const SURPRISE_PROMPTS: Omit<SeedQuestion, 'type'>[] = [
  // ——— SOFT ———
  { mode: 'soft', prompt: 'Surprise : donne à ton/ta partenaire un surnom mignon pour aujourd’hui.', tags: ['fun'] },
  { mode: 'soft', prompt: 'Surprise : envoie une photo de ton environnement actuel avec un message “Pensée pour toi”.', tags: ['photo'] },
  { mode: 'soft', prompt: 'Surprise : propose une activité à faire ensemble ce week-end (en 1 message).', tags: ['activité'] },
  { mode: 'soft', prompt: 'Surprise : écris 1 chose que tu as apprise sur ton/ta partenaire ce mois-ci.', tags: ['découverte'] },
  { mode: 'soft', prompt: 'Surprise : envoie un emoji qui décrit ton humeur + une phrase.', tags: ['emoji'] },
  { mode: 'soft', prompt: 'Surprise : dis “Merci pour…” et termine par une chose précise.', tags: ['gratitude'] },
  { mode: 'soft', prompt: 'Surprise : envoie une chanson qui te fait penser à lui/elle.', tags: ['musique'] },
  { mode: 'soft', prompt: 'Surprise : propose un défi commun pour demain (ex: pas de portable au repas).', tags: ['défi'] },
  { mode: 'soft', prompt: 'Surprise : écris une phrase qui commence par “Aujourd’hui j’ai pensé à toi quand…”', tags: ['pensée'] },
  { mode: 'soft', prompt: 'Surprise : envoie un message “Bonne nuit” personnalisé.', tags: ['attention'] },
  // ——— ROMANTIC ———
  { mode: 'romantic', prompt: 'Surprise : propose un mini rituel de couple pour cette semaine (5 minutes/jour).', tags: ['rituel', 'couple'] },
  { mode: 'romantic', prompt: 'Surprise : écris “Je t’aime” dans une langue que tu choisis.', tags: ['amour'] },
  { mode: 'romantic', prompt: 'Surprise : enregistre 15 secondes pour lui/elle dire ce qu’il/elle représente pour toi.', tags: ['vocal'] },
  { mode: 'romantic', prompt: 'Surprise : propose un rendez-vous surprise (lieu ou activité) pour cette semaine.', tags: ['date'] },
  { mode: 'romantic', prompt: 'Surprise : écris une phrase que tu aimerais graver quelque part pour lui/elle.', tags: ['éternel'] },
  { mode: 'romantic', prompt: 'Surprise : dis le moment où tu t’es senti(e) le/la plus aimé(e) récemment.', tags: ['moment'] },
  { mode: 'romantic', prompt: 'Surprise : envoie une photo d’un endroit où tu aimerais l’embrasser.', tags: ['photo'] },
  { mode: 'romantic', prompt: 'Surprise : écris un haïku (3 lignes) sur votre couple.', tags: ['poésie'] },
  { mode: 'romantic', prompt: 'Surprise : propose “notre” chanson et explique en 1 phrase.', tags: ['musique'] },
  { mode: 'romantic', prompt: 'Surprise : dis “Tu es…” et termine par 3 adjectifs d’amour.', tags: ['mots'] },
  // ——— HOT (élégant) ———
  { mode: 'hot', prompt: 'Surprise : envoie un message “teasing” soft (sans explicite) en 1 phrase.', tags: ['teasing', 'flirt'] },
  { mode: 'hot', prompt: 'Surprise : envoie un vocal de 5 secondes : un soupir + “Tu me manques”.', tags: ['vocal'] },
  { mode: 'hot', prompt: 'Surprise : écris une phrase de flirt que tu n’as jamais osé lui envoyer.', tags: ['flirt'] },
  { mode: 'hot', prompt: 'Surprise : envoie un selfie complice (regard, sourire).', tags: ['selfie'] },
  { mode: 'hot', prompt: 'Surprise : dis en 1 phrase ce que tu aimerais lui murmurer à l’oreille.', tags: ['murmure'] },
  { mode: 'hot', prompt: 'Surprise : envoie un emoji coquin + une phrase douce.', tags: ['emoji'] },
  { mode: 'hot', prompt: 'Surprise : écris “J’ai hâte de te voir” en le rendant un peu coquin (soft).', tags: ['désir'] },
  { mode: 'hot', prompt: 'Surprise : dis ce qui te fait craquer chez lui/elle (avec élégance).', tags: ['craquer'] },
  { mode: 'hot', prompt: 'Surprise : propose un petit jeu de séduction (soft) à faire ensemble.', tags: ['jeu'] },
  { mode: 'hot', prompt: 'Surprise : complimente son physique en 1 phrase élégante.', tags: ['compliment'] },
];
