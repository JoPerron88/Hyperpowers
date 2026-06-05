# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## État courant — reprise (2026-06-05)

**Phase : exécution** (la conception est faite). Branche git : `spike`.
- Plan directeur : `docs/superpowers/plans/2026-06-05-sondes-roles-et-memoire.md`
- Journal détaillé : `.claude/JOURNAL.md` · Analyses : `docs/analyse-*.md`
- **Reprendre à : Phase 1 — Sonde des rôles** = construire `spike/score.mjs` (TDD) avec
  superpowers + planning-with-files + karpathy actifs, et remplir `spike/roles-scorecard.md`.
- Mode : subagent-driven (Sonde 1 plutôt inline pour observer les outils en live ; Sonde 2 en subagents).
- Décidé : architecture « Conductor » ; étoile polaire = **qualité du code** ; mempalace **différé**
  (testé en oracle par la Sonde 2 du spike).

## Projet

**Hyperpowers** est un skill/plugin pour Claude Code. Son objectif distinctif :
**fusionner plusieurs skills/plugins existants en un ensemble cohérent pour
améliorer leur symbiose** — c.-à-d. faire en sorte que des capacités jusque-là
séparées se composent mieux (réutilisation de contexte, déclenchements croisés,
évitement des doublons).

Statut : **démarrage** — le dépôt ne contient encore que ce fichier, un README et
un `.gitignore`. Les décisions ci-dessous ne sont pas encore prises.

### À définir (à mettre à jour dès que tranché)

- **Langage** : non décidé.
- **Type de livrable** : plugin complet, skill unique, ou marketplace de skills — non décidé.
- **Outillage** : gestionnaire de paquets, framework de tests, linter, build — non décidé.

Quand une de ces décisions est prise, mettre à jour la section correspondante
**et** ajouter les commandes concrètes (build / lint / test, dont comment lancer
un seul test) dans une section « Commandes ».

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
