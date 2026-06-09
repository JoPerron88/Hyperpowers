<div align="center">

# ⚡ Hyperpowers

**Une distribution Claude Code curée — « ma version de superpowers ».**

Hyperpowers ne réécrit pas les bons plugins qui existent déjà : il les **assemble** et ajoute une
couche de **glue cohérente** pour qu'ils se composent mieux. Moins de doublons, des déclenchements
plus clairs, un seul cap : **la qualité du code**.

`Node.js` · `zéro-dépendance` · `62 tests verts` · outil **personnel**

</div>

---

## Sommaire

- [En une phrase](#en-une-phrase)
- [La vision](#la-vision)
- [Ce que Hyperpowers apporte](#ce-que-hyperpowers-apporte)
- [Le Standard — 6 principes](#le-standard--6-principes)
- [Installation](#installation)
- [Les skills — quand et comment les utiliser](#les-skills--quand-et-comment-les-utiliser)
- [La symbiose avec superpowers & planning-with-files](#la-symbiose-avec-superpowers--planning-with-files)
- [Utiliser sur d'autres plateformes](#utiliser-sur-dautres-plateformes)
- [Architecture](#architecture)
- [Développement](#développement)
- [Structure du dépôt](#structure-du-dépôt)
- [Statut & feuille de route](#statut--feuille-de-route)
- [Crédits & remerciements](#crédits--remerciements)

---

## En une phrase

> **Hyperpowers fusionne plusieurs skills/plugins Claude Code en un ensemble cohérent pour
> améliorer leur symbiose** — c.-à-d. faire en sorte que des capacités jusque-là séparées se
> composent mieux (réutilisation de contexte, déclenchements croisés, évitement des doublons).

Concrètement, le dépôt **EST** un plugin Claude Code : au démarrage de chaque session, il injecte
un **Standard de qualité** qui *pointe vers* les skills de process de [superpowers](#superpowers) et
de [planning-with-files](#planning-with-files), au lieu de re-sermonner en parallèle. Une seule voix.

## La vision

Hyperpowers suit le modèle d'une **distribution curée** (« distro »), pas d'un fork :

- **Non-fork.** Les plugins amont ([superpowers](#superpowers), [planning-with-files](#planning-with-files))
  restent à leur source et continuent de s'améliorer tout seuls. Hyperpowers les **référence**.
- **La valeur ajoutée = la composition.** Le Standard, le routage des plans, le FinalGoal et les
  skills embarqués sont la *glue* qui fait jouer ces capacités ensemble — c'est ça qui est original.
- **Architecture « Conductor ».** Une coordination fine au-dessus de l'amont, jamais une réécriture.
- **Étoile polaire : la qualité du code.**

## Ce que Hyperpowers apporte

| Capacité | Ce que c'est | Mécanisme |
|---|---|---|
| **Le Standard** | 6 principes de qualité injectés au SessionStart, chacun pointant vers la skill qui le *réalise* | `standard.md` via `hooks/session-start.mjs` |
| **Routage des plans** | Planifier à la bonne échelle : petite tâche = TDD direct · moyenne = superpowers · grosse/longue = planning-with-files | Principe 5 du Standard |
| **FinalGoal** | Un cap projet persistant (`.hyperpowers/goal.md`) relu aux checkpoints pour contrer la **dérive du but** sur les longs développements. *Dormant* tant qu'aucun cap n'est posé. | Principe 6 + hook |
| **7 skills embarqués** | Conception, cycle de vie projet, maintenance — voir [la section dédiée](#les-skills--quand-et-comment-les-utiliser) | `skills/` |
| **Filet de cohérence** | Garantit que la glue ne se dégrade pas : aucune référence morte entre skills, frontières disjointes explicites | Tests + `skills/disjoint-pairs.json` |

## Le Standard — 6 principes

Le cœur comportemental, injecté à chaque SessionStart. Chaque principe est le **QUOI** ; il délègue
le **COMMENT** à une skill superpowers (une seule voix, pas de doublon) :

1. **Réfléchir avant de coder** → `superpowers:brainstorming`
2. **Simplicité d'abord (YAGNI)** → tenu par `superpowers:test-driven-development`
3. **Changements chirurgicaux** → `superpowers:subagent-driven-development` / `executing-plans`
4. **Piloté par objectif** → TDD (rouge→vert) puis `verification-before-completion`
5. **Planifier à la bonne échelle** → routage TDD / superpowers / planning-with-files
6. **Garder le cap (le FinalGoal)** → relire `.hyperpowers/goal.md` aux checkpoints

## Installation

Hyperpowers dépend de deux plugins amont. Sur une machine fraîche :

1. **superpowers** (process) — marketplace officiel, puis `/plugin install superpowers@claude-plugins-official`
2. **planning-with-files** (suivi des grosses tâches) — depuis [github.com/OthmanAdi/planning-with-files](https://github.com/OthmanAdi/planning-with-files)
3. **Hyperpowers** :
   ```
   /plugin marketplace add JoPerron88/Hyperpowers   # ou un chemin local vers le clone
   /plugin install hyperpowers@hyperpowers
   ```
   Puis **redémarrer** Claude Code : les 6 principes du Standard doivent apparaître au SessionStart,
   et les skills dans la liste.

Une fois installé, le skill **`check-dependencies`** vérifie à tout moment que superpowers et
planning-with-files sont bien présents et donne les commandes d'installation manquantes.

> ⚠️ Le plugin est **copié dans le cache à l'install** : après toute édition de `standard.md`, d'un
> hook ou d'un skill, il faut **réinstaller + redémarrer** pour que ça prenne effet en runtime.

> ℹ️ Le `marketplace.json` reste **minimal** (une seule entrée `hyperpowers`). Le runtime Claude Code
> ne résout pas les dépendances entre plugins automatiquement — la distro curée passe par les skills
> et le Standard, pas par le registre. C'est un choix tranché, pas un manque.

## Les skills — quand et comment les utiliser

Tous les skills se déclenchent de deux façons : **automatiquement** quand leur description (« Use
when… ») correspond à ton intention, ou **manuellement** quand tu prononces une phrase déclencheuse
(ou tapes le slash command pour ceux qui l'exposent). Tu n'as jamais à mémoriser une syntaxe : décris
ce que tu veux, le bon skill s'active.

### 🧠 Concevoir & décider

#### `brainstorming-advanced`
> **Quand** : une décision a de **vraies tensions** qu'une seule perspective ne tranche pas —
> approches concurrentes toutes deux valables, enjeux d'architecture/produit, ou besoin de
> *pressure-tester* un design.
> **Comment** : « lançons un brainstorming-advanced sur… » (ou `/hyperpowers:brainstorming-advanced`).
> **Ce qu'il fait** : déclenche un **débat multi-agents** structuré — des entités indépendantes
> (Enthousiaste, Sage, Intégrateur, Estimateur, Sécuritaire, Utilisateur Final) débattent par tours,
> puis 2-4 options sont présentées avec une recommandation.
> **Distinct de** `superpowers:brainstorming` (le défaut, exploration simple) : ce skill est réservé
> aux sujets où des perspectives divergentes existent *même à information complète*. **Jamais lancé
> sans ton accord explicite.**

#### `conseil`
> **Quand** : tu veux **évaluer, réviser, ou prendre du recul long-terme** sur un projet ou une
> décision **qui existe déjà** — pas explorer des options (ça, c'est brainstorming).
> **Comment** : « revois mon projet », « analyse mon architecture », « est-ce que ça tient »,
> « consulte la firm ».
> **Ce qu'il fait** : une mini **firm de conseil** (Stratège / Guide / Relecteur) lit l'existant et
> rend un avis structuré — Verdict / Signal / Contrainte / Racine. Les livrables vont dans
> `firm/sessions/` + `firm/index.md`.
> **Symbiose** : `conseil` **lit ce qui existe**, `brainstorming-advanced` **explore les possibles**
> — frontière déclarée et vérifiée par le filet de cohérence.

### 🚀 Cycle de vie du projet

#### `newproject`
> **Quand** : tu démarres un **projet neuf à partir de zéro** — avant tout code ou structure de
> dossiers. (Pas pour un projet déjà en cours.)
> **Comment** : `/NewProject [description]`.
> **Ce qu'il fait** : amorce le projet en 5 phases (idée → choix techniques → scope/structure/risques
> → artefacts → suite), et produit 3 artefacts : `CLAUDE.md`, `.hyperpowers/goal.md` (le FinalGoal) et
> un `git init`.
> **Symbiose** : invoque `superpowers:brainstorming` en phase 2 (si pesée d'options nécessaire) et
> oriente vers `superpowers:writing-plans` pour la suite.

#### `session-handoff`
> **Quand** : tu **arrêtes le travail** — « fini pour aujourd'hui », « on met en pause », surtout si
> le projet sera repris bien plus tard, sur une autre machine, ou par quelqu'un sans les plugins.
> **Comment** : « fini pour aujourd'hui » (ou `/hyperpowers:session-handoff`).
> **Ce qu'il fait** : produit un dossier **`session-handoff/` commité** (`HANDOFF.md` + `OUTILLAGE.md`)
> qui permet de reprendre **à froid** — état, prochaine étape, outillage à installer — **même sans les
> plugins installés**. C'est la seule chose qui voyage au `git clone`.

#### `cahier-maitre`
> **Quand** : tu veux **consigner un événement, une décision ou un progrès** dans le journal maître du
> projet.
> **Comment** : « note dans le cahier », « ajoute une entrée au cahier ».
> **Ce qu'il fait** : prepend une entrée datée et signée (via `git config user.name`) en tête de
> `CAHIER.md`. C'est l'**historique** suivi par un humain.
> **Symbiose** : `session-handoff` y ajoute optionnellement une ligne de résumé de session si le
> `CAHIER.md` existe.

#### `project-reference`
> **Quand** : tu veux **générer ou rafraîchir un document de référence exhaustif** du projet.
> **Comment** : « génère la référence projet », « documente le projet ».
> **Ce qu'il fait** : produit `docs/project-reference.md` en 6 sections (pourquoi · décisions
> non-évidentes · structure · contraintes/invariants · flux de travail · zones actives/fragiles) —
> le document **durable** qui survit aux sessions.

### 🔧 Maintenance

#### `check-dependencies`
> **Quand** : vérifier que les plugins requis par Hyperpowers (superpowers, planning-with-files) sont
> installés, ou diagnostiquer pourquoi une délégation échoue.
> **Comment** : « vérifie les dépendances » (ou `/hyperpowers:check-dependencies`).
> **Ce qu'il fait** : lit `~/.claude/plugins/installed_plugins.json`, affiche un tableau d'état
> (installé / manquant + version) et donne les commandes d'installation manquantes.

## La symbiose avec superpowers & planning-with-files

C'est le **cœur du projet** : Hyperpowers ne duplique pas l'amont, il le **fait jouer ensemble**.
Quatre mécanismes concrets de composition :

**1. Le Standard délègue, il ne re-sermonne pas.** Chaque principe injecté au SessionStart nomme la
skill amont qui le réalise (principe 1 → `superpowers:brainstorming`, principe 2 → `…:test-driven-development`,
etc.). Une seule voix : Claude ne reçoit pas deux fois la même consigne sous deux formulations.

**2. Le routage des plans (principe 5) répartit selon l'échelle.** Petite tâche → TDD direct ·
tâche moyenne (mono-session) → `superpowers:writing-plans` + `executing-plans` · grosse tâche qui
franchit des sessions et accumule des découvertes → **planning-with-files** (`task_plan.md` /
`findings.md` / `progress.md`, reprise après `/clear`). Le discriminant n'est pas un seuil de tool
calls mais : « la tâche franchit-elle une compaction et des découvertes vont-elles s'accumuler ? »

**3. Les skills embarqués s'enchaînent avec ceux de l'amont.** Exemples vécus de chaînes :
- `newproject` → `superpowers:brainstorming` → `superpowers:writing-plans`
- `brainstorming-advanced` → `superpowers:writing-skills` (si le livrable est un skill) → `superpowers:writing-plans` → `superpowers:subagent-driven-development`
- Le **contexte voyage** via l'artefact partagé (la spec de design écrite par le débat est relue par
  `writing-plans` — pas de re-dérivation).

**4. Un filet de test garantit que la glue ne se dégrade pas.** Deux invariants vérifiés à chaque
`npm test` :
- **Pointeurs morts** — toute référence `superpowers:X` ou `hyperpowers:Y` dans un skill doit
  pointer vers un skill réellement installé. Renomme une skill amont, le test rougit.
- **Anti-chevauchement** — les paires de skills déclarées disjointes (`skills/disjoint-pairs.json`,
  ex. `conseil` vs `brainstorming-advanced`) doivent garder une frontière explicite dans leur
  description, pour éviter les déclenchements ambigus.

> 💡 **Note de conception.** La symbiose comportementale (passer un artefact, refuser de re-litiger
> une décision close) **émerge déjà** de Claude + des skills existants — vérifié empiriquement par
> des *baselines* avec subagents. Hyperpowers ne **décrète** donc pas un orchestrateur central (qui
> serait une « fausse autorité », puisqu'il ne contrôle pas le déclenchement des skills) : il
> **protège** une symbiose déjà vivante via le filet de test. Déclaratif + testé, pas impératif.

## Utiliser sur d'autres plateformes

Hyperpowers supporte 4 plateformes via des extensions natives (approche recommandée) et un
script de copie de fichiers comme fallback.

### Installation native

| Plateforme | Commande |
|---|---|
| **Gemini CLI** | `gemini extensions install /chemin/vers/hyperpowers` |
| **OpenCode** | Ajouter `{ "plugin": ["/chemin/vers/hyperpowers"] }` dans `~/.config/opencode/opencode.json` |
| **Codex CLI** | Via le gestionnaire de plugins Codex (path local) |
| **Cursor** | `/add-plugin /chemin/vers/hyperpowers` |

Fichiers natifs inclus dans le dépôt : `gemini-extension.json`, `.opencode/plugins/hyperpowers.js`,
`.codex-plugin/plugin.json`, `.cursor-plugin/plugin.json`.

OpenCode utilise une injection via `experimental.chat.messages.transform` — le standard est
injecté dans le premier message de chaque session, comme dans superpowers.

### Fallback (copie de fichiers)

```bash
npm run build:agents      # régénère AGENTS.md si nécessaire
npm run install-configs   # copie GEMINI.md → ~/.gemini/, AGENTS.md → ~/.codex/, etc.
```

**Limitation :** le hook dynamique FinalGoal (`.hyperpowers/goal.md`) est Claude Code-only.

**Mappings d'outils** (Claude Code → plateforme cible) : `references/gemini-tools.md`,
`references/codex-tools.md`.

## Architecture

Le **dépôt EST le plugin**. Tout est additif et minimal :

- `standard.md` — le texte injecté (les 6 principes).
- `hooks/session-start.mjs` — émet le Standard (+ le FinalGoal s'il existe) au format JSON
  `hookSpecificOutput.additionalContext` attendu par Claude Code.
- `skills/` — les 7 skills embarqués + `disjoint-pairs.json` (frontières déclarées).
- `.claude-plugin/{plugin,marketplace}.json` — manifeste + marketplace.

## Développement

- **Langage** : Node.js (ESM, `node:test`, **zéro dépendance**).
- **Tests** : `npm test` (= `node --test 'tests/**/*.test.mjs'`). **62 verts.**
- **Méthode** : le projet se construit lui-même avec superpowers — `brainstorming` → `writing-plans`
  → `subagent-driven-development`, et les skills sont durcis via `writing-skills` (RED-GREEN-REFACTOR
  avec des subagents). Les specs et plans vivent dans `docs/superpowers/`.

## Structure du dépôt

```
Hyperpowers/
├── standard.md                  # Les 6 principes injectés au SessionStart
├── GEMINI.md                    # Point d'entrée Gemini CLI (@-includes)
├── AGENTS.md                    # Contenu embarqué pour Codex (généré)
├── gemini-extension.json        # Extension native Gemini CLI
├── hooks/session-start.mjs      # Injection Claude Code (Standard + FinalGoal)
├── skills/                      # 7 skills + disjoint-pairs.json (frontières déclarées)
│   ├── brainstorming-advanced/  #   débat multi-agents
│   ├── conseil/                 #   firm d'analyse de l'existant
│   ├── newproject/              #   amorçage projet
│   ├── session-handoff/         #   reprise à froid
│   ├── cahier-maitre/           #   journal d'événements
│   ├── project-reference/       #   doc de référence durable
│   └── check-dependencies/      #   diagnostic des dépendances
├── .claude-plugin/              # plugin.json + marketplace.json (Claude Code)
├── .opencode/plugins/           # Plugin natif OpenCode (injection message transform)
├── .codex-plugin/               # Plugin natif Codex
├── .cursor-plugin/              # Plugin natif Cursor
├── references/                  # Mappings d'outils par plateforme
├── scripts/                     # build-agents.mjs · install.mjs
├── tests/                       # node:test (62 verts)
├── docs/superpowers/            # specs + plans (cycle brainstorm→plan)
├── firm/                        # consultations conseil (sessions/ + index.md)
├── session-handoff/             # handoff de reprise (HANDOFF.md + OUTILLAGE.md)
└── spike/                       # recherche close (spike mémoire → verdict rouge)
```

## Statut & feuille de route

- ✅ **v1** — noyau comportemental (Standard injecté).
- ✅ **v2** — routage des plans (principe 5).
- ✅ **v3** — FinalGoal (principe 6 + hook).
- ✅ **v4** — skill `session-handoff` (durci via `writing-skills`).
- ✅ **Skills de conception** — `brainstorming-advanced` v2 (débat multi-agents, méta-routage, 6 entités), `conseil` v2 (firm d'analyse).
- ✅ **Skills de cycle de vie** — `newproject`, `cahier-maitre`, `project-reference`.
- ✅ **Multi-plateforme** — extensions natives Gemini CLI, OpenCode, Codex, Cursor + `install.mjs` fallback.
- ✅ **v5 — Fondations Symbiose** — `check-dependencies`, notes de prérequis dans les skills qui délèguent à superpowers.
- ✅ **Glue inter-skills v1** — filet de test de cohérence (pointeurs morts + anti-chevauchement). La symbiose, déjà vivante, est désormais protégée contre la régression.
- 🔭 **Suite** — étendre les frontières déclarées au fil de l'eau ; durcir une arête de composition seulement si un *baseline* prouve qu'elle ne s'effectue pas déjà d'elle-même.

> Pour l'état détaillé et la reprise, voir le dossier [`session-handoff/`](session-handoff/).

## Crédits & remerciements

Hyperpowers **tient debout sur les épaules** de plugins remarquables. Toute la valeur de process et
de fond vient d'eux ; Hyperpowers ne fait que les **composer**. Merci sincère à leurs auteurs 🙏

<a name="superpowers"></a>
- **[superpowers](https://github.com/obra/superpowers)** — par **Jesse Vincent** ([@obra](https://github.com/obra)).
  La bibliothèque de skills de process (TDD, débogage, brainstorming, plans, revue, écriture de
  skills…) qui fournit **le COMMENT** vers lequel pointe tout le Standard d'Hyperpowers. C'est la
  fondation du projet.

- **andrej-karpathy-skills** — par **[forrestchang](https://github.com/forrestchang)**, *dérivé des
  observations d'**Andrej Karpathy*** sur les erreurs fréquentes des LLM en code. Ses 4 garde-fous
  (penser avant · simplicité · chirurgical · piloté par objectif) sont la **base directe** des
  principes 1-4 du Standard ; Hyperpowers les a recadrés en une seule voix.

<a name="planning-with-files"></a>
- **[planning-with-files](https://github.com/OthmanAdi/planning-with-files)** — par **Ahmad Othman
  Ammar Adi** ([@OthmanAdi](https://github.com/OthmanAdi)), inspiré du *context engineering* de
  **Manus**. Le plan vivant (`task_plan` / `findings` / `progress`, reprise après `/clear`) qui porte
  le tier « grosse tâche » du routage et l'idée de **récitation** reprise dans le Standard.

Et bien sûr **[Claude Code](https://claude.com/claude-code)** & Anthropic, sans qui rien de tout ça.

---

<div align="center">
<sub>Projet personnel de <b>Jonathan Perron</b> · construit avec Claude Code.</sub>
</div>
