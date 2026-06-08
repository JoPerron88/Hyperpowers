<!-- AUTO-GÉNÉRÉ — ne pas éditer directement -->
<!-- Source : standard.md + skills/*/SKILL.md -->
<!-- Régénérer : npm run build:agents -->

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
  Pour les décisions architecturales avec de vraies tensions de conception,
  `hyperpowers:brainstorming-advanced` peut être **suggéré** — jamais sans accord explicite de l'utilisateur.

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

## 6. Garder le cap (le FinalGoal)
Si un cap projet est posé (`.hyperpowers/goal.md` présent), garder le travail aligné dessus.
Aux checkpoints — avant de figer un plan, avant de déclarer une étape finie — **relis**
`.hyperpowers/goal.md` (récitation) et demande-toi : « est-ce que ça sert le FinalGoal ? ». Si ça
dévie, **signale-le et demande**, sans bloquer. Tout but temporaire (en-tête `Goal:` d'un plan,
section Goal de `task_plan.md`) doit **tracer vers le FinalGoal** ; sinon, dis-le.
Fréquence selon le tier (principe 5) : moyenne → au plan figé et à l'étape finie ; grosse / pwf
actif → à chaque phase. Garde-le léger : le cap oriente, il ne rigidifie pas (le nombre de
features ou l'esthétique ne sont pas le cap).
Absent (`.hyperpowers/goal.md` non présent) → ce principe est dormant.

## Priorité
Process d'abord (brainstorming/debugging décident l'approche), implémentation ensuite.


---

## Skills disponibles

### brainstorming-advanced

---
name: brainstorming-advanced
description: Use when a decision has real trade-offs that a single perspective won't resolve — competing approaches both seem valid, significant architectural or product stakes, or you need to pressure-test a design. More powerful than brainstorming — triggers a structured multi-agent debate with entity selection tailored to the problem type.
user-invocable: true
---

# Brainstorming Advanced — Débat multi-agents avec méta-routage

Entités indépendantes (vrais sous-agents `Agent`) débattent pour explorer une décision complexe.
Plus puissant que `superpowers:brainstorming` — réservé aux sujets où des perspectives légitimes
et divergentes existent *même à information complète*.

**Règle absolue :** ne jamais invoquer ce skill sans confirmation explicite de l'utilisateur.
`superpowers:brainstorming` reste le défaut.

## Test d'éligibilité

Avant tout débat, le Modérateur applique ces trois questions en silence :

**Question zéro :** *"Est-ce que plus d'information factuelle résoudrait la question ?"*
→ Si oui : ne pas débattre. Chercher l'information d'abord.

**Q1 :** *"Deux développeurs compétents et informés identiquement pourraient-ils défendre des
choix opposés avec des arguments solides ?"*

**Q2 :** *"Se tromper maintenant coûte-t-il quelque chose plus tard ?"*

→ Si Q1 et Q2 sont toutes deux oui : `brainstorming-advanced` est approprié.
→ Sinon : `superpowers:brainstorming` suffit.

## Catalogue des entités

Les deux modes piochent dans le même catalogue :

| Entité | Profil | Idéal pour |
|---|---|---|
| **Enthousiaste** | Développeur créatif et optimiste. Amplifie, propose des extensions, explore les possibilités. Argumente en construisant — jamais en démolissant. | Toute décision créative, nouvelles features, choix architecturaux ouverts |
| **Sage** | Senior dev 20 ans d'expérience, KISS dans le sang. Challenge la complexité, pointe la charge cachée, ramène aux objectifs réels. | Toute décision technique, arbitrages build/buy, complexité justifiée |
| **Utilisateur Final** | Ancré dans l'expérience vécue : comment ça se sent à l'usage, pas comment ça s'implémente. | UX, nommage, messages d'erreur, flux utilisateur |
| **Estimateur** | Spécialiste des compromis temps/valeur. Pense en semaines, pas en élégance. | Roadmap, priorisation, décisions de scope |
| **Sécuritaire** | Pense aux vecteurs d'abus avant qu'ils existent. | API publiques, permissions, authentification, données sensibles |
| **Intégrateur** | "Comment ça joue avec ce qui existe déjà ?" | Décisions dans un système complexe existant, migration, couplage |

## Méta-routage

Le Modérateur choisit le mode **avant** le premier tour.

**→ Pool léger** si : problème bien identifiable, complexité modérée, cas courant.

**→ Pool dynamique** si : forte complexité, sujet hybride inhabituel, ou demande explicite de l'utilisateur.

Guide de sélection pour le pool léger :

| Type de problème | Entités recommandées |
|---|---|
| Décision architecturale | Enthousiaste + Sage |
| Choix technologique | Enthousiaste + Sage + Intégrateur |
| Design UX / nommage | Utilisateur Final + Sage |
| Roadmap / estimation | Estimateur + Sage |
| Sécurité / API | Sécuritaire + Intégrateur + Sage |
| Sujet hybride connu | Selon les dimensions dominantes |

## Mode 1 — Pool léger

- Sélection : 2-3 entités du catalogue selon le type de problème (guide ci-dessus).
- **Si tu te retrouves à vouloir 4+ entités → bascule en pool dynamique.**
- **Limite : 3 tours max fixes.** Si trop complexe pour 3 tours → décomposer en sous-décisions.
- Expert élevable : un expert ponctuel peut être promu participant persistant sur 2-3 tours.

## Mode 2 — Pool dynamique

- Sélection libre parmi le catalogue. 3+ entités possibles si le sujet le justifie.
- **Limite adaptative :** convergence = clôture immédiate, même en tour 2.
- **Plafond absolu : 10 tours.** Clôture obligatoire quoi qu'il arrive.
- Évaluation après chaque tour : (1) les positions convergent-elles ? (2) reste-t-il une objection explicitement non résolue ?
- Expert élevable : même mécanisme que pool léger.

## Procédure

### 1. Triage

Le **Modérateur** est l'agent qui exécute ce skill — il orchestre, ne prend jamais position dans les tours, et communique seul avec l'utilisateur.

1. Appliquer le test d'éligibilité (3 questions). Si non éligible → `superpowers:brainstorming`.
2. Choisir le mode (pool léger vs dynamique) selon la complexité et la demande.
3. Annoncer à l'utilisateur et **attendre confirmation explicite** :
   > "Je propose `hyperpowers:brainstorming-advanced` en mode **[pool léger / pool dynamique]**.
   > Entités : [liste]. Sujet : [reformulation claire]. On lance ?"
4. Selon la réponse :
   - Confirmation → continuer.
   - Refus → invoquer `superpowers:brainstorming` à la place.
   - Autre mode ou autres entités → ajuster, re-annoncer, attendre confirmation.

### 2. Tour de débat

**a) Formuler la tension du tour** — question ouverte et équilibrée, ne préjuge pas de la réponse.
❌ "Pourquoi PostgreSQL est la bonne décision ?" ✅ "La complexité de PostgreSQL est-elle justifiée ici ?"

**b) Dispatcher chaque entité séquentiellement** — même au Tour 1. Chaque entité reçoit la réponse de la précédente, y compris dès le premier tour : la 2ᵉ entité adapte son angle si elle a lu la 1ère, ce qui rend le débat plus dense immédiatement. Parallèle = positions identiques au Tour 1, gaspillage.

```
Agent(
  description="[Entité] — tour N",
  prompt="Tu es [profil de l'entité tiré du catalogue].

Contexte du débat : [sujet original]
[Si tours précédents : Historique résumé : [résumé]]
[Si réponse précédente : [Entité précédente] vient de dire : [réponse]]

Question de ce tour : [tension formulée en a)]

[Instruction spécifique à l'entité selon son profil]
Réponds en 150-250 mots (100-150 mots pour les contre-arguments)."
)
```

**c) [Optionnel] 2ᵉ échange par entité si le débat n'est pas épuisé.**

**d) Évaluer :**
- Pool léger : consensus ou 3 tours atteints → aller à 4 (clôture).
- Pool dynamique : convergence ou 10 tours atteints → aller à 4.
- Si l'utilisateur interrompt à tout moment → aller directement à 4 avec les positions actuelles.

### 3. Invocation d'experts

**Mode validation** — hypothèse factuelle précise :

```
Agent(
  description="Expert [domaine] — validation",
  prompt="Tu es un expert [domaine précis].
Affirme ou infirme : [hypothèse en une phrase].
Justifie en 3-5 phrases. Sois direct et factuel."
)
```

Résultat injecté comme fait établi dans le tour suivant. Expert libéré immédiatement.

**Mode participation** — 4ᵉ voix temporaire :

```
Agent(
  description="Expert [domaine] — participant tour N",
  prompt="Tu es [titre expert].
Contexte : [sujet] / [entité A] dit : [X] / [entité B] dit : [Y]
Contribue en tant qu'expert [domaine]. Réponds en 150-200 mots."
)
```

Expert libéré après sa contribution.

**Mode élévation** — expert promu participant persistant :
Le Modérateur élève l'expert si sa perspective est structurellement nécessaire sur plusieurs tours.
Il reçoit le contexte complet à chaque tour comme n'importe quelle entité.

### 4. Clôture

Présenter **2-4 options** issues du débat :

```
## Options issues du débat

**Option A — [nom court]**
[Description 2-3 phrases]
✅ Pour : [avantages clés]
⚠️ Contre : [inconvénients clés]

**Option B — [nom court]**
...

**Ma recommandation : Option [X]** — [justification 1-2 phrases].

Note : tu peux avoir des préférences que je n'ai pas. Quel est ton choix ?
```

### 5. Suite

Après le choix de l'utilisateur :
- [ ] Poser les questions de raffinement restantes (une à la fois)
- [ ] Documenter le choix (dans `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` si le projet suit les conventions superpowers, sinon dans le format du projet)
- [ ] Auto-review de la spec (placeholders, cohérence, scope, ambiguïté)
- [ ] Demander la review utilisateur
- [ ] Invoquer `superpowers:writing-plans`

## Règles absolues

- Test d'éligibilité **toujours** appliqué en silence avant de lancer.
- Mode (léger vs dynamique) **annoncé** avant le premier tour.
- Le Modérateur ne prend **jamais** position pendant les tours — uniquement à la clôture.
- Experts non-élevés **toujours libérés** après contribution.
- Pool léger : **3 tours max**, pas d'exception. Si trop complexe → décomposer.
- Pool dynamique : **10 tours max absolus**, convergence peut clore plus tôt.
- Sortie **toujours compatible** avec `superpowers:writing-plans`.
- **Jamais sans accord explicite** de l'utilisateur.
- L'outil `Agent` est **toujours** utilisé — jamais de persona simulé.

## Erreurs courantes

| Erreur | Ce qui se passe | Correction |
|--------|----------------|------------|
| Simuler les personas en texte | Chambre d'écho — aucune indépendance réelle | Appeler `Agent` pour chaque entité, sans exception |
| Sauter le test d'éligibilité | Usage abusif sur des décisions triviales | Appliquer les 3 questions en silence avant tout |
| Garder Enthousiaste+Sage par défaut sans consulter le guide | Pool léger mal sélectionné | Choisir les entités selon le guide de sélection |
| Dispatcher les entités en parallèle "car Tour 1 = positions indépendantes" | Même Tour 1 : la 2ᵉ entité adapte son angle si elle a lu la 1ère — débat plus dense dès le départ | Séquentiel obligatoire, sans exception de tour |
| Pool dynamique : dépasser 10 tours | Boucle sans fin | 10 tours = clôture absolue |
| Garder un expert non-élevé pour les tours suivants | Contexte pollué, prompts gonflés | Libérer immédiatement sauf si élevé explicitement |
| Invoquer sans attendre la confirmation | L'utilisateur n'a pas consenti | Attendre "oui" explicite |


---

### cahier-maitre

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

Exécuter :

    git config user.name

Si la commande échoue ou retourne vide : utiliser `"Auteur inconnu"`.

### 2. Résumer les événements clés

Sans lire `CAHIER.md`, résumer en **2-3 lignes** les événements clés de la session courante :
avancées notables, problèmes rencontrés, décisions prises. Ton narratif court — carnet de
chantier, pas rapport. Pas de liste à puces imposée.

Si l'utilisateur a précisé le contenu à noter, l'utiliser directement.

### 3. Formater l'entrée

    ## YYYY-MM-DD — <auteur>

    <résumé 2-3 lignes>

Date = date du jour au format ISO (`YYYY-MM-DD`).

### 4. Prepend dans CAHIER.md

Utiliser un prepend Bash pour éviter de lire l'intégralité du fichier :

    # Remplacer DATE, AUTEUR et RESUME par les valeurs réelles avant d'exécuter.

    # Si CAHIER.md existe :
    { printf '## DATE — AUTEUR\n\nRESUME\n\n'; cat CAHIER.md; } > /tmp/cahier_tmp \
      && mv /tmp/cahier_tmp CAHIER.md

    # Si CAHIER.md n'existe pas :
    printf '## DATE — AUTEUR\n\nRESUME\n' > CAHIER.md

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


---

### newproject

---
name: newproject
description: >
  Use when starting a brand new project from scratch — before any code, any file,
  or folder structure exists. Invoke as /NewProject [description].
  Do NOT use for projects already in progress.
user-invocable: true
---

# NewProject — Démarrer du bon pied

Skill d'amorçage de projet. Utilisable sur n'importe quel type de projet (script, outil
CLI, plugin Claude Code, site web, outil de calcul, etc.).

**Invocation :** `/NewProject [Description courte]`

La `[Description]` est le point de départ — reformulée en retour à l'utilisateur en
Phase 1. Si absente, le skill pose la question d'ouverture. Cinq phases, 3 artefacts,
puis handoff vers le développement habituel.

---

## Phase 1 — Verbaliser l'idée

Si une `[Description]` est fournie, la reformuler immédiatement :
> "Voici ce que j'ai compris : [reformulation en 1-2 phrases]. C'est bien ça ?"

Puis poser les questions de raffinement, **une à la fois**, dans l'ordre :

1. "À quoi ça ressemblerait quand c'est terminé ? Comment tu sauras que c'est réussi ?"
2. "Qui l'utilise, et comment ? (toi seul, une équipe, un client, un autre outil ?)"

Si la description est absente ou trop vague (moins de 10 mots significatifs), poser
d'abord :
- "Qu'est-ce que tu veux construire ? Décris-le librement, sans jargon technique."

**But :** verbaliser l'idée en langage courant — pas collecter des specs techniques.
Ne proposer aucune option ici. Écouter, reformuler, valider.

---

## Phase 2 — Choix technologiques

Questions, **une à la fois**, dans l'ordre :

3. "As-tu déjà un langage ou un outil en tête — ou tu veux une recommandation ?"
   - Si l'utilisateur a une idée → expliquer les implications concrètes pour un
     non-développeur (courbe d'apprentissage, maintenance, compatibilité avec ses
     outils existants, exemples de ce que ça donne en pratique).
   - Si pas d'idée → proposer 2-3 options avec une recommandation claire et son
     raisonnement. Ex : Python pour sa lisibilité et ses bibliothèques scientifiques /
     d'ingénierie ; Node.js pour les plugins Claude Code.

4. "Y a-t-il des contraintes extérieures ? (formats de fichiers à lire ou écrire,
   logiciels avec lesquels le projet doit s'interfacer, environnement imposé)"

**Option à proposer à la fin de Phase 2 :**
> "Veux-tu qu'on explore les choix technologiques plus en profondeur ? Je peux invoquer
> `superpowers:brainstorming` pour peser les options ensemble avant de continuer."

- Si oui → invoquer `superpowers:brainstorming` avec le contexte des phases 1-2 comme
  point de départ. Reprendre en Phase 3 après.
- Si non → continuer directement.

---

## Phase 3 — Scope, structure et risques

Questions, **une à la fois** :

5. "En combien de temps veux-tu avoir une première version qui fonctionne ?"
6. "Y a-t-il des parties du projet qui te semblent floues, ou qui t'inquiètent ?"

**Option à proposer à la fin de Phase 3 :**
> "Veux-tu un débat rapide sur le scope et les risques de ce projet ? Je vais mettre
> en face une vision optimiste et une vision réaliste pour identifier les angles morts
> avant de commencer."

- Si oui → exécuter le débat ci-dessous.
- Si non → résumer les 3 principaux risques identifiés par Claude et passer en Phase 4.

### Débat de Phase 3 — Scope et risques

Deux sous-agents indépendants (outil `Agent`), 1 ou 2 tours maximum.

**Formuler la tension du Tour 1 :** "Ce scope est-il réaliste pour quelqu'un qui code
en amateur, dans le délai visé ?"

**Invoquer l'Enthousiaste :**

```
Agent(
  description="Enthousiaste — NewProject scope tour 1",
  prompt="Tu es l'Enthousiaste : développeur créatif et optimiste.

Contexte : l'utilisateur est [profil, ex: concepteur mécanique, néophyte en code].
Projet : [résumé du projet des phases 1-2]
Langage/tech choisi : [tech]
Délai visé : [délai]

Question : Ce scope est-il réaliste pour ce profil et ce délai ?

Amplifie ce qui est faisable et valuable. Si le scope est trop large,
propose une version qui livre rapidement de la valeur tout en gardant
l'essentiel. Argumente en construisant — jamais en démolissant.
Réponds en 150-200 mots."
)
```

*Capturer la réponse de l'Enthousiaste (résultat retourné par l'outil `Agent`) et
l'insérer à la place de `[réponse Enthousiaste]` dans le prompt ci-dessous.*

**Invoquer le Sage avec la réponse de l'Enthousiaste :**

```
Agent(
  description="Sage — NewProject scope tour 1",
  prompt="Tu es le Sage : senior dev 20 ans d'expérience, KISS dans le sang.

Contexte : l'utilisateur est [profil, ex: concepteur mécanique, néophyte en code].
Projet : [résumé du projet des phases 1-2]
Langage/tech choisi : [tech]
Délai visé : [délai]
L'Enthousiaste vient de dire : [réponse Enthousiaste]

Question : Ce scope est-il réaliste pour ce profil et ce délai ?

Challenge le scope. Pointe les risques typiques d'un non-développeur sur ce type de
projet : sous-estimation de la complexité, dette technique qui s'accumule vite, structure
de fichiers qui bloque la reprise après pause. Si besoin, propose une version réduite
qui livre 80% de la valeur avec 30% de la complexité.
Réponds en 150-200 mots."
)
```

**Si le débat n'est pas épuisé**, formuler un Tour 2 :
Tension : "Y a-t-il une version plus simple qui livre 80% de la valeur ?"
Même format — passer en contexte les réponses des deux agents du Tour 1 dans les prompts.
**Maximum 2 tours.**

**Clôture du débat — présenter 2-3 options de scope :**

```
## Options de scope

**Option A — [nom court, ex: "Version minimale"]**
[Ce que ça fait — 2 phrases]
✅ Pour : [avantages]
⚠️ Risques : [risques principaux pour ce profil]

**Option B — [nom court, ex: "Version complète"]**
[Ce que ça fait — 2 phrases]
✅ Pour : [avantages]
⚠️ Risques : [risques principaux pour ce profil]

**Ma recommandation : Option [X]** — [justification courte].

Top 3 risques à surveiller dans tous les cas :
1. [risque 1]
2. [risque 2]
3. [risque 3]

Quel scope tu choisis ?
```

---

## Phase 4 — Créer les artefacts

Après confirmation du scope par l'utilisateur, créer les 3 artefacts **dans cet ordre**.

### 1. `.hyperpowers/goal.md`

Créer le dossier `.hyperpowers/` puis le fichier :

```markdown
# FinalGoal — [Nom du projet]

[Description du projet — 1-2 phrases : ce que c'est, pour qui, dans quel contexte]
[Ce que "réussi" signifie concrètement — critère vérifiable]
[Contraintes clés à ne jamais perdre de vue]
```

Ce fichier active le hook FinalGoal d'Hyperpowers (principe 6 du standard). Sans lui,
Claude ne vérifiera pas l'alignement du travail avec le cap du projet aux checkpoints.

### 2. `CLAUDE.md`

À la racine du projet :

```markdown
# CLAUDE.md

## Projet
[Nom] — [description courte issue de la Phase 1]

## Langage et environnement
- Langage : [langage + version si connue]
- Outils : [outils principaux]

## Commandes
- Lancer : `[commande]`
- Tester : `[commande, ou "à définir lors de la première feature"]`

## Conventions
[Décisions de style déjà prises — ex: "ESM, zéro dépendances externes sauf X"]

## Contexte utilisateur
[Ex: "l'auteur est concepteur mécanique, non-développeur — privilégier la clarté
et la simplicité dans les explications et le code"]
```

### 3. `.gitignore` + `git init`

Créer le `.gitignore` adapté au langage choisi :

- **Python :** `__pycache__/`, `*.pyc`, `.env`, `venv/`, `dist/`, `*.egg-info/`, `.DS_Store`
- **Node.js :** `node_modules/`, `.env`, `dist/`, `*.log`, `.DS_Store`
- **Générique :** `.DS_Store`, `*.log`, `.env`, `*.tmp`

Puis :
```bash
git init
git add CLAUDE.md .gitignore .hyperpowers/goal.md
git commit -m "init: setup projet [nom] avec artefacts hyperpowers"
```

Afficher un résumé des 3 artefacts créés et demander confirmation avant le commit.

---

## Phase 5 — Plan large + handoff

Proposer un découpage en grandes phases (2-5 phases nommées) basé sur les échanges.
Format :

```
## Plan de développement — [Nom du projet]

Phase A — [nom] : [ce que ça fait, comment savoir que c'est fini]
Phase B — [nom] : [idem]
Phase C — [nom] : [idem]
```

Puis handoff explicite :
> "Le projet est prêt à démarrer. Pour développer chaque phase, dis-moi quelle phase
> on attaque en premier — j'invoquerai `superpowers:brainstorming` pour l'explorer,
> puis `superpowers:writing-plans` pour la planifier avant de coder."

---

## Erreurs courantes

| Erreur | Correction |
|--------|------------|
| Poser 2 questions dans le même message | Une seule question par message — toujours |
| Créer CLAUDE.md avant goal.md | Ordre imposé : goal.md → CLAUDE.md → git init |
| Forcer le débat Phase 3 si le scope est évident | Le débat est optionnel — ne le proposer que si l'utilisateur est incertain |
| Continuer à coder après Phase 5 | Ce skill s'arrête à Phase 5 ; handoff explicite vers les skills habituels |
| Commiter sans demander confirmation | Afficher le résumé des 3 artefacts, attendre le "ok" de l'utilisateur |

## Règles absolues

- Questions **une à la fois** — ne jamais en poser deux dans le même message.
- Reformuler l'idée avant les questions — valider la compréhension d'abord.
- Débat de Phase 3 : **optionnel** — ne pas le forcer si le scope est déjà clair.
- Artefacts : créer **dans l'ordre** (goal.md → CLAUDE.md → git init).
- Ne jamais créer de structure de dossiers, README, ou fichiers de tests vides.
- Ce skill s'arrête à la Phase 5. Le développement commence après, avec les skills habituels.


---

### session-handoff

---
name: session-handoff
description: Use when the user is wrapping up or stopping work ("fini pour aujourd'hui", "done for today", "on met en pause", "je m'arrête"), especially when the project may be resumed much later, on another machine, or by someone who has forgotten the context and does not have the project's plugins/skills installed.
user-invocable: true
---

# Session Handoff — « fini pour aujourd'hui »

Prépare la reprise **à froid dans un futur incertain** : peut-être dans des mois, sur une machine
neuve, par un toi qui a oublié le contexte — ou un nouvel utilisateur. Le livrable central est le
**dossier `session-handoff/`**, **commité** (il suit le projet dans git du début à la fin, et c'est
la seule chose qui voyage au `git clone`). On doit pouvoir dire « va lire le dossier
`session-handoff/` » et y trouver **tout** pour s'installer, comprendre, et reprendre — **même sans
les plugins/skills installés**.

## Principe

Dérive ce que tu peux, **demande** ce que seul l'utilisateur sait, et **n'invente jamais** ni le
setup projet ni la source d'install d'un outil (un nouvel arrivant qui suit des étapes fabriquées =
le scénario d'échec).

## Procédure

### 1. Dériver les faits génériques (git uniquement)
Exécute et garde les sorties :
- `git branch --show-current`
- `git log --oneline -8`
- `git status --short` (modifications non commitées)
- `git log --oneline @{u}.. 2>/dev/null` (commits non poussés, si un upstream existe)
- `git remote -v` (un remote existe-t-il ?)

**⚠️ Surface de perte — crucial pour la « machine neuve ».** Ce qui NE voyage PAS au `git clone` :
les modifications **non commitées**, les commits **non poussés**, ou l'**absence de remote**. Si tu
en repères, **signale-le explicitement à l'utilisateur** et **demande** s'il veut commiter / pousser
pour ne rien perdre — **ne commite jamais son travail en cours en douce** (c'est le sien). Reflète
cet état dans la section « Où on en est ».

Repère les docs de contexte présents (universels) : `README`, un dossier `docs/`, un journal
(souvent `.claude/JOURNAL.md`), un fichier de but `.hyperpowers/goal.md`. Si le projet utilise
Hyperpowers, aussi `docs/superpowers/specs` et `/plans` — mais **ne traite pas** ces chemins comme
universels.
**N'essaie pas** de deviner la commande de test/build/lancement — inconnue pour un projet quelconque.
Note aussi la **date du jour** : elle remplit l'en-tête « Dernière mise à jour ».

### 2. Dériver l'outillage Claude Code utilisé
Recense les plugins/skills **réellement** utilisés sur ce projet, pour `OUTILLAGE.md` :
- lis `~/.claude/plugins/installed_plugins.json` (plugins installés et leur marketplace) ;
- croise avec les indices du repo : `docs/superpowers/` → **superpowers** ; `.hyperpowers/` ou un
  `standard.md` injecté → **Hyperpowers** ; `task_plan.md` / `.planning/` → **planning-with-files**.

Pour chacun, note **comment l'installer** (commande exacte). Si la **source d'install** n'est pas
certaine (ex. l'URL d'un plugin maison comme Hyperpowers), **demande/confirme** — ne l'invente pas.

### 3. Poser les questions de trou (une à la fois)
1. **Ce qui était prévu ensuite ?** (l'info la plus précieuse pour un futur-toi.)
2. **Reprendre sur une machine neuve** : comment cloner / installer / lancer / tester *ce* projet ?
   Pré-remplis depuis les indices (`package.json` scripts, `README`) **mais fais confirmer** — ne
   fige rien d'inventé.
3. **Des pièges / gotchas** non-évidents à connaître ?
4. **Décisions clés et pourquoi** (pour qu'un nouvel arrivant ne les re-débatte pas) ?

Si l'utilisateur ne sait pas pour le point 2, écris-le explicitement (« setup non documenté — à
reconstituer ») au lieu d'inventer.
Si tu ne peux **pas** poser ces questions de façon interactive (exécution en une passe, utilisateur
absent), écris des marqueurs explicites « à confirmer » pour les parties humaines — ne bloque pas,
n'invente pas.

### 4. Écrire le dossier `session-handoff/` (racine du projet, deux fichiers)

**`session-handoff/HANDOFF.md`** — l'instantané de reprise :
```markdown
# Handoff — <projet>
> Dernière mise à jour : <date>. Reprise à froid : si tu n'as pas l'outillage de ce projet, lis
> d'abord `OUTILLAGE.md` (à côté), puis ce fichier.

## Le but (FinalGoal)
<contenu de .hyperpowers/goal.md si présent ; sinon un résumé demandé>

## Où on en est
- Branche : <…> · Derniers commits : <…>
- Non commité / non poussé / remote : <…> — ⚠️ tant que non poussé, ça ne voyage PAS au clone

## Ce qui était prévu ensuite
<réponse 1>

## Reprendre sur une machine neuve (le projet)
<réponse 2, confirmée — ou « non documenté, à reconstituer »>

## Pièges à connaître
<réponse 3>

## Décisions clés & pourquoi
<réponse 4 + specs pertinentes>

## Où trouver le détail
<pointeurs : specs/plans, journal, etc.>
```

**`session-handoff/OUTILLAGE.md`** — comment se remettre dans le même environnement de travail,
**lisible et actionnable même sans les outils installés** :
```markdown
# Outillage — <projet>
> Lis ceci EN PREMIER si tu reprends sur une machine neuve, avant de connaître le projet.

## Plugins / skills Claude Code utilisés
Pour chacun (dérivé de l'environnement, voir étape 2) :
- **<nom>** — ce qu'il apporte (1 phrase). Installer : `<commande exacte>`.
  <ex. superpowers : marketplace officiel · Hyperpowers : `/plugin marketplace add <URL/chemin>`
  puis `/plugin install hyperpowers@hyperpowers` · planning-with-files : <commande>>

## Repli — si tu n'installes pas l'outillage
Tu peux quand même continuer : le projet reste un dépôt git normal. <En 1-2 phrases par outil,
ce qu'il garantissait, pour le tenir à la main.> Rien n'oblige à installer les plugins pour lire
le code et avancer.

## Puis
Lis `HANDOFF.md` (à côté) pour l'état et la prochaine étape.
```

### 5. Réduire le doublon dans `CLAUDE.md`
Si `CLAUDE.md` existe et contient un bloc d'état/reprise, **remplace ce bloc** par un pointeur
court : « Pour reprendre, lis le dossier `session-handoff/` (`OUTILLAGE.md` puis `HANDOFF.md`). »
S'il n'y a pas de `CLAUDE.md`, ne pas en créer un.

### 6. Ajouter une entrée au journal
Ajoute une entrée au journal (`.claude/JOURNAL.md` selon la pratique du projet) : date, ce qui a
été fait, état, prochaine étape. Le journal est l'**historique** ; `session-handoff/` est
l'**instantané courant**.

### 7. Pointeur mémoire IA
Laisse une note mémoire d'**une ligne** : « Projet <nom> : pour reprendre, lis le dossier
`session-handoff/`. » Ne duplique pas le contenu (la mémoire ne voyage pas). Si ton environnement
n'a **pas** de système mémoire accessible pour ce projet, **saute cette étape** — n'invente pas.

### 8. Committer
Si le projet utilise Hyperpowers et que tu as modifié un skill (`skills/*/SKILL.md`), régénère d'abord
`AGENTS.md` : `npm run build:agents`.

`git add session-handoff/` (+ `CLAUDE.md` s'il a été aminci, + `AGENTS.md` si régénéré), puis un
commit clair (ex. « Mettre à jour le handoff de session »). Le dossier `session-handoff/` est
**versionné** et suit le projet. Le journal reste gitignoré/local.

## Cas limites
- **Pas un dépôt git** : saute les étapes git (1) et le commit (8) ; produis quand même le dossier
  `session-handoff/` et signale à l'utilisateur de le sauvegarder manuellement (son moyen de partage).
- **Dossier `session-handoff/` déjà présent** : réécris l'instantané courant, mais **préserve les
  réponses déjà confirmées** par l'utilisateur (ne les efface pas, ne ré-interroge pas inutilement) ;
  l'historique reste dans git.
- **Aucun outillage particulier détecté** : `OUTILLAGE.md` le dit (« projet git standard, aucun
  plugin/skill spécifique requis ») plutôt que d'inventer une liste.
- **Setup inconnu** : marque-le explicitement, n'invente pas.

## Honnêteté
Ce skill aide à reprendre à froid ; il ne garantit pas une reprise sans friction si le setup projet
ou l'outillage n'ont pas pu être documentés.

