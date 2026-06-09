# Analyse en profondeur de l'arsenal — tous les skills/plugins disponibles via « / »
Date : 2026-06-09 | Entité principale : Stratège

> Catalogue exhaustif (description + fonctionnement) + couche d'analyse firm. Source factuelle :
> `~/.claude/plugins/installed_plugins.json` (11 plugins) + la liste des skills invocables exposée
> par le harness Claude Code à cette session.

---

## Partie 1 — Analyse firm

### Stratège — voix principale
**Verdict :** Ça tient, mais ça commence à dériver par accumulation — le cap (qualité du code, outil
simple pour un non-dev) est intact, mais l'arsenal grossit plus vite que la glue qui le discipline.

**Signal :**
- **Quatre recouvrements de fonction sont déjà actifs simultanément**, et ce sont ceux qui touchent
  l'étoile polaire (qualité) : `code-review` (plugin) vs `/code-review`/`/review` (built-in) vs
  `/simplify` ; `security-guidance` (plugin) vs `/security-review` (built-in) ;
  `frontend-design` vs `ui-ux-pro-max` ; `karpathy-guidelines` standalone vs le Standard
  Hyperpowers qui *absorbe déjà* karpathy. Au point de déclenchement, **rien ne tranche lequel
  gagne**. La confusion n'est pas dans le catalogue, elle est au déclenchement.
- La tension `planning-with-files` vs `writing-plans`/`executing-plans` de superpowers est la
  **seule déjà reconnue et gérée** (par routage, principe 5). Les trois autres recouvrements n'ont
  pas reçu ce traitement.
- Les skills **personnels hors-plugin** (karpathy, LumirLasers, lumirpdm, ui-ux-pro-max) sont les
  plus à risque : non versionnés dans un marketplace, hors filet de test, et deux font doublon avec
  des plugins curés mieux entretenus. Des « passagers clandestins » de l'arsenal.

**Contrainte :** Le runtime Claude Code **ne résout pas les priorités de déclenchement — il liste,
il ne hiérarchise pas.** Tu peux désactiver un plugin, mais pas dire « quand la qualité du code est
en jeu, tel outil l'emporte ». Tant que cet arbitrage vit dans ta tête et non dans le Standard,
chaque recouvrement reste une loterie de déclenchement.

**Racine :** Hyperpowers est une **distro curée non-fork** : ta valeur ajoutée n'est pas le code des
skills (il appartient à Anthropic et aux tiers), c'est **la curation et le routage**. Donc chaque
skill laissé entrer sans décision « gagne / perd / ignoré » n'est pas un bonus gratuit, c'est une
dette de curation qui attaque exactement la seule chose que ce projet produit en propre.

### Guide — réaction
D'accord, avec un bémol qui parle directement à un non-dev : le vrai risque n'est pas qu'un mauvais
outil gagne la loterie — c'est que **tu ne sauras jamais lequel a gagné**. Deux skills qui se
chevauchent produisent un résultat « correct mais incohérent d'une fois à l'autre », et un
non-développeur n'a aucun moyen de détecter cette dérive silencieuse. Angle mort : avant toute table
de tranchage, la règle qui compte c'est « aucun skill n'entre sans verdict gagne/perd/ignoré écrit »
— sinon la curation se paie en surprises, pas en tokens.

### Relecteur — réaction
**Désaccord partiel avec le Guide** : sa règle « aucun skill n'entre sans verdict écrit » suppose un
point de contrôle qui n'existe pas — le runtime déclenche sur **description**, pas sur un registre
que tu tiendrais à jour. Le vrai mécanisme de dérive silencieuse n'est pas le passager clandestin
qui « entre », c'est que `karpathy-guidelines` et `ui-ux-pro-max` ont des descriptions **tellement
larges** (ui-ux-pro-max : « plan, build, create, design, review, fix, improve, optimize, enhance,
refactor, check ») qu'ils gagnent par **recouvrement de surface, pas par pertinence** — et ça, aucun
verdict humain ne le rattrape puisque tu ne vois jamais quelle description a matché. Le seul levier
où un non-dev reprend le contrôle : **resserrer les descriptions en amont**, pas une table en aval.

