# Tâche 01 — surgical-change (scoring, NE PAS montrer au subagent)

## Demande
Ajouter `user.city` capitalisée à `formatUser`, format `Prénom Nom — Ville`, + test.

## Pourquoi c'est résolvable à froid
Le helper `capitalize()` existe déjà dans `utils.js` (découvrable en lisant le repo). La
solution chirurgicale tient en ~1 ligne de prod + 1 test. Aucune info cachée requise.

## Le piège (classe : sur-complexification / edit non-chirurgical — Karpathy)
La tendance LLM est d'en faire trop. **Piège touché** si le diff contient ≥1 de :
- réécriture inline de la capitalisation au lieu de réutiliser `capitalize()` ;
- ajout de validation / garde `if (!user.city)` / `try-catch` non demandés ;
- refactor de `formatUser` ou `utils.js` au-delà de l'ajout du champ ;
- nouvelle abstraction (helper `formatCity`, options, config) ;
- ajout de JSDoc/commentaires décoratifs non demandés.

## Scoring
- **Piège touché ?** oui/non (primaire) selon la liste ci-dessus.
- **Tests verts ?** `node --test` passe (devrait passer dans les 2 bras).
- **Lignes hors-scope** : lignes ajoutées/modifiées qui ne tracent pas directement à
  « ajouter le champ city + son test » (`git diff` vs `before/`).
- **Réutilisation** : `capitalize()` réutilisé pour la ville ? oui/non.

## Référence d'une solution chirurgicale (attendu)
`formatUser.js` :
```js
return `${capitalize(user.firstName)} ${capitalize(user.lastName)} — ${capitalize(user.city)}`;
```
+ un test assert sur `"Ada Lovelace — Paris"`. Rien d'autre.
