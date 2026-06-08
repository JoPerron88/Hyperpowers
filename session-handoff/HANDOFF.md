# Handoff — Hyperpowers
> Dernière mise à jour : 2026-06-08 (session 5). Reprise à froid : si tu n'as pas l'outillage de ce projet, lis
> d'abord `OUTILLAGE.md` (à côté), puis ce fichier.

## Le but (FinalGoal)
Hyperpowers = un **plugin Claude Code qui fusionne plusieurs skills/plugins existants en un
ensemble cohérent** pour améliorer leur symbiose. La vision de l'auteur : « ma version de
superpowers » — une **distro curée** (modèle C) qui assemble superpowers + planning-with-files
(non-forkés) + une **couche de glue** propre : le Standard de qualité, le routage des plans, le
FinalGoal, le skill `session-handoff`. Étoile polaire = **qualité du code**. Outil **personnel**
(non commercial).

## Où on en est
- Branche : **`main`** · arbre propre · tout poussé sur GitHub.
- **54 tests verts** (54/54 — `planning-with-files` installé).
- **Plugin v0.5.0** actif.
- **v1→v4 livrées** + skills et features post-v4 :
  - **`brainstorming-advanced`** ✅ v2 — méta-routage pool léger / pool dynamique, catalogue 6
    entités, test d'éligibilité 3 questions.
  - **`newproject`** ✅ — skill d'amorçage projet en 5 phases.
  - **`cahier-maitre`** ✅ — skill de journal/registre maître transverse.
  - **`project-reference`** ✅ — skill de document de référence durable d'un projet.
  - **`session-handoff`** ✅ — résumé de session avec état et prochaines étapes.
  - **`conseil`** ✅ v2 — mini firm conseil (Stratège / Guide / Relecteur). Structure imposée :
    Verdict / Signal / Contrainte / Racine (conditionnelle). Livrables dans `firm/sessions/` +
    `firm/index.md`. Distinct de brainstorming-advanced (lit l'existant vs explore les options).
  - **`install.mjs`** ✅ — `npm run install-configs`.
  - **AGENTS.md staleness test** ✅.
  - **Extensions natives multi-plateforme** ✅.
  - **Gate runtime** ✅ — vérifié 2026-06-08.

## Ce qui était prévu ensuite
- **v5 — marketplace curé** — **dépendance bloquante identifiée** (firm 2026-06-08) : la symbiose
  inter-skills ne peut pas être testée tant que le marketplace v5 n'existe pas. C'est le chantier
  prioritaire. Le brainstorming v5 avait été interrompu à mi-session ; le format `git-subdir`/`url`
  est confirmé faisable. **Reprendre par brainstorming.**
- **Glue inter-skills** — après le marketplace : implémenter la composition réelle entre skills
  (le cœur de la promesse du projet, jamais encore touché).
- **Cycle gouvernance/construction** (signal firm) : chaque session produit une décision de
  gouvernance mais la suivante reprend la construction. À surveiller activement.

## Reprendre sur une machine neuve (le projet)
- `git clone https://github.com/JoPerron88/Hyperpowers.git`
- **Node ≥ v22**. Tests : `npm test` → doit afficher **54 verts** (54/54, 0 rouge si planning-with-files installé).
- `npm run build:agents` pour régénérer `AGENTS.md` si besoin (le test de staleness le détecte).
- Outillage Claude Code à installer : **voir `OUTILLAGE.md`**.
- Ce qui NE voyage PAS au clone : la mémoire privée de Claude (`~/.claude/projects/...`).
  `HANDOFF.md` + `CLAUDE.md` + `docs/` re-sèment le contexte.

## Pièges à connaître
- **Plugin copié dans le cache à l'install** : toute édition de `standard.md` / hook / skill n'a
  **aucun effet runtime** tant que le plugin n'est pas **mis à jour + rechargé**.
- **Procédure de mise à jour du cache** : (1) bumper la version dans `plugin.json` et
  `marketplace.json`, (2) committer + pousser, (3) `/plugin update hyperpowers@hyperpowers`,
  (4) `/reload-plugins` ou redémarrer la session. `/plugin install` retourne "already installed"
  sans toucher le cache si la version est identique.
- **Double injection (réglée)** : l'entrée manuelle dans `~/.claude/settings.json` a été retirée
  le 2026-06-07 — le plugin seul enregistre le hook désormais.
- Tests **scopés à `tests/`** (le dépôt a aussi des `*.test.mjs` dans `spike/` à ne pas lancer).
- `.claude/` est **gitignoré** (journal privé) — ne pas le committer.
- **`AGENTS.md` à régénérer** après toute modif de `standard.md` ou des skills :
  `npm run build:agents`. Le test de staleness le détectera si oublié.
- **Extensions natives vs install.mjs** : les deux coexistent. `install.mjs` copie des fichiers
  dans `~/` (fallback). Les dossiers `.opencode/`, `.codex-plugin/`, `.cursor-plugin/` et
  `gemini-extension.json` permettent l'installation via les gestionnaires natifs.

## Décisions clés & pourquoi
- **Modèle C (distro curée, non-fork)** — tranché 2026-06-07.
- **Spike mémoire = 🔴 ROUGE** : boucle mémoire écartée. PAS « la mémoire nuit » — ne pas rejouer.
- **FinalGoal = advisory** : réduit la dérive du but, ne la garantit pas à zéro.
- **NewProject = skill autonome** (non couplé à brainstorming-advanced) — option 2, skill standard.
- **Multi-plateforme = extensions natives** + `install.mjs` comme fallback. Décidé 2026-06-07.
- **OpenCode = injection message transform** (pas `instructions` array) — même pattern que
  superpowers.js.
- **brainstorming-advanced v2 = pool léger + pool dynamique** — méta-routage par le Modérateur.
  Catalogue fixe de 6 entités nommées. Test d'éligibilité en 3 questions obligatoire.
- **hooks.json `matcher: "startup|clear|compact"` = convention établie** — confirmé 2026-06-08 :
  superpowers upstream utilise exactement le même pattern.
- **`conseil` = structure en couches** (tranché 2026-06-08) : Verdict/Signal/Contrainte imposés,
  Racine conditionnelle (auto si blocage structurel propre au projet, ou forcée par "analyse en
  profondeur"). Entités secondaires réagissent à la précédente, pas de re-analyse depuis zéro.
- **`firm/` = dossier dédié à la racine du projet** — consultations dans `sessions/`, index dans
  `index.md`. Ne pas confondre avec les plans d'exécution (writing-plans) ni les caps (FinalGoal).

## Où trouver le détail
- Specs/plans : `docs/superpowers/specs/` et `docs/superpowers/plans/`.
- Skills livrés : `skills/brainstorming-advanced/`, `skills/newproject/`, `skills/session-handoff/`,
  `skills/cahier-maitre/`, `skills/project-reference/`, `skills/conseil/`.
- Consultations firm : `firm/sessions/` + `firm/index.md` (2 consultations 2026-06-08).
- Extensions natives : `gemini-extension.json`, `.opencode/`, `.codex-plugin/`, `.cursor-plugin/`.
- Références multi-plateforme : `references/`.
- Journal détaillé (privé, gitignoré) : `.claude/JOURNAL.md`.
- Guidance projet stable : `CLAUDE.md`.
