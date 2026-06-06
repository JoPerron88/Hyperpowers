# Spec — Hyperpowers v3 : le FinalGoal (fil conducteur projet)

> Conçu le 2026-06-06 (skill `superpowers:brainstorming`). Fait suite à v1 (noyau comportemental)
> et v2 (routage des plans). Répond à une douleur observée : sur les longs développements, le
> **but final dérive** (« lost in the middle ») — le code et les plans restent bons, mais le cap
> se perd, et c'est l'humain qui doit rappeler Claude à l'ordre.
>
> **Dépendance de branche** : conçue au-dessus de v2 (`v3-finalgoal` part de `v2-routage-plans`)
> pour que le nouveau principe se numérote « 6 » au-dessus du principe 5 de v2. À intégrer après
> ou avec v2.

## Objectif

Donner à un projet un **cap persistant** — le **FinalGoal** — que Claude garde en vue et **relit
aux moments de décision**, pour contrer la dérive du but sur les longues tâches. Léger et souple
(« 4 features ou 300, beau ou laid : ça reste un logiciel de prise de notes assisté par IA »),
**activable** (pas toujours actif), et **influent sur les plans** quand on est sur du gros/long.

C'est la suite naturelle du mécanisme Hyperpowers (injection au SessionStart + récitation, déjà
en place) et ça compose avec le tier « grosse/longue » de v2 (la montée d'influence s'y aligne).

## Le modèle (décidé au brainstorming)

- **FinalGoal** : un cap **projet**, persistant, l'« aboutissement ». **Seul artefact neuf.**
  pwf ne le couvre pas (le « Goal » de pwf meurt avec la tâche).
- **Buts temporaires** : on **ne crée pas** de porteur dédié. Ils restent dans les champs `Goal:`
  qui existent déjà — en-tête de plan `superpowers:writing-plans`, section Goal de `task_plan.md`
  (pwf). Hyperpowers ajoute seulement la **règle d'alignement** : tout but temporaire doit
  **tracer vers le FinalGoal**.
- **Influence = contrôle de dérive doux** : présence (injection) **+** checkpoint explicite
  « est-ce que ça sert le FinalGoal ? » avant de figer un plan et avant de déclarer une étape
  finie. Si dérive → **signaler et demander**, sans bloquer. C'est Claude qui rappelle à l'ordre,
  plus l'humain.
- **Resurfacing = checkpoint-reread** : à chaque checkpoint, Claude **relit le fichier de goal**
  (la récitation), pas la copie périmée injectée au SessionStart. Une injection unique au
  SessionStart serait « lost in the middle » comme le reste — la relecture est ce qui contre la
  dérive.
- **Activation hybride + dormant par défaut** : la fonctionnalité n'existe que **si un fichier de
  goal est présent**. Pas de fichier → comportement inchangé (zéro injection, zéro checkpoint).
  C'est exactement le « pas toujours actif ». La fréquence des checkpoints **monte avec le tier**
  v2 (moyenne : plan figé + étape finie ; grosse / pwf actif : à chaque phase).

## Non-objectifs (explicitement hors v3)

- **Pas de 3ᵉ porteur de but.** Les buts temporaires ne sont pas stockés par Hyperpowers ; la
  colle d'alignement s'accroche aux `Goal:` existants. Le seul fichier neuf = le FinalGoal.
- **Pas de commande `/goal`.** « Activer » = créer `.hyperpowers/goal.md` (Claude peut l'écrire
  sur demande de l'utilisateur). Une commande ergonomique pourra venir plus tard si le besoin se
  confirme — YAGNI pour l'instant.
- **Pas de gestion de cycle de vie des buts temporaires** (création/durée/retrait) : pwf et
  superpowers s'en chargent déjà.
- **Pas de garde-fou bloquant.** Le mécanisme est advisory ; il *réduit* la dérive, il ne la
  *garantit pas* à zéro (cf. critères de done).
- **Pas de fork** de superpowers ni de pwf. **Pas de nouveau hook** au-delà de l'extension de
  l'injection SessionStart existante.

## Architecture

Additive, dans la lignée v1/v2. Le **dépôt EST le plugin** ; l'injection passe par
`hooks/session-start.mjs` (JSON `hookSpecificOutput.additionalContext`). Trois pièces :

```
.hyperpowers/goal.md         — (DANS LE PROJET DE L'UTILISATEUR, pas dans ce dépôt)
                               le FinalGoal ; unique artefact neuf ; source de vérité
hooks/session-start.mjs      — étendu : lit le cwd, injecte le goal s'il existe
standard.md                  — +1 principe « 6. Garder le cap (le FinalGoal) »
tests/standard.test.mjs      — +cas (principe 6, injection conditionnelle, chemin nommé)
```

### Pièce 1 — Convention de fichier `.hyperpowers/goal.md`

- Vit dans le **projet actif de l'utilisateur** (n'importe quel projet où Hyperpowers est
  installé), pas dans le dépôt Hyperpowers. Chemin : `<racine-projet>/.hyperpowers/goal.md`.
- Contient **uniquement** le FinalGoal : un énoncé court (1–3 phrases). Pas de buts temporaires.
- Traitement git : laissé au choix de l'utilisateur par projet (committable pour partager le cap
  en équipe ; gitignorable s'il est personnel). Hyperpowers n'impose rien.

### Pièce 2 — Injection conditionnelle au SessionStart

