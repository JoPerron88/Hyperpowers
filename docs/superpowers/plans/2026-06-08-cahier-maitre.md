# Cahier maître — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Créer le skill `cahier-maitre` — log séquentiel narratif commité dans le repo, destiné à l'humain, avec intégration optionnelle dans `session-handoff`.

**Architecture:** Nouveau skill autonome `skills/cahier-maitre/SKILL.md` + modification légère de `skills/session-handoff/SKILL.md` (étape optionnelle si `CAHIER.md` existe). 5 nouveaux tests dans `tests/standard.test.mjs`. `AGENTS.md` régénéré après chaque modification de skill.

**Tech Stack:** Node.js ESM, `node:test`, Bash (prepend sans lecture complète du fichier).

---

## Structure des fichiers

| Action | Fichier | Rôle |
|---|---|---|
| Créer | `skills/cahier-maitre/SKILL.md` | Définition du skill |
| Modifier | `skills/session-handoff/SKILL.md` | Étape optionnelle CAHIER.md après étape 6 |
| Modifier | `tests/standard.test.mjs` | 5 nouveaux tests |
| Régénérer | `AGENTS.md` | Via `npm run build:agents` (obligatoire après chaque modif skill) |

---

## Task 1 : Tests cahier-maitre (rouge → confirmer le fail)

**Files:**
- Modify: `tests/standard.test.mjs` (ajouter à la fin)

- [ ] **Step 1 : Ajouter les 4 tests suivants à la fin de `tests/standard.test.mjs`**

```javascript
test("cahier-maitre skill existe et a un frontmatter valide", () => {
  const skillPath = join(root, "skills/cahier-maitre/SKILL.md");
  const content = readFileSync(skillPath, "utf8");
  assert.ok(content.startsWith("---"), "SKILL.md doit commencer par frontmatter YAML");
  assert.ok(content.includes("name: cahier-maitre"), "name requis");
  assert.ok(content.includes("description:"), "description requise");
  assert.ok(content.includes("user-invocable: true"), "user-invocable requis");
});

test("cahier-maitre description commence par 'Use when' (CSO)", () => {
  const content = readFileSync(join(root, "skills/cahier-maitre/SKILL.md"), "utf8");
  const frontmatter = content.match(/^---\n([\s\S]+?)\n---/)?.[1] ?? "";
  assert.ok(frontmatter.length > 0, "frontmatter absent");
  assert.ok(frontmatter.includes("Use when"), "description doit commencer par 'Use when' (CSO)");
});

test("cahier-maitre skill cible CAHIER.md avec insertion en haut du fichier", () => {
  const content = readFileSync(join(root, "skills/cahier-maitre/SKILL.md"), "utf8");
  assert.ok(content.includes("CAHIER.md"), "doit cibler CAHIER.md");
  assert.ok(
    content.includes("prepend") || content.includes("haut du fichier"),
    "insertion en tête du fichier requise"
  );
});

test("cahier-maitre skill dérive l'auteur via git config user.name", () => {
  const content = readFileSync(join(root, "skills/cahier-maitre/SKILL.md"), "utf8");
  assert.ok(content.includes("git config user.name"), "auteur via git config requis");
});
```

- [ ] **Step 2 : Confirmer que les 4 tests échouent**

```bash
npm test 2>&1 | grep -E "(cahier-maitre|FAIL|✗|not ok)" | head -20
```

Attendu : 4 lignes d'échec sur les tests `cahier-maitre`.

---

## Task 2 : Créer le skill cahier-maitre + régénérer AGENTS.md (vert)

**Files:**
- Create: `skills/cahier-maitre/SKILL.md`
- Regenerate: `AGENTS.md` (via script)

- [ ] **Step 3 : Créer `skills/cahier-maitre/SKILL.md` avec ce contenu exact**

```markdown
---
name: cahier-maitre
description: Use when the user wants to record a project event, decision, or progress update in the master project log ("note dans le cahier", "mets ça dans le cahier", "ajoute une entrée au cahier", or any request to log recent project events for human tracking).
user-invocable: true
---

# Cahier maître — log séquentiel narratif

Log séquentiel d'avancement de projet, **commité dans le repo**, destiné à l'humain.
Distinct de `session-handoff/HANDOFF.md` (snapshot écrasé à chaque session) et de
`.claude/JOURNAL.md` (journal privé local, non commité, orienté IA).

## Procédure

### 1. Dériver l'auteur

```bash
git config user.name
```

Si la commande échoue ou retourne vide : utiliser `"Auteur inconnu"`.

### 2. Résumer les événements clés

Sans lire `CAHIER.md`, résumer en **2-3 lignes** les événements clés de la session courante :
avancées notables, problèmes rencontrés, décisions prises. Ton narratif court — carnet de
chantier, pas rapport. Pas de liste à puces imposée.

Si l'utilisateur a précisé le contenu à noter, l'utiliser directement.

### 3. Formater l'entrée

```
## YYYY-MM-DD — <auteur>

<résumé 2-3 lignes>

```

Date = date du jour au format ISO (`YYYY-MM-DD`).

### 4. Prepend dans CAHIER.md

Utiliser un prepend Bash pour éviter de lire l'intégralité du fichier :

```bash
# Remplacer DATE, AUTEUR et RESUME par les valeurs réelles avant d'exécuter.

