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

### 6bis. Entrée optionnelle dans CAHIER.md

Si `CAHIER.md` existe à la racine du projet : prepend une ligne de résumé de session avec la
même structure que le skill `hyperpowers:cahier-maitre`. Étape silencieusement sautée si
`CAHIER.md` est absent — `session-handoff` fonctionne sans lui.

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
