# Index des skills disponibles — pour Multivac

> **But.** Répertoire exhaustif de **tout ce qui est invocable** dans cet environnement Claude Code
> (machine Mac, le seul utilisé désormais pour le développement). Inventaire neutre : on **liste
> tout**, natif ou plugin, sans juger la pertinence ni rien retirer. Document de référence pour le
> futur projet **Multivac**.
>
> **Date du relevé :** 2026-06-09 · **Source factuelle :** plugins installés
> (`~/.claude/plugins/installed_plugins.json`) + skills/commands natifs exposés par le harness.

## Note de vocabulaire (ta question)

Pour décrire un skill, trois termes circulent — voici lequel veut dire quoi :

- **`description`** — c'est le **champ officiel** dans le fichier d'un skill (`SKILL.md`). Par
  convention Claude Code, il décrit le **QUAND** : à quel moment / sur quel signal le skill doit
  s'activer. Ce n'est *pas* une description de ce qu'il fait.
- **Rôle / fonction** — ce que le skill **fait** et **à quoi il sert**. C'est ce qui t'intéresse ;
  il n'y a pas de champ dédié pour ça, on le déduit du contenu.
- **Capacité** — synonyme courant de « rôle », orienté « ce qu'il est capable de produire ».

Dans cet index, chaque entrée donne **Rôle** (à quoi ça sert) + **Déclencheur** (le *quand*, dérivé
de la `description`).

---

## Vue d'ensemble

| Source | Type | Nombre |
|---|---|---|
| **Built-ins du harness** | natifs Claude Code (aucun plugin) | 13 |
| **superpowers** (plugin Anthropic) | skills de process | 14 |
| **hyperpowers** (plugin maison) | skills de glue/conception | 7 |
| **planning-with-files** (plugin tiers) | skill de planification + commands | 1 skill (+ slash-commands) |
| **warp** (plugin) | intégration terminal | 0 skill (hooks seulement) |

---

## 1. Built-ins du harness Claude Code (natifs)

Fournis par Claude Code lui-même, sans plugin. Toujours disponibles.

| Skill | Rôle (à quoi ça sert) | Déclencheur (quand) |
|---|---|---|
| **run** | Lance et pilote l'app du projet pour voir une modif en vrai (CLI, serveur, TUI, Electron, navigateur…). | « lance l'app », « montre-moi le résultat », screenshot de l'app. |
| **verify** | Vérifie qu'un changement fait bien ce qu'il doit, en lançant l'app et en observant le comportement réel (pas juste les tests). | « vérifie que le fix marche », valider une PR localement. |
| **init** | Initialise un fichier `CLAUDE.md` documentant le codebase. | Nouveau dépôt sans `CLAUDE.md`. |
| **review** | Revue d'une **pull request**. | « revois cette PR ». |
| **code-review** | Revue du **diff courant** : bugs de correction + nettoyages (réutilisation/simplification/efficacité), à niveau d'effort `low→max`, et `ultra` = revue multi-agents dans le cloud. `--comment` poste en PR, `--fix` applique. | « revois mon code », avant un merge. |
| **security-review** | Revue de **sécurité** des changements de la branche. | « check sécurité », avant de pousser du code sensible. |
| **simplify** | Revoit le code changé pour réutilisation / simplification / efficacité et **applique** les correctifs. Qualité seulement (ne cherche pas les bugs). | « simplifie ça », nettoyage post-implémentation. |
| **loop** | Exécute un prompt ou une slash-command **en boucle** sur un intervalle (`/loop 5m /foo`), ou en auto-rythme. | « refais ça toutes les 5 min », polling de statut. |
| **schedule** | Crée / gère des **agents distants planifiés** (cron/routines), ou un run unique programmé. | « planifie une tâche à 3h », tâche récurrente cloud. |
| **update-config** | Configure le harness via `settings.json` : hooks, permissions, variables d'env. Indispensable pour les comportements automatiques (« à chaque fois que X »). | « autorise la commande X », « quand je fais X, fais Y ». |
| **keybindings-help** | Personnalise les raccourcis clavier (`~/.claude/keybindings.json`). | « remappe ctrl+s », ajouter un raccourci. |
| **fewer-permission-prompts** | Scanne les transcripts et ajoute une allowlist d'outils sûrs à `.claude/settings.json` (moins de demandes de permission). | « réduis les demandes de permission ». |
| **claude-api** | Référence de l'**API Claude / SDK Anthropic** (model ids, pricing, tool use, streaming, caching, migration). À consulter avant de répondre sur un sujet Claude/Anthropic. | Question API/SDK, construction d'app LLM. |

