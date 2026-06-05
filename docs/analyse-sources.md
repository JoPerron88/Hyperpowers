# Analyse des trois sources à fusionner

> Analyse de compréhension réalisée le 2026-06-05, avant tout design de fusion.
> Sources clonées dans `sources/` (ignoré par git) :
> - `mempalace` — https://github.com/MemPalace/mempalace (branche develop, v3.3.6)
> - `superpowers` — https://github.com/obra/superpowers (branche main, v5.1.0)
> - `planning-with-files` — https://github.com/OthmanAdi/planning-with-files (branche master, v2.43.0)
> - `andrej-karpathy-skills` — https://github.com/multica-ai/andrej-karpathy-skills (branche main, v1.0.0)

---

## 1. `superpowers` (v5.1.0) — la couche *méthodologie*

**Ce que c'est** : bibliothèque de **14 skills** purs, **zéro dépendance**, aucun code applicatif.

**Comment ça marche** :
- Un seul hook : `SessionStart` injecte tout `using-superpowers/SKILL.md` dans le
  contexte sous forme `<EXTREMELY_IMPORTANT>`. C'est le *bootstrap* : il impose le
  réflexe « vérifie s'il existe un skill avant d'agir ».
- Les autres skills se déclenchent via l'outil `Skill`, sur la base du champ `description`.
- Multi-harness (Claude Code, Codex, Cursor, Gemini, OpenCode, Copilot, Factory) —
  mêmes skills, bootstrap par harness.

**Rôle** : un **processus** de bout en bout — brainstorming → worktrees →
writing-plans → exécution par subagents → TDD → code review → finishing-branch.
Gouvernance stricte (94 % de PR rejetées, refus des dépendances tierces dans le cœur).

---

## 2. `planning-with-files` (v2.43.0) — la couche *mémoire de travail d'une tâche*

**Ce que c'est** : **un** skill + commandes + scripts (bash/PowerShell/Python) +
**hooks lourds**. Pattern « Manus » : 3 fichiers `task_plan.md` / `findings.md` / `progress.md`.

**Comment ça marche** (le plus mécanisé des trois) — le frontmatter du SKILL.md
enregistre **5 hooks** :
- `UserPromptSubmit` + `PreToolUse` → **réinjectent le plan actif** dans le contexte
  à chaque tour/outil (« attention manipulation » : relire le plan avant chaque décision).
- `PostToolUse` → rappelle de mettre à jour `progress.md`.
- `Stop` → lance `check-complete.sh` (vérifie que toutes les phases sont finies).
- `PreCompact` → rappelle de vider le contexte vers le disque avant compaction.
- Sécurité : contenu de plan encadré par `===BEGIN/END PLAN DATA===` + **attestation
  SHA-256** anti-injection.

**Rôle** : garder **une tâche complexe** sur les rails à travers les resets de
contexte. Mémoire = *disque comme RAM persistante*, à l'échelle de la session/tâche.
Isolation de plans parallèles, récupération après `/clear`. 17+ IDE.

---

## 3. `mempalace` (v3.3.6) — la couche *mémoire long terme*

**Ce que c'est** : une **vraie application Python** (CLI + serveur MCP + ChromaDB +
SQLite), installable via `uv`/`pip`. Le plugin Claude Code n'est qu'une fine couche.

**Comment ça marche** :
- SKILL.md **délégatif** : appelle `mempalace instructions <cmd>` et suit les
  instructions dynamiques renvoyées par la CLI (le cerveau est dans l'app, pas le skill).
- Serveur MCP : ~19–29 outils (lecture/écriture du palais, graphe de connaissances,
  navigation).
- 2 hooks : `Stop` et `PreCompact` → **auto-sauvegarde** la session dans le palais.
- Structure : Wings (personnes/projets) → Rooms (jours/sessions) → Drawers (texte
  **verbatim**), index compressé AAAK, recherche sémantique locale (96,6 % de rappel),
  zéro API externe par défaut.

**Rôle** : se souvenir **verbatim de tout, à travers toutes les sessions et dans le temps**.

---

## 4. `andrej-karpathy-skills` (v1.0.0) — la couche *garde-fous comportementaux*

**Ce que c'est** : **un** skill (`karpathy-guidelines`), **pure prose**, zéro hook, zéro
script, zéro dépendance. Dérivé des observations d'Andrej Karpathy sur les erreurs
typiques des LLM en code. Le plus simple des quatre.

**Comment ça marche** :
- Skill standard déclenché via l'outil `Skill` sur son `description` (« quand tu écris,
  relis ou refactorises du code »).
