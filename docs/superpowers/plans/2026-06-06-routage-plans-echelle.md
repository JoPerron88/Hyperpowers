# Routage des plans à la bonne échelle — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter un 5ᵉ principe au Standard Hyperpowers qui route le travail vers le bon niveau de planification (petite → TDD direct / moyenne → superpowers / grosse → planning-with-files), pour ne pas sur-planifier.

**Architecture:** Purement additif. On modifie le **contenu** injecté (`standard.md`) et on étend les smoke-tests (`tests/standard.test.mjs`). Le mécanisme d'injection v1 (`hooks/session-start.mjs` → JSON `additionalContext`) est inchangé. Aucun nouveau fichier de mécanisme, aucun fork, aucun nouveau skill/hook.

**Tech Stack:** Node.js ESM, `node:test`, zéro dépendance. Markdown pour `standard.md`.

**Spec :** `docs/superpowers/specs/2026-06-06-routage-plans-echelle-design.md`
**Branche :** `v2-routage-plans` (déjà créée ; la spec y est commitée en `b99f40e`).

---

## Task 0 : Pré-vol — vérifier que planning-with-files est présent et que ses hooks tirent

> Filet de sécurité, **pas** prémisse (le spike avait perdu un tour sur cette ambiguïté). Si les hooks ne tirent pas, le tier « grosse tâche » perd son suivi vivant → bloquant à traiter (réinstaller pwf en plugin) avant de déclarer la v2 livrée. Pas de code ici : c'est une porte de vérification.

**Files:** aucun (vérification).

- [ ] **Step 1 : Confirmer que le skill pwf est installé**

Run :
```bash
ls -l ~/.claude/skills/planning-with-files/SKILL.md
```
Expected : le fichier existe (symlink résolu vers `~/.agents/skills/planning-with-files/SKILL.md`).
Si absent : installer planning-with-files (skill ou plugin) avant de continuer.

- [ ] **Step 2 : Vérifier empiriquement que le hook UserPromptSubmit de pwf tire (gate humaine)**

Ce test exige un **tour utilisateur réel** — l'exécuteur ne peut pas le faire seul. Procédure pour l'humain :
```bash
# Depuis la racine du dépôt, créer un plan factice qui satisfait le gate des hooks pwf
printf '# Task Plan: sonde hooks\n\n## Status\nsonde\n' > /tmp/pwf-probe/task_plan.md 2>/dev/null || { mkdir -p /tmp/pwf-probe && printf '# Task Plan: sonde hooks\n\n## Status\nsonde\n' > /tmp/pwf-probe/task_plan.md; }
```
Puis, dans une session Claude Code ayant `task_plan.md` à la racine du cwd, envoyer un message quelconque et observer si le contexte reçoit `===BEGIN PLAN DATA===`.
Expected : `===BEGIN PLAN DATA===` apparaît → hooks actifs (cohérent avec la preuve antérieure du spike). 
Si rien n'apparaît : noter le bloquant ; le tier « grosse » devra passer par une réinstall plugin de pwf. **Ne pas supprimer** ce constat — le consigner dans le journal.

- [ ] **Step 3 : Nettoyer la sonde**

Run :
```bash
rm -rf /tmp/pwf-probe
```
Expected : pas de sortie.

---

## Task 1 : TDD — ajouter le 5ᵉ principe « Planifier à la bonne échelle »

**Files:**
- Modify: `tests/standard.test.mjs` (ajouter un helper + 3 tests, étendre 1 test existant)
- Modify: `standard.md` (insérer le principe 5 entre le principe 4 et la section `## Priorité`)

- [ ] **Step 1 : Écrire les tests qui échouent**

Dans `tests/standard.test.mjs`, ajouter le helper suivant **après** la fonction `installedSuperpowersSkills` (vers la ligne 46) :

```js
function planningWithFilesInstalled() {
  // pwf peut être installé en skill (~/.claude/skills) ou en plugin (cache marketplace).
  if (existsSync(join(homedir(), ".claude/skills/planning-with-files/SKILL.md"))) {
    return true;
  }
  const cache = join(homedir(), ".claude/plugins/cache");
  if (!existsSync(cache)) return false;
  for (const mk of readdirSync(cache)) {
    for (const pl of safeReaddir(join(cache, mk))) {
      for (const ver of safeReaddir(join(cache, mk, pl))) {
        if (
          existsSync(
            join(cache, mk, pl, ver, "skills", "planning-with-files", "SKILL.md"),
          )
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

function safeReaddir(dir) {
  try {
    return readdirSync(dir);
  } catch {
    return [];
  }
}
```

