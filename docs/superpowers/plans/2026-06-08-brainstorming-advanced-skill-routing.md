# Brainstorming-Advanced Skill Routing — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter une branche conditionnelle dans la section "5. Suite" de `brainstorming-advanced` : si le livrable est un skill ou plugin, invoquer `superpowers:writing-skills` avant `superpowers:writing-plans`.

**Architecture:** Modification chirurgicale d'une seule ligne dans `skills/brainstorming-advanced/SKILL.md` (ligne 183). Un test valide la présence du routage. AGENTS.md régénéré après.

**Tech Stack:** Node.js ESM, `node:test`, Markdown.

---

## Structure des fichiers

| Action | Fichier | Rôle |
|---|---|---|
| Modifier | `skills/brainstorming-advanced/SKILL.md` | Section Suite ligne 183 |
| Modifier | `tests/standard.test.mjs` | 1 nouveau test |
| Régénérer | `AGENTS.md` | Via `npm run build:agents` |

---

## Task 1 : Test rouge

**Files:**
- Modify: `tests/standard.test.mjs` (ajouter à la fin)

- [ ] **Step 1 : Ajouter ce test à la fin de `tests/standard.test.mjs`**

```javascript
test("brainstorming-advanced section Suite route vers writing-skills pour les livrables skill/plugin", () => {
  const content = readFileSync(join(root, "skills/brainstorming-advanced/SKILL.md"), "utf8");
  assert.ok(
    content.includes("superpowers:writing-skills"),
    "section Suite doit mentionner superpowers:writing-skills"
  );
  assert.ok(
    content.includes("skill ou plugin"),
    "section Suite doit nommer le cas livrable skill ou plugin"
  );
});
```

- [ ] **Step 2 : Confirmer que le test échoue**

```bash
npm test 2>&1 | grep "brainstorming-advanced section Suite route"
```

Attendu : `✖ brainstorming-advanced section Suite route vers writing-skills pour les livrables skill/plugin`

---

## Task 2 : Implémenter + AGENTS.md + commit

**Files:**
- Modify: `skills/brainstorming-advanced/SKILL.md:183`
- Regenerate: `AGENTS.md`

- [ ] **Step 3 : Dans `skills/brainstorming-advanced/SKILL.md`, remplacer la ligne 183**

Texte à remplacer (exact) :
```
- [ ] Invoquer `superpowers:writing-plans`
```

Remplacer par :
```
- [ ] Si le livrable est un **skill ou plugin** → invoquer `superpowers:writing-skills` en premier
  (puis `superpowers:writing-plans` si des tests ou scripts sont à implémenter)
- [ ] Sinon → invoquer `superpowers:writing-plans` directement
```

- [ ] **Step 4 : Vérifier que le nouveau test passe**

```bash
npm test 2>&1 | grep "brainstorming-advanced section Suite route"
```

Attendu : `✔ brainstorming-advanced section Suite route vers writing-skills pour les livrables skill/plugin`

- [ ] **Step 5 : Régénérer AGENTS.md**

```bash
npm run build:agents
```

- [ ] **Step 6 : Lancer tous les tests — vérifier 48 passing, 1 failing toléré**

```bash
npm test 2>&1 | tail -5
```

Attendu : 48 passing, 1 failing (planning-with-files).

- [ ] **Step 7 : Committer**

```bash
git add skills/brainstorming-advanced/SKILL.md AGENTS.md tests/standard.test.mjs
git commit -m "$(cat <<'EOF'
feat: brainstorming-advanced routes to writing-skills for skill/plugin outputs

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Auto-review

| Exigence spec | Tâche couverte |
|---|---|
| Section Suite conditionnelle skill/plugin → writing-skills | Task 2, Step 3 |
| writing-skills invoqué avant writing-plans | Task 2, Step 3 (ordre explicite) |
| Cas non-skill → writing-plans inchangé | Task 2, Step 3 (branche sinon) |
| brainstorming (simple) non modifié | (hors périmètre, non touché) |
| Test validant le routage | Task 1 |
| AGENTS.md régénéré | Task 2, Step 5 |

Aucun placeholder. Aucune exigence manquante.
