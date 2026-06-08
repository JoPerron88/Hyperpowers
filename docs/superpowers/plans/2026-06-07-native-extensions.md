# Native Extensions Multi-Plateforme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rendre Hyperpowers installable comme extension native sur Gemini CLI, OpenCode, Codex et Cursor — en plus du fallback `install.mjs` existant.

**Architecture:** Un dossier dédié par plateforme (`.codex-plugin/`, `.cursor-plugin/`, `.opencode/plugins/`) + `gemini-extension.json` à la racine. OpenCode utilise une injection via `experimental.chat.messages.transform` (adapté de superpowers). Les autres plateformes déclarent les skills via `plugin.json`. Tool mappings dans `references/`.

**Tech Stack:** Node.js ESM, `node:fs`, `node:path`, `node:os`, `node:url` — zéro dépendance externe.

---

## File Map

| Fichier | Action |
|---|---|
| `gemini-extension.json` | Créer |
| `GEMINI.md` | Modifier — ajouter `@references/gemini-tools.md` |
| `.opencode/plugins/hyperpowers.js` | Créer (+ dossier) |
| `.codex-plugin/plugin.json` | Créer (+ dossier) |
| `.cursor-plugin/plugin.json` | Créer (+ dossier) |
| `references/gemini-tools.md` | Créer (+ dossier) |
| `references/codex-tools.md` | Créer |
| `tests/standard.test.mjs` | Modifier — ajouter 7 tests (ligne 327) |
| `session-handoff/OUTILLAGE.md` | Modifier — ajouter section installation native |

---

### Task 1 : Tests structurels (TDD — rouge d'abord)

**Files:**
- Modify: `tests/standard.test.mjs` (ajouter après ligne 327)

- [ ] **Step 1 : Ajouter les 7 tests à la fin de `tests/standard.test.mjs`**

```javascript
test("gemini-extension.json existe et déclare name=hyperpowers et contextFileName=GEMINI.md", () => {
  const ext = JSON.parse(readFileSync(join(root, "gemini-extension.json"), "utf8"));
  assert.equal(ext.name, "hyperpowers");
  assert.equal(ext.contextFileName, "GEMINI.md");
});

test(".opencode/plugins/hyperpowers.js existe et référence standard.md et HYPERPOWERS_STANDARD", () => {
  const content = readFileSync(join(root, ".opencode/plugins/hyperpowers.js"), "utf8");
  assert.ok(content.includes("standard.md"), "doit lire standard.md");
  assert.ok(content.includes("HYPERPOWERS_STANDARD"), "guard d'injection requis");
  assert.ok(content.includes("experimental.chat.messages.transform"), "hook requis");
});

test(".codex-plugin/plugin.json est valide et déclare name=hyperpowers", () => {
  const p = JSON.parse(readFileSync(join(root, ".codex-plugin/plugin.json"), "utf8"));
  assert.equal(p.name, "hyperpowers");
  assert.ok(p.skills, "skills path requis");
});

test(".cursor-plugin/plugin.json est valide et déclare name=hyperpowers", () => {
  const p = JSON.parse(readFileSync(join(root, ".cursor-plugin/plugin.json"), "utf8"));
  assert.equal(p.name, "hyperpowers");
});

test("references/gemini-tools.md existe et contient un tableau de mapping", () => {
  const content = readFileSync(join(root, "references/gemini-tools.md"), "utf8");
  assert.ok(content.includes("read_file"), "mapping Read → read_file requis");
  assert.ok(content.includes("run_shell_command"), "mapping Bash requis");
});

test("references/codex-tools.md existe et contient un tableau de mapping", () => {
  const content = readFileSync(join(root, "references/codex-tools.md"), "utf8");
  assert.ok(content.includes("spawn_agent"), "mapping Task → spawn_agent requis");
  assert.ok(content.includes("multi_agent"), "note multi_agent requise");
});

test("GEMINI.md inclut references/gemini-tools.md", () => {
  const content = readFileSync(join(root, "GEMINI.md"), "utf8");
  assert.ok(content.includes("@references/gemini-tools.md"), "@-include references requis");
});
```

