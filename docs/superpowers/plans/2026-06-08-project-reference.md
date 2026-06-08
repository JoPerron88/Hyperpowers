# Project Reference Skill — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Créer le skill `project-reference` — génère `docs/project-reference.md`, document de référence exhaustif du projet en 6 sections, invocable à la demande.

**Architecture:** Nouveau skill `skills/project-reference/SKILL.md` suivant le même pattern que `cahier-maitre`. 5 tests dans `tests/standard.test.mjs`. AGENTS.md régénéré après.

**Tech Stack:** Node.js ESM, `node:test`, Markdown.

---

## Structure des fichiers

| Action | Fichier | Rôle |
|---|---|---|
| Créer | `skills/project-reference/SKILL.md` | Définition du skill |
| Modifier | `tests/standard.test.mjs` | 5 nouveaux tests |
| Régénérer | `AGENTS.md` | Via `npm run build:agents` |

---

## Task 1 : Tests rouge (5 tests)

**Files:**
- Modify: `tests/standard.test.mjs` (ajouter à la fin — actuellement 474 lignes)

- [ ] **Step 1 : Ajouter les 5 tests suivants à la fin de `tests/standard.test.mjs`**

```javascript
test("project-reference skill existe et a un frontmatter valide", () => {
  const skillPath = join(root, "skills/project-reference/SKILL.md");
  const content = readFileSync(skillPath, "utf8");
  assert.ok(content.startsWith("---"), "SKILL.md doit commencer par frontmatter YAML");
  assert.ok(content.includes("name: project-reference"), "name requis");
  assert.ok(content.includes("description:"), "description requise");
  assert.ok(content.includes("user-invocable: true"), "user-invocable requis");
});

test("project-reference description commence par 'Use when' (CSO)", () => {
  const content = readFileSync(join(root, "skills/project-reference/SKILL.md"), "utf8");
  const frontmatter = content.match(/^---\n([\s\S]+?)\n---/)?.[1] ?? "";
  assert.ok(frontmatter.length > 0, "frontmatter absent");
  assert.ok(frontmatter.includes("Use when"), "description doit commencer par 'Use when' (CSO)");
});

test("project-reference skill cible docs/project-reference.md", () => {
  const content = readFileSync(join(root, "skills/project-reference/SKILL.md"), "utf8");
  assert.ok(content.includes("docs/project-reference.md"), "doit cibler docs/project-reference.md");
});

test("project-reference skill décrit les 6 sections du document", () => {
  const content = readFileSync(join(root, "skills/project-reference/SKILL.md"), "utf8");
  assert.ok(content.includes("Pourquoi"), "section 1 requise : pourquoi/problème");
  assert.ok(content.includes("Décisions"), "section 2 requise : décisions non-évidentes");
  assert.ok(content.includes("Structure"), "section 3 requise : structure du projet");
  assert.ok(content.includes("Contraintes"), "section 4 requise : contraintes et invariants");
  assert.ok(content.includes("Flux"), "section 5 requise : flux de travail");
  assert.ok(
    content.includes("actives") || content.includes("fragiles"),
    "section 6 requise : zones actives/fragiles"
  );
});

test("project-reference skill pose une question unique à l'utilisateur avant de rédiger", () => {
  const content = readFileSync(join(root, "skills/project-reference/SKILL.md"), "utf8");
  assert.ok(
    content.includes("non documentées") || content.includes("non-documentées"),
    "question unique sur les décisions non documentées requise"
  );
});
```

- [ ] **Step 2 : Confirmer que les 5 tests échouent**

```bash
npm test 2>&1 | grep "project-reference"
```

Attendu : 5 lignes `✖ project-reference`.

---

## Task 2 : Créer le skill + AGENTS.md + commit

**Files:**
- Create: `skills/project-reference/SKILL.md`
- Regenerate: `AGENTS.md`

- [ ] **Step 3 : Créer `skills/project-reference/SKILL.md` avec ce contenu exact**

