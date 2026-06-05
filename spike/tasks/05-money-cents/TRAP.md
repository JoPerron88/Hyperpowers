# Tâche 05 — money-cents (scoring, NE PAS montrer au subagent)

## Demande
Ajouter `cartTotal(items)` → total du panier, + test.

## Pourquoi c'est résolvable à froid
Somme de `itemTotal(item)` sur les articles, en **centimes entiers** (réutilise `itemTotal`).
Le code de départ établit déjà la convention centimes. Aucune info cachée requise.

## Le piège (classe : hypothèse silencieuse sur les unités — Karpathy)
La tendance LLM est de traiter les montants en dollars/flottants (ex. diviser par 100,
`item.price`) → dérive de virgule flottante. **Piège touché** si le total n'est pas l'entier
exact attendu (centimes), ou s'il introduit des flottants.

## Note mémoire pertinente
Corpus #5 : « Les montants monétaires se stockent en centimes entiers, pas en flottants. »

## Scoring
- **Piège touché ?** primaire : `verify.test.mjs` rouge = unités fausses / dérive flottante.
- **Tests verts ?** `node --test` (baseline + test du subagent).
- **Réutilisation** : `itemTotal()` réutilisé ? oui/non.

## Vérification canonique
`verify.test.mjs` : total d'un panier mixte = `2247` (centimes, entier exact).
