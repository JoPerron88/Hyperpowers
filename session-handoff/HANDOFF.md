# Handoff — Hyperpowers
> Dernière mise à jour : 2026-06-07 (fin de soirée). Reprise à froid : si tu n'as pas l'outillage de ce projet,
> lis d'abord `OUTILLAGE.md` (à côté), puis ce fichier.

## Le but (FinalGoal)
Hyperpowers = un **plugin Claude Code qui fusionne plusieurs skills/plugins existants en un
ensemble cohérent** pour améliorer leur symbiose. La vision de l'auteur : « ma version de
superpowers » — une **distro curée** (modèle C) qui assemble superpowers + planning-with-files
(non-forkés) + une **couche de glue** propre : le Standard de qualité, le routage des plans, le
FinalGoal, le skill `session-handoff`. Étoile polaire = **qualité du code**. Outil **personnel**
(non commercial).

## Où on en est
- Branche : **`main`** (branche unique), **arbre propre**, tout poussé sur GitHub.
- **41 tests verts** (42 au total — 1 rouge pré-existant toléré : `planning-with-files` non
  installé sur cette machine).
- **v1→v4 livrées** + skills et features post-v4 livrés :
  - **`brainstorming-advanced`** ✅ v2 — méta-routage pool léger (2-3 entités du catalogue,
    3 tours max) / pool dynamique (sélection libre, convergence, 10 tours max). Catalogue de
    6 entités nommées (Enthousiaste, Sage, Utilisateur Final, Estimateur, Sécuritaire,
    Intégrateur). Test d'éligibilité en 3 questions. Durci via cycle `writing-skills`
    (RED-GREEN-REFACTOR — 3 loopholes identifiés et fermés).
  - **`newproject`** ✅ — skill d'amorçage projet en 5 phases (Verbalisation → Tech →
    Scope/Risques → 3 artefacts → Roadmap).
  - **`install.mjs`** ✅ — `npm run install-configs` copie les configs dans `~/` (fallback
    multi-plateforme).
  - **Extensions natives multi-plateforme** ✅ — même approche que superpowers :
    - `gemini-extension.json` → `gemini extensions install .`
    - `.opencode/plugins/hyperpowers.js` → injection `standard.md` via message transform
    - `.codex-plugin/plugin.json` → plugin natif Codex
    - `.cursor-plugin/plugin.json` → plugin natif Cursor
    - `references/gemini-tools.md` + `references/codex-tools.md` → mappings d'outils

## Ce qui était prévu ensuite
**Skills à concevoir** (périmètre non cadré — passer par brainstorming avant) :
- **« bible de projet »** — document de référence durable d'un projet (à définir).
- **« cahier maître »** — journal/registre maître transverse (à définir).

**Gate runtime** — vérifier que l'injection v2/v3/v4 fonctionne en runtime après réinstall
du plugin sur une machine fraîche (à faire une fois avec Claude Code ouvert).

**v5 — marketplace curé** — `marketplace.json` qui tire superpowers + planning-with-files
automatiquement (modèle C complet). Pas encore implémenté.

## Reprendre sur une machine neuve (le projet)
- `git clone https://github.com/JoPerron88/Hyperpowers.git`
- **Node ≥ v22**. Tests : `npm test` → doit afficher **36 verts** (37 total, 1 rouge toléré).
- `npm run build:agents` pour régénérer `AGENTS.md` si besoin.
- Outillage Claude Code à installer : **voir `OUTILLAGE.md`**.
- Ce qui NE voyage PAS au clone : la mémoire privée de Claude (`~/.claude/projects/...`).
  `HANDOFF.md` + `CLAUDE.md` + `docs/` re-sèment le contexte.

## Pièges à connaître
- **Plugin copié dans le cache à l'install** : toute édition de `standard.md` / hook / skill n'a
  **aucun effet runtime** tant que le plugin n'est pas **réinstallé + redémarré**.
- **Double injection (réglée)** : l'entrée manuelle dans `~/.claude/settings.json` a été retirée
  le 2026-06-07 — le plugin seul enregistre le hook désormais.
- Tests **scopés à `tests/`** (le dépôt a aussi des `*.test.mjs` dans `spike/` à ne pas lancer).
- `.claude/` est **gitignoré** (journal privé) — ne pas le committer.
- **`AGENTS.md` à régénérer** après toute modif de `standard.md` ou des skills :
  `npm run build:agents`.
- **Extensions natives vs install.mjs** : les deux coexistent. `install.mjs` copie des fichiers
  dans `~/` (fallback). Les dossiers `.opencode/`, `.codex-plugin/`, `.cursor-plugin/` et
  `gemini-extension.json` permettent l'installation via les gestionnaires natifs de chaque
  plateforme.

## Décisions clés & pourquoi
- **Modèle C (distro curée, non-fork)** — tranché 2026-06-07.
- **Spike mémoire = 🔴 ROUGE** : boucle mémoire écartée. PAS « la mémoire nuit » — ne pas rejouer.
- **FinalGoal = advisory** : réduit la dérive du but, ne la garantit pas à zéro.
- **NewProject = skill autonome** (non couplé à brainstorming-advanced) — option 2, skill standard.
- **Multi-plateforme = extensions natives** (même approche que superpowers) + `install.mjs`
  comme fallback. Décidé 2026-06-07 après analyse du repo superpowers.
- **OpenCode = injection message transform** (pas `instructions` array) — même pattern que
  superpowers.js, injecte `standard.md` dans le premier message utilisateur.

## Où trouver le détail
- Specs/plans : `docs/superpowers/specs/` et `docs/superpowers/plans/`.
- Skills livrés : `skills/brainstorming-advanced/`, `skills/newproject/`, `skills/session-handoff/`.
- Extensions natives : `gemini-extension.json`, `.opencode/`, `.codex-plugin/`, `.cursor-plugin/`.
- Références multi-plateforme : `references/`.
- Journal détaillé (privé, gitignoré) : `.claude/JOURNAL.md`.
- Guidance projet stable : `CLAUDE.md`.
