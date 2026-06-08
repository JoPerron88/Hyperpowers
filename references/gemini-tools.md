# Tool Mapping — Gemini CLI

Quand les skills référencent des outils Claude Code, utilise les équivalents Gemini CLI :

| Claude Code | Gemini CLI | Notes |
|---|---|---|
| `Read` | `read_file` | Lecture de fichier |
| `Write` | `write_file` | Écriture de fichier |
| `Edit` | `replace` | Remplacement dans fichier |
| `Bash` | `run_shell_command` | Commandes shell |
| `Glob` | `list_directory` + pattern | Lister des fichiers |
| `Grep` | `run_shell_command` avec grep | Recherche dans fichiers |
| `Task` (sous-agents) | `@generalist` ou `@code-reviewer` | Sous-agents Gemini |
| `Skill` | Inclure le contenu directement | Pas d'outil Skill natif |
| `TodoWrite` | `tracker_create_task` | Gestion de tâches |
| `EnterPlanMode` | `enter_plan_mode` | Mode plan |

Les skills superpowers invoqués via `Skill` doivent être chargés via @-include dans GEMINI.md.
