# Tool Mapping — Codex CLI

Quand les skills référencent des outils Claude Code, utilise les équivalents Codex :

| Claude Code | Codex | Notes |
|---|---|---|
| `Read` | `read_file` | Lecture de fichier |
| `Write` | `write_file` | Écriture de fichier |
| `Edit` | `apply_patch` | Patch de fichier |
| `Bash` | `run_command` | Commandes shell |
| `Task` (sous-agents) | `spawn_agent` | Sous-agents Codex |
| `TodoWrite` | `update_plan` | Mise à jour du plan |
| `Skill` | Skill natif Codex | Charger le skill par nom |

Pour les sous-agents Codex, activer dans `~/.codex/config.toml` :

    [experimental]
    multi_agent = true
