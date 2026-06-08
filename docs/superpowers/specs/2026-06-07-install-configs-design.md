# Spec — Script d'installation des configs globales (`install.mjs`)

**Date :** 2026-06-07
**Statut :** À reviewer

---

## Problème

Les fichiers `GEMINI.md`, `opencode.json` et `AGENTS.md` générés par Hyperpowers
existent dans le repo mais ne sont pas installés dans les configs globales des
plateformes IA. Sur une nouvelle machine, ou après un clone, les plateformes ne
voient rien tant que l'utilisateur n'a pas copié manuellement les fichiers.

---

## Périmètre

**Dans le scope :**
- Script `scripts/install.mjs` qui copie les 3 fichiers vers leurs emplacements globaux
- 3 plateformes : Gemini CLI, Codex CLI, OpenCode
- npm script `install-configs` (séparé de `build:agents`)

**Hors scope :**
- Mistral Vibe — pas de support markdown global (config TOML uniquement)
- Claude Code — géré par le plugin marketplace, pas par ce script
- Mise à jour automatique au `git pull` (pas de hook git)
- Chaining avec `build:agents` (scripts séparés, usage séparé)

---

## Emplacements cibles (validés)

| Plateforme | Source (repo) | Destination globale |
|---|---|---|
| Gemini CLI | `GEMINI.md` | `~/.gemini/GEMINI.md` |
| Codex CLI | `AGENTS.md` | `~/.codex/AGENTS.md` |
| OpenCode | `opencode.json` | `~/.config/opencode/opencode.json` |

---

## Comportement

### Détection de plateforme

`which gemini`, `which opencode`, `which codex` — pour le log uniquement.
**La copie se fait toujours**, que la plateforme soit détectée ou non.

Log selon détection :
- Plateforme détectée : `✓ Gemini CLI détecté`
- Non détectée : `○ Gemini CLI non détecté (config installée quand même)`

### Gestion des conflits à destination

Pour chaque fichier :

1. **Destination absente** → créer les répertoires parents si nécessaire, copier, log `✓ installé`
2. **Destination identique** (comparaison byte-à-byte) → skip silencieux
3. **Destination différente** → warning + skip :
   ```
   ⚠ ~/.gemini/GEMINI.md existe et diffère — ignoré. Relance avec --force pour écraser.
   ```
4. **Flag `--force`** → écraser sans confirmation, log `✓ écrasé`

### Récap final

Une ligne par plateforme :
```
✓ Gemini CLI détecté      ~/.gemini/GEMINI.md        → installé
○ Codex non détecté       ~/.codex/AGENTS.md          → installé
⚠ OpenCode détecté        ~/.config/opencode/opencode.json → existant différent, ignoré
```

---

## Architecture du script

Script Node.js ESM, zéro dépendance, `~30 lignes`.

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

for (const { name, cmd, src, dest } of platforms) {
  const detected = isInstalled(cmd);
  const detectedLabel = detected ? `✓ ${name} détecté` : `○ ${name} non détecté`;

  if (!existsSync(dest)) {
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, readFileSync(src));
    console.log(`${detectedLabel.padEnd(30)} ${dest} → installé`);
  } else {
    const srcContent = readFileSync(src);
    const destContent = readFileSync(dest);
    if (srcContent.equals(destContent)) {
      // identique — skip silencieux
    } else if (force) {
      writeFileSync(dest, srcContent);
      console.log(`${detectedLabel.padEnd(30)} ${dest} → écrasé`);
    } else {
      console.warn(`⚠ ${dest} existe et diffère — ignoré. Relance avec --force pour écraser.`);
    }
  }
}

function isInstalled(cmd) {
  try { execSync(`which ${cmd}`, { stdio: "ignore" }); return true; }
  catch { return false; }
}
```

---

## Modification `package.json`

Ajouter le script `install-configs` :

```json
{
  "scripts": {
    "test": "node --test 'tests/**/*.test.mjs'",
    "build:agents": "node scripts/build-agents.mjs",
    "install-configs": "node scripts/install.mjs"
  }
}
```

---

## Tests à ajouter (`tests/standard.test.mjs`)

Tests structurels uniquement (pas d'install réelle dans les tests) :

```javascript
test("scripts/install.mjs existe et est exécutable", () => {
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

---

## Mise à jour `OUTILLAGE.md`

Ajouter une section "Installer les configs globales" :

```markdown
## Installer les configs globales (Gemini CLI, Codex, OpenCode)

Après clone, lancer une fois :

    npm run build:agents   # si AGENTS.md n'est pas à jour
    npm run install-configs

Relancer après toute mise à jour des configs :

    npm run install-configs --force   # si les fichiers ont changé
```

---

## Livraison

| Fichier | Action |
|---|---|
| `scripts/install.mjs` | Créer |
| `package.json` | Modifier (ajouter `install-configs`) |
| `tests/standard.test.mjs` | Modifier (ajouter 2 tests) |
| `session-handoff/OUTILLAGE.md` | Modifier (ajouter section install-configs) |