Puis ajouter ces **trois nouveaux tests** à la fin du fichier (après le test `marketplace.json` de la ligne 102) :

```js
test("standard.md contient le 5ᵉ principe et ses 3 tiers", () => {
  const c = readFileSync(join(root, "standard.md"), "utf8");
  assert.ok(c.includes("Planifier à la bonne échelle"), "titre du 5ᵉ principe absent");
  for (const tier of ["Petite", "Moyenne", "Grosse"]) {
    assert.ok(c.includes(tier), `tier manquant : ${tier}`);
  }
  assert.ok(c.includes("Récite"), "idée de récitation (empruntée à pwf) absente");
});

test("standard.md explicite l'arbitrage des déclencheurs (pas seulement 5+ tool calls)", () => {
  const c = readFileSync(join(root, "standard.md"), "utf8");
  assert.ok(c.includes("5+ tool calls"), "le seuil pwf à arbitrer n'est pas nommé");
  assert.ok(
    c.includes("rester au tier inférieur"),
    "la règle anti sur-planification (doute → tier inférieur) est absente",
  );
});

test("standard.md cite planning-with-files et la skill existe (référence vivante)", () => {
  const c = readFileSync(join(root, "standard.md"), "utf8");
  assert.ok(c.includes("planning-with-files"), "référence à planning-with-files absente");
  assert.ok(
    planningWithFilesInstalled(),
    "planning-with-files non installé — référence morte (installer la skill/plugin pwf)",
  );
});
```

Enfin, **étendre le test existant du hook** (lignes 84-90, le tableau de titres dans le test « la commande du hook SessionStart émet le contrat additionalContext ») pour y ajouter le 5ᵉ titre. Remplacer le tableau :

```js
  for (const titre of [
    "Réfléchir avant de coder",
    "Simplicité d'abord",
    "Changements chirurgicaux",
    "Piloté par objectif",
  ]) {
```
par :
```js
  for (const titre of [
    "Réfléchir avant de coder",
    "Simplicité d'abord",
    "Changements chirurgicaux",
    "Piloté par objectif",
    "Planifier à la bonne échelle",
  ]) {
```

- [ ] **Step 2 : Lancer les tests pour vérifier qu'ils échouent**

Run : `npm test`
Expected : ÉCHEC. Les 3 nouveaux tests échouent (« titre du 5ᵉ principe absent », « le seuil pwf à arbitrer n'est pas nommé », « référence à planning-with-files absente ») et le test du hook échoue (« principe absent du contexte injecté : Planifier à la bonne échelle »). Le test `planningWithFilesInstalled()` lui-même doit passer sur sa clause d'install (échec uniquement sur la clause « cite »).

- [ ] **Step 3 : Ajouter le 5ᵉ principe à `standard.md`**

Dans `standard.md`, insérer ce bloc **entre** le principe 4 (qui se termine ligne 31) et la section `## Priorité` (ligne 33) :

```markdown

## 5. Planifier à la bonne échelle
Router le travail selon la taille de la tâche, pour ne pas sur-planifier. Trois niveaux, chacun
pointe vers la voix de management qui le réalise :

- **Petite** — changement unique et bien défini, une approche évidente, peu d'outils :
  **pas de plan**. → `superpowers:test-driven-development` directement.
- **Moyenne** — multi-étapes, demande conception/découpage, mais bornée et mono-session :
  → `superpowers:brainstorming` (si créatif), puis `superpowers:writing-plans`, puis
  `superpowers:executing-plans` / `superpowers:subagent-driven-development`.
  **Récite** : relis le plan avant chaque décision clé (contre le « lost in the middle »).
- **Grosse / longue** — nombreuses phases, franchit plusieurs sessions, va probablement croiser
  un `/clear` ou une compaction, découvertes qui s'accumulent :
  → `planning-with-files` (plan vivant `task_plan.md`/`findings.md`/`progress.md` + reprise).

Arbitrage moyen ↔ grosse : le discriminant n'est PAS le « 5+ tool calls » qu'annonce
planning-with-files (seuil trop bas — il pousserait tout vers pwf et sur-planifierait), mais :
« la tâche franchit-elle des sessions / une compaction, et des découvertes vont-elles s'accumuler
que je devrai me rappeler plus tard ? » Oui → pwf ; non → superpowers. En cas de doute,
**rester au tier inférieur**.
```

- [ ] **Step 4 : Lancer les tests pour vérifier qu'ils passent**

Run : `npm test`
Expected : SUCCÈS, **10 tests verts** (7 existants + 3 nouveaux ; le test du hook est *modifié*, pas ajouté). Vérifier `pass 10`, `fail 0`.

- [ ] **Step 5 : Commit**

Vérifier d'abord l'absence de secrets dans les fichiers stagés :
```bash
git add standard.md tests/standard.test.mjs
git diff --cached --name-only | xargs grep -li "API_KEY\|SECRET\|password\s*=\|apiKey\|Bearer " 2>/dev/null || echo "aucun secret"
```
Expected : « aucun secret ».

Puis :
```bash
git commit -m "Ajouter le 5e principe du Standard : planifier à la bonne échelle

Route le travail : petite=TDD direct, moyenne=superpowers, grosse=planning-with-files.
Arbitrage explicite du chevauchement de déclencheurs (le « 5+ tool calls » de pwf cède
au discriminant sessions/compaction/découvertes). Récitation empruntée à pwf pour le
tier moyen. Tests étendus (présence, arbitrage, référence vivante pwf, injection hook).

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```
Expected : commit créé.

---

## Task 2 : Réinstaller le plugin + vérifier en runtime + documenter

> Le plugin est **copié dans le cache à l'install** : éditer `standard.md` n'a aucun effet runtime tant que le plugin n'est pas réinstallé (leçon v1). Étapes de réinstall + vérif = **gate humaine** (nécessite les commandes `/plugin` et un redémarrage que l'exécuteur ne peut pas faire). Documenter précisément.

