# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## État courant — reprise (2026-06-05)

**Phase : spike CLOS (rouge).** Branche git : `spike`.
- Plan directeur : `docs/superpowers/plans/2026-06-05-sondes-roles-et-memoire.md`
- Journal détaillé : `.claude/JOURNAL.md` · Analyses : `docs/analyse-*.md`
- **Sonde 1 (rôles) — fait** : scoreur `spike/score.mjs` (TDD) + `spike/roles-scorecard.md`.
  Constat : garder **karpathy** + **superpowers** ; **pwf** conditionnel (utile seulement en
  install *plugin* avec hooks + tâche *sans* plan préexistant). Note : les hooks pwf SE
  déclenchent bien (UserPromptSubmit injecte le plan au tour utilisateur).
- **Sonde 2 (mémoire) — fait** : 12 runs, `spike/RESULTS.md`. **Verdict 🔴 ROUGE** : 0/12 pièges
  touchés, le bras à froid ne dégrade jamais → mémoire-oracle n'améliore rien de mesurable.
  → **Boucle mémoire non investie ; mempalace écarté pour cet objectif.**
- ⚠️ **Cadrage du rouge** (ne pas surinterpréter) : « non soutenue par CE test », **pas** « la
  mémoire nuit » ; pièges plus durs / modèle plus faible **non testés** ; re-jouer pour chercher
  le vert = biais de confirmation (analyse #5). Détail + confound dans `spike/RESULTS.md`.
- **Reprendre à** : décision produit de l'humain (le spike a tranché « stop mémoire »). Pistes
  ouvertes non décidées : façonner Hyperpowers autour de karpathy+superpowers (sans la couche
  mémoire), ou réorienter. Voir `finishing-a-development-branch` pour le sort de la branche `spike`.
- Décidé (antérieur) : architecture « Conductor » ; étoile polaire = **qualité du code**.

## Projet

**Hyperpowers** est un skill/plugin pour Claude Code. Son objectif distinctif :
**fusionner plusieurs skills/plugins existants en un ensemble cohérent pour
améliorer leur symbiose** — c.-à-d. faire en sorte que des capacités jusque-là
séparées se composent mieux (réutilisation de contexte, déclenchements croisés,
évitement des doublons).

Statut : **démarrage** — le dépôt ne contient encore que ce fichier, un README et
un `.gitignore`. Les décisions ci-dessous ne sont pas encore prises.

### À définir (à mettre à jour dès que tranché)

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
