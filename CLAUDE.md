# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## État courant — reprise (2026-06-07)

**Phase : v1 + v2 + v3 + v4 LIVRÉES et MERGÉES sur `main`** (16 tests verts ; `--no-ff`).
Branche unique = `main`. Sur `origin` (github.com/JoPerron88/Hyperpowers). Spec/plans dans
`docs/superpowers/` ; journal détaillé `.claude/JOURNAL.md`.
- **v1 — fait + vérifié runtime ✅** : le dépôt EST le plugin. `standard.md` (4 garde-fous karpathy
  → pointeurs superpowers) injecté au SessionStart via `hooks/session-start.mjs`. karpathy
  **désinstallé** ; superpowers + planning-with-files gardés **non-forkés** (dépendances).
- **v2 — routage des plans** (principe 5 de `standard.md`) : petite=TDD direct / moyenne=superpowers /
  grosse=`planning-with-files` ; arbitrage du « 5+ tool calls » de pwf (discriminant =
  franchit sessions/compaction + découvertes qui s'accumulent).
- **v3 — FinalGoal** (principe 6 + `hooks/session-start.mjs` étendu) : cap projet persistant dans
  `<projet>/.hyperpowers/goal.md`, **dormant par défaut**, injecté si présent (le hook lit le `cwd`
  via stdin JSON ; `CLAUDE_PROJECT_DIR` écarté), relu aux checkpoints (anti-dérive du but, non bloquant).
- **v4 — skill `session-handoff`** (1er skill embarqué, `skills/session-handoff/SKILL.md`) : « fini
  pour aujourd'hui » → produit un dossier `session-handoff/` commité (`HANDOFF.md` + `OUTILLAGE.md`)
  pour une reprise à froid **auto-suffisante même sans les plugins**. Durci + testé via
  `superpowers:writing-skills` (RED-GREEN, producteur + consommateur).
- **⚠️ Runtime NON vérifié pour v2/v3/v4** : tests unitaires + comportementaux verts, mais l'injection
  réelle (principes 5/6 au SessionStart, FinalGoal, **découverte du skill**) après **réinstall** du
  plugin reste à constater en session fraîche. NE PAS écrire « vérifié runtime » avant ce constat
  humain. (Le plugin est copié dans le cache à l'install → toute édition `standard.md`/hook/skill
  exige réinstall + redémarrage.)
- **Spike (antérieur) — clos** : mémoire→qualité **🔴 ROUGE** (boucle mémoire écartée ; « non
  soutenue par CE test », pas « la mémoire nuit » ; détail `spike/RESULTS.md`).
- **Architecture — modèle C tranché (2026-06-07)** : Hyperpowers = **distro curée** (non-fork).
  Étoile polaire = **qualité du code** ; architecture « Conductor ». Voir « Décisions de base ».

### Reprendre sur une AUTRE machine

Ce qui voyage dans git (tout le travail) : code du plugin, `docs/` (5 analyses + spec + plans),
`spike/` (RESULTS, scorecards, harnais). Ce qui NE voyage PAS (gitignoré / hors-repo) :
`.claude/JOURNAL.md` (journal privé), la mémoire privée de Claude (`~/.claude/projects/...`),
`sources/` (clones d'étude — **non nécessaires**, le spike est clos). La substance des décisions
est entièrement dans `docs/` et ce bloc.

Setup sur la nouvelle machine :
1. `git clone https://github.com/JoPerron88/Hyperpowers.git` (récupère `main` + `spike`).
2. Avoir **Node** (≥ v22 ; testé v26). Tests : `npm test` (zéro dépendance à installer).
3. Réinstaller l'environnement Claude Code :
   - installer **superpowers** (marketplace officiel) ET **planning-with-files** (dépôt OthmanAdi) —
     tous deux référencés par le standard (principes 2-6) ; le test « références vivantes » échoue
     s'ils manquent ;
   - `/plugin marketplace add <chemin-du-clone>` puis `/plugin install hyperpowers@hyperpowers` ;
   - **désinstaller** `andrej-karpathy-skills` s'il est présent (source unique = Hyperpowers) ;
   - redémarrer ; au SessionStart doivent apparaître les **6 principes** du standard ; le skill
     **`session-handoff`** doit être dans la liste des skills.
   - (Quand le modèle C sera implémenté, cette install manuelle sera remplacée par le marketplace
     curé d'Hyperpowers qui tire superpowers + pwf automatiquement.)
4. Lire ce `CLAUDE.md` + `docs/superpowers/specs/` pour le contexte. (Le journal détaillé
   `.claude/JOURNAL.md` reste privé/local ; le copier à la main si tu le veux ailleurs.)

## Projet

**Hyperpowers** est un skill/plugin pour Claude Code. Son objectif distinctif :
**fusionner plusieurs skills/plugins existants en un ensemble cohérent pour
améliorer leur symbiose** — c.-à-d. faire en sorte que des capacités jusque-là
séparées se composent mieux (réutilisation de contexte, déclenchements croisés,
évitement des doublons).

Statut : **v1→v4 livrées et mergées sur `main`** (noyau comportemental + routage des plans +
FinalGoal + skill `session-handoff`) ; runtime de v2/v3/v4 à re-vérifier. Le dépôt est un plugin
Claude Code fonctionnel ; les décisions de base ci-dessous sont tranchées.

### Décisions de base (tranchées)

- **Langage** : Node.js (ESM, `node:test`, zéro-dépendance).
- **Type de livrable** : plugin Claude Code (le dépôt EST le plugin).
- **Outillage** : npm pour les scripts ; pas de linter/build pour l'instant.
- **Modèle d'architecture = C, « distro curée » (tranché 2026-06-07)** : Hyperpowers **ne forke
  rien**. Il référencera superpowers + planning-with-files via leurs **sources externes** dans son
  `marketplace.json` (faisable : `source: git-subdir|url`, comme le marketplace officiel) et ajoute
  sa propre **glue** (Standard, routage, FinalGoal, `session-handoff`). Un seul point d'entrée curé.
  Écartés : (A) simple couche à côté, (B) fork/fusion de l'amont dedans (maintenance intenable).
  **Pas encore implémenté** : le `marketplace.json` ne liste encore que `hyperpowers` (≈ chantier v5).
  Contexte : outil **personnel** (non commercial), garder simple.

## Commandes

- Tests : `npm test` (= `node --test 'tests/**/*.test.mjs'`, scopé à `tests/` car le dépôt
  contient aussi des `*.test.mjs` dans `spike/` et `sources/` qu'il ne faut pas lancer ici).
- Un seul fichier de test : `node --test tests/standard.test.mjs`.

## Conventions Claude Code (référence)

Ces conventions sont stables côté Claude Code et cadrent la structure visée.

- **Skill** : un dossier contenant un `SKILL.md` avec un frontmatter YAML
  (`name`, `description`). Le `description` sert au déclenchement automatique —
  il doit décrire *quand* utiliser le skill, pas seulement ce qu'il fait.
  Ressources optionnelles à côté : `references/`, scripts, exemples.
- **Plugin** : dossier `.claude-plugin/plugin.json` (name, description, version,
  author) qui peut regrouper `skills/`, `commands/` (slash commands en markdown),
  `agents/` (subagents), et `hooks/hooks.json`.
- **Marketplace** : `.claude-plugin/marketplace.json` pour distribuer un ensemble
  de plugins.

Pour créer ou éditer un skill, utiliser le skill `superpowers:writing-skills`
(processus + vérifications). Pour concevoir le périmètre avant d'écrire du code,
passer par `superpowers:brainstorming`.

## Particularité d'architecture (le cœur du projet)

Comme le but est la **fusion / symbiose** de skills existants, le travail clé
n'est pas d'écrire des skills isolés mais de gérer leurs **interactions** :

- éviter les chevauchements de `description` qui créent des déclenchements ambigus ;
- définir l'ordre / la priorité quand plusieurs skills s'appliquent (process avant
  implémentation) ;
- partager le contexte entre skills plutôt que de le re-dériver.

Toute contribution doit préciser comment elle affecte ces interactions, pas
seulement la capacité ajoutée.

## Git

- L'identité git est configurée en global.
- `.claude/` est gitignoré (contexte privé Claude) — ne pas le committer.