- [ ] **Step 2 : Vérifier que les 7 tests échouent**

```bash
npm test
```

Attendu : 7 nouveaux FAIL (fichiers inexistants), 29 verts stables.

---

### Task 2 : Gemini CLI

**Files:**
- Create: `gemini-extension.json`
- Create: `references/gemini-tools.md`
- Modify: `GEMINI.md`

- [ ] **Step 1 : Créer `gemini-extension.json`**

```json
{
  "name": "hyperpowers",
  "description": "Standard de qualité + skills de process — distro curée superpowers",
  "version": "0.1.0",
  "contextFileName": "GEMINI.md"
}
```

- [ ] **Step 2 : Créer `references/gemini-tools.md`**

```markdown
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
```

- [ ] **Step 3 : Modifier `GEMINI.md` — ajouter `@references/gemini-tools.md` à la fin**

Contenu final de `GEMINI.md` :

```markdown
<!-- Hyperpowers — Gemini CLI entry point -->
<!-- standard.md injecté statiquement. -->
<!-- Limitation : le hook FinalGoal (.hyperpowers/goal.md) est Claude Code-only. -->
<!-- Si un cap projet existe, l'ajouter manuellement dans le GEMINI.md du projet. -->

@standard.md

## Skills disponibles

@skills/brainstorming-advanced/SKILL.md

@skills/newproject/SKILL.md

@skills/session-handoff/SKILL.md

@references/gemini-tools.md
```

- [ ] **Step 4 : Vérifier que les 3 tests Gemini passent**

```bash
npm test
```

Attendu : les 3 tests `gemini-extension.json`, `references/gemini-tools.md` et `GEMINI.md` passent.

- [ ] **Step 5 : Commit**

```bash
git add gemini-extension.json references/gemini-tools.md GEMINI.md
git commit -m "feat: add Gemini CLI native extension + tool mapping references"
```

---

### Task 3 : OpenCode

**Files:**
- Create: `.opencode/plugins/hyperpowers.js` (+ dossier `.opencode/plugins/`)

- [ ] **Step 1 : Créer `.opencode/plugins/hyperpowers.js`**

```javascript
// .opencode/plugins/hyperpowers.js
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const normalizePath = (p, homeDir) => {
  if (!p || typeof p !== 'string') return null;
  let normalized = p.trim();
  if (!normalized) return null;
  if (normalized.startsWith('~/')) normalized = path.join(homeDir, normalized.slice(2));
  else if (normalized === '~') normalized = homeDir;
  return path.resolve(normalized);
};

let _bootstrapCache = undefined;

export const HyperpowersPlugin = async ({ client, directory }) => {
  const homeDir = os.homedir();
  const skillsDir = path.resolve(__dirname, '../../skills');
  const envConfigDir = normalizePath(process.env.OPENCODE_CONFIG_DIR, homeDir);
  const configDir = envConfigDir || path.join(homeDir, '.config/opencode');

  const getBootstrapContent = () => {
    if (_bootstrapCache !== undefined) return _bootstrapCache;

    const standardPath = path.resolve(__dirname, '../../standard.md');
    if (!fs.existsSync(standardPath)) {
      _bootstrapCache = null;
      return null;
    }

    const standard = fs.readFileSync(standardPath, 'utf8');

    const toolMapping = `**Tool Mapping for OpenCode:**
