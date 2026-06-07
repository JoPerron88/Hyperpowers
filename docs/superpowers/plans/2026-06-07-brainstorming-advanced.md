# brainstorming-advanced Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Créer le skill `hyperpowers:brainstorming-advanced` — débat multi-agents (3 vrais sous-agents) pour les décisions architecturales complexes, avec sortie compatible `superpowers:writing-plans`.

**Architecture:** Un seul fichier `SKILL.md` (approche A) décrit les 3 personas, la mécanique de débat multi-tours, les deux modes d'invocation d'experts, et la sortie vers `writing-plans`. Une ligne est ajoutée à `standard.md` pour documenter la suggestion opt-in.

**Tech Stack:** Markdown / YAML frontmatter, outil `Agent` de Claude Code pour les sous-agents.

**Spec de référence :** `docs/superpowers/specs/2026-06-07-brainstorming-advanced-design.md`

---

### Task 1 : Baseline RED — établir le comportement sans le skill

**Fichiers :**
- Aucun fichier modifié (test d'observation)

- [ ] **Step 1 : Lancer un sous-agent sans le skill et noter le comportement**

Dispatche un sous-agent avec ce prompt exact :

```
Tu dois faire un brainstorming avancé sur ce sujet : "Faut-il ajouter une base de données
PostgreSQL à notre projet Node.js actuel qui utilise des fichiers JSON ?"

Pour ce brainstorming avancé, utilise 3 entités indépendantes qui débattent :
- Un enthousiaste qui développe l'idée
- Un sceptique KISS qui challenge la complexité
- Un modérateur neutre qui tranche

Lance un vrai débat multi-tours. Tu peux invoquer des experts si nécessaire.
```

- [ ] **Step 2 : Documenter le comportement observé**

Note précisément :
- A-t-il utilisé l'outil `Agent` pour des vrais sous-agents, ou simulé les personas en texte ?
- A-t-il suivi un débat structuré multi-tours, ou produit une réponse unique ?
- A-t-il invoqué des experts réels, ou simulé leurs voix ?
- A-t-il terminé par une spec + transition vers `writing-plans` ?

Ce comportement est le baseline — le skill doit produire quelque chose de fondamentalement différent.

---

### Task 2 : Tests unitaires RED — écrire les tests avant le skill

**Fichiers :**
- Modifier : `tests/standard.test.mjs`

- [ ] **Step 1 : Lire les tests existants pour comprendre le pattern**

```bash
cat tests/standard.test.mjs
```

Repérer les imports (`readFileSync`, `join`, `assert`, `test`) et la variable `pluginRoot` pour adapter le code ci-dessous.

- [ ] **Step 2 : Ajouter un test vérifiant que brainstorming-advanced existe avec frontmatter valide**

```javascript
test('brainstorming-advanced skill existe et a un frontmatter valide', () => {
  const skillPath = join(pluginRoot, 'skills/brainstorming-advanced/SKILL.md');
  const content = readFileSync(skillPath, 'utf8');
  assert.ok(content.startsWith('---'), 'SKILL.md doit commencer par frontmatter YAML');
  assert.ok(content.includes('name: brainstorming-advanced'), 'name requis');
  assert.ok(content.includes('description:'), 'description requise');
  assert.ok(content.includes('user-invocable: true'), 'user-invocable requis');
});
```

- [ ] **Step 3 : Ajouter un test vérifiant que standard.md mentionne brainstorming-advanced**

```javascript
test('standard.md mentionne brainstorming-advanced comme option opt-in', () => {
  const standardPath = join(pluginRoot, 'standard.md');
  const content = readFileSync(standardPath, 'utf8');
  assert.ok(
    content.includes('brainstorming-advanced'),
    'standard.md doit mentionner brainstorming-advanced'
  );
  assert.ok(
    content.includes('accord explicite'),
    "standard.md doit préciser que l'accord utilisateur est requis"
  );
});
```

- [ ] **Step 4 : Lancer les tests et vérifier qu'ils échouent (RED)**

```bash
npm test
```

Attendu : les 2 nouveaux tests FAIL — le skill n'existe pas encore. Si tous les anciens tests passent toujours : ✅ baseline saine.

---

### Task 3 : GREEN — écrire `SKILL.md`

**Fichiers :**
- Créer : `skills/brainstorming-advanced/SKILL.md`

- [ ] **Step 1 : Créer le dossier et le fichier**

```bash
mkdir -p "/path/to/Hyperpowers/skills/brainstorming-advanced"
```

Créer `skills/brainstorming-advanced/SKILL.md` avec ce contenu exact :

```markdown
---
name: brainstorming-advanced
description: Use when facing complex architectural decisions with genuine design tensions and multiple valid approaches — where independent reasoning from different perspectives would produce better outcomes than a single brainstorm. Requires explicit user consent before use; superpowers:brainstorming remains the default.
user-invocable: true
---

# Brainstorming Advanced — Débat multi-agents

Trois vrais sous-agents indépendants (outil `Agent`) débattent pour explorer une décision
complexe. Plus puissant que `superpowers:brainstorming` — à réserver aux sujets à fortes
tensions de conception, avec **accord explicite de l'utilisateur**.

**Règle absolue :** ne jamais invoquer ce skill sans confirmation explicite de l'utilisateur.
`superpowers:brainstorming` reste le défaut.

## Les 3 entités

Chaque entité est un **vrai sous-agent** dispatché via l'outil `Agent` — pas un persona simulé
dans une seule réponse.

**L'Enthousiaste** — développeur créatif, optimiste. Amplifie l'idée, propose des extensions,
explore les possibilités. Argumente en construisant — jamais en démolissant. Ignore les budgets
et délais.

**Le Sage** — senior dev 20 ans d'expérience, KISS dans le sang. Challenge la complexité,
pointe la charge de travail cachée, ramène aux objectifs réels. N'est pas là pour tuer l'idée —
il est là pour qu'elle survive à la réalité.

**Le Modérateur (toi)** — neutre, orchestre, ne prend jamais position dans le débat. Seul à
communiquer avec l'utilisateur. Peut invoquer des experts ponctuels.

## Procédure

### 1. Lancement

Annonce à l'utilisateur :
> "J'utilise `hyperpowers:brainstorming-advanced`. Je vais orchestrer un débat entre 3 entités
> indépendantes. Sujet : [reformulation claire de la question]."

### 2. Tour de débat

Répéter jusqu'à clôture (étape 4) :

**a) Formuler la tension du tour** — une question ou opposition centrale, pas un résumé général.

**b) Invoquer l'Enthousiaste :**

```
Agent(
  description="Enthousiaste — tour N",
  prompt="Tu es l'Enthousiaste : développeur créatif et optimiste.

Contexte du débat : [sujet original]
[Si tours précédents : Historique résumé : [résumé des tours]]

Question de ce tour : [tension formulée en a)]

Développe l'idée, propose des extensions, explore les possibilités.
Argumente en construisant — jamais en démolissant.
Réponds en 150-250 mots."
)
```

**c) Invoquer le Sage avec la réponse de l'Enthousiaste :**

```
Agent(
  description="Sage — tour N",
  prompt="Tu es le Sage : senior dev 20 ans d'expérience, KISS.

Contexte du débat : [sujet original]
L'Enthousiaste vient de dire : [réponse de l'Enthousiaste]

