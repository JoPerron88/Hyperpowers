# Multi-Platform Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rendre le standard Hyperpowers et les skills disponibles sur Gemini CLI, OpenCode, Codex et Mistral Vibe via trois fichiers d'entrée à la racine du dépôt.

**Architecture:** `GEMINI.md` utilise le @-include natif de Gemini CLI pour pointer vers `standard.md` et les skills. `opencode.json` utilise le champ `instructions` natif d'OpenCode. `AGENTS.md` embarque le contenu généré par `scripts/build-agents.mjs` (Node.js ESM, zéro dépendance) pour Codex et Mistral Vibe. Les sources canoniques (`standard.md`, `skills/`) restent inchangées.

**Tech Stack:** Node.js ESM (script de génération), Markdown (fichiers d'entrée), JSON (opencode.json).

---

### Task 1 : Tests rouge (3 tests structurels)

**Files:**
- Modify: `tests/standard.test.mjs`

- [ ] **Step 1 : Ajouter les 3 tests à la fin de `tests/standard.test.mjs`**

```javascript
test("GEMINI.md existe et référence standard.md via @-include", () => {
  const content = readFileSync(join(root, "GEMINI.md"), "utf8");
  assert.ok(content.includes("@standard.md"), "@-include de standard.md requis");
});

test("opencode.json est valide et inclut standard.md", () => {
  const config = JSON.parse(readFileSync(join(root, "opencode.json"), "utf8"));
  assert.ok(Array.isArray(config.instructions), "instructions doit être un tableau");
  assert.ok(
    config.instructions.includes("standard.md"),
    "standard.md doit être dans instructions",
  );
});

test("AGENTS.md existe et contient le standard (généré)", () => {
  const content = readFileSync(join(root, "AGENTS.md"), "utf8");
  assert.ok(content.includes("AUTO-GÉNÉRÉ"), "en-tête AUTO-GÉNÉRÉ requis");
  assert.ok(content.includes("Réfléchir avant de coder"), "contenu standard requis");
});
```

- [ ] **Step 2 : Vérifier que les 3 tests échouent**

```bash
npm test 2>&1 | grep -E "(GEMINI|opencode|AGENTS|FAIL|Error)" | head -20
```

Résultat attendu : 3 échecs ENOENT (fichiers inexistants).

---

### Task 2 : Créer `GEMINI.md`

**Files:**
- Create: `GEMINI.md`

- [ ] **Step 1 : Créer `GEMINI.md` à la racine**

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
```

---

### Task 3 : Créer `opencode.json`

**Files:**
- Create: `opencode.json`

- [ ] **Step 1 : Créer `opencode.json` à la racine**

```json
{
  "instructions": [
    "standard.md",
    "skills/brainstorming-advanced/SKILL.md",
    "skills/newproject/SKILL.md",
    "skills/session-handoff/SKILL.md"
  ]
}
```

---

### Task 4 : Créer `scripts/build-agents.mjs` et générer `AGENTS.md`

**Files:**
- Create: `scripts/build-agents.mjs`
- Create: `AGENTS.md` (généré)
- Modify: `package.json`

- [ ] **Step 1 : Créer `scripts/build-agents.mjs`**

```javascript
#!/usr/bin/env node
// Génère AGENTS.md (Codex + Mistral Vibe) depuis standard.md + skills/*/SKILL.md.
// Usage : npm run build:agents
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const standard = readFileSync(join(root, "standard.md"), "utf8");

const skillsDir = join(root, "skills");
const skills = readdirSync(skillsDir)
  .filter((name) => existsSync(join(skillsDir, name, "SKILL.md")))
  .sort()
  .map((name) => {
    const content = readFileSync(join(skillsDir, name, "SKILL.md"), "utf8");
    return `### ${name}\n\n${content}`;
  })
  .join("\n\n---\n\n");

const output = `<!-- AUTO-GÉNÉRÉ — ne pas éditer directement -->
<!-- Source : standard.md + skills/*/SKILL.md -->
<!-- Régénérer : npm run build:agents -->

${standard}

---

## Skills disponibles

${skills}
`;

writeFileSync(join(root, "AGENTS.md"), output);
console.log("AGENTS.md généré (" + output.length + " caractères).");
```

- [ ] **Step 2 : Ajouter `build:agents` dans `package.json`**

```json
{
  "name": "hyperpowers",
  "version": "0.1.0",
  "description": "Standard de qualité de code injecté au SessionStart, déléguant le process aux skills superpowers.",
  "type": "module",
  "scripts": {
    "test": "node --test 'tests/**/*.test.mjs'",
    "build:agents": "node scripts/build-agents.mjs"
  }
}
```

- [ ] **Step 3 : Générer `AGENTS.md`**

```bash
npm run build:agents
```

Résultat attendu : `AGENTS.md généré (NNNNN caractères).`

- [ ] **Step 4 : Vérifier que `AGENTS.md` contient les éléments requis**

```bash
head -5 "/Users/jonathanperron/Library/Mobile Documents/com~apple~CloudDocs/Projet Claude Code/Hyperpowers/AGENTS.md"
grep -c "Réfléchir avant de coder" "/Users/jonathanperron/Library/Mobile Documents/com~apple~CloudDocs/Projet Claude Code/Hyperpowers/AGENTS.md"
grep "^### " "/Users/jonathanperron/Library/Mobile Documents/com~apple~CloudDocs/Projet Claude Code/Hyperpowers/AGENTS.md"
```

Résultat attendu :
- Ligne 1 : `<!-- AUTO-GÉNÉRÉ — ne pas éditer directement -->`
- grep count : 1
- `### brainstorming-advanced`, `### newproject`, `### session-handoff`

---

### Task 5 : Passer les tests au vert + ajouter section README

**Files:**
- Read: `tests/standard.test.mjs` (vérifier)
- Modify: `README.md`

- [ ] **Step 1 : Lancer tous les tests**

```bash
npm test 2>&1 | tail -20
```

Résultat attendu : **28 tests verts** (25 existants + 3 nouveaux). 1 rouge pré-existant
toléré (`planning-with-files` non installé).

- [ ] **Step 2 : Si un test multi-plateforme est rouge — diagnostiquer**

Erreurs possibles :
- `GEMINI.md` : `@standard.md` absent → vérifier le fichier créé en Task 2
- `opencode.json` : `instructions` pas un tableau → vérifier le JSON en Task 3
- `AGENTS.md` : `AUTO-GÉNÉRÉ` absent → relancer `npm run build:agents`
- `AGENTS.md` : `Réfléchir avant de coder` absent → vérifier que standard.md est lu
  en entier dans le script

Relancer `npm test` après chaque correction.

- [ ] **Step 3 : Ajouter la section multi-plateforme dans `README.md`**

Ajouter après la section "Installation" (ou à la fin si absente) :

````markdown
## Utiliser sur d'autres plateformes

Le standard de qualité et les skills sont disponibles sur d'autres plateformes via les
fichiers d'entrée présents à la racine :

| Plateforme | Fichier | Mécanisme |
|---|---|---|
| **Gemini CLI** | `GEMINI.md` | `@-include` natif — automatique |
| **OpenCode** | `opencode.json` | `instructions` array natif — automatique |
| **Codex (OpenAI)** | `AGENTS.md` | Contenu embarqué — régénérer après modifs |
| **Mistral Vibe** | `AGENTS.md` | Idem — remplace le prompt système |

**Limitation :** le hook dynamique FinalGoal (`.hyperpowers/goal.md`) est Claude Code-only.
Sur les autres plateformes, le standard est injecté statiquement.

**Régénérer `AGENTS.md`** après toute modification de `standard.md` ou des skills :
```bash
npm run build:agents
```
````

- [ ] **Step 4 : Commiter**

```bash
cd "/Users/jonathanperron/Library/Mobile Documents/com~apple~CloudDocs/Projet Claude Code/Hyperpowers"
git add GEMINI.md opencode.json AGENTS.md scripts/build-agents.mjs package.json tests/standard.test.mjs README.md docs/superpowers/specs/2026-06-07-multi-platform-design.md docs/superpowers/plans/2026-06-07-multi-platform.md
git commit -m "feat: support multi-plateforme — Gemini CLI, OpenCode, Codex, Mistral Vibe"
```
