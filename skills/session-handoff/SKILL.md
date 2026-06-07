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
Note aussi la **date du jour** : elle remplit l'en-tête « Dernière mise à jour » du `HANDOFF.md`.

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
- **Pas un dépôt git** : saute les étapes 1 et 7 (pas de commit possible), appuie-toi sur les
  questions ; produis quand même `HANDOFF.md` et signale à l'utilisateur de le sauvegarder
  manuellement (son moyen de partage).
- **`HANDOFF.md` déjà présent** : réécris-le (instantané courant) ; l'historique est dans git.
- **Setup inconnu** : marque-le explicitement, n'invente pas.

## Honnêteté
Ce skill aide à reprendre à froid ; il ne garantit pas une reprise sans friction si le setup
n'a pas pu être documenté.
