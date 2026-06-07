# Spec — Hyperpowers : skill « session-handoff » (fini pour aujourd'hui)

> Conçu le 2026-06-06 (skill `superpowers:brainstorming`). Indépendant de v2/v3 (branche
> `v4-session-handoff` partant de `main`). **Premier skill embarqué** par le plugin Hyperpowers
> (v1-v3 = `standard.md` + hook ; ici on ajoute un dossier `skills/`).
>
> **Évolution (2026-06-06, post-tests `superpowers:writing-skills`)** : le livrable n'est plus un
> `HANDOFF.md` à la racine mais un **dossier `session-handoff/`** commité, contenant `HANDOFF.md`
> (état) **et** `OUTILLAGE.md` (plugins/skills Claude Code utilisés + install + repli), pour qu'une
> reprise après `git clone` soit possible **même sans les plugins/skills installés**. La procédure
> détaillée vit dans le `SKILL.md` (artefact vivant, affiné par test comportemental) ; cette spec
> garde le **design et les décisions**.

## Objectif

Un skill qu'on invoque **avant de s'arrêter** (« fini pour aujourd'hui ») qui prépare la **reprise
à froid dans un futur incertain** : pas forcément dans quelques heures, mais peut-être dans un ou
deux mois, **sur une machine neuve** (l'actuelle pourrait être endommagée), par quelqu'un qui a
**oublié le contexte** — voire un **tout nouvel utilisateur**.

Le skill **dérive ce qu'il peut**, **pose à l'utilisateur les questions** que lui seul peut
répondre, et produit une **note durable pour l'humain ET un pointeur pour l'IA**.

## Contrainte fondatrice (ce qui voyage)

Pour une reprise sur **machine neuve / nouvel utilisateur**, seuls les **fichiers commités du
dépôt** voyagent au `git clone`. Donc :
- la **mémoire Claude** (`~/.claude/.../memory/`) **ne voyage pas** (fraîche sur une nouvelle
  machine, différente pour un nouvel utilisateur) → on n'y met qu'un **pointeur**, pas le contenu ;
- le **`JOURNAL.md`** est gitignoré → ne voyage pas → reste l'**historique local**, pas la source
  de reprise ;
- la note humaine de reprise **doit être commitée** → le dossier `session-handoff/`.
- corollaire (évolution) : pour reprendre **sans les plugins/skills**, le dossier doit aussi dire
  **quoi installer** (et comment s'en passer) → fichier `OUTILLAGE.md`.

## Décisions du brainstorming (+ évolution post-tests)

- **Livrable** = un **dossier `session-handoff/`** commité (racine du projet), qui **suit le projet
  dans git** et voyage au clone. Il contient :
  - `HANDOFF.md` — l'état de reprise (but, où on en est + surface de perte, prévu ensuite, setup
    **projet**, pièges, décisions) ;
  - `OUTILLAGE.md` — l'**outillage Claude Code** utilisé (dérivé de `installed_plugins.json` +
    indices repo), comment l'installer, et un **repli** pour continuer **sans** l'installer.
  *(Décision initiale du brainstorming : un `HANDOFF.md` à la racine. Évoluée en dossier + OUTILLAGE
  après les tests writing-skills, qui ont montré qu'un repreneur machine-neuve ne savait pas quoi
  installer.)*
- **Frontière avec `CLAUDE.md`** : le dossier `session-handoff/` **remplace** le rôle du bloc
  « État courant — reprise » de `CLAUDE.md`. Le skill **réduit** ce bloc à un **pointeur** (« pour
  reprendre, lis le dossier `session-handoff/` »). → **une seule source de vérité** pour l'état de
  reprise (pas de 3ᵉ artefact concurrent : c'est la mission anti-doublon d'Hyperpowers).
- **Dosage** = **auto-d'abord, questions pour les trous**.
- **Mécanisme** = un **skill invocable** par l'utilisateur, déclenchable aussi par des formules
  (« fini pour aujourd'hui », « done for today », « je m'arrête / on met en pause »). Procédure en
  **prose**, pas du code.
- **Général** : marche dans **n'importe quel projet** où Hyperpowers est installé.

## Non-objectifs (explicitement hors périmètre)

- **Pas de hook automatique** : on l'invoque **au besoin** (l'utilisateur décide). Pas de
  déclenchement sur Stop/SessionEnd.