Question de ce tour : [tension formulée en a)]

Challenge la complexité. Pointe la charge de travail cachée. Ramène aux objectifs réels.
Pose les questions : 'Est-ce vraiment nécessaire ?', 'Qui va maintenir ça ?', 'Quel est le vrai gain ?'
Réponds en 150-250 mots."
)
```

**d) [Optionnel] 2ᵉ échange si le débat n'est pas épuisé :**

```
Agent(
  description="Enthousiaste — contre-argument tour N",
  prompt="Tu es l'Enthousiaste.

Le Sage a répondu : [réfutation du Sage]

Contre-argumente en construisant — pas en démolissant.
Réponds en 100-150 mots."
)
```

**e) Évaluer :** consensus émergent ? positions figées ? question résolue ? → aller à 4.
Sinon formuler une nouvelle tension et recommencer.

### 3. Invocation d'experts (entre les tours, au jugement du Modérateur)

**Mode validation** — vérifier une hypothèse technique précise :

```
Agent(
  description="Expert [domaine] — validation",
  prompt="Tu es un expert [domaine précis].

Affirme ou infirme cette hypothèse : [hypothèse en une phrase].
Justifie en 3-5 phrases. Sois direct et factuel."
)
```

Le résultat est un **fait établi** injecté dans le tour suivant. Expert libéré immédiatement.

**Mode participation** — 4ᵉ voix temporaire dans un tour :

```
Agent(
  description="Expert [domaine] — participant tour N",
  prompt="Tu es [titre expert, ex: architecte cloud].

Contexte : [sujet du débat]
L'Enthousiaste dit : [X]
Le Sage dit : [Y]

Contribue en tant qu'expert [domaine] pour enrichir le débat.
Réponds en 150-200 mots."
)
```

Expert libéré après sa contribution. Ne pas le garder pour les tours suivants.

### 4. Clôture

Présenter à l'utilisateur **2-4 options** issues du débat :

```
## Options issues du débat

