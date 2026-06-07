# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## État courant — reprise

Pour reprendre — **état, prochaine étape, setup machine-neuve, pièges, décisions** — lis le dossier
**`session-handoff/`** : d'abord `OUTILLAGE.md` (quoi installer), puis `HANDOFF.md` (où on en est).
C'est la **source unique** de l'état de reprise, tenue à jour par le skill `session-handoff`
(« fini pour aujourd'hui »). Les décisions de fond stables restent ci-dessous.

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