- Distribué de trois façons : plugin (marketplace), ou simple `CLAUDE.md` à copier/
  ajouter par projet, ou règle Cursor (`.cursor/rules/karpathy-guidelines.mdc`).
- Aucun état, aucun fichier produit, aucune automatisation : c'est un texte de cadrage.

**Contenu** : 4 principes — (1) *Think Before Coding* (expliciter les hypothèses,
demander, présenter les arbitrages), (2) *Simplicity First* (minimum de code, pas de
sur-ingénierie), (3) *Surgical Changes* (ne toucher que le nécessaire), (4) *Goal-Driven
Execution* (transformer les tâches en critères vérifiables, boucler jusqu'à validation).

**Rôle** : **discipliner le comportement** du modèle pendant l'écriture de code —
réduire les diffs inutiles, la sur-complexité et les hypothèses silencieuses.

---

## Vue comparée

| | superpowers | planning-with-files | mempalace | karpathy-skills |
|---|---|---|---|---|
| **Nature** | 14 skills (prose) | 1 skill + scripts | Application Python + MCP | 1 skill (prose) |
| **Échelle mémoire** | aucune (processus) | une tâche / session | tout, long terme | aucune (garde-fous) |
| **Mécanisme clé** | bootstrap SessionStart | injection de plan par hooks | MCP + auto-save hooks | Skill tool / CLAUDE.md |
| **Dépendances** | zéro | scripts shell/py | ChromaDB, SQLite, embeddings | zéro |
| **Hooks utilisés** | SessionStart | UserPromptSubmit, PreToolUse, PostToolUse, **Stop**, **PreCompact** | **Stop**, **PreCompact** | aucun |

---

## Observation clé pour la suite (analyse, pas encore design)

Les quatre ne se concurrencent pas frontalement : ce sont **quatre couches** d'un même
axe « comportement / processus / mémoire » :
- **karpathy-skills = comment se comporter** (garde-fous, granularité fine, à chaque édition)
- **superpowers = comment travailler** (méthode, cycle complet d'un projet)
- **planning-with-files = rester sur les rails d'une tâche** (mémoire de travail)
- **mempalace = se souvenir à travers le temps** (mémoire long terme)

Points de friction et gisement de symbiose déjà identifiés :

- ⚠️ **Collision sur les mêmes events** : `Stop` et `PreCompact` sont utilisés à la
  fois par planning-with-files et mempalace → déclenchement simultané. Côté injection
  de contexte, seul superpowers injecte automatiquement (au `SessionStart`) ;
  planning-with-files injecte sur `UserPromptSubmit`/`PreToolUse` *uniquement si un plan
  est actif* ; le `wake-up` de mempalace est **opt-in** (commande CLI/MCP, pas un hook).
  (karpathy-skills n'ajoute aucun hook.) Analyse détaillée des conflits : voir
  [analyse-conflits.md](analyse-conflits.md).
- ⚠️ **Recouvrement conceptuel #1 — planification** : `writing-plans`/`executing-plans`
  (superpowers) vs les fichiers de plan (planning-with-files) = deux modèles de
  planification à arbitrer.
- ⚠️ **Recouvrement conceptuel #2 — philosophie** : karpathy-skills (Simplicity First,
  Think Before Coding, Goal-Driven) **redit** en grande partie la philosophie de
  superpowers (YAGNI/DRY, brainstorming « surface tradeoffs/ask », TDD « goal-driven »).
  À la fusion : soit karpathy devient un condensé comportemental toujours actif que les
  skills superpowers référencent, soit on déduplique pour éviter deux voix qui disent la
  même chose. C'est le plus léger à intégrer (prose, zéro hook) mais le plus redondant.
- ✅ **Complémentarité** : `findings.md`/`progress.md` en fin de tâche pourraient
  alimenter le palais long terme de mempalace ; le `wake-up` de mempalace pourrait
  pré-charger une session de planning ; superpowers pourrait orchestrer quand planifier
  et quand se souvenir ; karpathy-skills pourrait servir de garde-fou transversal pendant
  les phases d'écriture de code de tous les autres.
- 🧩 **Tension à résoudre** : superpowers refuse les dépendances tierces dans son cœur,
  alors que mempalace est une app Python lourde → la fusion ne pourra sans doute pas
  être un seul plugin monolithique, mais plutôt un **marketplace qui bundle** + un fin
  skill d'orchestration.

---

## Prochaine étape (non commencée)

Design de la fusion : cadrage → 2-3 approches → spec. À reprendre quand décidé.
