# Noyau comportemental fusionné (Hyperpowers v1) — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Faire du dépôt `Hyperpowers` un plugin Claude Code qui injecte au SessionStart un
**standard de qualité** (les 4 garde-fous karpathy recadrés) pointant vers les skills superpowers
— une seule voix au lieu du doublon karpathy↔superpowers.

**Architecture:** Le dépôt EST le plugin. Un hook `SessionStart` fait `cat standard.md`.
`standard.md` est la source unique du standard et nomme les skills superpowers qui réalisent
chaque principe. superpowers reste non-forké ; le plugin karpathy autonome est désinstallé
(étape manuelle documentée). Validé par des smoke-tests Node (zéro-dép) sur la surface de contrat.

**Tech Stack:** Node.js (`node:test`, ESM `.mjs`), JSON (manifeste plugin + hooks), shell (`cat`).

**Spec:** `docs/superpowers/specs/2026-06-05-noyau-comportemental-design.md`

---

## Structure de fichiers

- `package.json` — `type: module`, script `test` = `node --test`. Métadonnées projet.
- `standard.md` — le contenu injecté (4 principes + pointeurs superpowers). Source unique.
- `.claude-plugin/plugin.json` — manifeste du plugin (name/description/version/author).
- `hooks/hooks.json` — un hook `SessionStart` qui `cat` le standard.
- `tests/standard.test.mjs` — smoke-tests : standard présent/complet, références vivantes,
  manifeste valide, hook émet le standard.
- `README.md` — quoi/pourquoi, installation d'Hyperpowers, **désinstallation de karpathy**.
- `CLAUDE.md` — figer « livrable = plugin », « langage = Node », ajouter section « Commandes ».

---

## Task 1 : squelette du projet (package.json)

**Files:**
- Create: `package.json`

- [ ] **Step 1 : créer `package.json`**

```json
{
  "name": "hyperpowers",
  "version": "0.1.0",
  "description": "Standard de qualité de code injecté au SessionStart, déléguant le process aux skills superpowers.",
  "type": "module",
  "scripts": {
    "test": "node --test"
  }
}
```

