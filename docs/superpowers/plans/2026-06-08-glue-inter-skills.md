# Glue inter-skills v1 — Filet de test de cohérence — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Poser un filet de test qui garantit la cohérence inter-skills — aucune référence morte entre skills, et les frontières déclarées disjointes restent explicites — protégeant la symbiose déjà vivante contre la régression.

**Architecture:** Deux tests ajoutés à `tests/standard.test.mjs` (style des tests d'invariant existants du projet : ils scannent les fichiers réels). Un fichier de déclaration `skills/disjoint-pairs.json` liste les paires de skills déclarées disjointes avec, pour chacune, la phrase de démarcation attendue dans une des deux descriptions. Aucune édition de skill (les baselines RED ont prouvé que le comportement de symbiose émerge déjà — voir la spec).

**Tech Stack:** Node.js ESM, `node:test`, `node:fs`. Zéro dépendance. Réutilise la fonction `installedSuperpowersSkills()` déjà présente dans le fichier de test.

---

## File Structure

- **Create:** `skills/disjoint-pairs.json` — déclaration des paires de skills disjointes + marqueur de frontière. Responsabilité unique : la source de vérité des frontières déclarées.
- **Modify:** `tests/standard.test.mjs` — deux tests ajoutés à la fin (Test A pointeurs morts, Test B anti-chevauchement).

Aucun autre fichier touché. Pas d'impact sur `AGENTS.md` (le générateur n'itère que `skills/*/SKILL.md` — un fichier `.json` à la racine de `skills/` est ignoré). Pas de bump de version plugin : aucun skill/hook/standard modifié, donc rien à propager au cache runtime.

---

## Task 1 : Test B — anti-chevauchement + disjoint-pairs.json

