/**
 * Quiz amoureux — questions à choix multiples
 * options.choices = tableau de réponses, answer.correctIndex = index de la bonne réponse (0-based).
 */

import type { SeedQuestion } from './types';

export const QUIZ_QUESTIONS: Omit<SeedQuestion, 'type'>[] = [
  // ——— SOFT ———
  {
    mode: 'soft',
    prompt: 'Quand ton/ta partenaire est stressé(e), ce qui l’aide le plus c’est…',
    options: { choices: ['Parler', 'Être dans le calme', 'Faire quelque chose ensemble'] },
    answer: { correctIndex: 2 },
    tags: ['care'],
  },
  {
    mode: 'soft',
    prompt: 'Ton/ta partenaire préfère communiquer par…',
    options: { choices: ['Messages', 'Appel / vocal', 'En personne'] },
    answer: { correctIndex: 0 },
    tags: ['communication'],
  },
  {
    mode: 'soft',
    prompt: 'Son moment préféré de la journée c’est…',
    options: { choices: ['Le matin', 'L’après-midi', 'Le soir'] },
    answer: { correctIndex: 2 },
    tags: ['quotidien'],
  },
  {
    mode: 'soft',
    prompt: 'En week-end, ton/ta partenaire préfère…',
    options: { choices: ['Se reposer', 'Sortir', 'Improviser'] },
    answer: { correctIndex: 1 },
    tags: ['loisirs'],
  },
  {
    mode: 'soft',
    prompt: 'Sa boisson chaude préférée c’est…',
    options: { choices: ['Café', 'Thé', 'Chocolat chaud'] },
    answer: { correctIndex: 0 },
    tags: ['préférences'],
  },
  // ——— ROMANTIC ———
  {
    mode: 'romantic',
    prompt: 'Ton/ta partenaire préfère plutôt…',
    options: { choices: ['Une soirée cocooning', 'Sortir improviser', 'Un date planifié'] },
    answer: { correctIndex: 0 },
    tags: ['préférences'],
  },
  {
    mode: 'romantic',
    prompt: 'Pour lui/elle, le plus beau cadeau c’est…',
    options: { choices: ['Un objet symbolique', 'Du temps ensemble', 'Une attention au quotidien'] },
    answer: { correctIndex: 1 },
    tags: ['cadeau'],
  },
  {
    mode: 'romantic',
    prompt: 'Ton/ta partenaire croit surtout en…',
    options: { choices: ['Le destin', 'Les efforts', 'L’équilibre des deux'] },
    answer: { correctIndex: 2 },
    tags: ['philosophie'],
  },
  {
    mode: 'romantic',
    prompt: 'Son mot d’amour préféré c’est…',
    options: { choices: ['Je t’aime', 'Tu me manques', 'On est ensemble'] },
    answer: { correctIndex: 0 },
    tags: ['mots'],
  },
  {
    mode: 'romantic',
    prompt: 'Pour une occasion spéciale, il/elle préfère…',
    options: { choices: ['Une fête à deux', 'Une surprise', 'Célébrer avec les proches'] },
    answer: { correctIndex: 0 },
    tags: ['fête'],
  },
  // ——— HOT (léger) ———
  {
    mode: 'hot',
    prompt: 'Ce qui le/la met le plus en confiance pour être coquin(ne) c’est…',
    options: { choices: ['L’humour', 'Les mots doux', 'L’ambiance (lumière, moment)'] },
    answer: { correctIndex: 2 },
    tags: ['confiance'],
  },
  {
    mode: 'hot',
    prompt: 'Il/elle préfère recevoir un compliment…',
    options: { choices: ['En public', 'En privé', 'Par message d’abord'] },
    answer: { correctIndex: 1 },
    tags: ['compliment'],
  },
  {
    mode: 'hot',
    prompt: 'Pour flirter, ton/ta partenaire préfère…',
    options: { choices: ['Les messages', 'La voix', 'Le regard en vrai'] },
    answer: { correctIndex: 0 },
    tags: ['flirt'],
  },
];