- [ ] **Step 2 : vérifier que la suite tourne (vide pour l'instant)**

Run: `npm test`
Expected: sortie `node --test` ; `tests 0`, exit 0 (aucun test encore).

- [ ] **Step 3 : committer**

```bash
git add package.json
git commit -m "Ajouter le squelette npm du plugin Hyperpowers"
```

---

## Task 2 : `standard.md` (TDD — présent, complet, références vivantes)

**Files:**
- Create: `tests/standard.test.mjs`
- Create: `standard.md`

- [ ] **Step 1 : écrire les tests qui échouent**

```js
// tests/standard.test.mjs — smoke-tests du noyau comportemental Hyperpowers.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

test("standard.md existe et n'est pas vide", () => {
  const p = join(root, "standard.md");
  assert.ok(existsSync(p), "standard.md manquant");
  assert.ok(readFileSync(p, "utf8").trim().length > 0);
});

test("standard.md contient les 4 principes", () => {
  const c = readFileSync(join(root, "standard.md"), "utf8");
  for (const titre of [
    "Réfléchir avant de coder",
    "Simplicité d'abord",
    "Changements chirurgicaux",
    "Piloté par objectif",
  ]) {
    assert.ok(c.includes(titre), `principe manquant : ${titre}`);
  }
});

function installedSuperpowersSkills() {
  const base = join(
    homedir(),
    ".claude/plugins/cache/claude-plugins-official/superpowers",
  );
  assert.ok(
    existsSync(base),
    "superpowers non installé — impossible de valider les références",
  );
  const names = new Set();
  for (const v of readdirSync(base)) {
    const skillsDir = join(base, v, "skills");
    if (!existsSync(skillsDir)) continue;
    for (const s of readdirSync(skillsDir)) names.add(s);
  }
  return names;
}

test("toutes les skills superpowers citées dans standard.md existent", () => {
  const c = readFileSync(join(root, "standard.md"), "utf8");
  const refs = [...c.matchAll(/superpowers:([a-z-]+)/g)].map((m) => m[1]);
  assert.ok(refs.length >= 4, "trop peu de références superpowers");
  const installed = installedSuperpowersSkills();
  for (const r of refs) {
    assert.ok(installed.has(r), `référence morte : superpowers:${r}`);
  }
});
```

- [ ] **Step 2 : lancer les tests pour les voir échouer**

Run: `npm test`
Expected: FAIL — `standard.md manquant`.

- [ ] **Step 3 : créer `standard.md`**

```markdown
# Hyperpowers — Le Standard de qualité (injecté au SessionStart)

> Ceci est LE STANDARD : à quoi ressemble du bon code. superpowers fournit LE PROCESSUS qui
> l'atteint. Une seule voix : quand un principe ci-dessous nomme une skill superpowers, cette
> skill est le COMMENT — invoque-la, ne ré-improvise pas le principe. Les instructions de
> l'utilisateur priment toujours sur ce standard.

## 1. Réfléchir avant de coder
Expliciter les hypothèses ; si plusieurs interprétations existent, les présenter au lieu d'en
choisir une en silence ; si une approche plus simple existe, le dire. Si quelque chose est
flou : s'arrêter, nommer le flou, demander.
→ Process : `superpowers:brainstorming` avant tout travail créatif.

## 2. Simplicité d'abord (YAGNI)
Le minimum qui résout le problème, rien de spéculatif : pas d'options/config/abstraction non
demandées, pas de gestion d'erreur pour des cas impossibles.
→ Déjà imposé par `superpowers:test-driven-development` (code minimal pour passer le test).
  N'énonce pas la règle deux fois — applique TDD.

## 3. Changements chirurgicaux
Ne toucher que ce qui trace directement à la demande. Pas de refactor adjacent, pas de
nettoyage de code non demandé, adopter le style existant. Ne retirer que les orphelins que TES
changements créent.
→ Tenu pendant l'exécution : `superpowers:subagent-driven-development` ou
  `superpowers:executing-plans`.

## 4. Piloté par objectif
Transformer la tâche en critères vérifiables et boucler jusqu'au vert (« corrige le bug » →
« écris un test qui le reproduit, puis fais-le passer »).
→ `superpowers:test-driven-development` (rouge→vert) puis
  `superpowers:verification-before-completion` (preuve avant de déclarer terminé).

## Priorité
Process d'abord (brainstorming/debugging décident l'approche), implémentation ensuite.
```

- [ ] **Step 4 : lancer les tests pour les voir passer**

Run: `npm test`
Expected: PASS (3 tests). Si « référence morte » : corriger le nom de skill dans `standard.md`
(noms valides installés : `brainstorming`, `test-driven-development`,
`subagent-driven-development`, `executing-plans`, `verification-before-completion`).

- [ ] **Step 5 : committer**

```bash
git add tests/standard.test.mjs standard.md
git commit -m "Ajouter standard.md (4 principes + pointeurs superpowers) et ses tests"
```

---

## Task 3 : manifeste du plugin + hook SessionStart (TDD)

**Files:**
- Modify: `tests/standard.test.mjs`
- Create: `.claude-plugin/plugin.json`
- Create: `hooks/hooks.json`

- [ ] **Step 1 : ajouter les tests qui échouent** (à la fin de `tests/standard.test.mjs`)

```js
import { execFileSync } from "node:child_process";

test("plugin.json est un JSON valide avec name=hyperpowers", () => {
  const m = JSON.parse(
    readFileSync(join(root, ".claude-plugin/plugin.json"), "utf8"),
  );
  assert.equal(m.name, "hyperpowers");
  assert.ok(m.description && m.description.length > 0);
});

test("hooks.json déclare un SessionStart non vide", () => {
  const h = JSON.parse(readFileSync(join(root, "hooks/hooks.json"), "utf8"));
  assert.ok(Array.isArray(h.hooks.SessionStart), "SessionStart manquant");
  assert.ok(h.hooks.SessionStart.length > 0);
});

test("la commande du hook SessionStart émet les 4 principes", () => {
  const h = JSON.parse(readFileSync(join(root, "hooks/hooks.json"), "utf8"));
  const cmd = h.hooks.SessionStart[0].hooks[0].command;
  const resolved = cmd.replaceAll("${CLAUDE_PLUGIN_ROOT}", root);
  const out = execFileSync("sh", ["-c", resolved], { encoding: "utf8" });
  assert.ok(out.includes("Réfléchir avant de coder"));
  assert.ok(out.includes("Piloté par objectif"));
});
```

- [ ] **Step 2 : lancer les tests pour les voir échouer**

Run: `npm test`
Expected: FAIL — `.claude-plugin/plugin.json` introuvable (ENOENT).

- [ ] **Step 3 : créer `.claude-plugin/plugin.json`**

```json
{
  "name": "hyperpowers",
  "description": "Le standard de qualité de code (penser avant, simplicité, chirurgical, piloté par objectif) injecté au SessionStart, qui délègue le process aux skills superpowers. Fusionne karpathy dans une seule voix.",
  "version": "0.1.0",
  "author": "Jonathan Perron"
}
```

- [ ] **Step 4 : créer `hooks/hooks.json`**

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          { "type": "command", "command": "cat \"${CLAUDE_PLUGIN_ROOT}/standard.md\"" }
        ]
      }
    ]
  }
}
```

- [ ] **Step 5 : lancer les tests pour les voir passer**

Run: `npm test`
Expected: PASS (6 tests).

- [ ] **Step 6 : committer**

```bash
git add .claude-plugin/plugin.json hooks/hooks.json tests/standard.test.mjs
git commit -m "Ajouter le manifeste du plugin et le hook SessionStart"
```

---

## Task 4 : README + figer le CLAUDE.md + suite verte

**Files:**
- Create: `README.md` (ou écraser le README de démarrage s'il existe)
- Modify: `CLAUDE.md`

- [ ] **Step 1 : écrire `README.md`**

```markdown
# Hyperpowers

