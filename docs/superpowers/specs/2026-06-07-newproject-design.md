# Spec — `hyperpowers:newproject`

**Date :** 2026-06-07
**Skill :** `hyperpowers:newproject`
**Invocation :** `/NewProject [Description]`
**Statut :** À reviewer

---

## Problème

Un utilisateur non-développeur (profil : concepteur mécanique, néophyte en code) qui veut démarrer un nouveau projet de code se retrouve face à une page blanche : pas de structure, pas de CLAUDE.md, pas de cap, pas de choix technologique éclairé. Les erreurs typiques — mauvais langage, scope trop ambitieux, structure qui bloque Claude, pas de git — se paient cher plus tard.

Le skill `NewProject` résout ça en guidant l'utilisateur à travers 5 phases, de l'idée verbalisée jusqu'au lancement du développement dans les règles.

---

## Périmètre

- **Dans le scope :** orchestration de la phase d'amorçage (questions → artefacts → handoff vers le développement)
- **Hors scope :** développement lui-même (délégué à `brainstorming` + `writing-plans` comme d'habitude), README, tests vides, structure de dossiers auto-générée

---

## Flow en 5 phases

### Phase 1 — Verbalisation de l'idée

**Point de départ :** la `[Description]` passée en argument à `/NewProject` est le matériau brut. Le skill la reformule et la lit en retour à l'utilisateur ("Voici ce que j'ai compris : …") avant de poser ses questions de raffinement.

Questions de raffinement, une à la fois :

1. "À quoi ça ressemblerait quand c'est terminé ? Comment tu sauras que c'est réussi ?"
2. "Qui l'utilise, et comment ? (toi seul, une équipe, un client ?)"

Si la `[Description]` est absente ou trop courte, ajouter d'abord :
0. "Qu'est-ce que tu veux construire ? Décris-le librement, sans jargon technique."

**But :** verbaliser l'idée — pas collecter des specs techniques. L'utilisateur doit pouvoir expliquer son projet comme à un collègue, sans avoir à connaître les termes du développement.

Pas de choix proposé ici, pas d'option. On collecte, on reformule, on valide avec l'utilisateur.

---

### Phase 2 — Choix technologiques + implications

Questions, dans l'ordre, une à la fois :

4. "As-tu déjà un langage ou un outil en tête ? Ou tu veux une recommandation ?"
   - Si l'utilisateur a une idée → expliquer les implications concrètes pour un non-dev (maintenance, courbe d'apprentissage, compatibilité avec ses outils mécaniques éventuels).
   - Si pas d'idée → proposer 2-3 options avec une recommandation claire et son raisonnement.
5. "Y a-t-il des contraintes extérieures ? (format de fichiers, logiciels existants, environnement de travail)"

**Option à proposer ici :**
> "Veux-tu qu'on explore les choix technologiques plus en profondeur ? Je peux invoquer `superpowers:brainstorming` pour qu'on pèse les options ensemble avant de continuer."

Si oui → invoquer `superpowers:brainstorming` avec le contexte des phases 1-2. À la sortie, reprendre la phase 3.
Si non → continuer directement.

---

### Phase 3 — Scope, structure et risques néophyte

Questions, dans l'ordre, une à la fois :

6. "En combien de temps veux-tu avoir une première version qui fonctionne ?"
7. "Y a-t-il des parties du projet qui te semblent floues ou qui t'inquiètent ?"

**Option à proposer ici :**
> "Veux-tu un débat approfondi sur le scope et les risques de ce projet ? J'ai un mode spécial pour ça — il met en débat une vision optimiste contre une vision réaliste de ton projet, pour identifier les angles morts avant de commencer."

Si oui → invoquer `hyperpowers:brainstorming-advanced` en **mode NewProject** (voir section dédiée ci-dessous).
Si non → continuer directement avec un résumé des risques identifiés par Claude.

---

### Phase 4 — Goal + artefacts

À partir des réponses collectées, créer les 3 artefacts **dans cet ordre** :

**1. `.hyperpowers/goal.md`**
Cap du projet en 3-5 lignes. Format :
```
# FinalGoal — [Nom du projet]

[Description du projet en 1-2 phrases — ce que c'est, pour qui]
[Ce que "réussi" signifie concrètement]
[Contraintes clés à ne jamais perdre de vue]
```

**2. `CLAUDE.md`** (à la racine du projet)
```
# CLAUDE.md

## Projet
[Nom + description courte]

## Langage et environnement
[Langage, version, outils]

## Commandes
- Lancer : `[commande]`
- Tester : `[commande ou "à définir"]`

## Conventions
[Style de code adopté, décisions déjà prises]

## Contexte utilisateur
[Ex : "l'auteur est concepteur mécanique, pas développeur — privilégier la clarté et la simplicité"]
```

