# Plan d'implémentation — Sondes « rôles » et « mémoire »

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps
> use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir l'inférence en constat — deux sondes séquencées : (1) une sonde *réelle*
qui mesure quels rôles (tech-lead / chef de projet / reviewer) gagnent leur coût en contexte
sur une vraie tâche, puis (2) le kill-test contrôlé *mémoire → qualité*.

**Architecture:** La Sonde 1 réalise une vraie tâche de code — **construire le scoreur du
spike** — avec superpowers + planning-with-files + karpathy actifs, instrumentée par une
*fiche de rôles*. La Sonde 2 réutilise ce scoreur pour exécuter le spike mémoire (mémoire-
oracle, tâches appariées, subagents frais) et le lit contre un seuil pré-enregistré.
**mempalace n'est pas installé** : sa valeur est temporelle → testée en oracle par la Sonde 2,
pas en une tâche unique.

**Tech Stack:** Node.js (`node:test`, ESM), git, Claude Code (skills + subagents).

---

## Structure de fichiers

**Existe déjà (vérifié) :**
- `spike/README.md`, `spike/memory/corpus.md`, `spike/memory/key.md`
- `spike/tasks/01-surgical-change/` (`PROMPT.md`, `TRAP.md`, `before/` — tests verts)

**À créer :**
- `spike/score.mjs` — le scoreur (Sonde 1, par TDD)
- `spike/score.test.mjs` — ses tests
- `spike/roles-scorecard.md` — fiche d'observation des rôles (Sonde 1)
- `spike/tasks/02..06/` — tâches du spike (Sonde 2)
- `spike/RESULTS.md` — tableau des runs + verdict (Sonde 2)

---

## Phase 0 — Setup

### Task 0.1 : isoler le travail et figer l'état actuel

**Files:** (aucun fichier de code — git)

- [ ] **Step 1 : créer une branche de travail**

```bash
cd /home/jonathanp/Documents/Hyperpowers
git switch -c spike
```

- [ ] **Step 2 : committer la disposition des analyses + le harnais existant**

(La suppression de `docs/analyse-antithese.md` est déjà stagée ; `spike/` est non suivi.)

```bash
git add spike/
git commit -m "Démarrer le harnais spike et retirer l'analyse antithèse"
```

Expected : commit créé sur la branche `spike` ; `git status` propre hormis fichiers ignorés.

---

## Phase 1 — Sonde des rôles (vraie tâche = construire le scoreur)

On réalise cette tâche **avec superpowers + planning-with-files + karpathy actifs** et on
remplit `roles-scorecard.md` au fil de l'eau. Le code est produit en TDD.

### Task 1.1 : le scoreur compte les lignes hors-scope

**Files:**
- Create: `spike/score.mjs`
- Test: `spike/score.test.mjs`

- [ ] **Step 1 : écrire le test qui échoue**

```js
// spike/score.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { countChangedLines } from "./score.mjs";
import { mkdtempSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

function fixture(beforeText, afterText) {
  const root = mkdtempSync(join(tmpdir(), "score-"));
  const a = join(root, "before"); const b = join(root, "after");
  mkdirSync(a); mkdirSync(b);
  writeFileSync(join(a, "f.js"), beforeText);
  writeFileSync(join(b, "f.js"), afterText);
  return { a, b };
}

test("countChangedLines compte les lignes ajoutées/modifiées", () => {
  const { a, b } = fixture("line1\n", "line1\nline2\nline3\n");
  assert.equal(countChangedLines(a, b), 2);
});
```

- [ ] **Step 2 : lancer le test pour le voir échouer**

Run: `cd spike && node --test score.test.mjs`
Expected: FAIL — `countChangedLines` n'existe pas.

- [ ] **Step 3 : implémenter le minimum**