# Si CAHIER.md existe :
{ printf '## DATE — AUTEUR\n\nRESUME\n\n'; cat CAHIER.md; } > /tmp/cahier_tmp \
  && mv /tmp/cahier_tmp CAHIER.md

# Si CAHIER.md n'existe pas :
printf '## DATE — AUTEUR\n\nRESUME\n' > CAHIER.md
```

Adapter le chemin selon la racine du projet courant.

### 5. Confirmer

Une ligne : `Entrée ajoutée dans CAHIER.md.`

Proposer `git add CAHIER.md` + commit si le contexte s'y prête.

## Règles

- **Ne pas lire `CAHIER.md` pour écrire** — le prepend Bash évite ce coût en tokens.
- **Ne jamais réécrire les entrées existantes.**
- **2-3 lignes maximum** par entrée.
- `CAHIER.md` est à la **racine du repo**, commité dans git — le proposer à l'utilisateur si
  non commité.
```

- [ ] **Step 4 : Vérifier que les 4 tests cahier-maitre passent maintenant**

```bash
npm test 2>&1 | grep "cahier-maitre"
```

Attendu : 4 lignes `ok` (pas de `not ok`). Le test de staleness `AGENTS.md` peut échouer à
cette étape — c'est attendu.

- [ ] **Step 5 : Régénérer AGENTS.md**

```bash
npm run build:agents
```

Attendu : pas d'erreur.

- [ ] **Step 6 : Lancer tous les tests et vérifier 46 verts (47 total, 1 rouge toléré)**

```bash
npm test 2>&1 | tail -10
```

Attendu : 46 passing, 1 failing (`planning-with-files non installé`).

- [ ] **Step 7 : Committer**

```bash
git add skills/cahier-maitre/SKILL.md AGENTS.md tests/standard.test.mjs
git commit -m "feat: add cahier-maitre skill — sequential project log committed to repo"
```

---

## Task 3 : Test intégration session-handoff (rouge → confirmer le fail)

**Files:**
- Modify: `tests/standard.test.mjs` (ajouter à la fin)

- [ ] **Step 8 : Ajouter ce test à la fin de `tests/standard.test.mjs`**

```javascript
test("session-handoff mentionne CAHIER.md comme étape optionnelle", () => {
  const content = readFileSync(join(root, "skills/session-handoff/SKILL.md"), "utf8");
  assert.ok(
    content.includes("CAHIER.md"),
    "session-handoff doit mentionner CAHIER.md (intégration optionnelle cahier-maitre)"
  );
});
```

- [ ] **Step 9 : Confirmer que ce test échoue**

```bash
npm test 2>&1 | grep "session-handoff mentionne"
```

Attendu : `not ok` sur ce test.

---

## Task 4 : Intégration session-handoff + régénérer AGENTS.md (vert)

**Files:**
- Modify: `skills/session-handoff/SKILL.md` (ajouter une étape 6bis après l'étape 6)
- Regenerate: `AGENTS.md`

- [ ] **Step 10 : Dans `skills/session-handoff/SKILL.md`, localiser ce bloc (étape 6)**

```
### 6. Ajouter une entrée au journal
Ajoute une entrée au journal (`.claude/JOURNAL.md` selon la pratique du projet) : date, ce qui a
été fait, état, prochaine étape. Le journal est l'**historique** ; `session-handoff/` est
l'**instantané courant**.
```

- [ ] **Step 11 : Insérer le bloc suivant immédiatement après l'étape 6 (avant l'étape 7)**

```markdown
### 6bis. Entrée optionnelle dans CAHIER.md

Si `CAHIER.md` existe à la racine du projet : prepend une ligne de résumé de session avec la
même structure que le skill `hyperpowers:cahier-maitre`. Étape silencieusement sautée si
`CAHIER.md` est absent — `session-handoff` fonctionne sans lui.
```

- [ ] **Step 12 : Régénérer AGENTS.md**

```bash
npm run build:agents
```

- [ ] **Step 13 : Lancer tous les tests et vérifier 47 verts (48 total, 1 rouge toléré)**

```bash
npm test 2>&1 | tail -10
```

Attendu : 47 passing, 1 failing (`planning-with-files non installé`).

- [ ] **Step 14 : Committer**

```bash
git add skills/session-handoff/SKILL.md AGENTS.md tests/standard.test.mjs
git commit -m "feat: session-handoff optionally prepends to CAHIER.md when present"
```

---

## Auto-review (spec coverage)

| Exigence spec | Tâche couverte |
|---|---|
| Skill `cahier-maitre` autonome | Task 2 |
| CAHIER.md à la racine, commité | Task 2 (règles du skill) |
| Prepend (plus récent en haut) | Task 2 (étape 4) |
| Claude rédige automatiquement | Task 2 (étape 2) |
| Auteur via `git config user.name` | Task 2 (étape 1) |
| Pas de lecture de CAHIER.md pour écrire | Task 2 (règles + Bash prepend) |
| Format H2 date + auteur + texte libre | Task 2 (étape 3) |
| Intégration optionnelle session-handoff | Task 4 |
| session-handoff fonctionne sans CAHIER.md | Task 4 (étape silencieusement sautée) |
| Tests validant le skill | Tasks 1 + 3 |
| AGENTS.md à jour | Tasks 2 + 4 (build:agents) |

Aucun placeholder. Aucune exigence manquante.