**3. `git init` + `.gitignore` adapté au langage**
Créer le `.gitignore` ciblé (Python / Node / autre selon la tech choisie).
Exclure les dossiers courants : `__pycache__`, `.env`, `node_modules`, etc.
Faire `git init`.

Afficher un résumé des artefacts créés et demander confirmation avant de continuer.

---

### Phase 5 — Plan de développement large + handoff

Proposer un découpage en grandes phases du projet (2-5 phases, nommées) basé sur les réponses collectées. Exemple :
- Phase A : script de base fonctionnel (cas nominal)
- Phase B : gestion des cas limites
- Phase C : interface ou intégration externe

Puis, handoff explicite :
> "Le projet est prêt à démarrer. Pour développer chaque phase, on utilisera le processus habituel : `superpowers:brainstorming` pour explorer une feature, puis `superpowers:writing-plans` pour la planifier, puis l'implémentation. Tu peux commencer quand tu veux — dis-moi quelle phase on attaque en premier."

---

## Le mode NewProject dans `hyperpowers:brainstorming-advanced`

Mode spécial invocable **uniquement depuis `hyperpowers:newproject`** (pas proposé dans les déclenchements normaux de brainstorming-advanced).

**Ce que ce mode fait différemment :**
- Les agents ne débattent pas d'une décision technique précise — ils débattent du **projet dans son ensemble** : scope, faisabilité, structure, risques pour un non-dev.
- Le Sage est particulièrement aiguisé sur les **pièges typiques du néophyte** (sous-estimation de la complexité, absence de tests, scope qui gonfle, structure qui bloque la reprise après pause).
- Un **Expert néophyte** est invocable en mode validation pour répondre à : "Qu'est-ce qu'un non-développeur (profil : concepteur mécanique) sous-estime systématiquement dans ce type de projet ?"

**Tensions types pour ce mode :**
- Tour 1 : "Ce scope est-il réaliste pour quelqu'un qui code en amateur ?"
- Tour 2 : "Quelle structure de fichiers survivra à 3 mois de pause et de reprise ?"
- Tour 3 (si besoin) : "Y a-t-il une version plus simple du projet qui livre 80% de la valeur ?"

**Clôture spécifique au mode NewProject :**
Les options présentées sont des **versions du projet** (scope A, scope B, scope C) avec leurs risques — pas des options d'architecture. La recommandation finale indique le scope recommandé + les 3 risques principaux à surveiller.

**Implémentation :** section `## Mode NewProject` dans `SKILL.md` de `brainstorming-advanced`, marquée d'un commentaire `<!-- usage interne : newproject uniquement -->`. Le skill principal ne référence pas ce mode dans sa description (reste "caché" aux déclenchements automatiques).

---

## Artefacts produits (récapitulatif)

| Artefact | Obligatoire | Rôle |
|---|---|---|
| `.hyperpowers/goal.md` | Oui | Active le hook FinalGoal (principe 6) |
| `CLAUDE.md` | Oui | Contexte projet pour Claude à chaque session |
| `.gitignore` + `git init` | Oui | Filet de sécurité |

---

## Intégration avec l'écosystème

| Phase | Skill invoqué | Condition |
|---|---|---|
| Phase 2 | `superpowers:brainstorming` | Si utilisateur veut explorer les choix tech |
| Phase 3 | `hyperpowers:brainstorming-advanced` (mode NewProject) | Si utilisateur veut débat sur scope/risques |
| Phase 5+ | `superpowers:brainstorming` → `superpowers:writing-plans` | Pour chaque feature / composant |
| Fin de session | `hyperpowers:session-handoff` | Quand l'utilisateur s'arrête |

---

## Ce que ce skill n'est pas

- Pas un générateur de structure de projet (trop variable par type de projet)
- Pas un remplaçant de `brainstorming` ou `writing-plans` pour le développement
- Pas un skill à invoquer à chaque session — seulement au démarrage d'un nouveau projet

---

## Invocation

Slash command : `/NewProject [Description]`

- La `[Description]` est optionnelle mais recommandée. Elle accélère la Phase 1 en évitant la question d'ouverture.
- Le skill est autonome — il ne dépend d'aucun autre skill hyperpowers pour fonctionner. `superpowers:brainstorming` est proposé en option en Phase 2, jamais requis.
- Utilisable sur n'importe quel type de projet (script, outil CLI, plugin, site) — le skill adapte ses questions et ses recommandations technologiques au contexte décrit.

---

## Description du skill (pour le frontmatter SKILL.md)

```yaml
name: newproject
description: >
  Use when starting a brand new project from scratch — before any code, any file, any structure.
  Invoke as /NewProject [short description] to start. Guides through idea verbalization,
  technology choices, scope, risks, and creates the essential artefacts (CLAUDE.md,
  .hyperpowers/goal.md, git init) to start clean.
  Do NOT use for projects already in progress.
```
