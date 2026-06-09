# v5 Fondations Symbiose — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rendre la symbiose inter-skills concrète : un skill `check-dependencies` diagnostique les plugins requis, et les skills qui délèguent à superpowers affichent un message d'installation clair si la dépendance manque.

**Architecture:** Option C — un skill `check-dependencies` lit `~/.claude/plugins/installed_plugins.json` via Bash et reporte l'état de superpowers et planning-with-files. Option B — `brainstorming-advanced` et `newproject` ajoutent une note de prérequis ciblée au point de délégation vers superpowers, sans perturber leur flux.

**Tech Stack:** Node.js ESM, `node:test`, `node:fs`, `node:os` — même stack que les tests existants. Aucune nouvelle dépendance.

---

## File Structure

- **Create:** `skills/check-dependencies/SKILL.md` — nouveau skill de diagnostic
- **Modify:** `skills/brainstorming-advanced/SKILL.md` — note prérequis superpowers
- **Modify:** `skills/newproject/SKILL.md` — note prérequis superpowers
- **Modify:** `tests/standard.test.mjs` — 6 nouveaux tests
- **Modify:** `AGENTS.md` — régénéré automatiquement (`npm run build:agents`)
- **Modify:** `.claude-plugin/plugin.json` — version 0.5.0 → 0.6.0
- **Modify:** `.claude-plugin/marketplace.json` — version 0.5.0 → 0.6.0

---

## Task 1 — Tests pour check-dependencies (rouge)

**Files:**
- Modify: `tests/standard.test.mjs`