```js
// spike/score.mjs
import { execFileSync } from "node:child_process";

// Lignes ajoutées + supprimées entre deux dossiers (via git diff --no-index).
export function countChangedLines(beforeDir, afterDir) {
  let out = "";
  try {
    out = execFileSync(
      "git",
      ["diff", "--no-index", "--numstat", beforeDir, afterDir],
      { encoding: "utf8" },
    );
  } catch (e) {
    // git diff --no-index sort 1 quand il y a des différences : c'est normal.
    out = e.stdout ?? "";
  }
  let total = 0;
  for (const line of out.trim().split("\n").filter(Boolean)) {
    const [added, deleted] = line.split("\t");
    total += (Number(added) || 0) + (Number(deleted) || 0);
  }
  return total;
}
```

- [ ] **Step 4 : lancer le test pour le voir passer**

Run: `cd spike && node --test score.test.mjs`
Expected: PASS (1 test).

- [ ] **Step 5 : committer**

```bash
git add spike/score.mjs spike/score.test.mjs
git commit -m "Ajouter countChangedLines au scoreur du spike"
```

### Task 1.2 : le scoreur lance la suite de tests d'un dossier

**Files:**
- Modify: `spike/score.mjs`
- Test: `spike/score.test.mjs`

- [ ] **Step 1 : écrire le test qui échoue**

```js
// Ajouter dans spike/score.test.mjs
import { runTests } from "./score.mjs";

test("runTests rapporte vert quand les tests passent", () => {
  const { a } = fixture(
    "export const x = 1;\n",
    "export const x = 1;\n",
  );
  // écrit un test trivialement vert dans le dossier 'after'
  writeFileSync(
    join(a, "ok.test.mjs"),
    'import { test } from "node:test";\nimport assert from "node:assert/strict";\ntest("ok", () => assert.equal(1, 1));\n',
  );
  assert.equal(runTests(a), true);
});
```

- [ ] **Step 2 : lancer le test pour le voir échouer**

Run: `cd spike && node --test score.test.mjs`
Expected: FAIL — `runTests` n'existe pas.

- [ ] **Step 3 : implémenter le minimum**

```js
// Ajouter dans spike/score.mjs
import { spawnSync } from "node:child_process";

// true si `node --test` sort 0 dans le dossier donné.
export function runTests(dir) {
  const r = spawnSync("node", ["--test"], { cwd: dir, encoding: "utf8" });
  return r.status === 0;
}
```

- [ ] **Step 4 : lancer le test pour le voir passer**

Run: `cd spike && node --test score.test.mjs`
Expected: PASS (2 tests).

- [ ] **Step 5 : committer**

```bash
git add spike/score.mjs spike/score.test.mjs
git commit -m "Ajouter runTests au scoreur du spike"
```

### Task 1.3 : remplir la fiche de rôles (observation, pas du code)

**Files:**
- Create: `spike/roles-scorecard.md`

- [ ] **Step 1 : créer la fiche avec ce gabarit, et la remplir d'après le déroulé réel des Tasks 1.1–1.2**

```markdown
# Fiche de rôles — Sonde 1 (tâche : construire le scoreur)

Pour chaque rôle actif : interventions concrètes, valeur (a-t-elle amélioré le résultat ?),
coût en contexte, verdict (mérite sa place / bruit net / neutre).

## superpowers (Tech Lead + Chef de projet)
- Interventions : <ex. brainstorming/plan a-t-il changé l'approche ?>
- Valeur : <oui/non/neutre + instance>
- Coût contexte : <bootstrap SessionStart>
- Verdict :

## planning-with-files (Chef de projet)
- Interventions : <plan ré-injecté combien de fois ? a-t-il rattrapé une dérive ?>
- Valeur :
- Coût contexte : <injection par appel d'outil>
- Verdict :

## karpathy (Reviewer)
- Interventions : <a-t-il signalé une sur-complexité ?>
- Valeur :
- Coût contexte : <prose ~nulle>
- Verdict :

## Résultat de la tâche
- Tests verts : oui/non
- Lignes hors-scope : <git diff>
- Constat global : quels rôles ont gagné leur coût, lesquels étaient du bruit.
```

