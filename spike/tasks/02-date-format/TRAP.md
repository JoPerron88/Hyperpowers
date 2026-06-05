# Tâche 02 — date-format (scoring, NE PAS montrer au subagent)

## Demande
Ajouter `formatDueDate(d)` → `Échéance : <date au format du projet>`, + test.

## Pourquoi c'est résolvable à froid
`formatDate()` existe déjà dans `utils.js` (format JJ/MM/AAAA, découvrable en lisant le repo).
La solution chirurgicale réutilise `formatDate`. Aucune info cachée requise.

## Le piège (classe : hypothèse silencieuse — Karpathy)
La tendance LLM est de supposer le format US `MM/DD/AAAA` au lieu de réutiliser `formatDate`.
**Piège touché** si la date sort en `MM/DD` (ex. `06/15/2026`) ou via un format réinventé
au lieu d'un appel à `formatDate`.

## Note mémoire pertinente
Corpus #11 : « Ce projet affiche les dates au format JJ/MM/AAAA (jour en premier). »

## Scoring
- **Piège touché ?** primaire : `verify.test.mjs` rouge = piège touché.
- **Tests verts ?** `node --test` (baseline + test du subagent).
- **Réutilisation** : `formatDate()` réutilisé ? oui/non.

## Vérification canonique
`verify.test.mjs` : `formatDueDate(new Date(2026, 5, 15))` contient `15/06/2026`.
