# Spec — Hyperpowers : skill « session-handoff » (fini pour aujourd'hui)

> Conçu le 2026-06-06 (skill `superpowers:brainstorming`). Indépendant de v2/v3 (branche
> `v4-session-handoff` partant de `main`). **Premier skill embarqué** par le plugin Hyperpowers
> (v1-v3 = `standard.md` + hook ; ici on ajoute un dossier `skills/`).

## Objectif

Un skill qu'on invoque **avant de s'arrêter** (« fini pour aujourd'hui ») qui prépare la **reprise
à froid dans un futur incertain** : pas forcément dans quelques heures, mais peut-être dans un ou
deux mois, **sur une machine neuve** (l'actuelle pourrait être endommagée), par quelqu'un qui a
**oublié le contexte** — voire un **tout nouvel utilisateur**.

Le skill **dérive ce qu'il peut**, **pose à l'utilisateur les questions** que lui seul peut
répondre, et produit une **note durable pour l'humain ET un pointeur pour l'IA**.

## Contrainte fondatrice (ce qui voyage)

Pour une reprise sur **machine neuve / nouvel utilisateur**, seuls les **fichiers commités du
dépôt** voyagent au `git clone`. Donc :
- la **mémoire Claude** (`~/.claude/.../memory/`) **ne voyage pas** (fraîche sur une nouvelle
  machine, différente pour un nouvel utilisateur) → on n'y met qu'un **pointeur**, pas le contenu ;
- le **`JOURNAL.md`** est gitignoré → ne voyage pas → reste l'**historique local**, pas la source
  de reprise ;
- la note humaine de reprise **doit être un fichier commité** → `HANDOFF.md`.

## Décisions du brainstorming

- **Note humaine** = **`HANDOFF.md`** dédié, commité (racine du projet).
- **Frontière avec `CLAUDE.md`** : `HANDOFF.md` **remplace** le rôle du bloc « État courant —
  reprise » de `CLAUDE.md`. Le skill **réduit** ce bloc à un **pointeur** (« pour reprendre, lis
  `HANDOFF.md` »). → **une seule source de vérité** pour l'état de reprise (pas de 3ᵉ artefact
  concurrent : c'est la mission anti-doublon d'Hyperpowers).
- **Dosage** = **auto-d'abord, questions pour les trous**.
- **Mécanisme** = un **skill invocable** par l'utilisateur, déclenchable aussi par des formules
  (« fini pour aujourd'hui », « done for today », « je m'arrête / on met en pause »). Procédure en
  **prose**, pas du code.
- **Général** : marche dans **n'importe quel projet** où Hyperpowers est installé.

## Non-objectifs (explicitement hors périmètre)

- **Pas de hook automatique** : on l'invoque **au besoin** (l'utilisateur décide). Pas de
  déclenchement sur Stop/SessionEnd.
