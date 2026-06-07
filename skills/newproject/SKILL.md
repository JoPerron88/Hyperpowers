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
