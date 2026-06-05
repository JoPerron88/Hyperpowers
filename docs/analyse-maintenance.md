# Analyse #4 — Mises à jour des sources & ajout de fonctionnalités

> Réalisée le 2026-06-05. Suite directe de `analyse-symbiose.md` (architecture
> « Conductor » retenue). Répond à : comment vit Hyperpowers dans le temps ?
>
> Décision actée avec l'utilisateur : **stratégie de mise à jour = Hybride** (à jour par
> défaut, mais alerté si une update amont casse une interface dont on dépend).
> Étoile polaire toujours = **qualité / simplicité**.

---

## Le principe résolveur : construire la détection, différer l'isolation

Pour un outil **personnel**, la tentation est de bâtir une grosse machinerie de maintenance
(couches d'adaptation, lockfiles, matrice de compatibilité, CI planifiée). Ce serait trahir
« Simplicity First ».

La ligne juste :
- **Détection** (on construit) : *savoir* de quoi on dépend, et *être prévenu* quand ça
  casse. Bon marché, haute valeur — c'est exactement ce que veut dire « Hybride ».
- **Isolation** (on diffère) : abstractions, frameworks d'adaptateurs, CI. Spéculatif —
  on devinerait ce qui va changer. **YAGNI** : on l'ajoute quand une vraie casse le mérite.

Tout le modèle ci-dessous découle de cette ligne.

---

## L'artefact central : la « surface de contrat »

**Hyperpowers ne dépend pas des 4 sources « en gros » — il dépend d'un petit ensemble
précis d'interfaces.** Cet ensemble *est* l'API de la couche Conductor vers les 4. Le
nommer explicitement, le garder **petit, explicite et centralisé (DRY)**, c'est ça « gérer
les mises à jour ».

Ce dont Hyperpowers dépend, source par source :

| Source | Surface de contrat (ce qu'on consomme) |
|---|---|
| **planning-with-files** | Format `task_plan.md` (`### Phase` + `**Status:** complete\|in_progress\|pending`) ; délimiteurs `===BEGIN/END PLAN DATA===` ; événements de hook (UserPromptSubmit, PreToolUse, PostToolUse, Stop, PreCompact) ; noms de scripts (`init-session.sh`, `check-complete.sh`, `resolve-plan-dir.sh`) ; résolution `.planning/<slug>/` + `.active_plan`. |
| **mempalace** | **Noms d'outils MCP** : `kg_add`, `kg_query`, `diary_write`, `diary_read`, `add_drawer` (le contrat de la boucle mémoire) ; commande serveur `mempalace-mcp` ; CLI `mempalace wake-up` / `mempalace hook run`. |
| **superpowers** | Noms des skills consommés ; format de plan `docs/superpowers/plans/*.md` (cases `- [ ]`) ; mécanisme de déclenchement (Skill tool + bootstrap SessionStart). |
| **karpathy** | Le texte des 4 principes (qu'on fusionne). Quasi rien — voir « risque ». |

> **DRY, pas abstraction prématurée** : chaque élément de cette surface (un nom d'outil MCP,
> une hypothèse de format de plan) doit vivre à **un seul endroit** dans le code de la couche
> Conductor. Un renommage amont devient alors un correctif d'**une ligne**, pas une chasse.
> Ce n'est pas un framework d'adaptateurs — juste « ne te répète pas ».

---

## Le modèle Hybride, concret

**Détection — on construit :**
1. **La surface de contrat documentée** (le tableau ci-dessus, maintenu dans le repo).
2. **Un test de fumée lancé *à la mise à jour*** (pas de CI planifiée) : il vérifie que la
   surface tient encore — le format `task_plan.md` parse-t-il ? les 5 outils MCP existent-ils
   toujours ? les skills superpowers consommés sont-ils présents ? S'il détecte une dérive,
   il **alerte**.
3. **Une simple ligne « versions connues-bonnes »** (ex. `PwF 2.43 · mempalace 3.3 ·
   superpowers 5.1 · karpathy 1.0`) — pas un mécanisme de lock, juste un repère.

**Isolation — on diffère (YAGNI) :** pas de lockfile, pas de matrice semver, pas de couche
d'adaptateurs, pas de CI. On les ajoutera *si* une casse réelle le justifie.

> **Précision factuelle** : le test de fumée cible les **plugins installés** (ce qui tourne
> réellement et se met à jour via le marketplace Claude Code), **pas** les clones de
> `sources/` — ceux-ci sont des copies d'étude jetables et gitignorées.

---

## Risque par source (mené par la preuve)

- 🔴 **planning-with-files — risque le plus élevé.** Son propre changelog le prouve : il a
  **cassé son propre frontmatter deux fois** (`---` → `===` en v2.26.2 puis v2.38.1 à cause
  des délimiteurs de plan), déplacé/oublié des scripts entre variantes (v2.36.x), changé la
  portabilité du hook Stop (v2.34.1). Churn permanent (des dizaines de releases). **C'est ici
  que le test de fumée doit être le plus strict.**
- 🟠 **mempalace — risque moyen.** Application versionnée ; le nombre d'outils MCP a grossi
  (19 → 29) au fil des versions → un nom pourrait changer. Test de fumée = **lister les outils
  MCP** et vérifier la présence des 5 du contrat.
- 🟡 **superpowers — risque moyen-bas.** Cœur stable, mais réorganise/renomme ses skills, et
  **rejette explicitement les changements « fork-specific »** → on ne peut pas remonter du
  code Hyperpowers-spécifique en amont. Risque = skill renommé/supprimé.
- 🟢 **karpathy — risque le plus bas.** Prose minuscule et stable. Option pragmatique :
  **intégrer le texte directement** (MIT) plutôt que d'en dépendre comme plugin externe — ça
  retire une source de la surface de contrat pour un coût nul.

---

## L'ajout de nouvelles fonctionnalités

**Le principe unificateur** : *une nouvelle feature doit étendre TA couche, pas approfondir
ton couplage.* Toute feature qui ajoute une dépendance à une source **élargit la surface de
contrat à surveiller**. Ainsi « où vit une feature ? » se répond avec le même concept que
« comment marchent les updates ? ».

Trois tiers, du plus sûr au dernier recours :

| Tier | Quand | Coût |
|---|---|---|
| **1. Additif dans la couche Conductor** (défaut, ~tous les cas) | la feature vit dans *nos* skill/hooks/commands ; on ne touche pas les 4 | nul sur la surface de contrat |
| **2. Override via préséance** | changer le *comportement* d'une source via un hook/skill qui prend le dessus, sans la modifier | faible |
| **3. Fork d'une source** (dernier recours) | quand il faut vraiment changer l'intérieur d'une source | **élevé : tu quittes le train des updates pour cette source** — à documenter |

Cas particulier mémoire : toute feature mémoire **compose les primitifs MCP existants**
(`kg_add`, `diary_write`, …) → Tier 1, zéro nouveau code mempalace, zéro élargissement.

**Arbre de décision :**
```
Puis-je le faire dans ma propre couche ?           → oui : Tier 1.
  └ non → Puis-je l'obtenir par préséance hook/skill ? → oui : Tier 2.
        └ non → dois-je changer l'intérieur d'une source ? → Tier 3 (fork + assume le coût).
```

---

## Ce que ça implique (au design détaillé — pas maintenant)

Artefacts à créer plus tard, tous légers :
1. **`CONTRACT.md`** — la surface de contrat (le tableau), tenue à jour.
2. **Un script de smoke-test** — lancé à la main / par Claude après chaque update ; vérifie
   le contrat sur les plugins installés ; alerte sur dérive.
3. **La ligne « versions connues-bonnes »** dans le repo.
4. **La règle DRY** — un seul point de référence par dépendance externe dans le code.

Rien d'autre tant qu'une casse réelle ne le réclame.

---

## Continuité avec les analyses précédentes

Le test de fumée ne garde pas n'importe quoi : il garde **précisément les deux jointures
porteuses** de l'analyse #3 —
- **Jointure #1** (plans à deux altitudes) → le format `task_plan.md` doit rester parsable.
- **Jointure #2** (boucle mémoire) → les outils `kg_add` / `diary_write` / `add_drawer`
  doivent rester présents.

Autrement dit : la maintenance protège exactement ce qui fait la valeur de la symbiose.

---

## Prochaine étape (non commencée)

Vision de maintenance, pas implémentation. Réagis : valider / corriger. Le design détaillé
réunira ensuite les **2 décisions de glue** de l'analyse #3 + ces **4 artefacts légers**.