- [ ] **Step 1 : Ajouter les 4 tests check-dependencies à la fin de `tests/standard.test.mjs`**

  Ajouter ce bloc à la fin du fichier (avant la dernière ligne si elle n'est pas vide) :

  ```js
  test("check-dependencies skill existe et a un frontmatter valide", () => {
    const skillPath = join(root, "skills/check-dependencies/SKILL.md");
    const content = readFileSync(skillPath, "utf8");
    assert.ok(content.startsWith("---"), "SKILL.md doit commencer par frontmatter YAML");
    assert.ok(content.includes("name: check-dependencies"), "name requis");
    assert.ok(content.includes("description:"), "description requise");
    assert.ok(content.includes("user-invocable: true"), "user-invocable requis");
  });

  test("check-dependencies description commence par 'Use when' (CSO)", () => {
    const content = readFileSync(join(root, "skills/check-dependencies/SKILL.md"), "utf8");
    const frontmatter = content.match(/^---\n([\s\S]+?)\n---/)?.[1] ?? "";
    assert.ok(frontmatter.length > 0, "frontmatter absent");
    assert.ok(frontmatter.includes("Use when"), "description doit commencer par 'Use when' (CSO)");
  });

  test("check-dependencies skill référence superpowers et planning-with-files avec commandes d'install", () => {
    const content = readFileSync(join(root, "skills/check-dependencies/SKILL.md"), "utf8");
    assert.ok(content.includes("superpowers"), "doit mentionner superpowers");
    assert.ok(content.includes("planning-with-files"), "doit mentionner planning-with-files");
    assert.ok(
      content.includes("/plugin install superpowers@claude-plugins-official"),
      "commande install superpowers requise"
    );
    assert.ok(
      content.includes("/plugin install planning-with-files@planning-with-files"),
      "commande install planning-with-files requise"
    );
  });

  test("check-dependencies skill décrit le mécanisme de vérification via installed_plugins.json", () => {
    const content = readFileSync(join(root, "skills/check-dependencies/SKILL.md"), "utf8");
    assert.ok(
      content.includes("installed_plugins.json"),
      "doit référencer installed_plugins.json comme source de vérification"
    );
  });
  ```

- [ ] **Step 2 : Lancer les tests pour confirmer qu'ils échouent**

  ```bash
  npm test
  ```

  Attendu : 4 nouveaux tests FAIL avec "no such file or directory" pour SKILL.md.

---

## Task 2 — Créer le skill check-dependencies (vert)

**Files:**
- Create: `skills/check-dependencies/SKILL.md`

- [ ] **Step 1 : Créer le dossier et le fichier SKILL.md**

  Créer `skills/check-dependencies/SKILL.md` avec ce contenu exact :

  ```markdown
  ---
  name: check-dependencies
  description: Use when you need to verify that the plugins required by Hyperpowers are installed (superpowers and planning-with-files), or when a skill fails to invoke one of these dependencies and you need to diagnose what is missing.
  user-invocable: true
  ---

  # check-dependencies — Vérification des dépendances Hyperpowers

  Hyperpowers délègue à deux plugins externes : **superpowers** et **planning-with-files**.
  Ce skill vérifie leur présence dans le cache local et donne les commandes d'installation
  si l'une d'elles manque.

  ## Procédure

  1. Lis `~/.claude/plugins/installed_plugins.json` :

     ```bash
     cat ~/.claude/plugins/installed_plugins.json
     ```

  2. Dans le JSON retourné, cherche les clés commençant par `superpowers@` et
     `planning-with-files@` dans l'objet `plugins`.

  3. Affiche le rapport avec ce format :

     ```
     ## Dépendances Hyperpowers

     | Plugin              | Statut       | Version |
     |---------------------|--------------|---------|
     | superpowers         | ✅ installé  | vX.Y.Z  |
     | planning-with-files | ❌ manquant  | —       |
     ```

  4. Pour chaque dépendance manquante, affiche la commande d'installation :

  ### superpowers manquant

  ```
  /plugin marketplace add claude-plugins-official
  /plugin install superpowers@claude-plugins-official
  ```

  ### planning-with-files manquant

  ```
  /plugin marketplace add OthmanAdi/planning-with-files
  /plugin install planning-with-files@planning-with-files
  ```

  5. Si les deux sont présents, conclure :

     > ✅ Toutes les dépendances Hyperpowers sont installées.
  ```

- [ ] **Step 2 : Lancer les tests pour confirmer qu'ils passent**

  ```bash
  npm test
  ```

  Attendu : les 4 nouveaux tests PASS. Total : 58 verts.

- [ ] **Step 3 : Régénérer AGENTS.md (staleness test l'exigerait)**

  ```bash
  npm run build:agents
  ```

  Attendu : AGENTS.md mis à jour avec le nouveau skill check-dependencies.

- [ ] **Step 4 : Relancer les tests pour confirmer 0 rouge**

  ```bash
  npm test
  ```

  Attendu : tous les tests PASS (58/58).

- [ ] **Step 5 : Commit**

  ```bash
  git add skills/check-dependencies/SKILL.md tests/standard.test.mjs AGENTS.md
  git commit -m "feat: skill check-dependencies — diagnostic des dépendances superpowers + pwf"
  ```

---

## Task 3 — Tests pour les prérequis dans brainstorming-advanced (rouge)

**Files:**
- Modify: `tests/standard.test.mjs`

- [ ] **Step 1 : Ajouter 1 test brainstorming-advanced prérequis**

  Ajouter ce bloc à la fin de `tests/standard.test.mjs` :

  ```js
  test("brainstorming-advanced mentionne la commande d'install superpowers si manquant", () => {
    const content = readFileSync(join(root, "skills/brainstorming-advanced/SKILL.md"), "utf8");
    assert.ok(
      content.includes("/plugin install superpowers@claude-plugins-official"),
      "doit inclure la commande d'install superpowers pour guider l'utilisateur si la dépendance manque"
    );
  });
  ```

- [ ] **Step 2 : Lancer les tests pour confirmer que le test échoue**

  ```bash
  npm test
  ```

  Attendu : 1 test FAIL sur brainstorming-advanced.

---

## Task 4 — Ajouter la note prérequis dans brainstorming-advanced (vert)

**Files:**
- Modify: `skills/brainstorming-advanced/SKILL.md`

- [ ] **Step 1 : Lire le début du fichier pour identifier le point d'insertion**

  Lire `skills/brainstorming-advanced/SKILL.md` lignes 1-15 pour confirmer la position
  de la **Règle absolue** (après le premier paragraphe d'intro).

- [ ] **Step 2 : Insérer la note prérequis juste avant la ligne `**Règle absolue :**`**

  Chercher le texte :
  ```
  **Règle absolue :** ne jamais invoquer ce skill sans confirmation explicite de l'utilisateur.
  `superpowers:brainstorming` reste le défaut.
  ```

  Le remplacer par :
  ```
  > **Prérequis :** Ce skill délègue à `superpowers:brainstorming` quand le sujet n'est pas
  > éligible. Si superpowers n'est pas installé au moment de la délégation, affiche ce message
  > et arrête-toi :
  > ⚠️ **superpowers requis.** Installer :
  > `/plugin marketplace add claude-plugins-official`
  > `/plugin install superpowers@claude-plugins-official`

  **Règle absolue :** ne jamais invoquer ce skill sans confirmation explicite de l'utilisateur.
  `superpowers:brainstorming` reste le défaut.
  ```

- [ ] **Step 3 : Lancer les tests pour confirmer que le test passe**

  ```bash
  npm test
  ```

  Attendu : PASS. Total : 59 verts.

- [ ] **Step 4 : Régénérer AGENTS.md**

  ```bash
  npm run build:agents
  ```

- [ ] **Step 5 : Relancer les tests**

  ```bash
  npm test
  ```

  Attendu : 59/59.

- [ ] **Step 6 : Commit**

  ```bash
  git add skills/brainstorming-advanced/SKILL.md tests/standard.test.mjs AGENTS.md
  git commit -m "feat: prérequis superpowers dans brainstorming-advanced (option B)"
  ```

---

## Task 5 — Tests pour les prérequis dans newproject (rouge)

**Files:**
- Modify: `tests/standard.test.mjs`

- [ ] **Step 1 : Ajouter 1 test newproject prérequis**

  Ajouter à la fin de `tests/standard.test.mjs` :

  ```js
  test("newproject mentionne la commande d'install superpowers si manquant", () => {
    const content = readFileSync(join(root, "skills/newproject/SKILL.md"), "utf8");
    assert.ok(
      content.includes("/plugin install superpowers@claude-plugins-official"),
      "doit inclure la commande d'install superpowers pour guider l'utilisateur si la dépendance manque"
    );
  });
  ```

- [ ] **Step 2 : Lancer les tests pour confirmer que le test échoue**

  ```bash
  npm test
  ```

  Attendu : 1 test FAIL sur newproject.

---

## Task 6 — Ajouter la note prérequis dans newproject (vert)

**Files:**
- Modify: `skills/newproject/SKILL.md`

- [ ] **Step 1 : Lire le fichier autour de la Phase 2 pour identifier le point d'insertion**

  Lire `skills/newproject/SKILL.md` autour des lignes 55-65 pour confirmer l'emplacement
  de l'option `superpowers:brainstorming` en Phase 2.

- [ ] **Step 2 : Insérer la note prérequis dans la Phase 2, avant l'option brainstorming**

  Chercher le texte (début de l'option en Phase 2) :
  ```
  **Option à proposer à la fin de Phase 2 :**
  ```

  Insérer ce bloc juste avant cette ligne :
  ```
  > **Prérequis Phase 2 :** Ce skill peut invoquer `superpowers:brainstorming` et
  > `superpowers:writing-plans`. Si superpowers n'est pas installé, affiche ce message
  > à la place de l'invocation :
  > ⚠️ **superpowers requis.** Installer :
  > `/plugin marketplace add claude-plugins-official`
  > `/plugin install superpowers@claude-plugins-official`

  ```

- [ ] **Step 3 : Lancer les tests pour confirmer que le test passe**

  ```bash
  npm test
  ```

  Attendu : PASS. Total : 60 verts.

- [ ] **Step 4 : Régénérer AGENTS.md**

  ```bash
  npm run build:agents
  ```

- [ ] **Step 5 : Relancer les tests**

  ```bash
  npm test
  ```

  Attendu : 60/60.

- [ ] **Step 6 : Commit**

  ```bash
  git add skills/newproject/SKILL.md tests/standard.test.mjs AGENTS.md
  git commit -m "feat: prérequis superpowers dans newproject (option B)"
  ```

---

## Task 7 — Version bump et commit final

**Files:**
- Modify: `.claude-plugin/plugin.json`
- Modify: `.claude-plugin/marketplace.json`

- [ ] **Step 1 : Bumper la version dans plugin.json**

  Dans `.claude-plugin/plugin.json`, remplacer `"version": "0.5.0"` par `"version": "0.6.0"`.

- [ ] **Step 2 : Bumper la version dans marketplace.json**

  Dans `.claude-plugin/marketplace.json`, remplacer `"version": "0.5.0"` par `"version": "0.6.0"`.

- [ ] **Step 3 : Lancer les tests pour confirmer que tout est vert**

  ```bash
  npm test
  ```

  Attendu : 60/60.

- [ ] **Step 4 : Commit**

  ```bash
  git add .claude-plugin/plugin.json .claude-plugin/marketplace.json
  git commit -m "chore: bump version 0.5.0 → 0.6.0 (v5 fondations symbiose)"
  ```

---

## Notes d'implémentation

- **Ordre des tâches :** respecter l'ordre (tests rouges → impl → vert → commit). Ne pas
  sauter de step.
- **AGENTS.md :** régénérer après **chaque** modification de skill (le test de staleness
  l'exigera). La commande est `npm run build:agents`.
- **Plugin cache :** après la session, bumper + `/plugin update hyperpowers@hyperpowers` +
  `/reload-plugins` pour que les skills modifiés prennent effet en runtime.
- **marketplace.json :** ne PAS ajouter d'entrées pour superpowers ou planning-with-files
  (décision tranchée en session 6 — le registre reste minimal, un seul plugin : hyperpowers).
