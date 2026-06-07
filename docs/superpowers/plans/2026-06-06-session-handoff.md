# Skill session-handoff (fini pour aujourd'hui) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter à Hyperpowers un skill `session-handoff` qui, invoqué « avant de s'arrêter », produit un `HANDOFF.md` commité pour une reprise à froid (futur incertain, machine neuve, contexte oublié).

**Architecture:** Premier skill embarqué par le plugin (`skills/session-handoff/SKILL.md`, auto-découvert par Claude Code). La substance est une **procédure en prose** ; un smoke-test **structurel** (pas de tautologie de prose) garde le frontmatter ; la vraie validation est review + essai runtime.

**Tech Stack:** Markdown (SKILL.md) ; Node.js ESM `node:test` zéro-dépendance pour le smoke-test.

**Spec :** `docs/superpowers/specs/2026-06-06-session-handoff-design.md`
**Branche :** `v4-session-handoff` (part de `main`, indépendante de v2/v3).

---

## Task 1 : TDD — créer le skill `session-handoff` + smoke-test structurel

> Le test ne valide QUE la structure chargeable (frontmatter `name`/`description`/`user-invocable`), pas la prose — c'est volontaire (un test « le SKILL.md contient tel mot » ne vérifierait rien). La qualité de la procédure se valide par revue + essai runtime (Task 2).

**Files:**
- Create: `tests/session-handoff.test.mjs`
- Create: `skills/session-handoff/SKILL.md`

- [ ] **Step 1 : Écrire le smoke-test qui échoue**

Créer `tests/session-handoff.test.mjs` avec exactement :

```js
// tests/session-handoff.test.mjs — smoke-test structurel du skill session-handoff.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const skillPath = join(root, "skills/session-handoff/SKILL.md");

test("le skill session-handoff existe", () => {
  assert.ok(existsSync(skillPath), "skills/session-handoff/SKILL.md manquant");
});

test("le SKILL.md a un frontmatter valide (name, description, user-invocable)", () => {
  const c = readFileSync(skillPath, "utf8");
  const m = c.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(m, "frontmatter délimité par --- absent");
  const fm = m[1];
  assert.match(fm, /^name:\s*session-handoff\s*$/m, "name: session-handoff absent");
  assert.match(fm, /^description:\s*\S.+$/m, "description non vide absente");
  assert.match(fm, /^user-invocable:\s*true\s*$/m, "user-invocable: true absent");
});
```

- [ ] **Step 2 : Lancer les tests pour vérifier l'échec**

