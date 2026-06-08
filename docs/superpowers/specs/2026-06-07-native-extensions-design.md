# Spec — Extensions natives multi-plateforme (Gemini CLI, OpenCode, Codex, Cursor)

**Date :** 2026-06-07
**Statut :** À reviewer

---

## Problème

Hyperpowers injecte son standard via Claude Code (hook SessionStart) et via `install.mjs`
(copie de fichiers dans `~/`). Cette approche fonctionne mais n'est pas "première classe" :
Gemini CLI ne reconnaît pas Hyperpowers comme une extension native, OpenCode ne charge pas
le standard via son système de plugins, Codex et Cursor n'ont pas de plugin déclaré.

Superpowers adopte une approche par dossier dédié par plateforme (`.codex-plugin/`,
`.cursor-plugin/`, `gemini-extension.json`, `.opencode/plugins/`) qui permet une installation
native sur chaque plateforme. On adopte la même architecture.

---

## Périmètre

**Dans le scope :**
- `gemini-extension.json` — extension native Gemini CLI
- `.opencode/plugins/hyperpowers.js` — plugin OpenCode avec injection via message transform
- `.codex-plugin/plugin.json` — plugin Codex
- `.cursor-plugin/plugin.json` — plugin Cursor
- `references/gemini-tools.md` — mapping d'outils Gemini CLI
- `references/codex-tools.md` — mapping d'outils Codex
- Mise à jour `GEMINI.md` pour @-inclure `references/gemini-tools.md`
- Tests structurels pour tous les nouveaux fichiers
- Mise à jour `OUTILLAGE.md` avec les commandes d'installation natives

**Hors scope :**
- `install.mjs` reste — il est conservé comme fallback (non modifié)
- Mistral Vibe — pas de support markdown/plugin global documenté
- Hook Cursor dynamique — le plugin déclare les skills, pas d'injection SessionStart
- `references/copilot-tools.md` — Copilot CLI non utilisé

---

## Architecture retenue

```
Hyperpowers/
  gemini-extension.json        ← NOUVEAU — extension Gemini CLI
  GEMINI.md                    ← MODIFIER — ajouter @references/gemini-tools.md
  .opencode/
    plugins/
      hyperpowers.js           ← NOUVEAU — plugin OpenCode (message transform)
  .codex-plugin/
    plugin.json                ← NOUVEAU — plugin Codex
  .cursor-plugin/
    plugin.json                ← NOUVEAU — plugin Cursor
  references/
    gemini-tools.md            ← NOUVEAU — mapping outils Gemini CLI
    codex-tools.md             ← NOUVEAU — mapping outils Codex
```

---

## Mécanisme par plateforme

### Gemini CLI — `gemini-extension.json`

Fichier JSON de 4 lignes à la racine. Permet `gemini extensions install .` et
`gemini extensions list`.

```json
{
  "name": "hyperpowers",
  "description": "Standard de qualité + skills de process — distro curée superpowers",
  "version": "0.1.0",
  "contextFileName": "GEMINI.md"
}
```

`GEMINI.md` existant à mettre à jour pour inclure les tool mappings :

```markdown
@standard.md

## Skills disponibles

@skills/brainstorming-advanced/SKILL.md
@skills/session-handoff/SKILL.md
@skills/newproject/SKILL.md

@references/gemini-tools.md
```

**Installation native :** `gemini extensions install /chemin/vers/hyperpowers`
**Fallback :** `npm run install-configs` (copie GEMINI.md dans `~/.gemini/`)

---

### OpenCode — `.opencode/plugins/hyperpowers.js`

Plugin JavaScript ESM qui injecte `standard.md` dans le premier message utilisateur
via `experimental.chat.messages.transform`. Adapté directement de `superpowers.js`.

Logique :
1. Lire `standard.md` une fois (cache module-level)
2. Ajouter les tool mappings OpenCode inline
3. Injecter dans le premier message utilisateur de chaque session
4. Enregistrer le dossier `skills/` via le hook `config`
5. Guard : ne pas injecter deux fois (check `HYPERPOWERS_STANDARD`)

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

**Installation native :** ajouter dans `~/.config/opencode/opencode.json` :
```json
{ "plugin": ["/chemin/vers/hyperpowers"] }
```
**Fallback :** `npm run install-configs` (copie opencode.json dans `~/.config/opencode/`)

---

### Codex — `.codex-plugin/plugin.json`

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

**Installation native :** via le système de plugins Codex (path local ou git URL)
**Fallback :** `npm run install-configs` (copie AGENTS.md dans `~/.codex/`)

---

### Cursor — `.cursor-plugin/plugin.json`

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

Note : pas de hook SessionStart pour Cursor dans cette version — les skills sont disponibles
mais l'injection dynamique du standard n'est pas implémentée (chantier séparé si besoin).

**Installation native :** `/add-plugin /chemin/vers/hyperpowers` dans Cursor

---

### Références d'outils

#### `references/gemini-tools.md`

Adapté de `superpowers/skills/using-superpowers/references/gemini-tools.md` :

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

#### `references/codex-tools.md`

```markdown
# Tool Mapping — Codex CLI

Quand les skills référencent des outils Claude Code, utilise les équivalents Codex :

| Claude Code | Codex | Notes |
|---|---|---|
| `Read` | `read_file` | Lecture de fichier |
| `Write` | `write_file` | Écriture de fichier |
| `Edit` | `apply_patch` | Patch de fichier |
| `Bash` | `run_command` | Commandes shell |
| `Task` (sous-agents) | `spawn_agent` | Sous-agents Codex (nécessite `multi_agent = true` dans ~/.codex/config.toml) |
| `TodoWrite` | `update_plan` | Mise à jour du plan |
| `Skill` | Skill natif Codex | Charger le skill par nom |

Pour les sous-agents Codex, activer dans `~/.codex/config.toml` :
\`\`\`toml
[experimental]
multi_agent = true
\`\`\`
```

---

## Tests à ajouter (`tests/standard.test.mjs`)

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

---

## Mise à jour `OUTILLAGE.md`

Ajouter dans la section "Installer les configs globales" :

```markdown
### Installation native (recommandée)

**Gemini CLI :**
    gemini extensions install /chemin/vers/hyperpowers

**OpenCode :** ajouter dans `~/.config/opencode/opencode.json` :
    { "plugin": ["/chemin/vers/hyperpowers"] }

**Codex :** via le gestionnaire de plugins Codex (path local)

**Cursor :** `/add-plugin /chemin/vers/hyperpowers` dans Cursor

### Fallback (copie de fichiers)
    npm run install-configs
```

---

## Livraison

| Fichier | Action |
|---|---|
| `gemini-extension.json` | Créer |
| `GEMINI.md` | Modifier (ajouter `@references/gemini-tools.md`) |
| `.opencode/plugins/hyperpowers.js` | Créer (+ dossier `.opencode/plugins/`) |
| `.codex-plugin/plugin.json` | Créer (+ dossier `.codex-plugin/`) |
| `.cursor-plugin/plugin.json` | Créer (+ dossier `.cursor-plugin/`) |
| `references/gemini-tools.md` | Créer (+ dossier `references/`) |
| `references/codex-tools.md` | Créer |
| `tests/standard.test.mjs` | Modifier (ajouter 7 tests) |
| `session-handoff/OUTILLAGE.md` | Modifier (ajouter section installation native) |
