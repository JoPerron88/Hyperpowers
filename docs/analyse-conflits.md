# Analyse #2 — Forces, faiblesses, overlaps, gaps et conflits des 4 sources

> Réalisée le 2026-06-05. Fichier indépendant. Complète `analyse-sources.md`
> (qui décrit *ce que fait* chaque source) en se concentrant sur ce qui se passe
> **quand on tente d'utiliser les 4 ensemble**.
>
> Sources : `superpowers` v5.1.0, `planning-with-files` v2.43.0 (PwF), `mempalace`
> v3.3.6, `andrej-karpathy-skills` v1.0.0 (karpathy). Clones dans `sources/`.
>
> Méthode : lecture directe des manifestes, des SKILL.md, des hooks (frontmatter +
> scripts), des commandes et des scripts de complétion. Les affirmations sur le
> comportement des hooks sont tirées du code, pas supposées.

---

## 1. Forces de chacun

| Source | Force distinctive (ce qu'elle est seule à apporter) |
|---|---|
| **superpowers** | Le **squelette méthodologique** : processus éprouvé et auto-déclenché (bootstrap `SessionStart`), 14 skills composables, orchestration de subagents, TDD/YAGNI/DRY, gouvernance stricte. |
| **planning-with-files** | Le **seul à renforcer activement en boucle** : ses hooks réinjectent le plan, rappellent de mettre à jour `progress.md`, et vérifient la complétion. **Survit aux resets de contexte** (`/clear`, compaction). Durcissement anti-injection (attestation SHA-256). Isolation de plans parallèles. Portée 17+ harness. |
| **mempalace** | La **seule vraie mémoire long terme verbatim**, local-first et privée. Rappel élevé (96,6 %), graphe de connaissances temporel, ~19–29 outils MCP. Vraie application d'ingénierie, pas un fichier de prompt. |
| **karpathy** | **Garde-fous comportementaux** à fort signal pour un coût ~nul. Adresse directement le mode d'échec « le modèle sur-complexifie / suppose en silence ». Fusion triviale (prose pure). |

---

## 2. Faiblesses de chacun

| Source | Faiblesses |
|---|---|
| **superpowers** | **Aucune mémoire** (oublie tout entre sessions). Suivi de travail via **TodoWrite = volatile** (exactement ce que PwF reproche). Cérémonie lourde pour petites tâches ; posture rigide « *EVERY project* passe par la porte ». |
| **planning-with-files** | **Coût en tokens** de l'injection par hook. Complexité interne (5 hooks, résolution slug, attestation). Son format de plan est un **dialecte propre** non interopérable. L'injection `PreToolUse` est bruyante. Dépend du modèle qui maintient réellement les fichiers. |
| **mempalace** | **Runtime lourd** (Python + ChromaDB + modèle d'embedding ~300 Mo). Friction d'installation. Plugin **délégatif** : ne marche que si la CLI/MCP externe est installée. Caveat rétention 30 j si les hooks ne sont pas câblés. Peut injecter un gros contexte de rappel. |
| **karpathy** | **Aucune application** : prose sans hook, facile à ignorer. **Fortement redondant** avec superpowers. Aucun mécanisme — juste un texte. |

---

## 3. Overlaps (recouvrements)

1. **Planification (fort)** — superpowers `writing-plans`/`executing-plans` vs PwF `task_plan.md`. **Deux formats, deux emplacements, deux conventions de complétion**, non interopérables (détaillé en §6-C).
2. **Suivi de tâche (moyen)** — `TodoWrite` (superpowers) vs `task_plan.md` + `progress.md` (PwF). Deux systèmes de tracking concurrents.
3. **Philosophie / garde-fous (fort)** — les 4 principes de karpathy (Simplicity First, Think Before Coding, Surgical Changes, Goal-Driven) sont quasi un **sous-ensemble** des valeurs superpowers (YAGNI/DRY, brainstorming « surface tradeoffs / ask », TDD « goal-driven »).
4. **« Filesystem as memory » (conceptuel)** — PwF (scratchpad d'une tâche) et mempalace (mémoire long terme verbatim) partagent le même slogan à des **portées différentes**. Pas de collision de fichiers (PwF écrit dans le projet/`.planning/` ; mempalace dans son palais), mais recouvrement de concept.
5. **Persistance pré-compaction** — PwF et mempalace veulent tous deux « sauver avant compaction » (détaillé en §6-D).

---

## 4. Gaps (ce qu'aucun des 4 ne fournit)

- **Aucune couche d'arbitrage/coordination.** Chacun est une île : il n'existe nulle part une notion partagée de « on est dans une tâche ; voici LE plan ; voici la mémoire ».
- **Aucune identité de tâche partagée** reliant la tâche PwF ↔ le wing/room mempalace ↔ le plan superpowers.
- **Aucun contrôle d'ordre/priorité des hooks inter-plugins.** Claude Code exécute *tous* les hooks correspondants ; l'ordre entre plugins n'est pas exprimable proprement par l'utilisateur.
- **Aucune déduplication** de la prose philosophique (karpathy ≈ valeurs superpowers) → deux voix qui disent la même chose.
- **Aucun pont de données automatique** : `findings.md`/`progress.md` (PwF) ne nourrissent pas la mémoire long terme mempalace ; le rappel mempalace n'amorce pas un plan PwF ; la complétion d'un plan superpowers ne déclenche pas de sauvegarde mempalace de « ce qu'on a appris ».
- **Aucun packaging unifié** : mempalace exige un runtime Python/ChromaDB, les trois autres sont zéro-dépendance.
- **Matrice de harness inégale** : superpowers (7), PwF (17+), mempalace (CC + MCP + Gemini), karpathy (CC + Cursor). Un produit unifié aurait un support de plateforme hétérogène.

---

## 5. Matrice des événements de hook (preuve)

| Événement | superpowers | planning-with-files | mempalace | karpathy |
|---|---|---|---|---|
| `SessionStart` | ✅ injecte le bootstrap | — | — | — |
| `UserPromptSubmit` | — | ✅ injecte le plan (si actif) | — | — |
| `PreToolUse` | — | ✅ injecte le plan à chaque `Write\|Edit\|Bash\|Read\|Glob\|Grep` (si actif) | — | — |
| `PostToolUse` | — | ✅ nudge `progress.md` après `Write\|Edit` (si actif) | — | — |
| `Stop` | — | ✅ `check-complete.sh` (exit 0, **non bloquant**) | ✅ save Python (timeout 30 s) | — |
| `PreCompact` | — | ✅ rappel (echo) | ✅ save Python (timeout 90 s) | — |

> « si actif » = les hooks PwF font un **early-exit 0** tant qu'aucun `task_plan.md` /
> `.planning/` ne se résout. PwF est donc **dormant** tant qu'on n'adopte pas sa
> convention de fichiers — ce qui restreint nettement le périmètre réel des conflits.
> Note : mempalace n'a **pas** de hook `SessionStart` ; son `wake-up` (rappel L0–L3)
> est une commande CLI/MCP **opt-in**, pas une injection automatique.

---

## 6. Conflits — classés par ce qui les déclenche

Tout n'est pas « conflit ». Quatre catégories, de la plus inconditionnelle à la plus bénigne.

### A. Coûts permanents (dès l'installation, inconditionnels)

- **mempalace tourne un job Python sur *chaque* `Stop` (≤30 s) et *chaque* `PreCompact` (≤90 s).** Indépendant des trois autres : taxe fixe de latence en fin de tour et avant compaction.
- **La tool-list MCP de mempalace** publie ~19–29 définitions d'outils **dans chaque session**. Coût de contexte permanent (les schémas d'outils occupent le prompt) + un processus serveur qui tourne, que la mémoire soit utilisée ou non ce jour-là.
- **superpowers injecte son bootstrap à chaque `SessionStart`** (`startup|clear|compact`). Coût fixe mais ponctuel, modéré.

### B. Double-suivi conditionnel (seulement si deux systèmes sont *activement* utilisés)

Le vrai mode d'échec, précis : lancer **superpowers `writing-plans`** (→ `docs/superpowers/plans/X.md`) **et** faire un **`/plan`** PwF (→ `task_plan.md`) dans la même tâche. On obtient alors **deux fichiers de plan** vivant en parallèle, PwF réinjectant le sien **à chaque appel d'outil** pendant que l'exécuteur superpowers suit l'autre. Tracking dédoublé + budget de contexte gaspillé. Tant qu'on n'ouvre pas de `task_plan.md`, PwF reste dormant et ce conflit n'existe pas.

### C. Redondance « choisis-en un » (no-op mutuel, pas un crash)

Les deux systèmes de planification **n'interopèrent pas** : `check-complete.sh` ne cherche que `### Phase` / `**Status:**` dans `task_plan.md` — il est **aveugle** aux plans superpowers en cases `- [ ]` rangés ailleurs. Conséquence : on choisit un système, la machinerie de l'autre est de l'install gaspillé (le hook `Stop` PwF rapportera « No task_plan.md found » si on planifie à la superpowers). Ce n'est pas une panne, c'est de la redondance.

### D. Collisions d'événements de hook

- **`Stop` double-fire** : PwF (`check-complete.sh`, non bloquant, sort du texte) **+** mempalace (save Python). Les deux s'exécutent à chaque arrêt → sortie redondante + latence cumulée.
- **`PreCompact` double-fire** : PwF (rappel instantané) **+** mempalace (save ≤90 s). Pas d'interblocage, mais la sauvegarde mempalace peut dominer la fenêtre pré-compaction.
- **Ordre inter-plugins non coordonné** : Claude Code exécute **tous** les hooks correspondants ; *que* les deux tournent est certain, *dans quel ordre* ne l'est pas de façon contrôlable. La conclusion (« rien ne les coordonne ») tient quel que soit l'ordre.

### E. Collisions cosmétiques

- **Commande `status`** exposée à la fois par mempalace et PwF. Claude Code **namespace** les commandes (`/mempalace:status` vs `/planning-with-files:status`) : seul le `/status` **nu** est ambigu. Mineur.

### F. Tensions philosophiques

- **Vrai opposé** : mempalace pose « *background everything, zéro token de bookkeeping dans le chat* » ; PwF **injecte le plan dans le chat à chaque appel d'outil**. Deux doctrines inverses sur l'hygiène de contexte. Cohabitables, mais idéologiquement contradictoires.
- **Tension dans l'alignement** : karpathy dit « *pour les tâches triviales, utilise ton jugement* (ne sur-process pas) » ; superpowers `brainstorming` impose « *EVERY project* passe par la porte, même une todo-list ». Différence sur la **cérémonie par défaut** — réelle, mais sur le reste karpathy **renforce** superpowers (TDD, goal-driven, simplicité). À présenter comme tension *au sein* d'un alignement, pas comme contradiction nette.

### G. Complémentaire — mais non câblé (le gisement de valeur)

Pas des conflits : des connexions qui *devraient* exister et n'existent pas.
- `findings.md`/`progress.md` (PwF) en fin de tâche → ingestion verbatim dans le palais mempalace.
- `wake-up` mempalace en début de tâche → pré-charge une session de planning PwF.
- superpowers orchestre **quand** planifier (PwF) et **quand** se souvenir (mempalace).
- karpathy comme garde-fou transversal pendant les phases d'écriture de code de tous les autres.

---

## 7. Hiérarchisation (impact × résolvabilité)

| Niveau | Problème | Pourquoi ça compte |
|---|---|---|
| 🔴 **Architectural** (la fusion se joue là) | **Unifier le modèle de plan** (un seul format, ou un adaptateur bidirectionnel) | Sans ça, B + C persistent : deux systèmes qui s'ignorent. |
| 🔴 **Architectural** | **Coordonner l'injection de contexte + le budget `Stop`/`PreCompact`** | Un seul point de sauvegarde, une seule politique d'injection — sinon coûts A + D cumulés. |
| 🟠 **Philosophique** | Doctrine de contexte (mempalace « zéro token » vs PwF « injecte tout ») | Doit être tranché : la fusion ne peut pas tenir les deux à la fois. |
| 🟠 **Philosophique** | Cérémonie par défaut (karpathy jugement vs superpowers porte systématique) | Décider du seuil où le process complet s'applique. |
| 🟡 **Cosmétique** | Collision `/status` | Réglé par le namespacing ; à documenter, c'est tout. |

---

## 8. Implications pour la fusion (questions ouvertes — pas encore de design)

Cette taxonomie *est* la liste de décisions que la fusion devra trancher :

1. **Un seul modèle de plan** : adopter celui de PwF (hooks + survie au reset) ? celui de superpowers (TDD bite-sized) ? ou un adaptateur qui traduit l'un vers l'autre ?
2. **Une seule politique de contexte** : qui injecte quoi, quand, avec quel plafond ?
3. **Un seul point de persistance** sur `Stop`/`PreCompact` (dédupliquer PwF + mempalace).
4. **Câbler les ponts de données** (§6-G) : PwF ↔ mempalace ↔ superpowers.
5. **Dédupliquer karpathy** dans superpowers, ou le garder comme condensé comportemental transversal ?
6. **Packaging** : vu la dépendance Python de mempalace, probablement un **marketplace qui bundle** + un fin skill d'orchestration, plutôt qu'un plugin monolithique.

---

## Prochaine étape (non commencée)

Design de la fusion. À reprendre quand décidé — en partant de la §8.