- **Pas de principe ajouté au `standard.md`** → aucune modif de `standard.md`, branche
  indépendante (depuis `main`, pas d'empilement sur v3).
- **Pas de contenu de mémoire IA riche** : juste un pointeur « lis `HANDOFF.md` » (la mémoire ne
  voyage pas ; le `HANDOFF.md` commité re-sème le contexte au clone).
- **Pas de gestion multi-projets**, pas de chiffrement, pas d'historique versionné des handoffs
  (git fait déjà l'historique de `HANDOFF.md`).

## Architecture

Le **dépôt EST le plugin**. On ajoute un dossier `skills/` (Claude Code auto-découvre
`skills/<nom>/SKILL.md` d'un plugin).

```
skills/session-handoff/SKILL.md   — la procédure (frontmatter name/description + corps en prose)
HANDOFF.md                        — (créé DANS LE PROJET de l'utilisateur, pas dans ce dépôt)
```

### Le skill `session-handoff`

Frontmatter : `name: session-handoff`, `description` orientée déclenchement (« Use when the user
is wrapping up / stopping for the day / pausing a project that may be resumed much later or on
another machine — produces a cold-resume HANDOFF.md »), `user-invocable: true`.

Corps (procédure que Claude suit) :

1. **Auto-dériver les faits génériques** (commandes git uniquement — agnostique au projet) :
   - branche courante (`git branch --show-current`) ;
   - derniers commits (`git log --oneline -n`) ;
   - état non-commité et non-poussé (`git status --short`, `git log @{u}..` si upstream) ;
   - présence de docs de planif (`docs/superpowers/specs|plans`), du `JOURNAL.md`, et du FinalGoal
     (`.hyperpowers/goal.md`) → à citer comme pointeurs.
   - **Ne PAS deviner** la commande de test/build/lancement : inconnue pour un projet quelconque.

2. **Poser les questions de trou** (ce que seul l'utilisateur sait), une à une :
   - ① **Ce qui était prévu ensuite** (l'info #1 pour un futur-toi qui a oublié).
   - ② **Reprendre sur machine neuve** : cloner / installer / lancer / tester **ce** projet.
     **Le plus crucial** ; pré-remplir à partir d'indices (`package.json` scripts, README) mais
     **faire CONFIRMER** — ne jamais inventer (un nouvel utilisateur qui suit des étapes
     fabriquées = le scénario d'échec).
   - ③ **Pièges / gotchas** non-évidents à connaître.
   - ④ **Décisions clés & pourquoi** (pour qu'un nouvel arrivant ne re-débatte pas).

3. **Écrire `HANDOFF.md`** (réécrit intégralement), structure :
   ```
   # Handoff — <projet>
   > Dernière mise à jour : <date>. Lis ce fichier en premier pour reprendre à froid.

   ## Le but (FinalGoal)        — depuis .hyperpowers/goal.md si présent, sinon demandé
   ## Où on en est              — auto (branche, commits, non-commité/non-poussé)
   ## Ce qui était prévu ensuite — demandé ①
   ## Reprendre sur machine neuve — demandé+confirmé ②
   ## Pièges à connaître         — demandé ③
   ## Décisions clés & pourquoi  — demandé ④ / specs
   ## Où trouver le détail       — auto (pointeurs specs/plans/JOURNAL)
   ```

4. **Réduire le bloc reprise de `CLAUDE.md`** (s'il existe) à un pointeur vers `HANDOFF.md` —
   pour supprimer le doublon. Si `CLAUDE.md` n'existe pas, ne rien forcer.

5. **Appondre une entrée au `JOURNAL.md`** (historique de session, via la pratique existante).

6. **Poser un pointeur mémoire IA** : une ligne « pour ce projet, lis `HANDOFF.md` » (pas de
   duplication du contenu).

7. **Committer** `HANDOFF.md` (+ `CLAUDE.md` aminci) — le `JOURNAL.md` reste gitignoré/local.

## Flux de données

```
Invocation (« fini pour aujourd'hui »)
  └─ git (branche/commits/état) ─────────────┐
  └─ pointeurs (specs/plans/JOURNAL/goal) ────┤→ assemble le brouillon
  └─ questions ①②③④ à l'utilisateur ──────────┘
       └─ écrit HANDOFF.md (commité)
       └─ amincit le bloc reprise de CLAUDE.md → pointeur
       └─ append JOURNAL.md (local)
       └─ pointeur mémoire IA
       └─ commit
```

## Gestion d'erreur / cas limites

- **Pas un dépôt git** → sauter l'auto-dérivation git, s'appuyer davantage sur les questions ;
  `HANDOFF.md` reste produit.
- **Pas de `CLAUDE.md`** → ne pas en créer un juste pour le pointeur ; HANDOFF.md se suffit.
- **`HANDOFF.md` déjà présent** → le **réécrire** (c'est l'instantané courant), pas l'appondre.
  L'historique est dans git.
- **Setup machine neuve inconnu / l'utilisateur ne sait pas** → l'écrire explicitement
  (« setup non documenté — à reconstituer ») plutôt qu'inventer des étapes.

## Stratégie de test (honnête)

La substance est une **procédure en prose**, pas du code → **pas de tests-tautologies** (« le
SKILL.md contient tel mot » ne vérifie rien d'utile). Validation :
- **Revue** du `SKILL.md` (clarté, complétude de la procédure, déclenchement correct).
- **Essai à blanc en runtime** : invoquer le skill dans un projet de test et vérifier qu'il produit
  un `HANDOFF.md` cohérent, amincit le bloc CLAUDE.md, et n'invente pas le setup.
- **Au plus** un smoke-test minimal : `skills/session-handoff/SKILL.md` existe et a un frontmatter
  YAML valide avec `name` et `description` (pas d'assertion sur le contenu de la prose).

## Critères de done (vérifiables)

- [ ] `skills/session-handoff/SKILL.md` existe (frontmatter valide `name`/`description`,
      `user-invocable: true`).
- [ ] Plugin réinstallé ; le skill est **découvert** (apparaît dans la liste des skills) et
      **invocable**.
- [ ] Essai runtime : sur un projet de test, l'invocation produit un `HANDOFF.md` couvrant les 7
      sections, amincit le bloc reprise de `CLAUDE.md` en pointeur, et **n'invente pas** le setup
      (le demande/le marque inconnu).
- [ ] **Honnêteté** : le skill aide à reprendre à froid ; il ne garantit pas une reprise
      sans friction si l'utilisateur n'a pas su documenter le setup.
