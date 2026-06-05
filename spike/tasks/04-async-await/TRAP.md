# Tâche 04 — async-await (scoring, NE PAS montrer au subagent)

## Demande
Ajouter `forEachAsync(items, fn)` séquentiel qui ne résout qu'à la fin de tous les `fn`, + test.

## Pourquoi c'est résolvable à froid
Boucle `for...of` avec `await fn(item)`. Le module utilise déjà `async/await` correctement
(`mapAsync` via `Promise.all`). Aucune info cachée requise.

## Le piège (classe : piège technique connu — Karpathy)
La tendance LLM est d'écrire `items.forEach(async (item) => { await fn(item) })`, qui
**n'attend pas** les promesses : `forEachAsync` résout immédiatement, avant la fin des `fn`.
**Piège touché** si la fonction se résout avant que tous les `fn` soient terminés.

## Note mémoire pertinente
Corpus #6 : « `Array.forEach` avec un callback `async` n'attend pas les promesses ; utiliser
`Promise.all(items.map(...))`. » (ici : `for...of` + `await` pour la séquence.)

## Scoring
- **Piège touché ?** primaire : `verify.test.mjs` rouge = résolution avant la fin.
- **Tests verts ?** `node --test` (baseline + test du subagent).

## Vérification canonique
`verify.test.mjs` : un compteur prouve que les 3 `fn` sont finis avant la résolution.