Run : `npm test`
Expected : ÉCHEC. Les 2 nouveaux tests échouent (`skills/session-handoff/SKILL.md manquant`, puis l'erreur de lecture du fichier inexistant). Les 7 tests de `standard.test.mjs` restent verts.

- [ ] **Step 3 : Créer `skills/session-handoff/SKILL.md`**

Créer le fichier avec exactement ce contenu :

````markdown
---
name: session-handoff
description: Use when the user is wrapping up or stopping work ("fini pour aujourd'hui", "done for today", "on met en pause", "je m'arrête"), especially when the project may be resumed much later, on another machine, or by someone who has forgotten the context. Produces a committed cold-resume HANDOFF.md and points CLAUDE.md and AI memory to it.
user-invocable: true
---

# Session Handoff — « fini pour aujourd'hui »

Prépare la reprise **à froid dans un futur incertain** : peut-être dans des mois, sur une machine
neuve, par un toi qui a oublié le contexte — ou un nouvel utilisateur. Le livrable central est
`HANDOFF.md`, **commité** (seule chose qui voyage au `git clone`).

## Principe

Dérive ce que tu peux, **demande** ce que seul l'utilisateur sait, et **n'invente jamais** le
setup machine-neuve (un nouvel arrivant qui suit des étapes fabriquées = le scénario d'échec).

## Procédure

### 1. Dériver les faits génériques (git uniquement)
Exécute et garde les sorties :
- `git branch --show-current`
- `git log --oneline -8`
- `git status --short`
- `git log --oneline @{u}.. 2>/dev/null` (commits non poussés, si un upstream existe)

Repère les pointeurs présents : `docs/superpowers/specs` et `/plans`, le journal (souvent
`.claude/JOURNAL.md`), et le FinalGoal `.hyperpowers/goal.md`.
**N'essaie pas** de deviner la commande de test/build/lancement — inconnue pour un projet quelconque.

### 2. Poser les questions de trou (une à la fois)
1. **Ce qui était prévu ensuite ?** (l'info la plus précieuse pour un futur-toi.)
2. **Reprendre sur une machine neuve** : comment cloner / installer / lancer / tester *ce* projet ?
   Pré-remplis depuis les indices (`package.json` scripts, `README`) **mais fais confirmer** — ne
   fige rien d'inventé.
3. **Des pièges / gotchas** non-évidents à connaître ?
4. **Décisions clés et pourquoi** (pour qu'un nouvel arrivant ne les re-débatte pas) ?

Si l'utilisateur ne sait pas pour le point 2, écris-le explicitement (« setup non documenté — à
reconstituer ») au lieu d'inventer.

### 3. Écrire `HANDOFF.md` (racine du projet, réécriture complète)
```markdown
# Handoff — <projet>
> Dernière mise à jour : <date>. Lis ce fichier en premier pour reprendre à froid.

## Le but (FinalGoal)
<contenu de .hyperpowers/goal.md si présent ; sinon un résumé demandé>

## Où on en est
- Branche : <…> · Derniers commits : <…>
- Non commité / non poussé : <…>

## Ce qui était prévu ensuite
<réponse 1>

## Reprendre sur une machine neuve
<réponse 2, confirmée — ou « non documenté, à reconstituer »>

## Pièges à connaître
<réponse 3>

## Décisions clés & pourquoi
<réponse 4 + specs pertinentes>

## Où trouver le détail
<pointeurs : specs/plans, journal, etc.>
```

### 4. Réduire le doublon dans `CLAUDE.md`
Si `CLAUDE.md` existe et contient un bloc d'état/reprise, **remplace ce bloc** par un pointeur
court : « Pour reprendre, lis `HANDOFF.md` (source unique de l'état de reprise). » S'il n'y a pas
de `CLAUDE.md`, ne pas en créer un.

### 5. Appondre au journal
Ajoute une entrée au journal (`.claude/JOURNAL.md` selon la pratique du projet) : date, ce qui a
été fait, état, prochaine étape. Le journal est l'**historique** ; `HANDOFF.md` est l'**instantané
courant**.

### 6. Pointeur mémoire IA
Laisse une note mémoire d'**une ligne** : « Projet <nom> : pour reprendre, lis `HANDOFF.md`. » Ne
duplique pas le contenu (la mémoire ne voyage pas vers une autre machine/un autre utilisateur).

### 7. Committer
`git add HANDOFF.md` (+ `CLAUDE.md` s'il a été aminci), puis un commit clair (ex. « Mettre à jour
le handoff de session »). Le journal reste gitignoré/local.

## Cas limites
- **Pas un dépôt git** : saute l'étape 1, appuie-toi sur les questions ; produis quand même `HANDOFF.md`.
- **`HANDOFF.md` déjà présent** : réécris-le (instantané courant) ; l'historique est dans git.
- **Setup inconnu** : marque-le explicitement, n'invente pas.

## Honnêteté
Ce skill aide à reprendre à froid ; il ne garantit pas une reprise sans friction si le setup
n'a pas pu être documenté.
````

- [ ] **Step 4 : Lancer les tests pour vérifier le vert**

Run : `npm test`
Expected : SUCCÈS, **9 tests verts** (`pass 9`, `fail 0`) — 7 de `standard.test.mjs` + 2 nouveaux.

- [ ] **Step 5 : Commit**

```bash
git add skills/session-handoff/SKILL.md tests/session-handoff.test.mjs
git diff --cached --name-only | xargs grep -li "API_KEY\|SECRET\|password\s*=\|apiKey\|Bearer " 2>/dev/null || echo "aucun secret"
git commit -m "Ajouter le skill session-handoff (fini pour aujourd'hui)

Procédure de handoff de fin de session : dérive le git générique, pose les 4 questions
humaines (prévu ensuite, setup machine neuve confirmé, pièges, décisions), écrit un
HANDOFF.md commité (reprise à froid), amincit le bloc reprise de CLAUDE.md en pointeur,
append au journal, pointeur mémoire IA. Smoke-test structurel du frontmatter.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2 : Réinstaller + vérifier la découverte du skill + essai runtime + documenter

> Le plugin est copié dans le cache à l'install ; un nouveau skill n'est découvert qu'après réinstall + redémarrage. Gate humaine (commandes `/plugin` + redémarrage + un essai à blanc que l'exécuteur ne peut pas piloter seul).

**Files:**
- Modify: `CLAUDE.md` (statut → skill session-handoff livré)
- Modify: `.claude/JOURNAL.md` (entrée de session — privé, hors git)

- [ ] **Step 1 : Réinstaller le plugin (humain)**

Dans Claude Code :
```
/plugin marketplace add /home/jonathanp/Documents/Hyperpowers
/plugin install hyperpowers@hyperpowers
```
puis **redémarrer**.
Expected : réinstall sans erreur.

- [ ] **Step 2 : Vérifier la découverte du skill (humain)**

Dans une session fraîche, vérifier que `session-handoff` apparaît dans la liste des skills
disponibles (et qu'il est invocable, p. ex. via la commande `/session-handoff` ou en disant
« fini pour aujourd'hui »).
Expected : le skill est listé et déclenchable. Si absent : le cache n'a pas pris le nouveau
dossier `skills/` → recommencer Step 1, et vérifier que Claude Code découvre bien
`skills/<nom>/SKILL.md` d'un plugin (sinon, déclarer le dossier `skills` dans `plugin.json`).

- [ ] **Step 3 : Essai à blanc (humain + IA)**

Dans un **projet de test jetable** (un petit dépôt git avec un `CLAUDE.md` contenant un faux bloc
« État courant — reprise »), invoquer le skill et répondre aux 4 questions.
Expected :
- un `HANDOFF.md` est créé, couvrant les 7 sections ;
- le bloc reprise du `CLAUDE.md` de test est **remplacé par un pointeur** vers `HANDOFF.md` ;
- le setup machine-neuve reflète **tes réponses** (non inventé) ; si tu réponds « je ne sais pas »,
  la section dit « non documenté — à reconstituer ».
Nettoyer le projet de test ensuite.

- [ ] **Step 4 : Actualiser `CLAUDE.md` + journal, committer la doc**

Mettre à jour le bloc « État courant » de `CLAUDE.md` (le vrai, celui du dépôt Hyperpowers) :
skill `session-handoff` livré sur `v4-session-handoff`, vérifié runtime. Mentionner la spec et ce
plan, et le compte de tests (→ 9 sur cette branche). Ajouter l'entrée de session au journal.
Puis :
```bash
git add CLAUDE.md
git commit -m "Documenter le skill session-handoff livré et vérifié en runtime

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```
Expected : commit créé. (`.claude/JOURNAL.md` gitignoré — non commité, normal.)

- [ ] **Step 5 : Décider de l'intégration**

Via `superpowers:finishing-a-development-branch`, présenter les options. `v4-session-handoff` part
de `main` (indépendante de v2/v3) → peut être mergée seule. Décision humaine, pas de merge sans
feu vert.

---

## Notes de mise en œuvre

- **Honnêteté des tests** : le smoke-test ne vérifie QUE la structure chargeable (frontmatter). La
  procédure se valide par revue + essai runtime (Task 2). Ne pas ajouter de tests-tautologies sur
  la prose.
- **Agnostique au projet** : l'auto-dérivation se limite à des faits git génériques ; la commande
  de test/build/lancement est **demandée**, jamais devinée.
- **Anti-doublon** : `HANDOFF.md` est la source unique de reprise ; `CLAUDE.md` n'en garde qu'un
  pointeur ; le journal reste l'historique ; la mémoire IA n'a qu'un pointeur.
- **Découverte du skill** : si après réinstall le skill n'apparaît pas, c'est le seul point
  technique à creuser (déclaration éventuelle dans `plugin.json`) — capturé en Task 2 Step 2.
