# Handoff — Hyperpowers
> Dernière mise à jour : 2026-06-09 (session 8). Reprise à froid : si tu n'as pas l'outillage de ce projet, lis
> d'abord `OUTILLAGE.md` (à côté), puis ce fichier.

## Le but (FinalGoal)
Hyperpowers = un **plugin Claude Code qui fusionne plusieurs skills/plugins existants en un
ensemble cohérent** pour améliorer leur symbiose. La vision de l'auteur : « ma version de
superpowers » — une **distro curée** (modèle C) qui assemble superpowers + planning-with-files
(non-forkés) + une **couche de glue** propre : le Standard de qualité, le routage des plans, le
FinalGoal, le skill `session-handoff`. Étoile polaire = **qualité du code**. Outil **personnel**
(non commercial).

## Où on en est
- Branche : **`main`** · arbre propre · tout poussé sur GitHub (dernier commit `21b4c8f`, session 8).
- **62 tests verts** (62/62 dans l'env de dev — ⚠️ 55/62 sur un clone Google Drive, voir piège « CRLF » plus bas).
- **Plugin v0.6.0** actif.
- **Session 8 (méta)** : 2 consultations firm livrées (`firm/sessions/2026-06-09-*`), désinstallation
  de `karpathy-guidelines` + `ui-ux-pro-max` (recouvrements tranchés), fix `OUTILLAGE` (count 54→62),
  setup git bi-compte (ce repo = `JoPerron88`, défaut global = `jperron-maker`).
- **v1→v5 + glue inter-skills v1 livrées** + skills et features :
  - **Glue inter-skills v1** ✅ (session 7) — **filet de test de cohérence**, PAS d'orchestrateur.
    `skills/disjoint-pairs.json` + Test A (pointeurs morts : références `superpowers:`/`hyperpowers:`
    dans les SKILL.md doivent exister) + Test B (anti-chevauchement : marqueur de frontière présent
    dans une description). Découverte clé : les 2 baselines RED de `writing-skills` sont **verts** —
    le comportement de symbiose émerge déjà, **aucune édition de skill justifiée** (Iron Law). Le
    filet **protège** une symbiose déjà vivante contre la régression.
  - **`brainstorming-advanced`** ✅ v2 — méta-routage pool léger / pool dynamique, catalogue 6
    entités, test d'éligibilité 3 questions.
  - **`newproject`** ✅ — skill d'amorçage projet en 5 phases.
  - **`cahier-maitre`** ✅ — skill de journal/registre maître transverse.
  - **`project-reference`** ✅ — skill de document de référence durable d'un projet.
  - **`session-handoff`** ✅ — résumé de session avec état et prochaines étapes.
  - **`conseil`** ✅ v2 — mini firm conseil (Stratège / Guide / Relecteur). Structure imposée :
    Verdict / Signal / Contrainte / Racine (conditionnelle). Livrables dans `firm/sessions/` +
    `firm/index.md`. Distinct de brainstorming-advanced (lit l'existant vs explore les options).
  - **`check-dependencies`** ✅ v1 — skill de diagnostic : lit `~/.claude/plugins/installed_plugins.json`,
    reporte l'état de superpowers + planning-with-files, donne les commandes d'install si manquant.
  - **Prérequis superpowers** ✅ (Option B) — `brainstorming-advanced` et `newproject` affichent
    une note d'installation si superpowers manque au moment de la délégation.
  - **`install.mjs`** ✅ — `npm run install-configs`.
  - **AGENTS.md staleness test** ✅.
  - **Extensions natives multi-plateforme** ✅.
  - **Gate runtime** ✅ — vérifié 2026-06-08.

## Ce qui était prévu ensuite
**Priorités confirmées par l'auteur (session 8) :**
- ✅ **Trancher les 2 recouvrements restants** — **FAIT (2026-06-09)** : `code-review` et
  `security-guidance` → **garder le built-in, désinstaller le plugin** (built-ins indépendants des
  plugins, vérifié ; geste réversible). Détail + commandes dans
  `firm/sessions/2026-06-09-arsenal-skills-plugins.md` § « Tranchage final ». Les 4 recouvrements sont
  désormais tous tranchés. **Reste à exécuter sur la machine Windows** (sur le Mac, ces 2 plugins ne
  sont pas installés — rien à faire). `/plugin uninstall code-review@claude-plugins-official` +
  `/plugin uninstall security-guidance@claude-plugins-official`.
- **Définir « symbiose » en positif dans le Standard** (livrable de
  `firm/sessions/2026-06-09-pwf-symbiose-installation.md`) : une phrase en langage d'impact (« le bon
  outil routé selon la taille de la tâche, deux systèmes étanches »), pour stopper la récidive du doute
  « mal installé ». Tension non tranchée : la loger dans `standard.md` (relu au SessionStart, fort mais
  alourdit l'injection) ou dans README/cahier (léger mais pas relu auto).
- **Investiguer les 7 tests rouges** du clone Drive (cause probable CRLF) — confirmer, et si avéré
  ajouter un `.gitattributes`. Voir piège plus bas.
- **Cap exploratoire : skill/plugin « Multivac »** — futur assistant personnel de l'auteur. Pas encore
  spécifié → passera par `superpowers:brainstorming` (ou `brainstorming-advanced` si vraies tensions de
  conception) **avant** tout code. Vérifier l'alignement avec le FinalGoal (qualité du code, outil perso).
  📄 **Conversation de conception amorcée → `session-handoff/multivac-notes.md`** (fondations sur le
  stockage des entités + vocabulaire sous-agent, à relire avant de reprendre Multivac).
- **Expansion des « rôles » (entités) joués par les sous-agents** — aujourd'hui ces rôles sont des
  *briefs inline* d'1-3 phrases dans le `SKILL.md` (catalogue de `brainstorming-advanced` : 6 entités ;
  profils de `conseil` : Stratège/Guide/Relecteur). Piste : les **enrichir** (rôle + capacités +
  personnalité + exemples) et les **sortir** dans des fichiers dédiés (`skills/<skill>/references/`) ou
  les **promouvoir en agents définis** (`.claude/agents/<nom>.md`, réutilisables/routables), à appliquer :
  (a) aux skills actuels `conseil` + `brainstorming-advanced` ; (b) **dès la conception de « Multivac »**
  (penser ses rôles comme des entités riches dès le départ). ⚠️ C'est un **changement de conception**, pas
  une retouche : passer par `brainstorming` d'abord, et peser contre YAGNI/simplicité (le brief mince
  actuel est un choix assumé — l'expansion doit prouver sa valeur, pas être faite par défaut).

**Reporté des sessions précédentes :**
- **Étendre `disjoint-pairs.json`** — au fil de l'eau, ajouter les frontières disjointes qui
  méritent d'être protégées (chaque nouvelle paire = une ligne + un marqueur de démarcation présent
  dans une description). Léger, pas urgent.
