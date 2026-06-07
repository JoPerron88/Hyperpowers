# Outillage — Hyperpowers
> Lis ceci EN PREMIER si tu reprends sur une machine neuve, avant de connaître le projet.

## Plugins / skills Claude Code utilisés
Détectés via `~/.claude/plugins/installed_plugins.json` + la structure du dépôt :

- **superpowers** (officiel Anthropic, marketplace `claude-plugins-official`) — skills de process :
  `brainstorming`, `writing-plans`, `subagent-driven-development`, `test-driven-development`,
  `writing-skills`, `finishing-a-development-branch`, etc. **Hyperpowers en dépend** : le standard et
  les principes 1-6 pointent vers ses skills (le test « références vivantes » échoue s'il manque).
  Installer : le marketplace `claude-plugins-official` est officiel → `/plugin install
  superpowers@claude-plugins-official` (ajouter le marketplace officiel d'abord s'il n'est pas là).

- **planning-with-files** (pwf — dépôt **github.com/OthmanAdi**, à confirmer l'URL exacte) — fichiers
  persistants `task_plan.md`/`findings.md`/`progress.md`, reprise après `/clear`. Référencé par les
  principes 5/6 du standard. Installer : *à confirmer* — soit `/plugin marketplace add <URL/chemin>`
  puis install, soit le skill via `npx skills add planning-with-files`. (Sur la machine d'origine il
  était installé en **skill-only** dans `~/.claude/skills/planning-with-files`.)

- **hyperpowers** (CE projet) — la **glue** : standard de qualité injecté au SessionStart + routage
  des plans (principe 5) + FinalGoal (principe 6 + hook) + skill `session-handoff`. Installer depuis
  ce dossier : `/plugin marketplace add <chemin-de-ce-dossier>` puis `/plugin install
  hyperpowers@hyperpowers`. ⚠️ **désinstaller `andrej-karpathy-skills`** s'il est présent (son
  contenu est absorbé dans Hyperpowers — source unique).

> Quand le **modèle C / v5** sera implémenté, le `marketplace.json` d'Hyperpowers tirera
> superpowers + pwf automatiquement : « ajouter le marketplace Hyperpowers » suffira.

## Repli — si tu n'installes pas l'outillage
Tu peux quand même continuer : c'est un dépôt **Node standard** (`npm test` marche tel quel, 16 verts).
- **Sans superpowers** : les skills de process ne se déclenchent pas automatiquement. Reproduis la
  méthode à la main : brainstorm → spec dans `docs/superpowers/specs/` → plan → TDD → revue.
- **Sans hyperpowers** : le standard (penser avant · simplicité/YAGNI · chirurgical · piloté par
  objectif · planifier à la bonne échelle · garder le cap) n'est pas injecté — applique-le
  consciemment (il est lisible dans `standard.md`).
- **Sans planning-with-files** : pas de suivi vivant pour les grosses tâches ; un plan statique
  superpowers suffit pour le moyen.

## Puis
Lis `HANDOFF.md` (à côté) pour l'état du projet et la prochaine étape.