**Files:**
- Modify: `CLAUDE.md` (statut → v2 livrée)
- Modify: `.claude/JOURNAL.md` (entrée de session — privé, hors git)

- [ ] **Step 1 : Réinstaller le plugin hyperpowers (humain)**

Dans Claude Code :
```
/plugin marketplace add /home/jonathanp/Documents/Hyperpowers
/plugin install hyperpowers@hyperpowers
```
(Ou réinstaller s'il est déjà présent, pour forcer la recopie du `standard.md` à jour dans le cache.)
Puis **redémarrer** Claude Code.
Expected : réinstall sans erreur.

- [ ] **Step 2 : Vérifier en runtime que le 5ᵉ principe est injecté (humain)**

Dans une **session fraîche**, vérifier que le contexte SessionStart contient le bloc
« ## 5. Planifier à la bonne échelle » (les 3 tiers + l'arbitrage), à côté des 4 principes v1.
Expected : le 5ᵉ principe est cité mot pour mot dans le contexte injecté.
Si absent : le cache n'a pas été rafraîchi → recommencer Step 1.

- [ ] **Step 3 : Actualiser `CLAUDE.md`**

Mettre à jour le bloc « État courant » : v2 = 5ᵉ principe (routage des plans) livré sur la branche
`v2-routage-plans`, vérifié runtime. Mentionner la spec et ce plan. Mettre à jour le compte de
tests (passe de 7 à ~10). Une à deux phrases, dans le style existant.

- [ ] **Step 4 : Mettre à jour le journal et committer la doc**

Ajouter l'entrée de session à `.claude/JOURNAL.md` (travail effectué, fichiers, résultat runtime).
Puis :
```bash
git add CLAUDE.md
git commit -m "Documenter la v2 (routage des plans) livrée et vérifiée en runtime

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```
Expected : commit créé. (`.claude/JOURNAL.md` est gitignoré — non commité, normal.)

- [ ] **Step 5 : Décider de l'intégration de la branche**

Présenter via `superpowers:finishing-a-development-branch` les options (merge `--no-ff` vers `main`,
PR, ou rester sur la branche). Décision humaine — ne pas merger sans feu vert.

---

## Notes de mise en œuvre

- **DRY/YAGNI/chirurgical** : ne toucher QUE `standard.md` (insertion) et `tests/standard.test.mjs`
  (helper + 3 tests + 1 tableau étendu). Ne pas refactorer les tests existants, ne pas renommer le
  test « 4 principes » (les 4 restent présents — il demeure valide).
- **Pas de 3ᵉ système** : le tier moyen ne crée aucun `findings.md`/`progress.md` fait main. La seule
  idée empruntée à pwf est la **récitation** (une phrase de comportement).
- **Référence vivante** : le test `planningWithFilesInstalled()` échoue franchement si pwf disparaît —
  même contrat que les références superpowers vivantes de la v1.
