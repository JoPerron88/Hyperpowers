# Spec — Skill `cahier-maitre`

**Date :** 2026-06-08
**Statut :** validé par l'utilisateur (post-brainstorming-advanced)

---

## But

Un log séquentiel narratif d'avancement de projet, destiné à l'humain. Distinct de :
- `session-handoff/HANDOFF.md` — snapshot d'état courant, écrasé à chaque session
- `.claude/JOURNAL.md` — journal privé local, gitignoré, orienté IA
- `git log` — historique technique atomique, orienté machine

**Trou comblé :** fil narratif cumulatif, commité, lisible sans git, retrouvable mois plus tard.

---

## Décision (Option A)

Skill autonome `cahier-maitre` + intégration légère optionnelle dans `session-handoff`.

## Format de CAHIER.md

```markdown
## 2026-06-08 — Jonathan

Décision archi : distro curée (option C) adoptée. marketplace.json reste à faire (v5).
brainstorming-advanced v2 livré. 42 tests verts.

## 2026-06-07 — Jonathan

...
```

- Racine du repo, **commité dans git** (suit le projet au clone)
- H2 `## YYYY-MM-DD — <auteur>` (auteur = `git config user.name`)
- Texte libre 2-3 lignes max — avancées + problèmes, ton narratif
- **Prepend** : nouvelle entrée en haut du fichier (pas besoin de lire le fichier entier)
- Pas de champs imposés, pas de frontmatter, format humain

---

## Comportement du skill

### Trigger

Invocation manuelle par l'utilisateur : "note dans le cahier", "mets ça dans le cahier",
"ajoute une entrée", ou invocation directe `/cahier-maitre`.

### Ce que fait Claude

1. Lit `git config user.name` pour l'auteur.
2. Résume automatiquement les événements clés de la session courante (avancées + problèmes)
   en 2-3 lignes, ton narratif court — sans lire CAHIER.md.
3. Prepend l'entrée dans CAHIER.md (ou crée le fichier s'il n'existe pas).
4. Confirme à l'utilisateur (une ligne).

### Ce que le skill NE fait PAS

- Ne lit pas CAHIER.md avant d'écrire (prepend = opération triviale sans lecture).
- Ne reformate pas les entrées existantes.
- Ne résume pas l'historique entier.

---

## Intégration avec session-handoff

`session-handoff` gagne une étape optionnelle (après l'étape journal actuelle) :
> Si `CAHIER.md` existe à la racine → prepend une ligne de résumé de session.

Ce n'est pas une dépendance — `session-handoff` fonctionne sans CAHIER.md.
Si CAHIER.md absent : étape silencieusement sautée.

## Intégration avec autres skills

`brainstorming`, `brainstorming-advanced`, `test-driven-development` peuvent optionnellement
prepend une entrée courte (ex. "Décision : X adoptée") sans passer par `session-handoff`.
Contrat : même format H2 date + texte libre.

---

## Ce qui NE change PAS

- `.claude/JOURNAL.md` reste le journal privé local orienté IA — inchangé.
- `session-handoff/HANDOFF.md` reste le snapshot d'état — inchangé.
- Aucun skill existant modifié, sauf ajout d'une étape optionnelle dans `session-handoff`.

---

## Questions résolues

| Question | Réponse |
|---|---|
| Nom du fichier | `CAHIER.md` (terme naturel de l'utilisateur, francophone, pas de collision avec `.claude/JOURNAL.md`) |
| Emplacement | Racine du repo |
| Commité ? | Oui — suit le projet au git clone |
| Sens d'insertion | Prepend (plus récent en haut) |
| Qui rédige ? | Claude automatiquement (résumé du contexte de session) |
| Lire le fichier avant d'écrire ? | Non — prepend ne le requiert pas |
| Skill autonome ou extension ? | Autonome + intégration légère optionnelle dans session-handoff |