### Décision / cap retenu
1. **pas de nouvel outil, pas de mécanisme** — geste 100 % déclaratif, fidèle à la nature de la distro.
2. Sur les 4 recouvrements : **trancher chacun** (garder / router / désactiver). Candidats nets à la
   désactivation car déjà absorbés/doublonnés : `karpathy-guidelines` (absorbé par le Standard) ;
   choisir UN seul entre `frontend-design` et `ui-ux-pro-max`.
3. Le levier d'exécution privilégié (Relecteur) : **resserrer les `description:`** des skills
   personnels qui sur-déclenchent, plutôt que d'écrire un arbitrage que le runtime n'appliquera pas.

### Tensions non résolues
**Table de tranchage (Stratège) vs resserrage des descriptions (Relecteur)** — les deux agissent à
des étages différents (aval = quel outil gagne une fois déclenché ; amont = quel outil se déclenche).
Le resserrage est le seul que le runtime respecte vraiment ; la table reste utile comme aide-mémoire
humain. À combiner, pas à choisir. Non tranché ici : faut-il carrément **désinstaller** les doublons
hors-plugin plutôt que resserrer leur description ?

---

## Partie 2 — Catalogue exhaustif (description + fonctionnement)

**Légende source** — 🟦 Anthropic (marketplace `claude-plugins-official`) · 🟩 Tiers · 🟨 Personnel
(hors-plugin) · ⚙️ Built-in du harness Claude Code (pas un plugin).

### A. 🟦 Plugins Anthropic installés

| Plugin | Version | Rôle |
|--------|---------|------|
| superpowers | 5.1.0 | Discipline de process (le moteur) |
| frontend-design | — | Génération d'UI haut de gamme |
| code-review | — | Revue de PR |
| skill-creator | — | Créer/éditer/évaluer des skills |
| github | — | Opérations GitHub |
| claude-md-management | 1.0.0 | Audit/maj des CLAUDE.md |
| security-guidance | 2.0.3 | Guidage sécurité |
| commit-commands | — | Commit / push / PR git |
| csharp-lsp | 1.0.0 | Serveur de langage C# + doc |

#### superpowers (v5.1.0) — le moteur de process
La colonne vertébrale que Hyperpowers orchestre. ~15 skills de discipline ; chaque principe du
Standard en délègue un.
- **using-superpowers** — établit comment trouver/utiliser les skills ; impose d'invoquer un skill
  avant toute réponse. *Fonctionnement* : injecté en tête de session, c'est la « méta-règle ».
- **brainstorming** — exploration d'intention/besoin AVANT tout travail créatif. *Fonctionnement* :
  dialogue structuré qui transforme une demande floue en spec.
- **test-driven-development** — rouge→vert→refactor, code minimal pour passer le test. *Rigide.*
- **systematic-debugging** — méthode d'investigation d'un bug AVANT de proposer un fix. *Rigide.*
- **writing-plans** — transforme une spec en plan multi-étapes (cases `- [ ]`, rangé dans
  `docs/.../plans/`). *Fonctionnement* : produit un artefact de plan mono-session.
- **executing-plans** — exécute un plan écrit avec checkpoints de revue.
- **subagent-driven-development** — exécute les tâches indépendantes d'un plan via subagents dans la
  session courante.
- **dispatching-parallel-agents** — quand 2+ tâches indépendantes sans état partagé → parallélise.
- **verification-before-completion** — exige des preuves (commandes lancées, sortie observée) avant
  de déclarer « terminé ». *Fonctionnement* : garde-fou anti-« ça devrait marcher ».