Ce test se fait en premier car son cycle RED→GREEN est naturel (le fichier de déclaration n'existe pas encore → rouge).

**Files:**
- Create: `skills/disjoint-pairs.json`
- Modify: `tests/standard.test.mjs`

- [ ] **Step 1 : Écrire le test B à la fin de `tests/standard.test.mjs`**

```js
test("paires disjointes : chaque paire déclarée a un marqueur de frontière présent dans une description", () => {
  const pairsPath = join(root, "skills/disjoint-pairs.json");
  assert.ok(existsSync(pairsPath), "skills/disjoint-pairs.json manquant");
  const pairs = JSON.parse(readFileSync(pairsPath, "utf8"));
  assert.ok(Array.isArray(pairs) && pairs.length >= 1, "au moins une paire disjointe déclarée");
  const skillsDir = join(root, "skills");
  for (const entry of pairs) {
    const [a, b] = entry.skills;
    const marker = entry.boundaryMarker;
    for (const s of [a, b]) {
      assert.ok(
        existsSync(join(skillsDir, s, "SKILL.md")),
        `paire disjointe pointe vers un skill inexistant : ${s}`,
      );
    }
    const fmA = readFileSync(join(skillsDir, a, "SKILL.md"), "utf8").match(/^---\n([\s\S]+?)\n---/)?.[1] ?? "";
    const fmB = readFileSync(join(skillsDir, b, "SKILL.md"), "utf8").match(/^---\n([\s\S]+?)\n---/)?.[1] ?? "";
    assert.ok(
      fmA.includes(marker) || fmB.includes(marker),
      `frontière absente : ni ${a} ni ${b} ne contient le marqueur "${marker}" dans sa description`,
    );
  }
});
```

- [ ] **Step 2 : Lancer le test pour vérifier qu'il échoue**

Run: `npm test`
Expected: FAIL — `skills/disjoint-pairs.json manquant` (le fichier n'existe pas encore).

- [ ] **Step 3 : Créer `skills/disjoint-pairs.json`**

```json
[
  {
    "skills": ["conseil", "brainstorming-advanced"],
    "boundaryMarker": "use brainstorming for that"
  }
]
```

Note : la description de `conseil` contient déjà la phrase « not to explore options (use brainstorming for that) » — c'est la démarcation explicite entre `conseil` (lit l'existant) et `brainstorming-advanced` (explore les options).

- [ ] **Step 4 : Lancer le test pour vérifier qu'il passe**

Run: `npm test`
Expected: PASS — `fmA` (description de `conseil`) contient « use brainstorming for that ».

- [ ] **Step 5 : Vérifier que le test a des dents (watch-it-fail)**

Modifier temporairement `skills/disjoint-pairs.json` : remplacer `"use brainstorming for that"` par `"marqueur-absent-xyz"`.
Run: `npm test`
Expected: FAIL — `frontière absente : ni conseil ni brainstorming-advanced ne contient le marqueur "marqueur-absent-xyz"`.
Puis **restaurer** `"use brainstorming for that"` et relancer `npm test` → PASS.

- [ ] **Step 6 : Commit**

```bash
git add skills/disjoint-pairs.json tests/standard.test.mjs
git commit -m "feat: test anti-chevauchement inter-skills + disjoint-pairs.json"
```

---

## Task 2 : Test A — pointeurs morts inter-skills

**Files:**
- Modify: `tests/standard.test.mjs`

- [ ] **Step 1 : Écrire le test A à la fin de `tests/standard.test.mjs`**

Ce test réutilise `installedSuperpowersSkills()`, déjà définie plus haut dans le fichier (elle retourne l'ensemble des noms de skills superpowers installés dans le cache).

```js
test("pointeurs inter-skills : toute référence superpowers:/hyperpowers: dans un SKILL.md existe", () => {
  const skillsDir = join(root, "skills");
  const skillNames = readdirSync(skillsDir).filter((n) =>
    existsSync(join(skillsDir, n, "SKILL.md")),
  );
  const internalSkills = new Set(skillNames);
  const spSkills = installedSuperpowersSkills();
  let refCount = 0;
  for (const name of skillNames) {
    const content = readFileSync(join(skillsDir, name, "SKILL.md"), "utf8");
    for (const [, ns, skill] of content.matchAll(/\b(superpowers|hyperpowers):([a-z][a-z-]*)/g)) {
      refCount++;
      if (ns === "superpowers") {
        assert.ok(spSkills.has(skill), `référence morte dans ${name}/SKILL.md : superpowers:${skill}`);
      } else {
        assert.ok(internalSkills.has(skill), `référence morte dans ${name}/SKILL.md : hyperpowers:${skill}`);
      }
    }
  }
  assert.ok(refCount >= 3, "trop peu de références inter-skills détectées — le scan a-t-il fonctionné ?");
});
```

- [ ] **Step 2 : Lancer le test pour vérifier qu'il passe sur l'état actuel**

Run: `npm test`
Expected: PASS. Toutes les références actuelles sont vivantes (`superpowers:brainstorming`, `superpowers:writing-plans`, `superpowers:writing-skills`, `hyperpowers:cahier-maitre`, `hyperpowers:brainstorming-advanced`). C'est un test de garde-fou : vert sur l'existant, il protège le futur.

- [ ] **Step 3 : Vérifier que le test a des dents (watch-it-fail)**

Ajouter temporairement, dans `skills/check-dependencies/SKILL.md`, une ligne contenant `hyperpowers:skill-fantome`.
Run: `npm test`
Expected: FAIL — `référence morte dans check-dependencies/SKILL.md : hyperpowers:skill-fantome`.
Puis **retirer** la ligne et relancer `npm test` → PASS.

- [ ] **Step 4 : Commit**

```bash
git add tests/standard.test.mjs
git commit -m "feat: test pointeurs morts inter-skills (références superpowers:/hyperpowers:)"
```

---

## Notes d'implémentation

- **Ordre :** Task 1 puis Task 2. Task 1 a un RED naturel (fichier absent) ; Task 2 est un garde-fou vert sur l'existant dont on prouve les dents au Step 3.
- **Ne pas committer** les modifications temporaires des steps « watch-it-fail » — elles servent uniquement à prouver que le test détecte une violation, puis sont restaurées avant le commit.
- **Pas de régénération `AGENTS.md`** : aucun `SKILL.md` n'est modifié de façon permanente.
- **Total attendu après les deux tasks :** 62 tests verts (60 actuels + 2 nouveaux).
