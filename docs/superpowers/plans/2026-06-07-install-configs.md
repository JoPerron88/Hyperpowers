# Install Configs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Créer `scripts/install.mjs` qui copie `GEMINI.md`, `AGENTS.md` et `opencode.json` vers leurs emplacements globaux sur la machine (Gemini CLI, Codex CLI, OpenCode).

**Architecture:** Copies simples via `fs.copyFile`, détection plateforme via `which` pour le log uniquement (la copie se fait toujours), gestion des conflits : skip silencieux si identique, warning + skip si différent, `--force` pour écraser. ~30 lignes ESM zéro-dépendance.

**Tech Stack:** Node.js ESM, `node:fs`, `node:os`, `node:child_process`, `node:path`

---

## File Map

| Fichier | Action |
|---|---|
| `scripts/install.mjs` | Créer |
| `package.json` | Modifier — ajouter `install-configs` |
| `tests/standard.test.mjs` | Modifier — ajouter 2 tests structurels |
| `session-handoff/OUTILLAGE.md` | Modifier — ajouter section install-configs |

---

### Task 1 : Tests structurels (TDD — rouge d'abord)

**Files:**
- Modify: `tests/standard.test.mjs` (ajouter à la fin, après la ligne 313)

- [ ] **Step 1 : Ajouter les 2 tests à la fin de `tests/standard.test.mjs`**

```javascript
test("scripts/install.mjs existe et déclare les 3 plateformes et --force", () => {
  const path = join(root, "scripts", "install.mjs");
  assert.ok(existsSync(path), "scripts/install.mjs doit exister");
  const content = readFileSync(path, "utf8");
  assert.ok(content.includes("--force"), "flag --force requis");
  assert.ok(content.includes("GEMINI.md"), "Gemini CLI requis");
  assert.ok(content.includes("AGENTS.md"), "Codex requis");
  assert.ok(content.includes("opencode.json"), "OpenCode requis");
});

test("package.json contient le script install-configs", () => {
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  assert.ok(pkg.scripts?.["install-configs"], "script install-configs requis");
});
```

- [ ] **Step 2 : Vérifier que les tests échouent**

```bash
npm test
```

Attendu : 2 nouveaux FAIL — `scripts/install.mjs doit exister` et `script install-configs requis`

---

### Task 2 : Créer `scripts/install.mjs`

**Files:**
- Create: `scripts/install.mjs`

- [ ] **Step 1 : Créer le script**

```javascript
// scripts/install.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { homedir } from "node:os";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const force = process.argv.includes("--force");
const home = homedir();

const platforms = [
  {
    name: "Gemini CLI",
    cmd: "gemini",
    src: join(root, "GEMINI.md"),
    dest: join(home, ".gemini", "GEMINI.md"),
  },
  {
    name: "Codex CLI",
    cmd: "codex",
    src: join(root, "AGENTS.md"),
    dest: join(home, ".codex", "AGENTS.md"),
  },
  {
    name: "OpenCode",
    cmd: "opencode",
    src: join(root, "opencode.json"),
    dest: join(home, ".config", "opencode", "opencode.json"),
  },
];

function isInstalled(cmd) {
  try {
    execSync(`which ${cmd}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

for (const { name, cmd, src, dest } of platforms) {
  const detected = isInstalled(cmd);
  const label = (detected ? `✓ ${name} détecté` : `○ ${name} non détecté`).padEnd(30);

  if (!existsSync(dest)) {
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, readFileSync(src));
    console.log(`${label} ${dest} → installé`);
  } else {
    const srcContent = readFileSync(src);
    const destContent = readFileSync(dest);
    if (srcContent.equals(destContent)) {
      // identique — skip silencieux
    } else if (force) {
      writeFileSync(dest, srcContent);
      console.log(`${label} ${dest} → écrasé`);
    } else {
      console.warn(`⚠  ${dest} existe et diffère — ignoré. Relance avec --force pour écraser.`);
    }
  }
}
```

- [ ] **Step 2 : Vérifier la syntaxe**

```bash
node --check "/Users/jonathanperron/Library/Mobile Documents/com~apple~CloudDocs/Projet Claude Code/Hyperpowers/scripts/install.mjs"
```

Attendu : aucune sortie (syntaxe valide)

---

### Task 3 : Mettre à jour `package.json`

**Files:**
- Modify: `package.json`

- [ ] **Step 1 : Ajouter le script `install-configs`**

Remplacer le bloc `"scripts"` existant :

```json
{
  "name": "hyperpowers",
  "version": "0.1.0",
  "description": "Standard de qualité de code injecté au SessionStart, déléguant le process aux skills superpowers.",
  "type": "module",
  "scripts": {
    "test": "node --test 'tests/**/*.test.mjs'",
    "build:agents": "node scripts/build-agents.mjs",
    "install-configs": "node scripts/install.mjs"
  }
}
```

- [ ] **Step 2 : Vérifier que les 2 tests passent maintenant**

```bash
npm test
```

Attendu : 29 verts (ou 30 total, 1 rouge toléré si planning-with-files absent)

---

### Task 4 : Mettre à jour `session-handoff/OUTILLAGE.md`

**Files:**
- Modify: `session-handoff/OUTILLAGE.md`

- [ ] **Step 1 : Ajouter la section `install-configs` avant la section "Repli"**

Insérer après la section décrivant hyperpowers et avant `## Repli` :

```markdown
## Installer les configs globales (Gemini CLI, Codex, OpenCode)

Après clone (une fois) :

    npm run build:agents     # si AGENTS.md n'est pas à jour
    npm run install-configs

Relancer après mise à jour des configs sources :

    npm run install-configs --force   # si les fichiers ont changé

Emplacements installés :
- `~/.gemini/GEMINI.md`
- `~/.codex/AGENTS.md`
- `~/.config/opencode/opencode.json`

Note : Mistral Vibe hors scope (config TOML uniquement, pas de markdown global).
```

---

### Task 5 : Commit

- [ ] **Step 1 : Vérifier état final**

```bash
npm test
```

Attendu : tous verts sauf le rouge toléré (planning-with-files)

- [ ] **Step 2 : Commit**

```bash
git add scripts/install.mjs package.json tests/standard.test.mjs "session-handoff/OUTILLAGE.md"
git commit -m "feat: add install-configs script — copies platform configs to global locations"
```