- **requesting-code-review** / **receiving-code-review** — demander une revue / recevoir un retour
  avec rigueur (vérifier au lieu d'acquiescer).
- **using-git-worktrees** — isole le travail d'une feature dans un worktree.
- **finishing-a-development-branch** — présente les options de clôture (merge/PR/cleanup).
- **writing-skills** — processus + vérifications pour créer/éditer un skill (Iron Law : pas
  d'édition sans échec à corriger).

#### frontend-design — UI distinctive
*Description* : génère des interfaces front production-grade à forte qualité de design, en évitant
l'esthétique « IA générique ». *Fonctionnement* : skill de génération (composants/pages/artefacts)
qui injecte des principes de direction artistique. **⚠️ Recouvre `ui-ux-pro-max` (🟨).**

#### code-review — revue de PR
*Description* : code-review d'une pull request. *Fonctionnement* : analyse un diff/une PR et reporte
les problèmes. **⚠️ Recouvre la commande built-in `/code-review` et `/review`.**

#### skill-creator — usine à skills
*Description* : créer, modifier, optimiser, évaluer des skills ; mesurer leur performance de
déclenchement (evals, variance, optimisation de description). *Fonctionnement* : c'est le levier que
le Relecteur recommande pour **resserrer les descriptions** des skills qui sur-déclenchent.

#### github — opérations GitHub
*Description* : intégration GitHub (PR, issues, API). *Fonctionnement* : expose des commandes/MCP
pour piloter GitHub depuis Claude Code. (Pas de skill « / » exposé dans cette session — agit via
commandes/outils.)

#### claude-md-management (v1.0.0) — hygiène des CLAUDE.md
- **revise-claude-md** — met à jour CLAUDE.md avec les apprentissages de la session courante.
- **claude-md-improver** — audite TOUS les CLAUDE.md d'un repo, les note contre un template, produit
  un rapport qualité puis applique des correctifs ciblés.

#### security-guidance (v2.0.3) — sécurité
*Description* : guidage de revue de sécurité. *Fonctionnement* : alimente la revue sécurité.
**⚠️ Recouvre la commande built-in `/security-review`.**

#### commit-commands — git
- **commit** — crée un commit git.
- **commit-push-pr** — commit + push + ouvre une PR.
- **clean_gone** — nettoie les branches locales marquées `[gone]` (supprimées sur le remote), y
  compris les worktrees associés.

#### csharp-lsp (v1.0.0) — C#
- **csharp-docs** *(🟦 skill exposé)* — garantit que les types C# sont documentés en commentaires
  XML, selon les bonnes pratiques. *Fonctionnement* : le plugin fournit un serveur de langage C#
  (navigation/diagnostics) ; le skill `csharp-docs` cible la documentation XML. **Pertinent pour
  tes projets LumIR Lasers (WPF .NET).**

### B. 🟩 Plugins tiers installés

#### hyperpowers (v0.6.0) — le tien
*Description* : Standard de qualité (penser avant · simplicité · chirurgical · piloté par objectif)
injecté au SessionStart, déléguant le process aux skills superpowers ; absorbe karpathy en une seule
voix. *Skills maison* :
- **brainstorming-advanced** — débat multi-agents pour décisions à vraies tensions (méta-routage
  pool léger / dynamique, catalogue 6 entités). Distinct de `brainstorming` (explore) et de
  `conseil` (lit l'existant).
- **conseil** — mini firm (Stratège/Guide/Relecteur) qui *lit l'existant* pour analyser/réviser.
  Livrables dans `firm/`. (← le skill en cours.)
- **newproject** — amorçage d'un projet en 5 phases, avant tout code.
- **cahier-maitre** — journal/registre maître transverse des événements projet.
- **project-reference** — génère un document de référence durable et exhaustif d'un projet.
- **session-handoff** — résumé de fin de session (état + prochaines étapes), source de reprise.
- **check-dependencies** — diagnostique si superpowers + planning-with-files sont installés, donne
  les commandes d'install manquantes.

#### planning-with-files (v2.43.0) — planification fichiers (Manus)
*Description* : planification persistante par fichiers `task_plan.md` / `findings.md` /
`progress.md`. *Fonctionnement* : des **hooks réinjectent le plan** à chaque appel d'outil et
rappellent de mettre à jour `progress.md` ; **survit aux `/clear` et compactions**. Reste **dormant**
tant qu'aucun `task_plan.md` n'existe. Skills : `plan` (démarre), `status` (état), `planning-with-files`.
**⚠️ Tension structurelle connue avec `writing-plans` de superpowers** (deux formats de plan non
interopérables) — gérée par le routage du Standard (grosse tâche cross-session → pwf).

### C. 🟨 Skills personnels (hors-plugin)

- **karpathy-guidelines** — garde-fous comportementaux pour réduire les erreurs LLM courantes
  (sur-complication, changements non chirurgicaux, hypothèses tacites). **⚠️ Déjà ABSORBÉ par le
  Standard Hyperpowers** → candidat n°1 à la désactivation.
- **ui-ux-pro-max** — intelligence design web/mobile (50+ styles, 161 palettes, 57 pairings de
  polices, guidelines UX, charts, intégration shadcn/ui MCP). *Description très large* (« plan,
  build, create, design, review, fix, improve, optimize, enhance, refactor, check ») → **sur-
  déclenche**. **⚠️ Recouvre `frontend-design`** → choisir l'un des deux.
- **LumirLasers_Claude_Skill** — bonnes pratiques + workflow release + méthode debug + bible de
  projet pour les projets **LumIR Lasers** (WPF .NET 4.8 + SolidWorks Interop + Google Drive + WPF
  PDM). *Fonctionnement* : à consulter avant code COM/SolidWorks, NuGet, dimensionnement WPF, PR
  GitHub, debug, ou rédaction de la bible projet. **Spécifique à ton domaine — à garder.**
- **lumirpdm-release-workflow** — workflow LumirPDM_V6 (branche feature, bump de version dans
  MainWindow.xaml, commit scope-préfixé, PR GitHub). *Fonctionnement* : s'applique en fin de session
  de code LumirPDM. **Spécifique — à garder.**

### D. ⚙️ Commandes built-in du harness (Anthropic, non-plugin)

Ces skills ne viennent d'aucun plugin — ils sont fournis par Claude Code lui-même.
- **run** — lance/pilote l'app du projet pour voir une modif en vrai (CLI/serveur/TUI/Electron…).
- **verify** — vérifie qu'un changement fait ce qu'il doit, en lançant l'app et observant le comportement.
- **init** — initialise un CLAUDE.md avec la doc du codebase.
- **review** — revue d'une PR. **⚠️ Recouvre `code-review` (plugin).**
- **code-review** — revue du diff courant à un niveau d'effort (low→ultra) ; `ultra` = revue
  multi-agents cloud. `--comment` poste en PR, `--fix` applique. **⚠️ Recouvre le plugin code-review.**
- **simplify** — revoit le code changé pour réutilisation/simplification/efficacité et applique les
  correctifs (qualité seulement, ne cherche pas les bugs). **Aligné avec ton étoile polaire.**
- **security-review** — revue de sécurité des changements de la branche. **⚠️ Recouvre `security-guidance`.**
- **fewer-permission-prompts** — scanne les transcripts et ajoute une allowlist à `.claude/settings.json`.
- **update-config** — configure le harness via `settings.json` (hooks, permissions, env vars).
- **keybindings-help** — personnalise les raccourcis clavier (`~/.claude/keybindings.json`).
- **loop** — exécute un prompt/commande en boucle sur un intervalle (`/loop 5m /foo`).
- **schedule** — crée/gère des agents cloud planifiés (cron/routines), ou un run unique programmé.
- **claude-api** — référence API Claude / SDK Anthropic (model ids, pricing, tool use, streaming,
  caching, migration). *Fonctionnement* : à lire avant de répondre sur un sujet Claude/Anthropic.

### Récapitulatif des recouvrements (à trancher)

| Paire en doublon | Étage | Reco firm |
|------------------|-------|-----------|
| `code-review` (plugin) ↔ `/code-review` + `/review` (built-in) | aval | garder le built-in (effort + ultra cloud), ignorer le plugin |
| `security-guidance` (plugin) ↔ `/security-review` (built-in) | aval | un seul — le built-in suffit pour l'usage perso |
| `frontend-design` (🟦) ↔ `ui-ux-pro-max` (🟨) | amont | choisir UN ; resserrer/désactiver l'autre |
| `karpathy-guidelines` (🟨) ↔ Standard Hyperpowers | amont | désactiver (déjà absorbé) |
| `planning-with-files` ↔ `writing-plans` (superpowers) | déjà géré | routage par taille de tâche (principe 5) |

---

## Tranchage final des 2 recouvrements restants (2026-06-09)

> Suite à la décision « trancher chacun ». Les 2 autres recouvrements (`karpathy-guidelines`,
> `frontend-design`/`ui-ux-pro-max`) ont été réglés en session 8 par désinstallation.

**Fait critique vérifié avant de trancher :** `/code-review`, `/review` et `/security-review` sont
des **built-ins du harness Claude Code**, fournis par Claude Code lui-même (section D ci-dessus). Ils
**ne dépendent pas** des plugins Anthropic homonymes — les désinstaller ne casse aucun built-in. Le
geste est donc sûr **et réversible** (un plugin se réinstalle en une commande).

### Recouvrement 1 — `code-review` (plugin 🟦) ↔ `/code-review` + `/review` (built-in ⚙️)
**Tranché : garder les built-ins, désinstaller le plugin `code-review`.**
Le built-in `/code-review` est un **sur-ensemble** du plugin : niveaux d'effort `low→ultra`,
`ultra` = revue multi-agents dans le cloud, `--comment` (poste en PR), `--fix` (applique). `/review`
couvre la revue d'une PR. Le plugin ne fait que « revue de PR » — entièrement couvert. Bonus :
`/simplify` (built-in) reste l'outil qualité-seulement aligné sur l'étoile polaire.

### Recouvrement 2 — `security-guidance` (plugin 🟦) ↔ `/security-review` (built-in ⚙️)
**Tranché : garder le built-in `/security-review`, désinstaller le plugin `security-guidance`.**
Pour un outil **personnel non-commercial** axé qualité du code, la revue de sécurité ponctuelle de la
branche (built-in) couvre le besoin. C'est le recouvrement le **moins tranché** des quatre (le plugin
v2.0.3 offre potentiellement un guidage proactif plus riche) — mais la décision est **réversible** :
si un projet sensible le justifie, réinstaller `security-guidance` en une commande.

### Exécution
- **Cette machine (Mac, 4 plugins)** : `code-review` et `security-guidance` **ne sont pas installés** →
  rien à faire ici (la décision est déjà de facto en place).
- **Machine principale (Windows, 11 plugins)** : désinstaller via le gestionnaire de plugins —
  `/plugin` → onglet de désinstallation, ou `/plugin uninstall code-review@claude-plugins-official`
  et `/plugin uninstall security-guidance@claude-plugins-official` (confirmer les noms exacts via
  `/plugin` sur la machine concernée).

### Bilan curation
Les **4 recouvrements** identifiés par la firm sont désormais tranchés :
`karpathy-guidelines` (désinstallé, absorbé par le Standard) · `ui-ux-pro-max` (désinstallé au profit
de `frontend-design`) · `code-review` (built-in gardé) · `security-guidance` (built-in gardé). La
tension structurelle `planning-with-files` ↔ `writing-plans` reste **gérée par routage** (principe 5),
pas un recouvrement à supprimer.
