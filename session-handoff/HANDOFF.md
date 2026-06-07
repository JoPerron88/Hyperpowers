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
- Branche : **`main`** (branche unique), **arbre propre**.
- **⚠️ 3 commits NON POUSSÉS** vers `origin` (github.com/JoPerron88/Hyperpowers) :
  - `c0c934c` feat: support multi-plateforme — Gemini CLI, OpenCode, Codex, Mistral Vibe
  - `51f9f99` refine: newproject — corrections writing-skills (CSO, erreurs courantes, Tour 2)
  - `c971b2e` feat: ajouter hyperpowers:newproject — skill d'amorçage de projet en 5 phases
  → Pousser avec `git push` pour sécuriser avant reprise sur une autre machine.
- **27 tests verts** (28 au total — 1 rouge pré-existant toléré : `planning-with-files` non
  installé sur cette machine).
- **v1→v4 livrées** + skills post-v4 livrés cette session :
  - **`brainstorming-advanced`** ✅ livré — débat multi-agents (Enthousiaste + Sage + Modérateur
    via vrais sous-agents `Agent`), 2 modes experts, clôture avec recommandation.
  - **`newproject`** ✅ livré — skill d'amorçage projet en 5 phases (Verbalisation → Tech →
    Scope/Risques → 3 artefacts → Roadmap). Corrigé via writing-skills (CSO, Erreurs courantes,
    Tour 2 du débat). Tests comportementaux Iron Law effectués.
  - **Support multi-plateforme** ✅ livré (statiquement) — `GEMINI.md` (@-include), `opencode.json`
    (instructions array), `scripts/build-agents.mjs` + `AGENTS.md` (contenu embarqué pour Codex +
    Mistral Vibe). Ces fichiers servent le repo Hyperpowers lui-même.

## Ce qui était prévu ensuite
**À faire en début de prochaine session :**

1. **A — Configs globales** ← **PROCHAIN CHANTIER** (décidé fin de session 2026-06-07)
   - Écrire `scripts/install.mjs` : détecte les plateformes IA installées sur la machine
     (`~/.gemini/`, config OpenCode, etc.) et copie/lie les fichiers d'entrée vers leurs
     emplacements globaux.
   - Brainstormer d'abord avec `superpowers:brainstorming` pour cadrer :
     - Emplacements globaux exacts pour chaque plateforme (à vérifier — ne pas inventer)
     - Comportement si plateforme absente (skip silencieux vs. warning)
     - Mise à jour : est-ce que `npm run build:agents` doit aussi relancer l'install ?
   - **Lacune actuelle** : les fichiers `GEMINI.md` / `opencode.json` / `AGENTS.md` sont dans le
     repo Hyperpowers mais pas dans les configs globales des plateformes → les autres plateformes
     ne voient rien dans les projets utilisateur.

2. **Skills à concevoir** (périmètre non cadré — passer par brainstorming avant) :
   - **« bible de projet »** — document de référence durable d'un projet (à définir).
   - **« cahier maître »** — journal/registre maître transverse (à définir).

## Reprendre sur une machine neuve (le projet)
- `git clone https://github.com/JoPerron88/Hyperpowers.git` *(après avoir poussé les 3 commits)*
- **Node ≥ v22** (testé v26.2.0). Tests : `npm test` → doit afficher **27 verts** (28 total,
  1 rouge toléré si planning-with-files absent).
- `npm run build:agents` pour régénérer `AGENTS.md` si besoin.
- Outillage Claude Code à installer sur la nouvelle machine : **voir `OUTILLAGE.md`**.
- Ce qui NE voyage PAS au clone : la mémoire privée de Claude (`~/.claude/projects/...`).
  `HANDOFF.md` + `CLAUDE.md` + `docs/` re-sèment le contexte.

## Pièges à connaître
- **Plugin copié dans le cache à l'install** : toute édition de `standard.md` / hook / skill n'a
  **aucun effet runtime** tant que le plugin n'est pas **réinstallé + redémarré**.
- **Double injection (réglée)** : l'entrée manuelle dans `~/.claude/settings.json` a été retirée
  le 2026-06-07 — le plugin seul enregistre le hook désormais.
- Tests **scopés à `tests/`** (le dépôt a aussi des `*.test.mjs` dans `spike/` à ne pas lancer).
- `.claude/` est **gitignoré** (journal privé) — ne pas le committer.
- **Multi-plateforme = statique seulement** : `GEMINI.md` / `opencode.json` / `AGENTS.md` sont
  dans le repo mais pas installés globalement. Le prochain chantier (configs globales) comble ça.
- **`AGENTS.md` à régénérer** après toute modif de `standard.md` ou des skills :
  `npm run build:agents`.

## Décisions clés & pourquoi
- **Modèle C (distro curée, non-fork)** — tranché 2026-06-07. Ne pas forker superpowers/pwf
  (activement maintenus) ; les **référencer** + ajouter la glue.
- **Spike mémoire = 🔴 ROUGE** : boucle mémoire écartée. PAS « la mémoire nuit » — ne pas rejouer.
- **FinalGoal = advisory** : réduit la dérive du but, ne la garantit pas à zéro.
- **NewProject = skill autonome** (non couplé à brainstorming-advanced) — option 2, skill standard
  invocable par `/NewProject [Description]`.
- **Multi-plateforme = fichiers statiques dans le repo** (YAGNI) — les configs globales sont le
  prochain chantier, pas un surcoût de la spec initiale.

## Où trouver le détail
- Specs/plans : `docs/superpowers/specs/` et `docs/superpowers/plans/`.
- Skills livrés : `skills/brainstorming-advanced/`, `skills/newproject/`, `skills/session-handoff/`.
- Journal détaillé (privé, gitignoré) : `.claude/JOURNAL.md`.
- Guidance projet stable : `CLAUDE.md`.