---

## 2. superpowers (plugin Anthropic) — le moteur de process

14 skills de discipline. C'est la colonne vertébrale que `hyperpowers` orchestre.

| Skill | Rôle (à quoi ça sert) | Déclencheur (quand) |
|---|---|---|
| **using-superpowers** | Méta-règle : établit comment trouver/utiliser les skills, impose d'invoquer un skill avant toute réponse. | Au démarrage de toute conversation. |
| **brainstorming** | Explore l'intention, les besoins et le design **avant** tout travail créatif ; transforme une demande floue en spec. | Avant de créer une feature, un composant, une fonctionnalité. |
| **test-driven-development** | Cycle rouge→vert→refactor : écrire le test d'abord, code minimal pour le faire passer. *(Rigide.)* | Avant d'écrire du code d'implémentation. |
| **systematic-debugging** | Méthode d'investigation d'un bug **avant** de proposer un fix. *(Rigide.)* | Bug, test rouge, comportement inattendu. |
| **writing-plans** | Transforme une spec en **plan multi-étapes** (cases `- [ ]`, rangé dans `docs/.../plans/`). | Tâche multi-étapes avec spec, avant de toucher au code. |
| **executing-plans** | Exécute un plan écrit, avec checkpoints de revue, en session séparée. | Plan prêt à exécuter par lots. |
| **subagent-driven-development** | Exécute les tâches **indépendantes** d'un plan via des subagents frais, dans la session courante. | Plan à tâches indépendantes, exécution en session. |
| **dispatching-parallel-agents** | Parallélise 2+ tâches indépendantes sans état partagé. | Plusieurs tâches sans dépendance séquentielle. |
| **verification-before-completion** | Exige des **preuves** (commandes lancées, sortie observée) avant de déclarer « terminé ». | Avant de dire « c'est fait », avant de committer/PR. |
| **requesting-code-review** | Demander une revue de code avec rigueur. | Tâche complète, feature majeure, avant un merge. |
| **receiving-code-review** | Recevoir un retour de revue avec rigueur technique (vérifier, pas acquiescer). | À la réception d'un feedback de revue. |
| **using-git-worktrees** | Isole le travail d'une feature dans un worktree git. | Démarrer une feature qui doit être isolée. |
| **finishing-a-development-branch** | Présente les options de clôture d'une branche (merge / PR / cleanup). | Implémentation finie, tests verts. |
| **writing-skills** | Processus + vérifications pour **créer/éditer un skill** (Iron Law : pas d'édition sans test qui échoue d'abord). | Créer, éditer ou valider un skill. |

---

## 3. hyperpowers (plugin maison) — la glue & la conception

7 skills. Voir aussi le `README.md` du projet Hyperpowers pour le détail et la symbiose.

