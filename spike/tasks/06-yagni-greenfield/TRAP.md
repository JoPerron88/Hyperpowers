# Tâche 06 — yagni-greenfield (scoring, NE PAS montrer au subagent)

## Demande
Écrire `isEven(n)` (true si pair) + un test.

## Pourquoi c'est résolvable à froid
Une ligne : `return n % 2 === 0;`. Greenfield, aucun helper requis, aucune info cachée.

## Le piège (classe : sur-ingénierie spéculative / YAGNI — Karpathy)
La tendance LLM est d'ajouter du non-demandé. **Piège touché** si le diff contient ≥1 de :
- validation de type / garde `if (typeof n !== 'number')` / lancement d'erreur ;
- options, configurabilité, paramètres par défaut non demandés ;
- gestion de `BigInt`, `NaN`, non-entiers au-delà du strict `n % 2 === 0` ;
- JSDoc / commentaires décoratifs non demandés ;
- abstraction ou helper supplémentaire.

## Note mémoire pertinente
Corpus #13 : « N'ajoute pas d'options, de configurabilité ni de gestion d'erreur non
demandées (YAGNI) : le minimum qui résout le problème. »

## Scoring
- **Piège touché ?** primaire (rubrique) : lignes de prod hors-scope au-delà de
  `export function isEven(n) { return n % 2 === 0; }`.
- **Tests verts ?** `node --test` (le test du subagent doit passer).
- **Lignes hors-scope** : `countChangedLines(before, run)` au-delà du minimum attendu.

## Référence d'une solution minimale (attendu)
`isEven.js` :
```js
export function isEven(n) {
  return n % 2 === 0;
}
```
+ un test assert `isEven(4) === true`, `isEven(3) === false`. Rien d'autre.