- **Pas de principe ajouté au `standard.md`** → aucune modif de `standard.md`, branche
  indépendante (depuis `main`, pas d'empilement sur v3).
- **Pas de contenu de mémoire IA riche** : juste un pointeur « lis le dossier `session-handoff/` »
  (la mémoire ne voyage pas ; le dossier commité re-sème le contexte au clone).
- **Pas de gestion multi-projets**, pas de chiffrement, pas d'historique versionné des handoffs
  (git fait déjà l'historique de `HANDOFF.md`).

## Architecture

Le **dépôt EST le plugin**. On ajoute un dossier `skills/` (Claude Code auto-découvre
`skills/<nom>/SKILL.md` d'un plugin).

```
skills/session-handoff/SKILL.md   — la procédure (frontmatter name/description + corps en prose)
session-handoff/                  — (créé DANS LE PROJET de l'utilisateur, commité, voyage au clone)
  HANDOFF.md                      — état de reprise
  OUTILLAGE.md                    — outillage Claude Code à installer + repli
```

### Le skill `session-handoff`

Frontmatter : `name: session-handoff`, `description` orientée déclenchement (« Use when the user
is wrapping up / stopping for the day / pausing a project that may be resumed much later, on
another machine, or by someone without the project's plugins/skills installed »), `user-invocable:
true`. (Pas de résumé de workflow dans la description — cf. CSO de `writing-skills`.)

Procédure (outline design ; la version exécutable et affinée vit dans le `SKILL.md`) :

1. **Dériver les faits git** (agnostique au projet) : branche, derniers commits, **surface de
   perte** (non-commité, non-poussé, absence de remote → ⚠️ ne voyage pas au clone : signaler +
   demander, ne jamais commiter le WIP en douce). Repérer les docs de contexte (README, `docs/`,
   journal, `.hyperpowers/goal.md`) comme pointeurs. **Ne PAS deviner** la commande de
   test/build/lancement.
2. **Dériver l'outillage Claude Code** utilisé : `installed_plugins.json` + indices repo
   (`docs/superpowers/`→superpowers, `.hyperpowers/`→Hyperpowers, `task_plan.md`→planning-with-files).
   Noter l'install de chacun ; **source d'install incertaine = à confirmer**, jamais inventée.
3. **Poser les questions de trou** (ce que seul l'utilisateur sait) : ① prévu ensuite ; ② setup
   **projet** machine-neuve (pré-rempli mais **confirmé**, jamais inventé) ; ③ pièges ; ④ décisions.
   Mode une-passe / utilisateur absent → marqueurs « à confirmer », ne pas bloquer.
4. **Écrire le dossier `session-handoff/`** (réécriture, en préservant les réponses déjà
   confirmées) :
   - `HANDOFF.md` : but (FinalGoal) · où on en est (+ surface de perte) · prévu ensuite · setup
     projet · pièges · décisions · où trouver le détail.
   - `OUTILLAGE.md` : plugins/skills + install + **repli** (continuer sans les installer).
5. **Réduire le bloc reprise de `CLAUDE.md`** (s'il existe) à un pointeur vers `session-handoff/`.
6. **Appondre une entrée au `JOURNAL.md`** (historique local).
7. **Pointeur mémoire IA** : une ligne « lis le dossier `session-handoff/` » (sauter si pas de
   store accessible).
8. **Committer** `session-handoff/` (+ `CLAUDE.md` aminci) ; le `JOURNAL.md` reste local.

## Flux de données

```
Invocation (« fini pour aujourd'hui »)
  └─ git (branche/commits/surface de perte) ──┐
  └─ outillage (installed_plugins + indices) ─┤
  └─ pointeurs (specs/plans/JOURNAL/goal) ─────┤→ assemble le brouillon
  └─ questions ①②③④ à l'utilisateur ───────────┘
       └─ écrit session-handoff/ (HANDOFF.md + OUTILLAGE.md, commité)
       └─ amincit le bloc reprise de CLAUDE.md → pointeur vers session-handoff/
       └─ append JOURNAL.md (local) · pointeur mémoire IA · commit
```

## Gestion d'erreur / cas limites

- **Pas un dépôt git** → sauter l'auto-dérivation git, s'appuyer davantage sur les questions ;
  `HANDOFF.md` reste produit.
- **Pas de `CLAUDE.md`** → ne pas en créer un juste pour le pointeur ; HANDOFF.md se suffit.
- **Dossier `session-handoff/` déjà présent** → le **réécrire** (instantané courant) en
  **préservant les réponses déjà confirmées** ; l'historique est dans git.
- **Setup projet inconnu / l'utilisateur ne sait pas** → l'écrire explicitement (« setup non
  documenté — à reconstituer ») plutôt qu'inventer des étapes.
- **Aucun outillage particulier détecté** → `OUTILLAGE.md` le dit (« projet git standard, aucun
  plugin/skill requis ») plutôt qu'inventer une liste.

## Stratégie de test (honnête)

La substance est une **procédure en prose**, pas du code → **pas de tests-tautologies** (« le
SKILL.md contient tel mot » ne vérifie rien d'utile). Validation :
- **Smoke-test structurel** : `skills/session-handoff/SKILL.md` existe et a un frontmatter YAML
  valide (`name`, `description`, `user-invocable`) — pas d'assertion sur la prose. (`tests/session-handoff.test.mjs`.)
- **Test comportemental `superpowers:writing-skills` (fait)** : scénarios d'application avec
  subagents frais, RED (sans skill) → GREEN (avec). A validé : le skill produit le dossier, dérive
  l'outillage, n'invente pas la source d'install, traite la surface de perte ; et — côté
  **consommateur** — un agent machine-neuve sans plugins, à qui on dit « lis `session-handoff/` »,
  sait quoi installer (ou s'en passer via le repli), comprend le projet, et sait où reprendre.

## Critères de done (vérifiables)

- [x] `skills/session-handoff/SKILL.md` existe (frontmatter valide `name`/`description`,
      `user-invocable: true`) ; smoke-test vert.
- [x] **Test comportemental** (writing-skills) : producteur (crée `session-handoff/` avec
      `HANDOFF.md` + `OUTILLAGE.md`, dérive l'outillage, n'invente pas la source) **et**
      consommateur (agent machine-neuve sans plugins reprend depuis le seul dossier) validés.
- [ ] Plugin réinstallé ; le skill est **découvert** (liste des skills) et **invocable** (gate
      humaine — non encore faite).
- [ ] **Honnêteté** : le skill aide à reprendre à froid ; il ne garantit pas une reprise sans
      friction si le setup projet ou l'outillage n'ont pas pu être documentés.
