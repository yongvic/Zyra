/**
 * Compliments — Compliment Rain / Roue / générateur
 * Phrases pour inviter à complimenter ou thèmes de compliments.
 */

import type { SeedQuestion } from './types';

export const COMPLIMENT_PROMPTS: Omit<SeedQuestion, 'type'>[] = [
  // ——— SOFT ———
  { mode: 'soft', prompt: 'Compliment : dis ce que tu admires chez ton/ta partenaire, en 1 détail concret.', tags: ['admiration'] },
  { mode: 'soft', prompt: 'Compliment : décris en une phrase ce qui te fait sourire chez lui/elle.', tags: ['sourire'] },
  { mode: 'soft', prompt: 'Compliment : dis une qualité qu’il/elle ne sait peut-être pas qu’il/elle a.', tags: ['découverte'] },
  { mode: 'soft', prompt: 'Compliment : remercie-le/la pour un geste récent en 1 phrase.', tags: ['gratitude'] },
  { mode: 'soft', prompt: 'Compliment : dis ce qu’il/elle fait de mieux pour toi au quotidien.', tags: ['quotidien'] },
  { mode: 'soft', prompt: 'Compliment : décris son sourire en 3 mots.', tags: ['détail'] },
  { mode: 'soft', prompt: 'Compliment : dis pourquoi tu es fier/fière de lui/elle.', tags: ['fierté'] },
  { mode: 'soft', prompt: 'Compliment : dis ce qui te rassure chez ton/ta partenaire.', tags: ['sécurité'] },
  { mode: 'soft', prompt: 'Compliment : nomme une chose qu’il/elle fait mieux que personne.', tags: ['talent'] },
  { mode: 'soft', prompt: 'Compliment : dis ce que tu aimes dans sa façon de t’écouter.', tags: ['écoute'] },
  // ——— ROMANTIC ———
  { mode: 'romantic', prompt: 'Compliment : écris “Je t’aime parce que…” et termine par une raison profonde.', tags: ['amour'] },
  { mode: 'romantic', prompt: 'Compliment : dis ce qui te fait croire que vous êtes faits l’un pour l’autre.', tags: ['destin'] },
  { mode: 'romantic', prompt: 'Compliment : décris en une phrase le sentiment qu’il/elle te donne.', tags: ['émotion'] },
  { mode: 'romantic', prompt: 'Compliment : dis ce que tu voudrais qu’il/elle retienne de toi pour toujours.', tags: ['souvenir'] },
  { mode: 'romantic', prompt: 'Compliment : écris “Tu es…” et termine par 3 adjectifs d’amour.', tags: ['mots'] },
  { mode: 'romantic', prompt: 'Compliment : dis pourquoi tu choisis ton/ta partenaire chaque jour.', tags: ['choix'] },
  { mode: 'romantic', prompt: 'Compliment : décris le moment où tu t’es senti(e) le/la plus aimé(e).', tags: ['moment'] },
  { mode: 'romantic', prompt: 'Compliment : dis ce que son regard change en toi.', tags: ['regard'] },
  { mode: 'romantic', prompt: 'Compliment : écris une phrase que tu aimerais graver quelque part pour lui/elle.', tags: ['éternel'] },
  { mode: 'romantic', prompt: 'Compliment : dis ce qu’il/elle t’a appris sur l’amour.', tags: ['apprentissage'] },
  // ——— HOT (élégant, suggestif mais pas explicite) ———
  { mode: 'hot', prompt: 'Compliment : écris une phrase de flirt élégant (soft, pas explicite).', tags: ['flirt'] },
  { mode: 'hot', prompt: 'Compliment : dis en une phrase ce qui t’attire le plus chez lui/elle (avec élégance).', tags: ['désir'] },
  { mode: 'hot', prompt: 'Compliment : écris “Tu es sexy quand…” et termine par une situation douce.', tags: ['séduction'] },
  { mode: 'hot', prompt: 'Compliment : dis ce que tu aimes dans sa façon de te regarder.', tags: ['regard'] },
  { mode: 'hot', prompt: 'Compliment : écris une phrase coquine en 1 ligne (élégante).', tags: ['coquin'] },
  { mode: 'hot', prompt: 'Compliment : dis ce qui te met en confiance pour être un peu coquin(ne) avec lui/elle.', tags: ['confiance'] },
  { mode: 'hot', prompt: 'Compliment : décris en 1 phrase ce que tu aimerais lui murmurer à l’oreille.', tags: ['murmure'] },
  { mode: 'hot', prompt: 'Compliment : dis ce qui te fait “craquer” chez lui/elle (avec respect).', tags: ['craquer'] },
  { mode: 'hot', prompt: 'Compliment : écris “J’adore quand tu…” et termine par un geste doux/sensuel (soft).', tags: ['geste'] },
  { mode: 'hot', prompt: 'Compliment : dis en une phrase pourquoi tu as hâte de le/la revoir.', tags: ['désir'] },
];