- **Nouvelle arête de skill : SEULEMENT si un baseline échoue.** Leçon de la session 7 : avant de
  durcir une arête (éditer un SKILL.md pour instruire une composition), **tester le baseline** d'un
  subagent frais. Si le comportement émerge déjà → ne pas éditer (Iron Law + YAGNI). Deux candidates
  ont déjà des baselines verts (brainstorming→writing-plans, brainstorming→décisions-tranchées) ;
  ne pas les re-tenter.
- **Cycle gouvernance/construction** (signal firm) : la session 7 a **livré du code** (le filet),
  pas seulement une décision de gouvernance — bon signe. Continuer à surveiller.

## Révision conceptuelle clé (session 6)
« v5 marketplace curé » → **« v5 Fondations Symbiose »**. Le marketplace.json ne change pas
(registre minimal, une seule entrée hyperpowers). La symbiose se construit dans les skills
eux-mêmes, pas dans le registre. Le runtime Claude Code n'a pas de résolution automatique de
dépendances entre plugins.

## Reprendre sur une machine neuve (le projet)
- `git clone https://github.com/JoPerron88/Hyperpowers.git`
- **Identité git de CE repo = compte `JoPerron88`** (l'auteur a 2 comptes GitHub ; `jperron-maker` est
  le défaut global, sans droit d'écriture ici). Sur une machine neuve, pour pouvoir pousser : se
  connecter `gh auth login` comme `JoPerron88`, puis dans le repo :
  `git remote set-url origin https://JoPerron88@github.com/JoPerron88/Hyperpowers.git` +
  `git config --local user.name "Jonathan Perron"` +
  `git config --local user.email "jonathan.perron.travail@gmail.com"`. Le push est routé par le
  username dans l'URL du remote (Git Credential Manager), pas par le compte gh « actif ».
- **Node ≥ v22**. Tests : `npm test` → doit afficher **62 verts** (62/62, 0 rouge si planning-with-files installé).
- `npm run build:agents` pour régénérer `AGENTS.md` si besoin (le test de staleness le détecte).
- Outillage Claude Code à installer : **voir `OUTILLAGE.md`**.
- Ce qui NE voyage PAS au clone : la mémoire privée de Claude (`~/.claude/projects/...`).
  `HANDOFF.md` + `CLAUDE.md` + `docs/` re-sèment le contexte.

## Pièges à connaître
- **Clone sur Google Drive (`G:`) = 7 tests rouges trompeurs** : un `git clone` sur un chemin Drive
  sous Windows donne 55/62 au lieu de 62/62. Les tests qui rougissent comparent des chaînes exactes
  (frontmatter « Use when », staleness `AGENTS.md`, marqueurs de frontière disjoints). **Ce n'est PAS
  une régression du code** — vérifié manuellement : les descriptions commencent bien par « Use when ».
  Cause probable = fins de ligne **CRLF** introduites par le clone Windows/Drive (non confirmée à 100 %,
  investigation reportée). Tester plutôt hors-Drive, ou ajouter un `.gitattributes` (`* text=auto eol=lf`).
- **Plugin copié dans le cache à l'install** : toute édition de `standard.md` / hook / skill n'a
  **aucun effet runtime** tant que le plugin n'est pas **mis à jour + rechargé**.
- **Procédure de mise à jour du cache** : (1) bumper la version dans `plugin.json` et
  `marketplace.json`, (2) committer + pousser, (3) `/plugin update hyperpowers@hyperpowers`,
  (4) `/reload-plugins` ou redémarrer la session. `/plugin install` retourne "already installed"
  sans toucher le cache si la version est identique.
- **Double injection (réglée)** : l'entrée manuelle dans `~/.claude/settings.json` a été retirée
  le 2026-06-07 — le plugin seul enregistre le hook désormais.
- Tests **scopés à `tests/`** (le dépôt a aussi des `*.test.mjs` dans `spike/` à ne pas lancer).
- **Filet de cohérence inter-skills (Test A/B)** : si tu renommes un skill ou retires la phrase de
  démarcation d'une description, `npm test` rougit. `skills/disjoint-pairs.json` déclare les paires
  disjointes ; le marqueur = phrase de démarcation EXACTE attendue dans une description (pas le nom
  du skill — trop faible).
- **Avant de durcir une arête inter-skills, teste le baseline** : un subagent frais fait-il déjà la
  composition sans instruction ? Si oui → ne pas éditer le SKILL.md (Iron Law : pas d'édition sans
  échec à corriger). C'est la leçon centrale de la session 7.
- `.claude/` est **gitignoré** (journal privé) — ne pas le committer.
- **`AGENTS.md` à régénérer** après toute modif de `standard.md` ou des skills :
  `npm run build:agents`. Le test de staleness le détectera si oublié.
- **Extensions natives vs install.mjs** : les deux coexistent. `install.mjs` copie des fichiers
  dans `~/` (fallback). Les dossiers `.opencode/`, `.codex-plugin/`, `.cursor-plugin/` et
  `gemini-extension.json` permettent l'installation via les gestionnaires natifs.
- **marketplace.json reste minimal** (une seule entrée `hyperpowers`) — ne pas ajouter
  superpowers/pwf : le runtime ne résout pas les dépendances automatiquement, et des sha épinglés
  deviendraient vite obsolètes. La distro curée passe par les skills, pas le registre.

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
  Racine conditionnelle. Entités secondaires réagissent à la précédente.
- **`firm/` = dossier dédié à la racine du projet** — consultations dans `sessions/`, index dans
  `index.md`.
- **v5 = Fondations Symbiose, pas marketplace curé** (tranché 2026-06-08 session 6) : le
  marketplace.json ne référence pas les dépendances externes — le runtime ne supporte pas la
  résolution automatique. La symbiose passe par les skills eux-mêmes (`check-dependencies` +
  notes prérequis dans les skills qui délèguent).
- **Glue inter-skills = filet de test, pas orchestrateur** (tranché 2026-06-09 session 7) : le débat
  a écarté à l'unanimité un orchestrateur actif (« fausse autorité » — Hyperpowers ne contrôle pas
  le déclenchement des skills). La glue est déclarative (pointeurs + descriptions disjointes), garantie
  par un filet de test. **La symbiose émerge déjà** de Claude + des skills (prouvé par 2 baselines RED
  verts) → on ne décrète pas, on protège. Le « bus de contexte » (artefacts partagés) reste un horizon
  émergent, jamais formalisé (voisinage du spike mémoire rouge).

