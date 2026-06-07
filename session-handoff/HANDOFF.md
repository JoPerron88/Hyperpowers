# Handoff — Hyperpowers
> Dernière mise à jour : 2026-06-07. Reprise à froid : si tu n'as pas l'outillage de ce projet,
> lis d'abord `OUTILLAGE.md` (à côté), puis ce fichier.

## Le but (FinalGoal)
Hyperpowers = un **plugin Claude Code qui fusionne plusieurs skills/plugins existants en un
ensemble cohérent** pour améliorer leur symbiose. La vision de l'auteur : « ma version de
superpowers » — une **distro curée** (modèle C) qui assemble superpowers + planning-with-files
(non-forkés) + une **couche de glue** propre : le Standard de qualité, le routage des plans, le
FinalGoal, le skill `session-handoff`. Étoile polaire = **qualité du code**. Outil **personnel**
(non commercial).

## Où on en est
- Branche : **`main`** (branche unique), **arbre propre**, à jour avec `origin` (dernier commit :
  `git log -1`). **Tout est commité ET poussé** sur `origin` (github.com/JoPerron88/Hyperpowers)
  **ET** présent dans ce dossier (copier-coller → rien ne se perd). ✅ surface de perte nulle.
- Inclus le **README détaillé** (avec crédits aux dépôts d'origine) et la **feuille de route**
  ci-dessous.
- **v1→v4 livrées et mergées sur `main`** (`--no-ff`, **16 tests verts**) :
  - **v1** — noyau comportemental : `standard.md` injecté au SessionStart (`hooks/session-start.mjs`),
    4 garde-fous karpathy recadrés en pointeurs vers superpowers.
  - **v2** — routage des plans (**principe 5** de `standard.md`) : petite=TDD / moyenne=superpowers /
    grosse=planning-with-files ; arbitrage du « 5+ tool calls » de pwf.
  - **v3** — FinalGoal (**principe 6** + hook étendu) : cap projet dans `<projet>/.hyperpowers/goal.md`,
    dormant par défaut, injecté si présent, relu aux checkpoints (anti-dérive du but).
  - **v4** — skill **`session-handoff`** (`skills/session-handoff/SKILL.md`) : c'est lui qui a
    produit ce dossier.

## Ce qui était prévu ensuite
1. **Gate runtime (v2/v3/v4) — PAS encore faite.** Réinstaller le plugin + redémarrer, puis
   constater en session fraîche : les **6 principes** du standard injectés ; le **FinalGoal**
   (dormant sans `.hyperpowers/goal.md`, injecté avec) ; le skill **`session-handoff`** présent dans
   la liste des skills. C'est la seule chose qui permettra d'écrire « vérifié runtime » dans
   `CLAUDE.md`.
2. **v5 = implémenter le modèle C** (distro curée). Faire du `.claude-plugin/marketplace.json` un
   marketplace qui référence **superpowers** (`source: url|git-subdir` → github.com/obra/superpowers) +
   **planning-with-files** (`source: url` → github.com/OthmanAdi/planning-with-files) +
   **hyperpowers** (`./`). Faisabilité confirmée (le marketplace officiel utilise déjà ces sources).
3. **Nouveaux skills / artefacts à concevoir** (idées de l'auteur — **périmètre non cadré, passer
   par `superpowers:brainstorming` avant de coder**) :
   - **`brainstorming-advanced`** — un 2ᵉ skill d'idéation, plus avancé que `superpowers:brainstorming`.
   - **« bible de projet »** — document/skill de référence durable du projet (à définir).
   - **« cahier maître »** — journal/registre maître transverse (à définir).

## Reprendre sur une machine neuve (le projet)
- **Méthode prévue : copier-coller du dossier complet** → tu obtiens `.git` (historique),
  `.claude/JOURNAL.md` (journal privé, gitignoré mais physiquement présent), tout le code.
  *(Alternative : `git clone https://github.com/JoPerron88/Hyperpowers.git` → identique, sauf le
  JOURNAL qui ne suit pas.)*
- **Node ≥ v22** (testé v26.2.0). Tests : `npm test` (zéro dépendance à installer) → doit afficher
  **16 verts**.
- Outillage Claude Code à installer sur la nouvelle machine : **voir `OUTILLAGE.md`**.
- Ce qui NE voyage PAS, même en copier-coller : la **mémoire privée de Claude**
  (`~/.claude/projects/...`, hors dossier). Ce `HANDOFF.md` + `CLAUDE.md` + `docs/` re-sèment le
  contexte.

## Pièges à connaître
- **Plugin copié dans le cache à l'install** : toute édition de `standard.md` / hook / skill n'a
  **aucun effet runtime** tant que le plugin n'est pas **réinstallé + redémarré**. (C'est pour ça
  que la gate runtime reste à faire.)
- **Runtime de v2/v3/v4 non vérifié** : tests unitaires + comportementaux verts, mais l'injection
  réelle pas constatée. Ne pas affirmer « vérifié runtime » avant.
- Tests **scopés à `tests/`** (le dépôt a aussi des `*.test.mjs` dans `spike/` à ne pas lancer).
- `.claude/` est **gitignoré** (journal privé) — ne pas le committer.

## Décisions clés & pourquoi
- **Modèle C (distro curée, non-fork)** — tranché 2026-06-07. Ne pas forker superpowers/pwf
  (activement maintenus → re-merge à vie, intenable) ; les **référencer** + ajouter la glue.
  Écartés : A (couche à côté), B (fork dedans).
- **Spike mémoire = 🔴 ROUGE** : « se souvenir améliore le code » **non soutenue par CE test**
  (0/12 pièges). Boucle mémoire écartée. ⚠️ PAS « la mémoire nuit ». Ne pas rejouer pour chercher
  le vert (biais de confirmation déjà fermé).
- **FinalGoal = advisory** : réduit la dérive du but, ne la garantit pas à zéro.
- karpathy **absorbé** (→ `standard.md`) puis désinstallé ; superpowers + pwf **non-forkés**.

## Où trouver le détail
- Specs/plans (v1→v4) : `docs/superpowers/specs` et `docs/superpowers/plans`.
- Analyses de conception : `docs/analyse-*.md`.
- Spike (clos) : `spike/RESULTS.md`, `spike/roles-scorecard.md`.
- Journal détaillé (privé, voyage en copier-coller) : `.claude/JOURNAL.md`.
- Guidance projet stable : `CLAUDE.md`.
