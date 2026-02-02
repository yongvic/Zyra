# Spécification des jeux premium Zyra

Chaque jeu doit créer des **moments** : connexion, sourire, excitation douce, complicité. Zyra ne cherche pas la performance — Zyra crée des moments.

---

## Exigences communes à tous les jeux

| Élément | Description |
|--------|-------------|
| **Introduction animée** | Courte séquence d’entrée (titre, sous-titre, illustration ou icône) avec fondu + léger scale/translate. Durée ~1,5–2 s. |
| **Ambiance sonore douce** | Boucle ou fond musical discret (optionnel, volume faible). Sons courts pour micro-feedback (tap, validation, succès). |
| **Micro-interactions naturelles** | Boutons avec léger scale au tap, transitions fluides (opacity, transform), pas de saccades. |
| **Version romantique (soft)** | Contenu adapté : doux, bienveillant, jamais explicite. |
| **Version sensuelle (18+)** | Activée **volontairement** par les deux partenaires (double consentement). Questions/défis plus intimes mais élégants, jamais explicites. |
| **Conclusion émotionnelle** | À la fin d’une partie ou d’un round : feedback visuel, souvenir (résumé), score ou message personnalisé. Animation de clôture (confettis légers, halo, message “À bientôt”). |

---

## Jeux détaillés

### ❤️ Telepathy Love (Télépathie Amour)

**Principe** : Connexion mentale du couple — même question, réponses en secret, révélation simultanée.

- **Flow**
  1. Une question apparaît au centre dans une **bulle lumineuse** (animation d’apparition).
  2. Les deux partenaires voient la **même question** mais répondent **séparément** (chacun sur son appareil).
  3. **Compte à rebours circulaire** animé (ex. 10 s) avant révélation.
  4. Au zéro : **révélation simultanée** des deux réponses avec une **animation spectaculaire** (flip, scale, fondu).
- **Match**
  - Si les réponses **correspondent** : **halo doré** enveloppe l’écran + **son chaleureux** (ting, cloche).
  - Plus le couple enchaîne les matchs, plus un indicateur de **“connexion”** augmente visuellement (barre, cœurs, niveau).
- **Modes**
  - Soft / Romantique : questions du type “Où aimerais-tu voyager avec ton partenaire ?”, “Quel moment partagé te rend le plus heureux ?”.
  - Hot (18+, consensuel) : questions plus intimes mais élégantes, ex. “Quelle partie du corps de ton partenaire préfères-tu ?”.
- **Backend** : Session type `telepathy`, questions type `telepathy` (ou réutilisation `quiz` avec logique “réponse ouverte” + comparaison). Stocker réponses par user, révélation après countdown.
- **Conclusion** : Affichage du nombre de matchs, message du type “Votre connexion : X/5” ou “Vous êtes en phase sur Y questions”.

---

### 🎡 Destiny Wheel (Roue du Destin)

**Principe** : Une grande roue 3D au centre ; les deux posent le doigt pour “charger” l’énergie, au relâchement la roue tourne avec inertie réaliste.

- **Flow**
  1. **Roue 3D** (ou 2.5D) flottant au centre (ombre douce, léger mouvement de flottement).
  2. Chaque partenaire **pose son doigt** (bouton “Je charge”) pour charger l’énergie. Quand **les deux** ont chargé, bouton “Lancer” (ou relâchement automatique après 3 s).
  3. **Rotation** avec **inertie réaliste** (ralentissement progressif).
  4. **Ralentissement dramatique** en fin de course (suspense).
  5. À l’arrêt : **carte animée** qui révèle le résultat (slide-in ou flip).
- **Types de résultats**
  - Compliment
  - Défi romantique
  - Question profonde
  - Action surprise
  - Mission hot (en mode intime uniquement)
