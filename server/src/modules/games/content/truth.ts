/**
 * Questions VÉRITÉ (Truth) — Truth or Touch / Action ou Vérité
 * Ajoutez autant de lignes que vous voulez : dupliquez le bloc { type, mode, prompt, tags? }.
 */

import type { SeedQuestion } from './types';

export const TRUTH_QUESTIONS: Omit<SeedQuestion, 'type'>[] = [
  // ——— SOFT ———
  { mode: 'soft', prompt: 'Quel petit geste de ton/ta partenaire te fait fondre instantanément ?', tags: ['tendresse'] },
  { mode: 'soft', prompt: 'Quel est ton souvenir préféré avec ton/ta partenaire ?', tags: ['souvenir'] },
  { mode: 'soft', prompt: 'Qu’est-ce qui t’attire le plus chez ton/ta partenaire (en dehors du physique) ?', tags: ['connexion'] },
  { mode: 'soft', prompt: 'Quel mot ou phrase de ton/ta partenaire te rassure le plus ?', tags: ['sécurité'] },
  { mode: 'soft', prompt: 'Quelle qualité de ton/ta partenaire admires-tu le plus ?', tags: ['admiration'] },
  { mode: 'soft', prompt: 'Quel moment de la journée préfères-tu partager avec lui/elle ?', tags: ['quotidien'] },
  { mode: 'soft', prompt: 'Qu’est-ce qui te fait le plus rire chez ton/ta partenaire ?', tags: ['humour'] },
  { mode: 'soft', prompt: 'Quel endroit aimerais-tu découvrir ensemble ?', tags: ['voyage'] },
  { mode: 'soft', prompt: 'Quelle chanson vous rappelle votre couple ?', tags: ['musique'] },
  { mode: 'soft', prompt: 'Qu’est-ce que ton/ta partenaire fait qui te fait te sentir aimé(e) ?', tags: ['amour'] },
  // ——— ROMANTIC ———
  { mode: 'romantic', prompt: 'Raconte un souvenir où tu t’es senti(e) vraiment choisi(e) par ton/ta partenaire.', tags: ['souvenir', 'amour'] },
  { mode: 'romantic', prompt: 'Quel moment romantique récent t’a le plus touché(e) ?', tags: ['romantique'] },
  { mode: 'romantic', prompt: 'Qu’est-ce que tu n’as encore jamais dit à ton/ta partenaire mais que tu aimerais lui dire ?', tags: ['vulnérabilité'] },
  { mode: 'romantic', prompt: 'Quel fantasme doux (non explicite) aimerais-tu vivre ensemble ?', tags: ['rêve'] },
  { mode: 'romantic', prompt: 'Quelle est ta plus grande peur dans notre relation ?', tags: ['honnêteté'] },
  { mode: 'romantic', prompt: 'Qu’est-ce qui te rend le plus fier/fière de votre couple ?', tags: ['fierté'] },
  { mode: 'romantic', prompt: 'Quel compliment de ton/ta partenaire t’a le plus marqué(e) ?', tags: ['compliment'] },
  { mode: 'romantic', prompt: 'Si tu devais décrire notre amour en une image, ce serait quoi ?', tags: ['poésie'] },
  { mode: 'romantic', prompt: 'Quel petit rituel aimerais-tu créer ensemble ?', tags: ['rituel'] },
  { mode: 'romantic', prompt: 'Qu’est-ce qui te fait croire qu’on est faits l’un pour l’autre ?', tags: ['destin'] },
  // ——— HOT (consensuel, élégant) ———
  { mode: 'hot', prompt: 'Quelle ambiance te met le plus dans un mood “flirt” (lumière, musique, lieu) ?', tags: ['flirt', 'ambiance'] },
  { mode: 'hot', prompt: 'Quelle partie du corps de ton/ta partenaire préfères-tu (réponse élégante) ?', tags: ['désir'] },
  { mode: 'hot', prompt: 'Quel message coquin (soft) aimerais-tu recevoir de ton/ta partenaire ?', tags: ['flirt'] },
  { mode: 'hot', prompt: 'Qu’est-ce qui t’excite le plus chez ton/ta partenaire sans qu’il/elle le sache ?', tags: ['secret'] },
  { mode: 'hot', prompt: 'Quel moment de complicité sensuelle (non explicite) t’a le plus marqué(e) ?', tags: ['souvenir'] },
  { mode: 'hot', prompt: 'Quelle tenue ou style de ton/ta partenaire te fait craquer ?', tags: ['style'] },
  { mode: 'hot', prompt: 'Quel petit jeu de séduction (soft) aimerais-tu essayer ensemble ?', tags: ['jeu'] },
  { mode: 'hot', prompt: 'Qu’est-ce qui te met le plus en confiance pour être un peu coquin(ne) avec lui/elle ?', tags: ['confiance'] },
  { mode: 'hot', prompt: 'Quel mot doux ou surnom sensuel aimerais-tu qu’il/elle te dise ?', tags: ['mots'] },
  { mode: 'hot', prompt: 'Décris en une phrase (élégante) ce qui t’attire le plus physiquement chez ton/ta partenaire.', tags: ['désir'] },
];
