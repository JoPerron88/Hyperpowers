<div align="center">

# ⚡ Hyperpowers

**Une distribution Claude Code curée — « ma version de superpowers ».**

Hyperpowers ne réécrit pas les bons plugins qui existent déjà : il les **assemble** et ajoute une
couche de **glue cohérente** pour qu'ils se composent mieux. Moins de doublons, des déclenchements
plus clairs, un seul cap : **la qualité du code**.

`Node.js` · `zéro-dépendance` · `16 tests verts` · outil **personnel**

</div>

---

## Sommaire

- [En une phrase](#en-une-phrase)
- [La vision](#la-vision)
- [Ce que Hyperpowers apporte](#ce-que-hyperpowers-apporte)
- [Le Standard — 6 principes](#le-standard--6-principes)
- [Installation](#installation)
- [Utilisation](#utilisation)
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
- **La valeur ajoutée = la composition.** Le Standard, le routage des plans, le FinalGoal et le skill
  `session-handoff` sont la *glue* qui fait jouer ces capacités ensemble — c'est ça qui est original.
- **Architecture « Conductor ».** Une coordination fine au-dessus de l'amont, jamais une réécriture.
- **Étoile polaire : la qualité du code.**

## Ce que Hyperpowers apporte

| Capacité | Ce que c'est | Mécanisme |
|---|---|---|
| **Le Standard** | 6 principes de qualité injectés au SessionStart, chacun pointant vers la skill qui le *réalise* | `standard.md` via `hooks/session-start.mjs` |
| **Routage des plans** | Planifier à la bonne échelle : petite tâche = TDD direct · moyenne = superpowers · grosse/longue = planning-with-files | Principe 5 du Standard |
| **FinalGoal** | Un cap projet persistant (`.hyperpowers/goal.md`) relu aux checkpoints pour contrer la **dérive du but** sur les longs développements. *Dormant* tant qu'aucun cap n'est posé. | Principe 6 + hook |
| **`session-handoff`** | « Fini pour aujourd'hui » → produit un dossier `session-handoff/` commité (`HANDOFF.md` + `OUTILLAGE.md`) pour reprendre **à froid**, sur une autre machine, **même sans les plugins installés** | Skill embarqué |

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
   et le skill `session-handoff` dans la liste des skills.

> ⚠️ Le plugin est **copié dans le cache à l'install** : après toute édition de `standard.md`, d'un
> hook ou d'un skill, il faut **réinstaller + redémarrer** pour que ça prenne effet en runtime.

> 🔭 *À venir (modèle C)* : un marketplace curé qui tirera superpowers + planning-with-files
> automatiquement — « ajouter le marketplace Hyperpowers » suffira.

## Utilisation

- **Le Standard** s'applique tout seul (injecté au SessionStart). Rien à faire.
- **Le FinalGoal** : crée `.hyperpowers/goal.md` à la racine de ton projet avec une phrase de cap
  (ex. « Logiciel de prise de notes assisté par IA »). Il sera injecté et relu aux checkpoints.
  Pas de fichier = fonctionnalité dormante.
- **Le handoff** : quand tu t'arrêtes, dis « fini pour aujourd'hui » (ou invoque `session-handoff`) →
  un dossier `session-handoff/` est créé, commité, lisible à froid plus tard même sur une autre
  machine.

## Architecture

Le **dépôt EST le plugin**. Tout est additif et minimal :

- `standard.md` — le texte injecté (les 6 principes).
- `hooks/session-start.mjs` — émet le Standard (+ le FinalGoal s'il existe) au format JSON
  `hookSpecificOutput.additionalContext` attendu par Claude Code.
- `skills/session-handoff/` — le premier skill embarqué.
- `.claude-plugin/{plugin,marketplace}.json` — manifeste + marketplace.

## Développement

- **Langage** : Node.js (ESM, `node:test`, **zéro dépendance**).
- **Tests** : `npm test` (= `node --test 'tests/**/*.test.mjs'`). **16 verts.**
- **Méthode** : le projet se construit lui-même avec superpowers — `brainstorming` → `writing-plans`
  → `subagent-driven-development`, et les skills sont durcis via `writing-skills` (RED-GREEN-REFACTOR
  avec des subagents). Les specs et plans vivent dans `docs/superpowers/`.

## Structure du dépôt

```
Hyperpowers/
├── standard.md                  # Les 6 principes injectés au SessionStart
├── hooks/session-start.mjs      # Injection (Standard + FinalGoal)
├── skills/session-handoff/      # 1er skill embarqué
├── tests/                       # node:test (16 verts)
├── .claude-plugin/              # plugin.json + marketplace.json
├── docs/superpowers/            # specs + plans (cycle brainstorm→plan)
├── session-handoff/             # handoff de reprise (HANDOFF.md + OUTILLAGE.md)
└── spike/                       # recherche close (spike mémoire → verdict rouge)
```

## Statut & feuille de route

- ✅ **v1** — noyau comportemental (Standard injecté).
- ✅ **v2** — routage des plans (principe 5).
- ✅ **v3** — FinalGoal (principe 6 + hook).
- ✅ **v4** — skill `session-handoff` (durci via `writing-skills`).
- ⏳ **Gate runtime** (v2/v3/v4) — injection à re-constater après réinstall.
- 🔭 **v5** — implémenter le modèle C (marketplace curé).
- 💡 **Idées** — un skill d'idéation avancé `brainstorming-advanced`, une « bible de projet », un
  « cahier maître » (à cadrer par brainstorming).

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
