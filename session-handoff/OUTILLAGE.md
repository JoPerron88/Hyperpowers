# Outillage — Hyperpowers
> Lis ceci EN PREMIER si tu reprends sur une machine neuve, avant de connaître le projet.

## Plugins / skills Claude Code utilisés
Détectés via `~/.claude/plugins/installed_plugins.json` + la structure du dépôt :

- **superpowers** (officiel Anthropic, marketplace `claude-plugins-official`) — skills de process :
  `brainstorming`, `writing-plans`, `subagent-driven-development`, `test-driven-development`,
  `writing-skills`, `finishing-a-development-branch`, etc. **Hyperpowers en dépend** : le standard et
  les principes 1-6 pointent vers ses skills (le test « références vivantes » échoue s'il manque).
  Installer : `/plugin install superpowers@claude-plugins-official` (ajouter le marketplace officiel
  d'abord s'il n'est pas présent).

- **planning-with-files** (pwf — dépôt **github.com/OthmanAdi**, à confirmer l'URL exacte) — fichiers
  persistants `task_plan.md`/`findings.md`/`progress.md`, reprise après `/clear`. Référencé par les
  principes 5/6 du standard. Installer : *à confirmer* — soit `/plugin marketplace add <URL/chemin>`
  puis install, soit le skill via `npx skills add planning-with-files`. (Sur la machine d'origine il
  était installé en **skill-only** dans `~/.claude/skills/planning-with-files`.)

- **hyperpowers** (CE projet) — la **glue** : standard de qualité injecté au SessionStart + routage
  des plans (principe 5) + FinalGoal (principe 6 + hook) + skills `session-handoff`, `newproject`,
  `brainstorming-advanced`. Installer depuis ce dossier : `/plugin marketplace add <chemin-de-ce-dossier>`
  puis `/plugin install hyperpowers@hyperpowers`. ⚠️ **désinstaller `andrej-karpathy-skills`** s'il
  est présent (son contenu est absorbé dans Hyperpowers — source unique).

- **warp** (Warp terminal, marketplace `claude-code-warp`) — intégration Warp Terminal pour Claude
  Code : notifications natives et extras. Confort de workflow, non requis pour le projet.
  Installer : `/plugin install warp@claude-code-warp`.

## Installer les configs globales (Gemini CLI, Codex, OpenCode, Cursor)

### Installation native (recommandée)

**Gemini CLI :**

    gemini extensions install /chemin/vers/hyperpowers

**OpenCode :** ajouter dans `~/.config/opencode/opencode.json` :

    { "plugin": ["/chemin/vers/hyperpowers"] }

**Codex :** via le gestionnaire de plugins Codex (path local ou git URL).

**Cursor :** `/add-plugin /chemin/vers/hyperpowers` dans Cursor.

### Fallback (copie de fichiers)

    npm run build:agents     # si AGENTS.md n'est pas à jour
    npm run install-configs

Avec `--force` si les fichiers ont déjà été copiés et ont changé :

    npm run install-configs --force

Emplacements copiés par le fallback :
- `~/.gemini/GEMINI.md`
- `~/.codex/AGENTS.md`
- `~/.config/opencode/opencode.json`

Note : Mistral Vibe hors scope (config TOML uniquement, pas de markdown/plugin global).

## Repli — si tu n'installes pas l'outillage
Tu peux quand même continuer : c'est un dépôt **Node standard** (`npm test` marche tel quel, 27 verts).
- **Sans superpowers** : skills de process non déclenchés automatiquement. Reproduis à la main :
  brainstorm → spec dans `docs/superpowers/specs/` → plan → TDD → revue.
- **Sans hyperpowers** : le standard n'est pas injecté au SessionStart — applique-le consciemment
  (lisible dans `standard.md`). Les skills `newproject` et `brainstorming-advanced` ne sont pas
  disponibles.
- **Sans planning-with-files** : pas de suivi vivant pour les grosses tâches ; un plan statique
  superpowers suffit pour le moyen.

## Puis
Lis `HANDOFF.md` (à côté) pour l'état du projet et la prochaine étape.