Quand les skills référencent des outils Claude Code, utilise les équivalents OpenCode :
- \`TodoWrite\` → \`todowrite\`
- \`Task\` (sous-agents) → système de sous-agents OpenCode (@mention)
- \`Skill\` → outil natif \`skill\` d'OpenCode
- \`Read\`, \`Write\`, \`Edit\`, \`Bash\` → tes outils natifs`;

    _bootstrapCache = `<HYPERPOWERS_STANDARD>
${standard}

${toolMapping}
</HYPERPOWERS_STANDARD>`;

    return _bootstrapCache;
  };

  return {
    config: async (config) => {
      config.skills = config.skills || {};
      config.skills.paths = config.skills.paths || [];
      if (!config.skills.paths.includes(skillsDir)) {
        config.skills.paths.push(skillsDir);
      }
    },

    'experimental.chat.messages.transform': async (_input, output) => {
      const bootstrap = getBootstrapContent();
      if (!bootstrap || !output.messages.length) return;
      const firstUser = output.messages.find(m => m.info.role === 'user');
      if (!firstUser || !firstUser.parts.length) return;
      if (firstUser.parts.some(p => p.type === 'text' && p.text.includes('HYPERPOWERS_STANDARD'))) return;
      const ref = firstUser.parts[0];
      firstUser.parts.unshift({ ...ref, type: 'text', text: bootstrap });
    }
  };
};
```

- [ ] **Step 2 : Vérifier la syntaxe**

```bash
node --check ".opencode/plugins/hyperpowers.js"
```

Attendu : aucune sortie (syntaxe valide).

- [ ] **Step 3 : Vérifier que le test OpenCode passe**

```bash
npm test
```

Attendu : test `.opencode/plugins/hyperpowers.js` vert.

- [ ] **Step 4 : Commit**

```bash
git add .opencode/plugins/hyperpowers.js
git commit -m "feat: add OpenCode native plugin with standard.md injection"
```

---

### Task 4 : Codex

**Files:**
- Create: `.codex-plugin/plugin.json` (+ dossier `.codex-plugin/`)
- Create: `references/codex-tools.md`

- [ ] **Step 1 : Créer `.codex-plugin/plugin.json`**

```json
{
  "name": "hyperpowers",
  "version": "0.1.0",
  "description": "Standard de qualité + skills de process — distro curée superpowers + planning-with-files",
  "author": {
    "name": "Jonathan Perron"
  },
  "homepage": "https://github.com/JoPerron88/Hyperpowers",
  "repository": "https://github.com/JoPerron88/Hyperpowers",
  "license": "MIT",
  "skills": "./skills/"
}
```

- [ ] **Step 2 : Créer `references/codex-tools.md`**

```markdown
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
```toml
[experimental]
multi_agent = true
```
```

- [ ] **Step 3 : Vérifier que les 2 tests Codex passent**

```bash
npm test
```

Attendu : tests `.codex-plugin/plugin.json` et `references/codex-tools.md` verts.

- [ ] **Step 4 : Commit**

```bash
git add .codex-plugin/plugin.json references/codex-tools.md
git commit -m "feat: add Codex native plugin + tool mapping references"
```

---

### Task 5 : Cursor

**Files:**
- Create: `.cursor-plugin/plugin.json` (+ dossier `.cursor-plugin/`)

- [ ] **Step 1 : Créer `.cursor-plugin/plugin.json`**

```json
{
  "name": "hyperpowers",
  "displayName": "Hyperpowers",
  "description": "Standard de qualité + skills de process — distro curée superpowers",
  "version": "0.1.0",
  "author": {
    "name": "Jonathan Perron"
  },
  "homepage": "https://github.com/JoPerron88/Hyperpowers",
  "repository": "https://github.com/JoPerron88/Hyperpowers",
  "license": "MIT",
  "skills": "./skills/"
}
```

- [ ] **Step 2 : Vérifier que le test Cursor passe**

```bash
npm test
```

Attendu : test `.cursor-plugin/plugin.json` vert. Total : 36 verts (37 total, 1 rouge toléré).

- [ ] **Step 3 : Commit**

```bash
git add .cursor-plugin/plugin.json
git commit -m "feat: add Cursor native plugin declaration"
```

---

### Task 6 : OUTILLAGE.md

**Files:**
- Modify: `session-handoff/OUTILLAGE.md`

- [ ] **Step 1 : Remplacer la section "Installer les configs globales" dans `session-handoff/OUTILLAGE.md`**

Trouver la section qui commence par `## Installer les configs globales` et la remplacer par :

```markdown
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
```

- [ ] **Step 2 : Vérifier**

```bash
npm test
```

Attendu : 36 verts, 1 rouge toléré (planning-with-files).

- [ ] **Step 3 : Commit**

```bash
git add "session-handoff/OUTILLAGE.md"
git commit -m "docs: update OUTILLAGE with native extension install instructions"
```
