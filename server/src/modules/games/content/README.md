# Contenu des jeux Zyra

Tous les textes (questions Vérité/Action, compliments, Tu préfères, quiz, défis quotidiens, etc.) sont dans des **fichiers séparés** pour que vous puissiez en ajouter des centaines facilement.

## Structure

| Fichier | Contenu | Modes |
|--------|---------|--------|
| `truth.ts` | Questions **Vérité** (Truth or Touch) | soft, romantic, hot |
| `dare.ts` | **Actions / défis** (Touch) | soft, romantic, hot |
| `compliments.ts` | **Compliments** (Compliment Rain, roue) | soft, romantic, hot |
| `would-you-rather.ts` | **Tu préfères** (options a / b) | soft, romantic, hot |
| `surprise.ts` | **Surprises** (roue du destin) | soft, romantic, hot |
| `quiz.ts` | **Quiz** à choix multiples (options.choices + answer.correctIndex) | soft, romantic, hot |
| `more-less.ts` | **Plus ou Moins** (un seul prompt type) | soft |
| `daily-challenges.ts` | **Défis quotidiens** (challengeType: text, emoji, photo, voice) | soft, romantic, hot |

## Comment ajouter du contenu

1. Ouvrez le fichier correspondant (ex. `truth.ts`).
2. Dupliquez un bloc existant et modifiez `prompt` (et `options` / `answer` si besoin).
3. Choisissez le `mode` : `'soft'`, `'romantic'` ou `'hot'`.
4. Optionnel : ajoutez des `tags` pour filtrer plus tard.

Exemple dans `truth.ts` :

```ts
{ mode: 'romantic', prompt: 'Quel moment récent t’a le plus touché(e) ?', tags: ['souvenir'] },
```

Exemple dans `would-you-rather.ts` (options a et b) :

```ts
{ mode: 'soft', prompt: 'Tu préfères…', options: { a: 'Option A', b: 'Option B' }, tags: ['fun'] },
```

Exemple dans `quiz.ts` (choix multiples + bonne réponse) :

```ts
{
  mode: 'romantic',
  prompt: 'Ta question ici ?',
  options: { choices: ['Choix 1', 'Choix 2', 'Choix 3'] },
  answer: { correctIndex: 0 },
  tags: ['préférences'],
},
```

## Index

Le fichier `index.ts` fusionne tous les tableaux et exporte `DEFAULT_GAME_QUESTIONS` et `DEFAULT_DAILY_CHALLENGES`. Le service `GamesService` seed la base au premier usage. Inutile de modifier `index.ts` sauf si vous ajoutez un **nouveau type** de jeu.

## Politique de contenu

- **Soft** : tendre, bienveillant, jamais explicite.
- **Romantic** : amour, vulnérabilité, souvenirs, poésie.
- **Hot** : flirt, désir, coquin **élégant**, jamais explicite — toujours consensuel.
