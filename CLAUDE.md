# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## État courant — reprise (2026-06-05)

**Phase : v1 du noyau comportemental LIVRÉE ET VÉRIFIÉE EN RUNTIME** (branche `spike`, 7 tests verts).
- Plans : v1 = `docs/superpowers/plans/2026-06-05-noyau-comportemental-plan.md` (spec :
  `docs/superpowers/specs/2026-06-05-noyau-comportemental-design.md`). Spike =
  `docs/superpowers/plans/2026-06-05-sondes-roles-et-memoire.md`.
- Journal détaillé : `.claude/JOURNAL.md` · Analyses : `docs/analyse-*.md`
- **v1 — fait + validé** : le dépôt EST le plugin. `standard.md` (4 garde-fous karpathy
  recadrés → pointeurs superpowers) injecté au SessionStart via `hooks/session-start.mjs`
  (JSON `hookSpecificOutput.additionalContext`) ; `.claude-plugin/{plugin,marketplace}.json` ;
  `tests/standard.test.mjs` (7 verts). **Installé** (`hyperpowers@hyperpowers`), **karpathy
  désinstallé**, superpowers gardé non-forké. **Vérif runtime ✅** : une session fraîche a cité
  le standard injecté depuis son SessionStart. Revue spec + qualité passées.
- **Spike (antérieur) — fait** : Sonde 1 (rôles) → garder karpathy + superpowers ; pwf
  conditionnel. Sonde 2 (mémoire) → **🔴 ROUGE** (0/12 pièges ; mémoire-oracle n'améliore rien
  de mesurable) → boucle mémoire écartée. ⚠️ « non soutenue par CE test », **pas** « la mémoire
  nuit » (détail `spike/RESULTS.md`, `spike/roles-scorecard.md`).
- **Reprendre à** : v1 complète et validée. Pistes ouvertes (non décidées) : merge `spike`→
  `main` (branche actuellement mêlée recherche + plugin) ; itérations du standard (⚠️ réinstaller
  le plugin après édition — il est copié dans le cache à l'install) ; reprise mémoire « plus
  tard ». Mémoire = « on y reviendra ».
- Décidé (antérieur) : architecture « Conductor » ; étoile polaire = **qualité du code**.

## Projet

**Hyperpowers** est un skill/plugin pour Claude Code. Son objectif distinctif :
**fusionner plusieurs skills/plugins existants en un ensemble cohérent pour
améliorer leur symbiose** — c.-à-d. faire en sorte que des capacités jusque-là
séparées se composent mieux (réutilisation de contexte, déclenchements croisés,
évitement des doublons).

Statut : **v1 livrée** (noyau comportemental). Le dépôt est désormais un plugin Claude Code
fonctionnel ; les décisions de base ci-dessous sont tranchées.

### Décisions de base (tranchées)

- **Langage** : Node.js (ESM, `node:test`, zéro-dépendance).
- **Type de livrable** : plugin Claude Code (le dépôt EST le plugin).
- **Outillage** : npm pour les scripts ; pas de linter/build pour l'instant.

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