- **Mode intime** : Défis sensuels doux (messages coquins, photos suggestives, actions de désir) — jamais explicites.
- **Backend** : Déjà en place (`wheel`, questions `compliment` / `surprise` / `truth` / `dare`). Adapter le tirage pour “mission hot” en mode hot.
- **Conclusion** : Afficher la carte résultat + court message “À vous de jouer !” ou “Partagez ce moment”.

---

### 🎭 Truth or Touch (Vérité ou Contact)

**Principe** : Version émotionnelle de “Action ou Vérité”. Choix entre **Truth** (question personnelle/amoureuse) et **Touch** (action romantique ou sensuelle).

- **Flow**
  1. Le joueur choisit **Truth** ou **Touch**.
  2. Une **carte** arrive avec **animation flottante** (slide + léger rebond).
  3. **Truth** : question à répondre (affichée à l’autre après envoi).
  4. **Touch** : action à réaliser (ex. “Envoie un selfie sourire”, “Écris un message coquin”, “Enregistre un audio doux”). Le **partenaire doit accepter** avant que l’action soit “validée”.
- **Exemples**
  - Truth : “Quelle est ta plus grande peur dans notre relation ?”, “Quel fantasme doux aimerais-tu vivre ensemble ?”
  - Touch : selfie, message coquin, audio doux.
- **Backend** : Réutiliser `truth-dare` ; côté front, différencier clairement Truth (question) vs Touch (action), et ajouter flow “acceptation partenaire” pour les actions.
- **Conclusion** : Résumé des cartes jouées (nombre Truth / Touch), message “Merci d’avoir partagé”.

---

### 🧠 Love Quiz Personnalisé (Quiz Amoureux)

**Principe** : Chaque partenaire **crée des questions sur lui-même**. L’autre y répond ; les réponses sont affichées en **bulles animées**.

- **Flow**
  1. Écran “Créer une question” (ex. “Ma boisson préférée ?”, “Ce que j’aime le plus quand tu me touches ?” en hot).
  2. L’autre partenaire reçoit la question et choisit parmi des options ou texte libre (selon implémentation).
  3. **Réponses animées** sous forme de **bulles** (apparition en cascade ou une par une).
  4. À la fin d’un set : **score de compatibilité** avec **animation circulaire dynamique** (jauge ou pourcentage).
- **Backend** : Questions créées par les users (table ou champ dédié “custom questions” par couple/user). Session type `quiz` avec source “custom”.
- **Conclusion** : Score de compatibilité + message “Vous vous connaissez bien !” / “Encore un peu de pratique…” avec animation circulaire.

---

### 🃏 Memory Love (Memory Couple)

**Principe** : Jeu de mémoire **émotionnel** : les paires ne sont pas que des symboles, mais **souvenirs, photos, emojis amoureux, mots doux**.

- **Flow**
  1. **Cartes 3D** (ou 2D avec effet de profondeur) qui **flottent** doucement sur la grille.
  2. Retourner deux cartes : si **paire**, **animation lumineuse** (glow, particules) + **génération d’un souvenir** (texte ou association à une photo/memory existante).
  3. En **mode hot** : certaines cartes peuvent révéler des **défis sensuels** ou des **photos privées** (upload couple).
- **Backend** : Session `memory` existante. Étendre `state` pour associer des paires à des “souvenirs” (texte, memoryId) ou défis. Contenu hot stocké de façon sécurisée (privé couple).
- **Conclusion** : Nombre de paires trouvées, liste des “souvenirs” générés, message “Votre mémoire d’amour”.

---

### 🌸 Daily Couple Challenges (Défi Quotidien)

**Principe** : Chaque jour, Zyra propose **un défi commun** au couple.

- **Flow**
  1. Affichage du **défi du jour** (ex. “Dire trois qualités de ton partenaire”, “Envoyer une photo spontanée”, “Écrire un mini poème”, “Partager un moment intime”).
  2. **Barre de progression** : chaque partenaire peut cocher “Fait” ou soumettre une preuve ; la barre se remplit (ex. 2/2 quand les deux ont validé).
  3. Quand le défi est **accompli** (les deux ont participé/validé) : **animation de célébration** (confettis, halo, message “Défi du jour relevé !”).
