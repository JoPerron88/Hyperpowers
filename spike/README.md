# Spike — La mémoire améliore-t-elle la qualité du code ?

Premier code du projet. Teste l'hypothèse centrale d'Hyperpowers (analyse #3),
rétrogradée en hypothèse par le débat (analyse #5) : **« se souvenir d'apprentissages
passés améliore le code futur ».**

C'est un **kill-test**, pas une validation :
- **Rouge décisif** : si même un rappel *parfait* (mémoire-oracle) n'améliore pas la
  qualité → l'hypothèse tombe, on n'investit pas dans la boucle mémoire.
- **Vert nécessaire mais pas suffisant** : le vrai système ajoute du bruit de retrieval et
  de l'erreur de distillation que l'oracle saute. Un vert autorise le palier suivant, il ne
  le garantit pas.

## Design

- **Mémoire-oracle** : on simule un rappel parfait avec un corpus de notes curé. On ne monte
  PAS mempalace ici — le retrieval est déjà prouvé à 96,6 %. On teste le *plafond*.
- **Apparié intra-tâche** : chaque tâche est jouée 2 fois, **sessions/subagents frais** :
  - **À froid** (control) : la tâche seule.
  - **Avec mémoire** (treatment) : la tâche + le corpus mémoire injecté au départ.
  - Chaque tâche est son propre témoin → neutralise la difficulté de la tâche.
- **Anti-trucage** :
  1. Tâches **résolvables à froid** — la mémoire améliore la qualité, ne débloque pas une
     tâche impossible.
  2. La note pertinente est **noyée dans ~9 notes non pertinentes** (`memory/corpus.md`) →
     teste rappel *plus reconnaissance*, pas un indice ciblé.
  3. La note pertinente est un **principe transférable**, jamais la solution littérale.
  4. Pièges réalistes, **difficulté non calibrée** : si les runs à froid ne tombent pas dans
     un piège réaliste, *c'est le résultat* (le modèle n'a pas besoin de cette mémoire).

## Métriques (score sur le diff final + tests seulement)

| Métrique | Comment | Rôle |
|---|---|---|
| **Piège touché ?** | rubrique dans `tasks/*/TRAP.md`, jugé sur le diff | **primaire** |
| **Tests verts** | `node --test` dans le dossier de travail | plancher (les 2 bras devraient passer) |
| **Lignes hors-scope** | `git diff` vs `before/` : lignes changées qui ne tracent pas à la demande | qualité (chirurgical) |
| **Réutilisation** | a-t-il réutilisé l'existant ou réinventé ? | qualité |

> On laisse tomber « itérations jusqu'au vert » : le mesurer demande un harnais qui mange
> l'après-midi (proportionnalité — analyse #5).

## Seuil pré-enregistré

> Mémoire (provisoirement) utile si, sur les tâches où le run **à froid** dégrade la qualité
> (piège touché ou lignes hors-scope notables), la mémoire-oracle **divise ce taux par ≥2
> sans casser de tests**. Sinon → **rouge, on arrête**.

## Protocole d'exécution

Pour chaque tâche `tasks/NN-xxx/` et chaque condition :
1. Copier `before/` dans un dossier de travail neuf.
2. Dispatcher un **subagent frais** avec :
   - **à froid** : le contenu de `PROMPT.md`.
   - **avec mémoire** : `memory/corpus.md` + puis `PROMPT.md`.
3. Récupérer le diff final + lancer `node --test`.
4. Scorer selon `TRAP.md`. Le subagent ne voit jamais `TRAP.md` ni `memory/key.md`.

## État

- [x] Harnais + tâche-exemple `01-surgical-change` (cette session)
- [ ] Tâches 02–06 (à répliquer après réaction)
- [ ] Exécution des 2×N runs + tableau de résultats
- [ ] Lecture vs seuil → vert/rouge