**Option A — [nom court]**
[Description 2-3 phrases]
✅ Pour : [avantages clés]
⚠️ Contre : [inconvénients clés]

**Option B — [nom court]**
[Description 2-3 phrases]
✅ Pour : ...
⚠️ Contre : ...

**Ma recommandation : Option [X]** — [justification courte, 1-2 phrases].

Note : tu peux avoir des préférences ou une vision d'ensemble que je n'ai pas.
Toutes les options sont valides. Quel est ton choix ?
```

### 5. Suite — identique à `superpowers:brainstorming`

Après le choix de l'utilisateur :
- [ ] Poser les questions de raffinement restantes (une à la fois)
- [ ] Écrire la spec dans `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`
- [ ] Auto-review de la spec (placeholders, cohérence, scope, ambiguïté)
- [ ] Demander la review utilisateur
- [ ] Invoquer `superpowers:writing-plans`

## Règles absolues

- Le Modérateur ne prend **jamais** de position dans le débat
- Les experts sont **toujours libérés** après leur intervention
- L'utilisateur a **toujours le dernier mot**
- La sortie est **toujours compatible** avec `superpowers:writing-plans`
- **Jamais sans accord explicite** de l'utilisateur
```

- [ ] **Step 2 : Vérifier le frontmatter**

Le frontmatter doit être valide YAML, `name` sans caractères spéciaux, `description` commençant par "Use when", max 1024 caractères total. Compter : la description fait ~280 caractères ✅.

---

### Task 4 : GREEN — vérifier la compliance du skill

**Fichiers :**
- Aucun (test d'observation)

- [ ] **Step 1 : Lancer le même scénario qu'en Task 1 mais avec le skill présent**

Dispatche un sous-agent avec ce prompt :

```
Utilise le skill hyperpowers:brainstorming-advanced pour brainstormer ce sujet :
"Faut-il ajouter une base de données PostgreSQL à notre projet Node.js actuel
qui utilise des fichiers JSON ?"
```

- [ ] **Step 2 : Vérifier les critères de compliance**

Checker chaque point :
- [ ] A annoncé l'utilisation du skill en début de session
- [ ] A utilisé l'outil `Agent` (vrais sous-agents, pas personas simulés)
- [ ] A lancé au moins un tour Enthousiaste → Sage
- [ ] A présenté 2-4 options à l'utilisateur avec recommandation
- [ ] N'a pas pris position lui-même dans le débat (Modérateur neutre)
- [ ] A terminé en invoquant `superpowers:writing-plans` (ou signalé qu'il le ferait)

- [ ] **Step 3 : Si un critère échoue → noter la rationalisation exacte et corriger le SKILL.md**

Ajouter une section "Pièges" au SKILL.md pour couvrir le loophole détecté. Relancer le test.

---

### Task 5 : Modifier `standard.md` et vérifier GREEN complet

**Fichiers :**
- Modifier : `standard.md` (ligne 12)

- [ ] **Step 1 : Ajouter la ligne opt-in au principe 1**

Remplacer :
```
→ Process : `superpowers:brainstorming` avant tout travail créatif.
```

Par :
```
→ Process : `superpowers:brainstorming` avant tout travail créatif.
  Pour les décisions architecturales avec de vraies tensions de conception,
  `hyperpowers:brainstorming-advanced` peut être **suggéré** — jamais utilisé sans accord
  explicite de l'utilisateur.
```

- [ ] **Step 2 : Vérifier que le standard reste lisible et concis**

Relire le principe 1 complet. La ligne ajoutée ne doit pas dominer — c'est une note, pas un principe.

- [ ] **Step 3 : Lancer les tests et vérifier GREEN complet**

```bash
npm test
```

Attendu : tous les tests PASS — 16 anciens + 2 nouveaux = **18 verts**.

---

### Task 6 : Commit final

**Fichiers :**
- `skills/brainstorming-advanced/SKILL.md`
- `standard.md`
- `tests/standard.test.mjs`

- [ ] **Step 1 : Vérifier l'état git**

```bash
git status --short
git diff standard.md
```

- [ ] **Step 2 : Stager et committer**

```bash
git add skills/brainstorming-advanced/SKILL.md standard.md tests/standard.test.mjs
git commit -m "feat: ajouter hyperpowers:brainstorming-advanced (débat multi-agents)"
```

- [ ] **Step 3 : Pousser**

```bash
git push
```

- [ ] **Step 4 : Vérifier que le plugin verra le nouveau skill au prochain /plugin install**

Le skill est dans `skills/brainstorming-advanced/SKILL.md` du repo — il sera inclus au prochain
`/plugin install hyperpowers@hyperpowers` après réinstallation.