- **Backend** : Déjà en place (`daily-challenge`, assignments, completions, validation).
- **Conclusion** : Message de félicitations + rappel du défi accompli ; option “Partager ce moment” (souvenir).

---

### 💌 Love Letter Game (Lettre d’amour)

**Principe** : Un partenaire écrit un **message brut** ; une **IA** transforme le texte en **lettre romantique stylisée**. La lettre s’affiche avec une **animation manuscrite** (effet “écrite en temps réel”).

- **Flow**
  1. Champ de saisie : “Écris ce que tu veux lui dire.”
  2. Envoi → appel backend (service IA ou règle de style) → retour d’un texte **stylisé** (romantique ou sensuel selon mode).
  3. **Affichage** de la lettre avec **animation type écriture** (curseur qui avance, caractères qui apparaissent un par un ou par mots).
  4. Mode hot : la lettre peut être **plus sensuelle** tout en restant **artistique**.
- **Backend** : Nouveau endpoint “transform letter” (IA ou template). Stocker la lettre dans Memories ou table dédiée.
- **Conclusion** : “Lettre envoyée à [partenaire]” + option “Sauvegarder dans les souvenirs”.

---

### 🌿 Mood Garden (Jardin des humeurs)

**Principe** : Chaque **émotion** exprimée (joie, désir, manque, amour) **plante une fleur** dans un **jardin partagé**. Les fleurs **poussent avec le temps**.

- **Mapping**
  - Joie → tournesol  
  - Désir → rose  
  - Manque → lavande  
  - Amour → cerisier  
- **Flow**
  1. Le couple choisit une émotion (ou elle est déduite d’une action : message, défi complété, etc.).
  2. Une **nouvelle fleur** apparaît dans le jardin (animation de plantation + croissance courte).
  3. Les **deux partenaires** voient le **même jardin** évoluer (sync via backend).
- **Backend** : Table “MoodGarden” ou JSON dans Couple : liste d’événements (emotion, date, userId). Calcul des fleurs à afficher selon les événements.
- **Conclusion** : Vue du jardin actuel + “Votre jardin grandit avec vos émotions”.

---

### 🌧 Compliment Rain (Pluie de compliments)

**Principe** : Une **pluie de compliments** tombe sur l’écran. Chaque **tap** fait **éclater** un mot en **cœur animé**.

- **Flow**
  1. Des **mots doux** tombent (compliments prédéfinis ou générés) comme des gouttes.
  2. L’utilisateur **tape** sur un mot → il **éclate** en **cœurs** (particules, animation).
  3. En **mode hot** : les mots peuvent être **plus suggestifs** (toujours élégants).
- **Backend** : Questions type `compliment` ; côté front, affichage en “pluie” et gestion du tap.
- **Conclusion** : Nombre de compliments “attrapés”, message “Vous avez fait pleuvoir l’amour”.

---

## 🔥 Mode Intime (18+)

- **Activation** : **Volontaire** et **double consentement** (les deux partenaires activent).
- **Ambiance** : Thème **rouge velours**, lumière **tamisée**, **musique lente** (optionnel).
- **Contenu** : Questions sensuelles, défis coquins, jeux de désir, messages audio intimes. Tout reste **sensuel** et **élégant**, jamais explicite.
- **Technique** : Flag `intimateMode` en session ou préférence couple ; tous les jeux qui supportent “hot” respectent ce flag et affichent le thème adapté.

---

## Philosophie globale

- **Connexion** : Chaque jeu doit rapprocher les partenaires (écoute, révélation, partage).
- **Sourire** : Ton bienveillant, léger, jamais culpabilisant.
- **Excitation douce** : Possibilité de monter en intimité de façon consentie et élégante.
- **Complicité** : Jeux à deux, tour par tour ou simultanés, avec feedback partagé.

**Zyra crée des moments, pas des performances.**
