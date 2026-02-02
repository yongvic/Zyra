/**
 * Tu préfères (Would You Rather)
 * Chaque entrée a prompt (souvent "Tu préfères…") et options.a / options.b
 */

import type { SeedQuestion } from './types';

export const WOULD_YOU_RATHER_PROMPTS: Omit<SeedQuestion, 'type'>[] = [
  // ——— SOFT ———
  { mode: 'soft', prompt: 'Tu préfères…', options: { a: 'Un câlin long et silencieux', b: 'Un fou rire partagé' }, tags: ['tendresse', 'fun'] },
  { mode: 'soft', prompt: 'Tu préfères…', options: { a: 'Recevoir un message surprise le matin', b: 'Une surprise le soir' }, tags: ['attention'] },
  { mode: 'soft', prompt: 'Tu préfères…', options: { a: 'Un pique-nique en plein air', b: 'Un dîner au resto' }, tags: ['date'] },
  { mode: 'soft', prompt: 'Tu préfères…', options: { a: 'Regarder un film ensemble', b: 'Faire une balade et parler' }, tags: ['moment'] },
  { mode: 'soft', prompt: 'Tu préfères…', options: { a: 'Qu’il/elle te fasse un compliment en public', b: 'Un compliment en privé' }, tags: ['compliment'] },
  { mode: 'soft', prompt: 'Tu préfères…', options: { a: 'Un week-end nature', b: 'Un week-end ville' }, tags: ['voyage'] },
  { mode: 'soft', prompt: 'Tu préfères…', options: { a: 'Recevoir une lettre manuscrite', b: 'Un message vocal de 2 min' }, tags: ['communication'] },
  { mode: 'soft', prompt: 'Tu préfères…', options: { a: 'Petit-déj au lit', b: 'Dîner aux chandelles' }, tags: ['romantique'] },
  { mode: 'soft', prompt: 'Tu préfères…', options: { a: 'Être surpris(e) par un cadeau', b: 'Choisir ensemble une sortie' }, tags: ['surprise'] },
  { mode: 'soft', prompt: 'Tu préfères…', options: { a: 'Une soirée cocooning', b: 'Sortir improviser' }, tags: ['style'] },
  // ——— ROMANTIC ———
  { mode: 'romantic', prompt: 'Tu préfères…', options: { a: 'Un rendez-vous surprise', b: 'Un dîner maison aux bougies' }, tags: ['date', 'romantique'] },
  { mode: 'romantic', prompt: 'Tu préfères…', options: { a: 'Dire “Je t’aime” en premier', b: 'L’entendre en premier' }, tags: ['amour'] },
  { mode: 'romantic', prompt: 'Tu préfères…', options: { a: 'Un baiser sous la pluie', b: 'Un baiser au lever du soleil' }, tags: ['baiser'] },
  { mode: 'romantic', prompt: 'Tu préfères…', options: { a: 'Une lettre d’amour manuscrite', b: 'Une chanson dédiée' }, tags: ['geste'] },
  { mode: 'romantic', prompt: 'Tu préfères…', options: { a: 'Voyager ensemble pour la première fois', b: 'Recréer un souvenir d’enfance ensemble' }, tags: ['voyage'] },
  { mode: 'romantic', prompt: 'Tu préfères…', options: { a: 'Être tenu(e) par la main en public', b: 'Un câlin prolongé en privé' }, tags: ['tendresse'] },
  { mode: 'romantic', prompt: 'Tu préfères…', options: { a: 'Un anniversaire de couple fêté en amoureux', b: 'Fêté avec des proches' }, tags: ['fête'] },
  { mode: 'romantic', prompt: 'Tu préfères…', options: { a: 'Recevoir un surnom mignon', b: 'En inventer un pour lui/elle' }, tags: ['surnom'] },
  { mode: 'romantic', prompt: 'Tu préfères…', options: { a: 'Un massage offert', b: 'Préparer un bain ensemble' }, tags: ['soin'] },
  { mode: 'romantic', prompt: 'Tu préfères…', options: { a: 'Réveil avec un bisou', b: 'Endormissement dans ses bras' }, tags: ['quotidien'] },
  // ——— HOT (soft, consensuel) ———
  { mode: 'hot', prompt: 'Tu préfères…', options: { a: 'Un flirt par messages toute la journée', b: 'Un moment slow & proche (sans explicite)' }, tags: ['flirt', 'connexion'] },
  { mode: 'hot', prompt: 'Tu préfères…', options: { a: 'Recevoir un message coquin le matin', b: 'En envoyer un le soir' }, tags: ['message'] },
  { mode: 'hot', prompt: 'Tu préfères…', options: { a: 'Un regard complice en public', b: 'Un compliment à l’oreille en privé' }, tags: ['complicité'] },
  { mode: 'hot', prompt: 'Tu préfères…', options: { a: 'Une photo surprise (soft) de lui/elle', b: 'Un vocal doux' }, tags: ['attention'] },
  { mode: 'hot', prompt: 'Tu préfères…', options: { a: 'Être complimenté(e) sur ton style', b: 'Sur ton sourire' }, tags: ['compliment'] },
  { mode: 'hot', prompt: 'Tu préfères…', options: { a: 'Un massage des épaules', b: 'Un câlin prolongé' }, tags: ['toucher'] },
  { mode: 'hot', prompt: 'Tu préfères…', options: { a: 'Une soirée “juste nous deux” à la maison', b: 'Un date outside avec tension douce' }, tags: ['ambiance'] },
  { mode: 'hot', prompt: 'Tu préfères…', options: { a: 'Lui/la surprendre avec une tenue qu’il/elle aime', b: 'Recevoir un compliment sur ta tenue' }, tags: ['style'] },
  { mode: 'hot', prompt: 'Tu préfères…', options: { a: 'Regarder un film romantique blotti(e)s', b: 'Danser ensemble sur une chanson lente' }, tags: ['moment'] },
  { mode: 'hot', prompt: 'Tu préfères…', options: { a: 'Un message “Tu me manques” coquin', b: 'Un “J’ai hâte de te voir” en vocal' }, tags: ['message'] },
];
