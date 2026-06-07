# Le FinalGoal (fil conducteur projet) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Donner à un projet un cap persistant (`.hyperpowers/goal.md`) que Claude relit aux checkpoints pour contrer la dérive du but, dormant par défaut.

**Architecture:** Additif, dans la lignée v1/v2. (1) Principe 6 « Garder le cap » dans `standard.md`. (2) `hooks/session-start.mjs` étendu : lit le `cwd` depuis le JSON stdin (fallback `process.cwd()`), et injecte le FinalGoal **si** `<cwd>/.hyperpowers/goal.md` existe — sinon standard seul. Aucun nouveau hook, aucun fork.

**Tech Stack:** Node.js ESM, `node:test`, zéro dépendance. Markdown pour `standard.md`.

**Spec :** `docs/superpowers/specs/2026-06-06-finalgoal-fil-conducteur-design.md`
**Branche :** `v3-finalgoal` (part de `v2-routage-plans`, qui contient déjà le principe 5).

---

## Task 1 : TDD — ajouter le 6ᵉ principe « Garder le cap (le FinalGoal) »

**Files:**
- Modify: `tests/standard.test.mjs` (1 nouveau test + ajout d'un titre au test du hook existant)
- Modify: `standard.md` (insérer le principe 6 entre le principe 5 et la section `## Priorité`)

- [ ] **Step 1 : Écrire le test qui échoue**

Dans `tests/standard.test.mjs`, ajouter ce test **à la fin du fichier** :

```js
test("standard.md contient le 6ᵉ principe (Garder le cap)", () => {
  const c = readFileSync(join(root, "standard.md"), "utf8");
  assert.ok(c.includes("Garder le cap"), "titre du 6ᵉ principe absent");
  assert.ok(c.includes(".hyperpowers/goal.md"), "chemin du fichier de cap absent");
  assert.ok(c.includes("relis"), "consigne de récitation (relis) absente");
});
```

Puis **étendre le test existant du hook** (le test « la commande du hook SessionStart émet le contrat additionalContext ») en ajoutant le 6ᵉ titre à son tableau. Remplacer :

```js
    "Piloté par objectif",
    "Planifier à la bonne échelle",
  ]) {
```
par :
```js
    "Piloté par objectif",
    "Planifier à la bonne échelle",
    "Garder le cap",
  ]) {
```

- [ ] **Step 2 : Lancer les tests pour vérifier l'échec**

Run : `npm test`
Expected : ÉCHEC. Le nouveau test échoue (« titre du 6ᵉ principe absent ») et le test du hook échoue (« principe absent du contexte injecté : Garder le cap »).

- [ ] **Step 3 : Ajouter le principe 6 à `standard.md`**

Insérer ce bloc **entre** le principe 5 et la section `## Priorité` :

```markdown

## 6. Garder le cap (le FinalGoal)
Si un cap projet est posé (`.hyperpowers/goal.md` présent), garder le travail aligné dessus.
Aux checkpoints — avant de figer un plan, avant de déclarer une étape finie — **relis**
`.hyperpowers/goal.md` (récitation) et demande-toi : « est-ce que ça sert le FinalGoal ? ». Si ça
dévie, **signale-le et demande**, sans bloquer. Tout but temporaire (en-tête `Goal:` d'un plan,
section Goal de `task_plan.md`) doit **tracer vers le FinalGoal** ; sinon, dis-le.
Fréquence selon le tier (principe 5) : moyenne → au plan figé et à l'étape finie ; grosse / pwf
actif → à chaque phase. Garde-le léger : le cap oriente, il ne rigidifie pas (le nombre de
features ou l'esthétique ne sont pas le cap).
Absent (`.hyperpowers/goal.md` non présent) → ce principe est dormant.
```

- [ ] **Step 4 : Lancer les tests pour vérifier le vert**

Run : `npm test`
Expected : SUCCÈS, **11 tests verts** (`pass 11`, `fail 0`).

- [ ] **Step 5 : Commit**

```bash
git add standard.md tests/standard.test.mjs
git diff --cached --name-only | xargs grep -li "API_KEY\|SECRET\|password\s*=\|apiKey\|Bearer " 2>/dev/null || echo "aucun secret"
git commit -m "Ajouter le 6e principe du Standard : garder le cap (FinalGoal)

Si .hyperpowers/goal.md est posé, relire le cap aux checkpoints (récitation) et
signaler la dérive sans bloquer. Buts temporaires tracent vers le FinalGoal.
Fréquence des checkpoints selon le tier (principe 5). Dormant si aucun cap.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2 : TDD — injection conditionnelle du FinalGoal dans le hook SessionStart

> Le hook doit lire le `cwd` depuis stdin pour localiser le projet (`CLAUDE_PROJECT_DIR` est écarté : bug connu). Il injecte le FinalGoal **seulement** si `<cwd>/.hyperpowers/goal.md` existe et n'est pas vide. Il ne doit **jamais** planter (toute erreur → standard seul).

**Files:**
- Modify: `tests/standard.test.mjs` (étendre les imports, ajouter un helper `runHook` + 3 tests, ajuster le test du hook existant pour passer `input: ""`)
- Modify: `hooks/session-start.mjs` (lecture stdin + injection conditionnelle)

- [ ] **Step 1 : Écrire les tests qui échouent**

Dans `tests/standard.test.mjs`, **étendre les imports** en tête de fichier. Remplacer :

```js
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";
import { execFileSync } from "node:child_process";
```
par :
```js
import {
  readFileSync,
  existsSync,
  readdirSync,
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  rmSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir, tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
```

Puis ajouter ce helper + ces **3 tests** à la fin du fichier :

```js
const hookPath = join(root, "hooks/session-start.mjs");
const standardContent = readFileSync(join(root, "standard.md"), "utf8");

function runHook(input) {
  const out = execFileSync("node", [hookPath], { input, encoding: "utf8" });
  return JSON.parse(out).hookSpecificOutput.additionalContext;
}

test("le hook injecte le FinalGoal quand .hyperpowers/goal.md existe", () => {
  const dir = mkdtempSync(join(tmpdir(), "hp-goal-"));
  try {
    mkdirSync(join(dir, ".hyperpowers"));
    const goal = "Logiciel de prise de notes assisté par IA.";
    writeFileSync(join(dir, ".hyperpowers/goal.md"), goal);
    const ctx = runHook(JSON.stringify({ cwd: dir, hook_event_name: "SessionStart" }));
    assert.ok(ctx.startsWith(standardContent), "le standard doit rester injecté en tête");
    assert.ok(ctx.includes(goal), "le contenu du FinalGoal doit être injecté");
    assert.ok(ctx.length > standardContent.length, "un bloc doit être ajouté au standard");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("le hook reste dormant quand .hyperpowers/goal.md est absent", () => {
  const dir = mkdtempSync(join(tmpdir(), "hp-nogoal-"));
  try {
    const ctx = runHook(JSON.stringify({ cwd: dir, hook_event_name: "SessionStart" }));
    assert.equal(ctx, standardContent, "sans cap, additionalContext = standard verbatim");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("le hook ne plante pas si stdin est vide (fallback process.cwd())", () => {
  const ctx = runHook("");
  assert.ok(
    ctx.includes("Réfléchir avant de coder"),
    "le standard doit être injecté même sans stdin",
  );
});
```

Enfin, **ajuster le test du hook existant** (« la commande du hook SessionStart émet le contrat additionalContext ») pour passer un stdin vide explicite, sinon le hook qui lit désormais stdin pourrait bloquer. Remplacer :

```js
  const out = execFileSync("sh", ["-c", resolved], { encoding: "utf8" });
```
par :
```js
  const out = execFileSync("sh", ["-c", resolved], { encoding: "utf8", input: "" });
```

- [ ] **Step 2 : Lancer les tests pour vérifier l'échec**

Run : `npm test`
Expected : ÉCHEC. Le test « le hook injecte le FinalGoal quand … existe » échoue (le hook actuel ignore stdin et n'injecte que le standard, donc `ctx.includes(goal)` est faux). Les tests « dormant » et « robustesse » passent déjà (garde-fous de régression).

- [ ] **Step 3 : Réécrire `hooks/session-start.mjs`**

Remplacer **tout le contenu** de `hooks/session-start.mjs` par :

```js
#!/usr/bin/env node
// Hook SessionStart : injecte standard.md (toujours) + le FinalGoal du projet (si présent),
// via le contrat additionalContext de Claude Code (JSON hookSpecificOutput.additionalContext).
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const pluginRoot =
  process.env.CLAUDE_PLUGIN_ROOT ??
  join(dirname(fileURLToPath(import.meta.url)), "..");

const standard = readFileSync(join(pluginRoot, "standard.md"), "utf8");

// Localiser le projet : cwd depuis le JSON stdin, fallback process.cwd().
// (CLAUDE_PROJECT_DIR est écarté — bug connu ; les hooks tournent dans le cwd du projet.)
function projectCwd() {
  try {
    const data = JSON.parse(readFileSync(0, "utf8"));
    if (data && typeof data.cwd === "string" && data.cwd.length > 0) {
      return data.cwd;
    }
  } catch {
    // stdin vide/illisible → fallback ci-dessous
  }
  return process.cwd();
}

// Bloc FinalGoal si .hyperpowers/goal.md existe et n'est pas vide. Ne jamais planter.
function finalGoalBlock(cwd) {
  try {
    const goal = readFileSync(join(cwd, ".hyperpowers/goal.md"), "utf8").trim();
    if (goal.length === 0) return "";
    return (
      "\n\n# Hyperpowers — FinalGoal (le cap du projet)\n\n" +
      "> Relis ce cap aux checkpoints (principe 6 du Standard). Garde le travail aligné dessus ; signale toute dérive.\n\n" +
      goal +
      "\n"
    );
  } catch {
    return "";
  }
}

const additionalContext = standard + finalGoalBlock(projectCwd());

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext,
    },
  }),
);
```

- [ ] **Step 4 : Lancer les tests pour vérifier le vert**

Run : `npm test`
Expected : SUCCÈS, **14 tests verts** (`pass 14`, `fail 0`).

- [ ] **Step 5 : Commit**

```bash
git add hooks/session-start.mjs tests/standard.test.mjs
git diff --cached --name-only | xargs grep -li "API_KEY\|SECRET\|password\s*=\|apiKey\|Bearer " 2>/dev/null || echo "aucun secret"
git commit -m "Injecter le FinalGoal au SessionStart si .hyperpowers/goal.md existe

Le hook lit le cwd depuis stdin (fallback process.cwd()), et ajoute le cap projet au
standard si le fichier est présent et non vide ; sinon standard seul (dormant). Ne
plante jamais. Tests : injection présente, dormant verbatim, robustesse stdin vide.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3 : Réinstaller le plugin + vérifier en runtime + documenter

> Le plugin est copié dans le cache à l'install : éditer `standard.md` / le hook n'a aucun effet runtime tant qu'on ne réinstalle pas. Étapes = **gate humaine** (commandes `/plugin` + redémarrage que l'exécuteur ne peut pas faire). Documenter précisément.

**Files:**
- Modify: `CLAUDE.md` (statut → v3 livrée)
- Modify: `.claude/JOURNAL.md` (entrée de session — privé, hors git)

- [ ] **Step 1 : Réinstaller le plugin (humain)**

Dans Claude Code :
```
/plugin marketplace add /home/jonathanp/Documents/Hyperpowers
/plugin install hyperpowers@hyperpowers
```
(réinstaller pour forcer la recopie de `standard.md` + du hook dans le cache), puis **redémarrer**.
Expected : réinstall sans erreur.

- [ ] **Step 2 : Vérifier en runtime — cap ABSENT (dormant) (humain)**

Dans un projet **sans** `.hyperpowers/goal.md`, ouvrir une session fraîche.
Expected : le contexte SessionStart contient le Standard (dont « ## 6. Garder le cap »), mais **aucun** bloc « # Hyperpowers — FinalGoal (le cap du projet) ». La fonctionnalité est dormante.

- [ ] **Step 3 : Vérifier en runtime — cap PRÉSENT (humain)**

Dans un projet de test, créer le cap :
```bash
mkdir -p .hyperpowers && printf 'Logiciel de prise de notes assisté par IA.\n' > .hyperpowers/goal.md
```
Ouvrir une session fraîche.
Expected : le contexte SessionStart contient le bloc « # Hyperpowers — FinalGoal (le cap du projet) » suivi de l'énoncé du cap, à côté du Standard. (Nettoyer ensuite si c'est un projet jetable.)

- [ ] **Step 4 : Actualiser `CLAUDE.md` et le journal, committer la doc**

Mettre à jour le bloc « État courant » de `CLAUDE.md` : v3 = FinalGoal (fil conducteur) livré sur `v3-finalgoal`, vérifié runtime (dormant sans cap, injecté avec). Mentionner la spec et ce plan, et le compte de tests (→ 14). Ajouter l'entrée de session à `.claude/JOURNAL.md`.
Puis :
```bash
git add CLAUDE.md
git commit -m "Documenter la v3 (FinalGoal) livrée et vérifiée en runtime

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```
Expected : commit créé. (`.claude/JOURNAL.md` gitignoré — non commité, normal.)

- [ ] **Step 5 : Décider de l'intégration des branches**

Via `superpowers:finishing-a-development-branch`, présenter les options. Rappel : `v3-finalgoal`
contient `v2-routage-plans`. Décision humaine — intégrer v2 puis v3 (ou v3 qui embarque v2) vers
`main`. Ne pas merger sans feu vert.

---

## Notes de mise en œuvre

- **Chirurgical** : ne toucher que `standard.md` (insertion principe 6), `hooks/session-start.mjs`
  (réécriture complète, petite) et `tests/standard.test.mjs` (imports + helper + 4 tests + 2
  ajustements ponctuels). Ne pas refactorer les tests existants.
- **Pas de 3ᵉ porteur de but** : aucun stockage de buts temporaires ; le principe 6 s'accroche aux
  `Goal:` existants (superpowers/pwf).
- **Dormant par défaut** : sans `.hyperpowers/goal.md`, `additionalContext` = standard **verbatim**
  (le test « dormant » l'asserte par égalité stricte).
- **Robustesse stdin** : le hook lit `readFileSync(0)` dans un `try/catch` ; les tests passent un
  `input` explicite pour rester déterministes et ne jamais bloquer.
- **Honnêteté** : le done = cap présent, relu aux checkpoints, dérive signalée — pas « zéro dérive ».