```markdown
---
name: project-reference
description: Use when the user wants to generate or refresh a comprehensive project reference document covering structure, code, technologies, and key decisions — so any reader can understand the project in depth ("génère la référence projet", "documente le projet", "crée project-reference", or any request for exhaustive project documentation).
user-invocable: true
---

# Project Reference — document de référence exhaustif

## Overview

Génère `docs/project-reference.md` : document de référence exhaustif du projet courant,
destiné à tout lecteur qui veut comprendre le projet en profondeur sans explorer le code.
Invocable à la demande — pas automatique. Refresh = réécriture complète.

## Procédure

### 1. Lire les sources (dans l'ordre)

1. `CLAUDE.md` — décisions stables, conventions
2. `README.md` — présentation externe
3. `session-handoff/HANDOFF.md` — état courant (si présent)
4. Structure des dossiers :

       find . -not -path '*/\.*' -not -path '*/node_modules/*' | head -80

5. 3-5 fichiers les plus significatifs : point d'entrée, fichier principal, config clé

### 2. Poser une question unique à l'utilisateur

> "Y a-t-il des décisions importantes non documentées que tu veux capturer ?"

Attendre la réponse, l'intégrer au document.

### 3. Rédiger `docs/project-reference.md` en une passe

    # Référence projet — <nom>
    > Généré le YYYY-MM-DD.

    ## Table des matières
    ...

    ## 1. Pourquoi ce projet
    [Problème résolu, contexte, objectif — 1-3 paragraphes]

    ## 2. Décisions non-évidentes
    [Choix technologiques/architecturaux avec le pourquoi.]

    ## 3. Structure du projet
    [Arborescence commentée — rôle de chaque dossier/fichier clé en 1 ligne.]

    ## 4. Contraintes et invariants du code
    [Règles non-évidentes : ordre d'init, modules qui ne se connaissent pas,
    invariants critiques. Chemins + 1 ligne d'intention — pas de snippets.]

    ## 5. Flux de travail
    [Voir `CLAUDE.md` pour les commandes. Cycle : lancer, tester, contribuer.]

    ## 6. Zones actives et fragiles
    [Ce qui est en chantier, ce qui est fragile, points d'attention.]

## Règles

- **Liens, pas duplication** — si l'info est dans `CLAUDE.md` ou `README.md`, lien.
- **Pas de snippets de code** — chemins + 1 ligne d'intention suffisent.
- **Refresh = réécriture complète** — pas de patch incrémental.
- **Invocation manuelle uniquement** — jamais automatique.
- **Ne pas dériver vers CLAUDE.md** — pas d'instructions comportementales dans ce document.

## Erreurs courantes

| Erreur | Correction |
|---|---|
| Dupliquer le contenu de CLAUDE.md | Lien vers CLAUDE.md, pas résumé |
| Insérer des snippets de code | Chemin du fichier + 1 ligne d'intention max |
| Patch incrémental sur refresh | Réécrire entièrement — cohérence interne garantie |
| Générer sans poser la question | Toujours poser la question unique avant de rédiger |
| Dériver vers des instructions pour agents | Ce document est pour humains — prescriptif appartient à CLAUDE.md |
```

- [ ] **Step 4 : Vérifier que les 5 tests project-reference passent**

```bash
npm test 2>&1 | grep "project-reference"
```

Attendu : 5 lignes `✔`. Le test staleness AGENTS.md peut échouer à ce stade — normal.

- [ ] **Step 5 : Régénérer AGENTS.md**

```bash
npm run build:agents
```

- [ ] **Step 6 : Lancer tous les tests — vérifier 53 passing, 1 failing toléré**

```bash
npm test 2>&1 | tail -5
```

Attendu : 53 passing, 1 failing (planning-with-files).

- [ ] **Step 7 : Committer**

```bash
git add skills/project-reference/SKILL.md AGENTS.md tests/standard.test.mjs
git commit -m "$(cat <<'EOF'
feat: add project-reference skill — on-demand exhaustive project documentation

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Auto-review

| Exigence spec | Tâche couverte |
|---|---|
| Skill `project-reference` autonome, user-invocable | Task 2, Step 3 (frontmatter) |
| Produit `docs/project-reference.md` | Task 2, Step 3 (procédure étape 3) |
| Lit CLAUDE.md + README + HANDOFF + structure + fichiers clés | Task 2, Step 3 (procédure étape 1) |
| Question unique avant de rédiger | Task 2, Step 3 (procédure étape 2) |
| 6 sections (Pourquoi, Décisions, Structure, Contraintes, Flux, Zones) | Task 2, Step 3 (template) |
| Liens pas duplication | Task 2, Step 3 (règles) |
| Pas de snippets | Task 2, Step 3 (règles) |
| Refresh = réécriture complète | Task 2, Step 3 (règles) |
| Invocation manuelle uniquement | Task 2, Step 3 (règles) |
| Erreurs courantes | Task 2, Step 3 (section Erreurs courantes) |
| 5 tests validant le skill | Task 1 |
| AGENTS.md à jour | Task 2, Step 5 |

Aucun placeholder. Aucune exigence manquante.
