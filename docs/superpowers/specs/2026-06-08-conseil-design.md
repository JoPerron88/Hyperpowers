# Spec — skill `conseil` (mini firm conseil)
Date : 2026-06-08 | Méthode : brainstorming-advanced pool dynamique (4 entités, 3 tours)

## Objectif

Créer un skill `hyperpowers:conseil` — une mini firm conseil personnelle invocable à tout moment.
Sa mission : lire ce qui existe (projet, décisions, historique), puis produire une analyse, une
revue, ou un plan long terme à partir de 3 entités expertes distinctes.

**Distinct de `brainstorming-advanced`** :
- `brainstorming-advanced` = avant décision, explore l'espace des possibles, débat ouvert
- `conseil` = après décision (ou en cours de projet), lit l'existant, évalue, oriente

## Invocation

`/conseil` — alias court. Nom complet : `hyperpowers:conseil`.

## Les 3 entités de la firm

| Entité | Rôle | Angle |
|--------|------|-------|
| **Stratège** | Vision, cap, plans long terme | "Construit-on la bonne chose ?" |
| **Guide** | Accompagnement pour non-développeur | "Comment traverser sans se perdre ?" |
| **Relecteur** | Revue de livrable, dérive silencieuse | "Ça tient la route ?" |

### Mode hiérarchique (toujours les 3)

Une entité **principale** porte le raisonnement selon le type de demande :

| Type de demande | Entité principale |
|-----------------|-------------------|
| "Revois mon architecture / mon projet" | Relecteur |
| "Plan long terme / roadmap" | Stratège |
| "Est-ce que mon approche tient ?" | Relecteur (ou équilibre 3) |
| "Fais-moi une analyse" | Stratège |
| "J'ai un doute, explique-moi" | Guide |

Les deux entités secondaires font une **passe courte** (1-2 lignes chacune).
Pas de routing pur — l'utilisateur ne choisit pas les entités. Le skill décide.

## Format des livrables

```
# [Titre de la consultation]
Date : YYYY-MM-DD | Entité principale : [Stratège / Guide / Relecteur]

## [Stratège / Guide / Relecteur] — voix principale
[3-4 lignes]

## [Entité 2] — passe courte
[1-2 lignes]

## [Entité 3] — passe courte
[1-2 lignes]

## Décision / cap retenu
[1-2 lignes — omis si consultation sans décision]

## Tensions non résolues
[optionnel — une ligne max si un point reste ouvert]
```

## Dossier dédié

```
firm/
  sessions/       ← un fichier par consultation : YYYY-MM-DD-<slug>.md
                     si deux sessions le même jour : YYYY-MM-DD-<slug>-2.md
  index.md        ← table des consultations (prepend), une ligne par session :
                     `YYYY-MM-DD | [titre] | [entité principale] | [décision/cap]`
```

Le dossier `firm/` est à la racine du projet. Il est propre et dédié — rien d'autre dedans.

## Protocole d'exécution

### 1. Lecture du contexte (ordre fixe)

1. `session-handoff/HANDOFF.md` — source de vérité sur l'état courant.
   → Si date > 7 jours OU section "Où on en est" vague : émettre une alerte explicite,
     ne pas halluciner du contexte.
2. `firm/index.md` — historique des consultations (si existe).
3. `firm/sessions/<dernière session>.md` — la session la plus récente uniquement.
4. `CLAUDE.md` (section "Décisions de base") — seulement si HANDOFF.md ne répond pas.

Ne pas lire : `CAHIER.md`, `.claude/JOURNAL.md`, specs dans `docs/` (trop verbeux).

### 2. Question initiale

Si le contexte est suffisant → commencer directement.
Si un élément essentiel manque → poser **une seule question**, pas un formulaire.

### 3. Débat (3 entités séquentielles, Agent tool)

Dispatcher Stratège → Guide → Relecteur séquentiellement (chaque entité lit la précédente).
Entité principale en premier pour poser le raisonnement principal, secondaires ensuite.

### 4. Livrable

Écrire `firm/sessions/YYYY-MM-DD-<slug>.md`.
Mettre à jour `firm/index.md` par prepend (même pattern que `cahier-maitre`).

### 5. Lien vers cahier-maitre

Ajouter **une ligne** dans `CAHIER.md` (si existe) :
`[date] | Consultation firm: [titre]`

## Intégration avec l'écosystème

| Skill | Relation |
|-------|----------|
| `brainstorming-advanced` | Complémentaire : l'un explore, l'autre évalue |
| `session-handoff` | Lit HANDOFF.md en entrée ; ne le modifie jamais |
| `finalgoal` | Peut référencer `firm/index.md` comme source de cap |
| `cahier-maitre` | Reçoit une ligne par consultation |
| `writing-plans` / `planning-with-files` | En aval : la firm oriente, writing-plans planifie |

## Description du skill (CSO — pour le déclenchement)

> Use when the user wants to evaluate, review, or get a long-term perspective on an existing
> project or decision — not to explore options (use brainstorming for that), but to get a
> structured assessment from multiple expert perspectives on what already exists or is in progress.

## Ce que ce skill n'est PAS

- Pas un remplacement de `writing-plans` ou `planning-with-files` (pas de plan d'exécution)
- Pas un `brainstorming-advanced` (pas d'exploration avant décision)
- Pas un `session-handoff` (pas de résumé d'état)
- Les documents produits sont des **ressources consultables**, pas des caps ou des plans
