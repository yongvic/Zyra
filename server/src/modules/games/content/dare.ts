/**
 * Actions / DÉFIS (Dare / Touch) — Truth or Touch
 * Ajoutez des centaines d’actions : envoi de message, selfie, vocal, etc.
 */

import type { SeedQuestion } from './types';

export const DARE_PROMPTS: Omit<SeedQuestion, 'type'>[] = [
  // ——— SOFT ———
  { mode: 'soft', prompt: 'Envoie un compliment ultra précis (pas générique) à ton/ta partenaire.', tags: ['compliment'] },
  { mode: 'soft', prompt: 'Envoie une photo de ce qui te rend heureux/heureuse en ce moment.', tags: ['photo'] },
  { mode: 'soft', prompt: 'Écris une phrase qui décrit ton humeur du jour.', tags: ['texte'] },
  { mode: 'soft', prompt: 'Envoie un emoji qui te représente aujourd’hui + une phrase.', tags: ['emoji'] },
  { mode: 'soft', prompt: 'Envoie un message “bonne journée” personnalisé.', tags: ['attention'] },
  { mode: 'soft', prompt: 'Propose une activité à faire ensemble ce week-end (en 1 message).', tags: ['activité'] },
  { mode: 'soft', prompt: 'Envoie une chanson ou un titre qui te fait penser à lui/elle.', tags: ['musique'] },
  { mode: 'soft', prompt: 'Écris 3 choses que tu apprécies chez ton/ta partenaire.', tags: ['gratitude'] },
  { mode: 'soft', prompt: 'Envoie un selfie sourire.', tags: ['selfie'] },
  { mode: 'soft', prompt: 'Enregistre un message vocal de 10 secondes pour lui/elle dire bonjour.', tags: ['vocal'] },
  // ——— ROMANTIC ———
  { mode: 'romantic', prompt: 'Écris un mini message “bonne nuit” en 2 phrases, comme si c’était une scène de film.', tags: ['romantique'] },
  { mode: 'romantic', prompt: 'Envoie un message “Je pense à toi” avec une raison précise.', tags: ['pensée'] },
  { mode: 'romantic', prompt: 'Écris une phrase qui commence par “Je t’aime parce que…”', tags: ['amour'] },
  { mode: 'romantic', prompt: 'Enregistre un court message vocal (15 s) pour lui/elle dire ce qu’il/elle représente pour toi.', tags: ['vocal', 'amour'] },
  { mode: 'romantic', prompt: 'Envoie une photo d’un endroit où tu aimerais l’embrasser.', tags: ['photo', 'romantique'] },
  { mode: 'romantic', prompt: 'Écris un haïku (3 lignes) sur votre couple.', tags: ['poésie'] },
  { mode: 'romantic', prompt: 'Propose un rendez-vous surprise (lieu ou activité) pour cette semaine.', tags: ['date'] },
  { mode: 'romantic', prompt: 'Envoie un message décrivant ton moment préféré avec lui/elle ce mois-ci.', tags: ['souvenir'] },
  { mode: 'romantic', prompt: 'Écris “Merci pour…” et termine par 3 choses concrètes.', tags: ['gratitude'] },
  { mode: 'romantic', prompt: 'Enregistre toi en train de chantonner 20 secondes d’une chanson d’amour.', tags: ['vocal', 'fun'] },
  // ——— HOT (consensuel, jamais explicite) ———
  { mode: 'hot', prompt: 'Envoie un message vocal doux de 10 secondes (sans contenu explicite) pour faire sourire ton/ta partenaire.', tags: ['vocal', 'flirt'] },
  { mode: 'hot', prompt: 'Écris un message “teasing” soft (1 phrase, élégant, pas explicite).', tags: ['teasing'] },
  { mode: 'hot', prompt: 'Envoie un selfie complice (regard, sourire — rien d’explicite).', tags: ['selfie', 'flirt'] },
  { mode: 'hot', prompt: 'Écris une phrase de flirt que tu n’as jamais osé lui envoyer.', tags: ['flirt'] },
  { mode: 'hot', prompt: 'Envoie un message “J’ai hâte de te voir” en le rendant un peu coquin (soft).', tags: ['désir'] },
  { mode: 'hot', prompt: 'Enregistre un message vocal de 5 secondes : un soupir + “Tu me manques”.', tags: ['vocal'] },
  { mode: 'hot', prompt: 'Envoie un emoji coquin + une phrase douce.', tags: ['emoji', 'flirt'] },
  { mode: 'hot', prompt: 'Écris ce que tu aimerais lui faire (massage, câlin, regard…) en 1 phrase élégante.', tags: ['tendresse'] },
  { mode: 'hot', prompt: 'Envoie une photo de ta main ou de ton environnement avec un message “J’y pense”.', tags: ['photo'] },
  { mode: 'hot', prompt: 'Écris un compliment sur son physique en restant élégant et respectueux.', tags: ['compliment'] },
];