Plugin Claude Code qui fusionne le **standard de qualité** d'Andrej Karpathy avec le **process**
de superpowers, en une seule voix. Au SessionStart, il injecte `standard.md` : les 4 garde-fous
(penser avant · simplicité · chirurgical · piloté par objectif) recadrés pour **pointer vers**
les skills superpowers qui les réalisent — au lieu de doublonner leur philosophie.

## Installation

1. Installer ce dépôt comme plugin via `/plugin` (marketplace local ou chemin du dépôt).
2. **Désinstaller le plugin karpathy autonome** (`andrej-karpathy-skills`) via `/plugin` :
   son contenu vit désormais dans `standard.md` (source unique). Sans ça, doublon temporaire.
3. Garder **superpowers** installé tel quel (non modifié).
4. Redémarrer Claude Code, puis vérifier que le standard apparaît dans le bloc de contexte
   SessionStart.

## Tester

```bash
npm test
```

Valide : `standard.md` présent et complet, références superpowers vivantes, manifeste JSON
valide, et que le hook émet bien le standard.

## Portée

v1 = noyau comportemental seulement. La couche mémoire (mempalace) est écartée (voir le spike
`spike/RESULTS.md`, verdict rouge) ; planning-with-files est différé (voir
`spike/roles-scorecard.md`).
```

- [ ] **Step 2 : figer les décisions dans `CLAUDE.md`** — remplacer les lignes « non décidé »
  de la section « À définir » par :

```markdown
- **Langage** : Node.js (ESM, `node:test`, zéro-dépendance).
- **Type de livrable** : plugin Claude Code (le dépôt EST le plugin).
- **Outillage** : npm pour les scripts ; pas de linter/build pour l'instant.

## Commandes

- Tests : `npm test` (= `node --test`).
- Un seul fichier de test : `node --test tests/standard.test.mjs`.
```

- [ ] **Step 3 : lancer toute la suite**

Run: `npm test`
Expected: PASS (6 tests), sortie propre.

- [ ] **Step 4 : committer**

```bash
git add README.md CLAUDE.md
git commit -m "Documenter Hyperpowers (README) et figer langage/livrable dans CLAUDE.md"
```

---

## Task 5 : vérification empirique post-install (manuelle — leçon du spike)

**Files:** (aucun — vérification runtime)

- [ ] **Step 1 :** l'utilisateur installe Hyperpowers et désinstalle karpathy via `/plugin`,
  puis **redémarre** Claude Code.
- [ ] **Step 2 :** au démarrage, confirmer que le bloc de contexte SessionStart contient le
  standard Hyperpowers (les 4 principes). Si absent : vérifier le nom de la variable
  `${CLAUDE_PLUGIN_ROOT}` (cf. risque de la spec) et que le plugin est bien activé.
- [ ] **Step 3 :** confirmer que le standard karpathy autonome **n'apparaît plus** en double.

> Cette task ne peut pas être automatisée par l'agent (install/redémarrage = action humaine,
> comme on l'a constaté pour pwf). Elle clôt la boucle « vérifier que le hook tire vraiment ».

---

## Auto-revue (faite)

- **Couverture spec** : forme du livrable (Tasks 1,3) ; mécanisme une-voix = hook SessionStart
  (Task 3) ; contenu `standard.md` adapté (Task 2) ; dé-duplication karpathy (README Task 4 +
  Task 5) ; tests de la surface de contrat (Tasks 2,3) ; vérif empirique (Task 5) ; figer
  langage/livrable (Task 4). ✓
- **Pas de placeholder** : tout le contenu de `standard.md`, `plugin.json`, `hooks.json`,
  `README.md`, et le code de test est complet et inline. ✓
- **Cohérence des noms** : `hyperpowers`, `standard.md`, `${CLAUDE_PLUGIN_ROOT}`, les 5 noms de
  skills superpowers, et les 4 titres de principes sont identiques entre `standard.md`, les
  tests et le manifeste. ✓
- **Proportionnalité** : aucune mémoire, aucun pwf, aucun orchestrateur — strictement le noyau
  v1. ✓