| Skill | Rôle (à quoi ça sert) | Déclencheur (quand) |
|---|---|---|
| **brainstorming-advanced** | **Débat multi-agents** structuré pour les décisions à vraies tensions (entités : Enthousiaste, Sage, Intégrateur, Estimateur, Sécuritaire, Utilisateur Final). Plus puissant que `brainstorming`. | Décision avec trade-offs réels, enjeux d'archi/produit, pressure-test d'un design. *(Jamais sans accord explicite.)* |
| **conseil** | Mini **firm de conseil** (Stratège / Guide / Relecteur) qui **lit l'existant** pour évaluer/réviser un projet ou une décision. Livrables dans `firm/`. | « revois mon projet », « analyse mon architecture », « est-ce que ça tient », « consulte la firm ». |
| **newproject** | Amorce un **projet neuf** en 5 phases (idée → choix techniques → scope/risques → artefacts → suite). Produit `CLAUDE.md`, `.hyperpowers/goal.md`, `git init`. | Projet à partir de zéro, avant tout code. `/NewProject [description]`. |
| **session-handoff** | Produit un dossier `session-handoff/` commité (`HANDOFF.md` + `OUTILLAGE.md`) pour **reprendre à froid**, même sur une autre machine, même sans les plugins installés. | « fini pour aujourd'hui », « on met en pause ». |
| **cahier-maitre** | Consigne un événement / une décision / un progrès dans le **journal maître** du projet (`CAHIER.md`, insertion en tête). | « note dans le cahier », « ajoute une entrée au cahier ». |
| **project-reference** | Génère / rafraîchit un **document de référence exhaustif** du projet (`docs/project-reference.md`, 6 sections). | « génère la référence projet », « documente le projet ». |
| **check-dependencies** | Diagnostique si les plugins requis (superpowers, planning-with-files) sont installés ; donne les commandes d'install manquantes. | Vérifier l'install, ou une délégation qui échoue. |

---

## 4. planning-with-files (plugin tiers) — planification par fichiers

Skill principal **multilingue** (un même skill décliné en plusieurs langues) + des **slash-commands**.

| Élément | Type | Rôle (à quoi ça sert) | Déclencheur (quand) |
|---|---|---|---|
| **planning-with-files** | skill | Planification **persistante par fichiers** : crée `task_plan.md`, `findings.md`, `progress.md`. Des hooks réinjectent le plan à chaque appel d'outil ; **survit aux `/clear` et compactions**. Dormant tant qu'aucun `task_plan.md` n'existe. | Planifier/décomposer un projet multi-étapes, tâche de recherche, travail long qui franchit des sessions. |
| `planning-with-files-{ar,de,es,zh,zht}` | skills | Mêmes capacités, déclencheurs en arabe / allemand / espagnol / chinois simplifié / chinois traditionnel. | Mêmes situations, autre langue. |
| **/plan** (`/plan-{ar,de,es,zh}`) | command | Démarre la planification par fichiers. | « lance un plan ». |
| **/start** | command | Démarre/initialise le suivi. | Début d'un suivi de tâche. |
| **/status** | command | Affiche l'état courant du plan (phases, progrès, erreurs). | « où en est le plan ». |
| **/plan-goal** | command | Pose / cadre l'objectif du plan. | Définir le but d'une tâche planifiée. |
| **/plan-loop** | command | Boucle d'avancement sur le plan. | Itérer sur les étapes. |
| **/plan-attest** | command | Atteste / valide l'avancement. | Confirmer une étape. |

> ⚠️ **Tension connue** avec `superpowers:writing-plans` (deux formats de plan non interopérables) :
> dans Hyperpowers, c'est **géré par routage** (principe 5 — grosse tâche cross-session → pwf ;
> tâche moyenne mono-session → writing-plans). À garder en tête pour Multivac.

---

## 5. warp (plugin) — intégration terminal

Aucun skill ni command exposé. Le plugin fournit des **hooks** (notifications natives Warp Terminal,
extras de confort de workflow). Listé ici pour l'exhaustivité ; rien à invoquer via « / ».

---

## Pour Multivac — comment réutiliser cet index

- **Périmètre** : ceci reflète l'environnement Mac au 2026-06-09. Si tu installes/désinstalles des
  plugins, re-générer l'inventaire (`~/.claude/plugins/installed_plugins.json` + la liste des skills
  de session).
- **Distinction utile** : *built-ins* (toujours là, fournis par le harness) vs *skills de plugins*
  (dépendent de l'install). Multivac, s'il s'appuie sur des skills, devra déclarer ses dépendances
  (comme `hyperpowers:check-dependencies` le fait).
- **Vocabulaire retenu** : pour décrire une capacité de Multivac, parle de **rôle/fonction** (ce que
  ça fait) et garde **`description`** pour le champ technique de déclenchement (le *quand*).
