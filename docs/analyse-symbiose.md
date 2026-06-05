# Analyse #3 — La meilleure symbiose des 4

> Réalisée le 2026-06-05. S'appuie sur `analyse-sources.md` (ce que fait chacun) et
> `analyse-conflits.md` (ce qui casse quand on les combine). Ici : **la vision cible.**
>
> Brief (décidé avec l'utilisateur) :
> - **Usage personnel d'abord**, dans **Claude Code**, pragmatique.
> - **mempalace pleinement assumé** : vraie mémoire long terme verbatim, runtime Python accepté.
> - **Étoile polaire = la qualité du code** (l'angle karpathy : penser avant, simplicité, chirurgical, piloté par objectif).

---

## La thèse en une phrase

**Aucun des quatre ne « produit » de la qualité de code. Un seul la *définit* (karpathy) ;
les trois autres créent les *conditions* pour l'atteindre. La meilleure symbiose fait de
la qualité l'output, et de la mémoire le mécanisme qui la fait *composer dans le temps* —
en transformant la règle locale de planning-with-files « ne jamais répéter un échec » en
une garantie permanente, à l'échelle de toute ta pratique.**

Aujourd'hui, cette règle (`planning-with-files`, SKILL.md règle #6) ne vit que le temps
d'une tâche : `progress.md` est effacé au projet suivant. mempalace possède exactement les
primitifs pour la rendre **permanente** (`kg_add`, `diary_write`). Personne ne les a câblés.
C'est le gisement.

---

## Le modèle mental : 4 couches, 1 colonne vertébrale, relue à l'aune de « qualité »

```
        ┌─────────────────────────────────────────────────────────────┐
        │  karpathy = LE STANDARD (toujours actif)                      │
        │  « voilà à quoi ressemble du bon code »                        │
        │  penser avant · simplicité · chirurgical · piloté objectif    │
        └─────────────────────────────────────────────────────────────┘
                                   ▲ enforce à chaque étape
        ┌─────────────────────────────────────────────────────────────┐
        │  superpowers = LE PROCESSUS qui opérationnalise le standard   │
        │  brainstorm → plan → TDD → revue → finition                   │
        └─────────────────────────────────────────────────────────────┘
                                   ▲ garde le standard+plan en attention
        ┌─────────────────────────────────────────────────────────────┐
        │  planning-with-files = LA MÉMOIRE DE TRAVAIL (une tâche)      │
        │  « ne jamais répéter un échec » … pendant cette tâche         │
        └─────────────────────────────────────────────────────────────┘
                                   ▲ promeut / rappelle les apprentissages
        ┌─────────────────────────────────────────────────────────────┐
        │  mempalace = LA MÉMOIRE LONG TERME (toute ta pratique)        │
        │  « ne jamais répéter un échec » … pour toujours                │
        └─────────────────────────────────────────────────────────────┘
```

Lu de bas en haut, c'est une seule promesse qui monte en échelle :
**la qualité d'aujourd'hui devient le socle de la qualité de demain.**

---

## L'architecture retenue : « Conductor » (chef d'orchestre)

**Hyperpowers est une fine couche d'orchestration qui *conduit* les 4 — sans les
réécrire.** Concrètement : un marketplace qui bundle les 4 (mempalace inclus, dépendance
assumée) + **une seule couche de coordination** :

1. **Un skill « lifecycle »** qui définit le cycle de tâche unifié (début → travail → fin)
   et arbitre les conflits ci-dessous.
2. **Un hook coordinateur unique** sur `Stop`/`PreCompact` qui remplace la double-exécution
   par une séquence ordonnée (flush plan → sauvegarde mémoire).
3. **Un noyau comportemental** = karpathy fusionné, référencé par le processus superpowers
   (une seule voix, pas deux).

Les 4 restent à jour depuis l'amont ; la symbiose vit dans la coordination, pas dans un fork.

**Alternatives écartées :**
- **« Forge » (tout forker/fusionner en un seul code)** — contredit l'étoile polaire
  (simplicité), maintenance énorme, tu hérites de toute l'app Python de mempalace, tu
  perds les mises à jour amont. Rejeté.
- **« Kernel + adaptateurs » (normaliser les I/O de chaque outil)** — plus propre mais
  surdimensionné pour un usage perso ; la couche d'adaptateurs est sa propre dette. Gardé
  en repli si la coordination par hooks s'avère trop indirecte.

> Le choix de A *est* cohérent avec l'objectif : on optimise la qualité, donc l'architecture
> doit incarner « Simplicity First ». Forker 4 projets pour prêcher la simplicité serait
> l'ironie ultime.

---

## Les deux jointures porteuses

Tout le reste est de la plomberie. Ces deux-là *sont* la symbiose.

### Jointure #1 — Deux plans, deux altitudes (et non deux plans concurrents)

Le conflit #1 de l'analyse #2 (deux modèles de plan qui s'ignorent) ne se résout PAS en
forçant l'un dans l'autre — ils ne sont pas à la même altitude :

| Artefact | Rôle | Où | Réinjecté ? |
|---|---|---|---|
| **Recette** (superpowers `writing-plans`) | plan TDD granulaire, code exact, étape par étape, consommé par `subagent-driven-development` | `docs/superpowers/plans/*.md` (statique) | **Non** — lu à la demande |
| **Tracker** (PwF `task_plan.md`) | mince ancre de phases + statut + erreurs ; **pointe vers** la recette | racine projet / `.planning/` | **Oui** — c'est lui, et lui seul |

Ainsi : la recette détaillée reste sur disque (pas de bloat de contexte), pendant que le
**tracker mince** est ce que les hooks réinjectent à chaque tour — le budget de contexte
est préservé. `TodoWrite` redevient ce qu'il doit être : un brouillon **intra-tour**, jamais
la source de vérité. La source de vérité, c'est le tracker.

### Jointure #2 — La boucle mémoire (le cœur « la qualité se bonifie »)

```
   DÉBUT DE TÂCHE                                    FIN DE TÂCHE (1 hook coordinateur)
   ┌───────────────────────┐                         ┌───────────────────────────────┐
   │ wake-up scopé projet  │                         │ 1. flush progress.md  (existant)│
   │  kg_query + diary_read│◄───── rappel ───────┐   │ 2. mine verbatim session(exist.)│
   │  → amorce le plan     │                     │   │ 3. DISTILLER les apprentissages │
   └──────────┬────────────┘                     │   │    durables :                   │
              │                                   │   │    • décisions/faits → kg_add   │
              ▼                                   │   │    • leçons/erreurs   → diary_write
        ┌───────────────┐   karpathy enforce     │   │    • extraits clés    → add_drawer
        │  TRAVAIL       │   superpowers séquence │   └──────────────┬────────────────┘
        │  (recette+     │   PwF garde en attention                  │
        │   tracker)     │───── erreurs loggées ─────────────────────┘
        └───────────────┘                         promotion (LA glue neuve)
```

- **Au début** : `kg_query` + `diary_read` (outils MCP existants) scopés au projet/topic →
  injectés dans le plan initial. L'agent *commence* en connaissant les décisions passées et
  les erreurs déjà commises ici.
- **Pendant** : rien de neuf — la recette + le tracker + karpathy + superpowers font le travail.
- **À la fin** : un **seul** hook coordinateur (qui dédoublonne PwF + mempalace) :
  1. flush `progress.md` *(comportement PwF existant)*
  2. mine verbatim de la session *(hook mempalace existant, en arrière-plan)*
  3. **NEUF — la promotion** : distiller les apprentissages durables vers
     `kg_add` (décisions : « migré vers X le 2026-06-05 », avec validité) et
     `diary_write` (leçons/erreurs, par topic). Outils MCP **déjà présents**
     (`mcp_server.py` : `tool_kg_add`, `tool_diary_write`, `tool_add_drawer`).

**Honnêteté sur le « neuf » vs l'existant** : les primitifs de mémoire (kg/diary/drawer)
et le mine verbatim existent. mempalace fait déjà du *bulk verbatim* (rappel volumineux).
Ce que Hyperpowers ajoute, c'est le chemin **haut-signal** : promouvoir des *apprentissages
distillés* (décisions, erreurs) et les rappeler de façon ciblée. C'est précisément le chemin
qui sert la qualité — l'erreur d'aujourd'hui devient permanente, requêtable, et resurgit
avant que tu la refasses.

---

## Comment chaque conflit de l'analyse #2 est résolu

| Conflit (analyse #2) | Résolution par la symbiose |
|---|---|
| 🔴 Deux modèles de plan (no-op mutuel) | **Jointure #1** : deux altitudes liées (recette statique + tracker mince réinjecté) |
| 🔴 Double `Stop`/`PreCompact` | **Un hook coordinateur unique** qui séquence flush → mine → promotion |
| 🔴 Suivi dédoublé (TodoWrite vs task_plan) | `task_plan.md` = source de vérité ; `TodoWrite` = brouillon intra-tour |
| 🟠 Doctrine de contexte opposée | **Politique unique** : mempalace en arrière-plan only (sauf wake-up explicite) ; injection PwF *throttlée* (UserPromptSubmit + sous-ensemble de `PreToolUse`, pas chaque `Read`/`Grep`) |
| 🟠 karpathy redondant avec superpowers | **Fusionné** dans le noyau comportemental, référencé par superpowers → une seule voix |
| 🟡 Collision `/status` | Namespacing CC (`/mempalace:status` vs `/planning-with-files:status`) — documenté, point final |
| ✅ Ponts non câblés (§6-G) | **C'est la Jointure #2** : la boucle mémoire EST le câblage manquant |

---

## Le flux de bout en bout (une tâche type, orientée qualité)

1. Tu lances une tâche dans un projet. **wake-up** rappelle : « la dernière fois ici, tu as
   migré vers Vitest ; l'approche X avait échoué pour la raison Y ». (kg_query + diary_read)
2. **brainstorming** (superpowers) cadre, **writing-plans** produit la *recette* TDD ; un
   *tracker* mince est créé et pointe dessus.
3. L'agent exécute (subagent-driven-development). À chaque édition, **karpathy** impose
   chirurgical + simplicité ; **PwF** réinjecte le tracker pour ne pas dériver ; les erreurs
   vont dans `progress.md`.
4. Compaction au milieu ? Le tracker survit, est relu, le travail continue sans perte.
5. Fin de tâche : le hook coordinateur flush le tracker, mine la session, **et promeut** :
   « décision : adopté Vitest (2026-06-05) » → KG ; « erreur : mock ESM cassé, fix = … » → diary.
6. Trois semaines plus tard, autre projet, même piège ESM : le wake-up te le ressort **avant**
   que tu le retombes. La qualité a composé.

---

## L'effet net

- **Qualité immédiate** : karpathy + superpowers + le tracker en attention → diffs chirurgicaux,
  pas de sur-ingénierie, exécution qui ne dérive pas.
- **Qualité qui se bonifie** : chaque erreur/décision devient un actif mémoire permanent et
  rappelé → tu ne refais pas deux fois la même faute, *jamais*, même entre projets.
- **Coût maîtrisé** : un seul plan réinjecté (mince), mempalace en arrière-plan, une seule
  voix comportementale, un seul point de sauvegarde.

---

## Ce qui reste à concevoir (au moment du design détaillé, pas maintenant)

Deux décisions de « glue » à spécifier — tout le reste compose de l'existant :

1. **La politique d'injection exacte** : quel sous-ensemble de `PreToolUse` déclenche la
   réinjection du tracker (probablement `Write|Edit` + `Bash`, pas `Read|Grep`) ; quel
   volume de wake-up au début.
2. **Le schéma de distillation** : comment décider *ce qui* est « durable » en fin de tâche
   (quelles lignes de `progress.md` deviennent `kg_add` vs `diary_write`), et avec quel
   format d'entité/topic pour que le rappel soit précis.

---

## Prochaine étape (non commencée)

Ceci est la **vision**, pas un plan d'implémentation. À toi de réagir : valider, corriger,
ou creuser une jointure. Le design détaillé (puis le plan) viendra ensuite, en partant des
deux décisions de glue ci-dessus.