`hooks/session-start.mjs` est étendu ainsi (le standard reste toujours injecté ; le goal s'ajoute
seulement s'il existe) :

- Localiser le projet de façon **robuste** : lire le JSON sur **stdin** et en extraire `cwd`
  (les hooks reçoivent ce payload) ; **fallback** `process.cwd()` si stdin est vide/illisible.
  → `CLAUDE_PROJECT_DIR` est **écarté** (bug connu « not found » dans la doc superpowers ; pwf
  lui-même cible des chemins relatifs au cwd, ce qui prouve que cwd = dossier projet).
- Si `<cwd>/.hyperpowers/goal.md` existe et n'est pas vide : `additionalContext` =
  `standard` + un bloc FinalGoal (titre clair + le contenu du fichier + un rappel court « relis ce
  cap aux checkpoints »). Sinon : `additionalContext` = `standard` seul (comportement v1/v2).
- Aucune exception ne doit casser le hook : toute erreur de lecture du goal dégrade vers
  « standard seul » (le SessionStart ne doit jamais échouer).

### Pièce 3 — Principe 6 du Standard « Garder le cap (le FinalGoal) »

Ajouté à `standard.md` après le principe 5, même style (le QUOI qui pointe vers le COMMENT).
Contenu :

- **Si** un FinalGoal est posé (`.hyperpowers/goal.md` présent), garder le travail aligné dessus.
- Aux **checkpoints**, **relire `.hyperpowers/goal.md`** (récitation) et se demander
  explicitement « est-ce que ce que je m'apprête à faire / viens de faire sert le FinalGoal ? ».
- Si ça **dévie** : le **signaler** à l'utilisateur et **demander**, sans bloquer.
- Tout but **temporaire** (en-tête `Goal:` d'un plan superpowers, section Goal de `task_plan.md`)
  doit **tracer vers le FinalGoal** ; si un but temporaire ne s'y rattache pas, le dire.
- **Fréquence selon le tier** (lien avec le principe 5) : tier moyen → checkpoint au plan figé et
  à l'étape déclarée finie ; tier grosse / pwf actif → checkpoint à chaque phase.
- Garder **léger** : le cap oriente, il ne rigidifie pas (le nombre de features ou l'esthétique
  ne sont pas le cap).

## Flux de données

```
SessionStart
  └─ hook lit cwd (stdin → fallback process.cwd())
       └─ <cwd>/.hyperpowers/goal.md existe ? 
            ├─ oui → additionalContext = standard + FinalGoal
            └─ non → additionalContext = standard (inchangé)

Pendant le travail (si FinalGoal posé)
  └─ à chaque checkpoint (fréquence = tier du principe 5)
       └─ Claude RELIT .hyperpowers/goal.md
            └─ aligné ? ─ oui → continue
                        └─ non → signale la dérive + demande (non bloquant)
```

## Gestion d'erreur / cas limites

- **Pas de fichier goal / fichier vide** → fonctionnalité **dormante** : injection = standard
  seul, aucun checkpoint. (C'est le « pas toujours actif ».)
- **cwd illisible / stdin absent** → fallback `process.cwd()` ; si tout échoue, injecter le
  standard seul. Le hook ne doit jamais planter.
- **FinalGoal présent mais aucun plan/tâche en cours** → le principe s'applique au prochain
  checkpoint ; rien à forcer entre-temps.
- **Conflit but temporaire ↔ FinalGoal** → cas nominal du contrôle de dérive : signaler, demander.

## Stratégie de test

Étendre `tests/standard.test.mjs` (node:test, zéro dépendance), même esprit que v1/v2 :

1. **Principe 6 présent** : `standard.md` contient le titre figé « Garder le cap » (titre complet :
   « 6. Garder le cap (le FinalGoal) »), nomme `.hyperpowers/goal.md`, et mentionne « relire » /
   récitation aux checkpoints.
2. **Injection conditionnelle — goal présent** : en exécutant `session-start.mjs` avec un cwd
   pointant vers un dossier temporaire contenant `.hyperpowers/goal.md`, l'`additionalContext`
   contient **et** le standard **et** le texte du goal.
3. **Injection conditionnelle — goal absent** : avec un cwd sans `.hyperpowers/goal.md`,
   l'`additionalContext` contient le standard et **n'ajoute pas** de bloc FinalGoal (dormant).
4. **Robustesse** : le hook ne plante pas si stdin est vide (fallback `process.cwd()`).

> Note d'implémentation pour le test : le hook devra accepter le `cwd` via stdin pour être
> testable de façon déterministe (sinon le test dépendrait du cwd réel). Le plan détaillera le
> contrat exact (lecture stdin + fallback).

## Critères de done (vérifiables, honnêtes)

- [ ] `standard.md` contient le principe 6 (cap + checkpoint-reread + alignement + fréquence par
      tier + souplesse).
- [ ] `session-start.mjs` injecte le FinalGoal **quand** `.hyperpowers/goal.md` existe, et **rien
      de plus** quand il est absent ; ne plante jamais.
- [ ] `npm test` vert avec les nouveaux cas (principe 6, injection présente/absente, robustesse).
- [ ] Plugin réinstallé + vérif runtime : dans un projet **avec** un `.hyperpowers/goal.md`, une
      session fraîche cite le FinalGoal ; dans un projet **sans**, elle ne le cite pas.
- [ ] **Honnêteté** : le done = le cap est présent, relu aux checkpoints, et la dérive est
      signalée — **pas** « zéro dérive ». Un mécanisme advisory réduit la dérive, ne la supprime
      pas.