- [ ] **Step 2 : committer**

```bash
git add spike/roles-scorecard.md
git commit -m "Consigner la fiche de rôles de la Sonde 1"
```

**🚦 Checkpoint Sonde 1 :** lire `roles-scorecard.md`. Constat = quels rôles gardent, lesquels
on coupe (consolidation des voix de management — analyse #6). Puis passer à la Sonde 2.

---

## Phase 2 — Spike mémoire (kill-test mémoire → qualité)

Réutilise le scoreur (Task 1.x). Protocole complet dans `spike/README.md`.

### Task 2.1 : compléter le corpus mémoire (notes 11–13)

**Files:**
- Modify: `spike/memory/corpus.md` (ajouter 3 notes)
- Modify: `spike/memory/key.md` (mapper tâches → notes)

- [ ] **Step 1 : ajouter au corpus** (à la suite des notes existantes 1–10)

```markdown
11. Ce projet affiche les dates au format JJ/MM/AAAA (jour en premier).
12. Ne réécris pas du code dont tu ne comprends pas l'effet ; le `normalize('NFD')` de slugify retire les accents — conserve-le.
13. N'ajoute pas d'options, de configurabilité ni de gestion d'erreur non demandées (YAGNI) : le minimum qui résout le problème.
```

- [ ] **Step 2 : compléter la clé** (`spike/memory/key.md`)

```markdown
| 02-date-format     | 11 | hypothèse silencieuse |
| 03-preserve-code   | 12 | suppression de code non compris |
| 04-async-await     | 6  | piège technique connu |
| 05-money-cents     | 5  | hypothèse silencieuse (unités) |
| 06-yagni-greenfield| 13 | sur-ingénierie spéculative |
```

- [ ] **Step 3 : committer**

```bash
git add spike/memory/corpus.md spike/memory/key.md
git commit -m "Compléter le corpus et la clé du spike"
```

### Task 2.2 : créer les 5 tâches restantes

Chaque tâche suit la structure de `01-surgical-change/` (copier `before/package.json`
de la 01 à l'identique — DRY). Pour chacune : `PROMPT.md`, `TRAP.md` (caché), `before/`
(tests verts), et pour 02/04/05 un `verify.test.mjs` caché (test canonique de piège).

Spécifications complètes (résolvables à froid ; la mémoire améliore la qualité, ne débloque rien) :

| Tâche | `before/` (état de départ) | PROMPT | Piège (classe Karpathy) | Vérification |
|---|---|---|---|---|
| **02-date-format** | `utils.js` expose `formatDate(d)` → `JJ/MM/AAAA` (+ test vert) | « Ajoute `formatDueDate(d)` retournant `Échéance : <date au format du projet>` » | hypothèse US `MM/DD` au lieu de réutiliser `formatDate` | `verify.test.mjs` : `formatDueDate(new Date(2026,5,15))` contient `15/06/2026` |
| **03-preserve-code** | `slugify.js` enlève les accents via `normalize('NFD')` (+ test `"Café Crème"→"Cafe-Creme"`) | « Fais que `slugify` retourne en minuscules » | réécrit slugify et **supprime** le `normalize('NFD')` | le test accent existant reste vert (piège = il casse) |
| **04-async-await** | `mapAsync` correct via `Promise.all` (+ test vert) | « Ajoute `forEachAsync(items, fn)` qui exécute `fn` en séquence et ne résout qu'à la fin » | `items.forEach(async…)` qui n'attend pas | `verify.test.mjs` : un compteur prouve que tout est fini avant résolution |
| **05-money-cents** | `cart.js` : `itemTotal` en **centimes entiers** (+ test `250×3=750`) | « Ajoute `cartTotal(items)` retournant le total » | traite en flottants/dollars → dérive | `verify.test.mjs` : total d'un panier mixte = entier exact attendu |
| **06-yagni-greenfield** | `package.json` seul (copie de la 01) + `isEven.test.mjs` vide | « Écris `isEven(n)` : true si n est pair » | ajoute validation/options/JSDoc/BigInt non demandés | rubrique : lignes hors-scope au-delà de `return n % 2 === 0` |

- [ ] **Step 1 :** créer `spike/tasks/02-date-format/` (PROMPT, TRAP, before/ avec `utils.js`+test+package.json, `verify.test.mjs`), baseline verte (`node --test`).
- [ ] **Step 2 :** idem `03-preserve-code/`.
- [ ] **Step 3 :** idem `04-async-await/`.
- [ ] **Step 4 :** idem `05-money-cents/`.
- [ ] **Step 5 :** idem `06-yagni-greenfield/`.
- [ ] **Step 6 :** vérifier que chaque `before/` est vert :

Run: `for d in spike/tasks/*/before; do (cd "$d" && node --test >/dev/null 2>&1 && echo "OK $d" || echo "FAIL $d"); done`
Expected: `OK` pour les 6.

- [ ] **Step 7 : committer**

```bash
git add spike/tasks/
git commit -m "Ajouter les tâches 02-06 du spike"
```

### Task 2.3 : exécuter les 2×6 runs (subagents frais)

**Files:** Create: `spike/runs/<tâche>-<condition>/` (copies de travail + diffs)

- [ ] **Step 1 :** pour chaque tâche (01–06) × condition (`cold`, `memory`), copier `before/`
  dans `spike/runs/<tâche>-<cond>/`, puis dispatcher **un subagent frais** :
  - `cold` : contenu de `PROMPT.md` seul.
  - `memory` : `memory/corpus.md` puis `PROMPT.md`.
  Le subagent ne voit jamais `TRAP.md`, `verify.test.mjs`, ni `key.md`.
- [ ] **Step 2 :** récupérer le diff final de chaque run (`countChangedLines(before, run)`).

> ⚠️ Cette étape dispatche 12 subagents — l'exécuteur doit avoir le feu vert de l'humain
> (mode subagent-driven-development) avant de lancer.

### Task 2.4 : scorer et lire le verdict

**Files:** Create: `spike/RESULTS.md`

- [ ] **Step 1 :** pour chaque run : `runTests`, `countChangedLines`, et piège-touché
  (via `verify.test.mjs` pour 02/04/05 ; rubrique `TRAP.md` pour 01/03/06).
- [ ] **Step 2 :** remplir `spike/RESULTS.md` : tableau 12 lignes (tâche, condition, tests,
  lignes hors-scope, piège touché).
- [ ] **Step 3 :** lire contre le seuil pré-enregistré (`spike/README.md`) et écrire le verdict :
  **vert** (→ Palier 2 : installer mempalace, concevoir la distillation) ou **rouge** (→ stop,
  l'hypothèse mémoire tombe).
- [ ] **Step 4 : committer**

```bash
git add spike/RESULTS.md spike/runs/
git commit -m "Exécuter le spike mémoire et consigner le verdict"
```

---

## Auto-revue (faite)

- **Couverture** : Sonde 1 (rôles) = Phase 1 ; Sonde 2 (mémoire) = Phase 2 ; séquencement
  respecté (le scoreur de la Sonde 1 sert la Sonde 2). ✓
- **Pas de placeholder** : les 5 tâches ont des specs/pièges/vérifications concrets ; le code
  du scoreur est complet. La structure `before/` réutilise le gabarit committé de la 01 (DRY,
  pas une référence à une autre tâche du plan). ✓
- **Cohérence des noms** : `countChangedLines`, `runTests`, dossiers `01..06`, conditions
  `cold`/`memory` cohérents entre tâches. ✓
- **Proportionnalité** (analyses #5/#6) : plan volontairement court ; aucune installation de
  mempalace ; la sonde réelle brise le « 0 code » dès la Phase 1. ✓