## Où trouver le détail
- **`README.md`** — enrichi session 7 : usage détaillé des 7 skills (quand/comment/symbiose) + section
  dédiée à la symbiose avec superpowers & planning-with-files (4 mécanismes de composition).
- Specs/plans : `docs/superpowers/specs/` et `docs/superpowers/plans/`.
- Skills livrés : `skills/brainstorming-advanced/`, `skills/newproject/`, `skills/session-handoff/`,
  `skills/cahier-maitre/`, `skills/project-reference/`, `skills/conseil/`, `skills/check-dependencies/`.
- Filet de cohérence inter-skills : `skills/disjoint-pairs.json` + 2 tests dans `tests/standard.test.mjs`.
  Spec/plan : `docs/superpowers/specs/2026-06-08-glue-inter-skills-design.md` (section « Découverte »
  documente les baselines RED verts) + `docs/superpowers/plans/2026-06-08-glue-inter-skills.md`.
- Consultations firm : `firm/sessions/` + `firm/index.md` (2 consultations 2026-06-08).
- Extensions natives : `gemini-extension.json`, `.opencode/`, `.codex-plugin/`, `.cursor-plugin/`.
- Références multi-plateforme : `references/`.
- Journal détaillé (privé, gitignoré) : `.claude/JOURNAL.md`.
- Guidance projet stable : `CLAUDE.md`.
