# Spec — Support multi-plateforme (Gemini CLI, OpenCode, Codex, Mistral Vibe)

**Date :** 2026-06-07
**Statut :** À reviewer

---

## Problème

Le standard de qualité Hyperpowers et les skills sont injectés via le hook SessionStart
de Claude Code (JSON propriétaire). Sur Gemini CLI, OpenCode, Codex et Mistral Vibe, rien
n'est chargé — l'utilisateur travaille sans le standard ni les skills.

---

## Périmètre

**Dans le scope :**
- Rendre le contenu (standard.md + skills) disponible sur les 4 plateformes cibles
- Mécanisme d'injection statique (pas de hook dynamique)
- Fichiers à la racine du dépôt Hyperpowers (source canonique)

**Hors scope :**
- Portage du hook dynamique FinalGoal (`.hyperpowers/goal.md`) — Claude Code only
- Configurations globales (`~/.gemini/`, `~/.codex/`, etc.) — à la charge de l'utilisateur
- Mise à jour du skill `NewProject` pour créer ces fichiers dans les nouveaux projets
  (chantier séparé)

---

## Architecture retenue

Trois fichiers d'entrée à la racine, pointant vers le contenu canonique existant :

```
Hyperpowers/
  standard.md          ← source canonique (inchangée)
  skills/              ← source canonique (inchangée)
  GEMINI.md            ← NOUVEAU — Gemini CLI (@-include natif)
  opencode.json        ← NOUVEAU — OpenCode (instructions array)
  AGENTS.md            ← NOUVEAU — Codex + Mistral Vibe (contenu embarqué)
  scripts/
    build-agents.mjs   ← NOUVEAU — génère AGENTS.md depuis les sources
```

---

## Mécanismes par plateforme

### Gemini CLI — `GEMINI.md`

Gemini CLI charge `GEMINI.md` au démarrage et supporte `@chemin/fichier.md` pour inclure
des fichiers Markdown externes (chemins relatifs, .md uniquement, confirmé).

```markdown
<!-- Hyperpowers — Gemini CLI entry point -->
<!-- standard.md injecté statiquement — le FinalGoal dynamique n'est pas disponible ici -->

@standard.md

## Skills disponibles

@skills/brainstorming-advanced/SKILL.md

@skills/session-handoff/SKILL.md

@skills/newproject/SKILL.md
```

**Limitation :** `.hyperpowers/goal.md` n'est pas détecté dynamiquement. Si un cap projet
existe, l'ajouter manuellement dans le `GEMINI.md` du projet.

---

### OpenCode — `opencode.json`

OpenCode supporte un fichier `opencode.json` à la racine avec un champ `"instructions"`
(tableau de chemins, globs supportés). Plus propre que l'`AGENTS.md` pour OpenCode car
pas d'embarquement de contenu.

```json
{
  "instructions": [
    "standard.md",
    "skills/brainstorming-advanced/SKILL.md",
    "skills/session-handoff/SKILL.md",
    "skills/newproject/SKILL.md"
  ]
}
```

**Note :** OpenCode lit aussi `AGENTS.md` en fallback. Si les deux sont présents,
`opencode.json` prend la priorité.

---

### Codex + Mistral Vibe — `AGENTS.md`

Ces deux plateformes lisent `AGENTS.md` (Markdown pur, pas d'@-include natif confirmé).
Le contenu de `standard.md` + les descriptions des skills y est embarqué.

`AGENTS.md` est **généré** par `scripts/build-agents.mjs` — ne pas éditer à la main.
Régénérer après toute modification de `standard.md` ou des skills.

Format généré :

```markdown
<!-- AUTO-GÉNÉRÉ — ne pas éditer directement -->
<!-- Source : standard.md + skills/*/SKILL.md -->
<!-- Régénérer : npm run build:agents -->

[contenu de standard.md]

---

## Skills disponibles

### brainstorming-advanced
[description + contenu de SKILL.md]

### session-handoff
[description + contenu de SKILL.md]

### newproject
[description + contenu de SKILL.md]
```

**Limitation Mistral Vibe :** AGENTS.md remplace le prompt système par défaut — le
contenu doit être autonome. Les références aux skills superpowers (ex: `superpowers:brainstorming`)
seront mentionnées comme guidance, pas comme outils invocables.

---

## Script `scripts/build-agents.mjs`

Script Node.js ESM, zéro dépendance, exécutable via `npm run build:agents`.

Logique :
1. Lire `standard.md`
2. Pour chaque skill dans `skills/*/SKILL.md` (ordre alphabétique) : lire et concaténer
3. Écrire `AGENTS.md` avec un en-tête "AUTO-GÉNÉRÉ"

```javascript
// scripts/build-agents.mjs
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const standard = readFileSync(join(root, "standard.md"), "utf8");

const skillsDir = join(root, "skills");
const skills = readdirSync(skillsDir)
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
console.log("AGENTS.md généré.");
```

---

## Modification `package.json`

Ajouter le script `build:agents` :

```json
{
  "scripts": {
    "test": "node --test 'tests/**/*.test.mjs'",
    "build:agents": "node scripts/build-agents.mjs"
  }
}
```

---

## Tests structurels à ajouter (`tests/standard.test.mjs`)

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

---

## Section README à ajouter

Ajouter dans `README.md` une section "Utiliser sur d'autres plateformes" :

```markdown
## Utiliser sur d'autres plateformes

Le standard de qualité et les skills sont disponibles sur d'autres plateformes via les fichiers
d'entrée présents à la racine :

| Plateforme | Fichier | Notes |
|---|---|---|
| **Gemini CLI** | `GEMINI.md` | @-includes natifs — automatique |
| **OpenCode** | `opencode.json` | instructions array natif — automatique |
| **Codex (OpenAI)** | `AGENTS.md` | Contenu embarqué — régénérer après modifs |
| **Mistral Vibe** | `AGENTS.md` | Idem — remplace le prompt système |

**Limitation :** le hook dynamique FinalGoal (`.hyperpowers/goal.md`) est Claude Code-only.
Sur les autres plateformes, le standard est injecté statiquement sans détection automatique du cap.

**Régénérer AGENTS.md** après toute modification de `standard.md` ou des skills :
`npm run build:agents`
```

---

## Livraison

| Fichier | Action |
|---|---|
| `GEMINI.md` | Créer |
| `opencode.json` | Créer |
| `scripts/build-agents.mjs` | Créer |
| `AGENTS.md` | Généré par le script |
| `package.json` | Modifier (ajouter `build:agents`) |
| `tests/standard.test.mjs` | Modifier (ajouter 3 tests) |
| `README.md` | Modifier (ajouter section multi-plateforme) |
