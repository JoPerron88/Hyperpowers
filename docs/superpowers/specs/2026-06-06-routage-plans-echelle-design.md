# Spec — Hyperpowers v2 : routage des plans à la bonne échelle

> Conçu le 2026-06-06 (skill `superpowers:brainstorming`). Fait suite à la v1 (noyau
> comportemental, livré + vérifié runtime) et au constat « pwf conditionnel » de la Sonde 1 du
> spike. Cette v2 ajoute **une 5ᵉ règle au Standard** : router le travail vers le bon niveau de
> planification selon la taille de la tâche, pour ne **pas sur-planifier les petites tâches**.

## Objectif

Faire **coexister sans chevauchement** les deux systèmes de planification déjà présents :

- `superpowers:writing-plans` / `executing-plans` — plan directeur **statique** (écrit une fois,
  tâches TDD bite-sized) ;
- `planning-with-files` (pwf) — plan **vivant** (`task_plan.md` / `findings.md` / `progress.md`,
  reprise après `/clear`, hook PreCompact).

Le problème ciblé est exactement la mission d'Hyperpowers (`CLAUDE.md`) : **éviter les
chevauchements de `description` qui créent des déclenchements ambigus**. pwf s'auto-déclare sur
« any work requiring 5+ tool calls » ; superpowers writing-plans sur « a spec or requirements for
a multi-step task ». Sans arbitrage, ces deux déclencheurs se marchent dessus et tendent à
**sur-planifier** des tâches moyennes/petites.

La v2 ajoute au Standard un **routage conseillé + un arbitrage explicite des déclencheurs** :
petite → pas de plan (TDD direct) ; moyenne → superpowers ; grosse/longue → pwf.

## Non-objectifs (explicitement hors v2)

- **Pas de 3ᵉ système de planification.** Le tier moyen = `superpowers` **tel quel**. On
  n'ajoute aucun `findings.md`/`progress.md` fait main (ce serait une 2ᵉ voix de management, ce
  que le spike a écarté — analyse #6 « une seule voix de management suffit »).
- **Pas de fork** de superpowers ni de pwf. La v2 est purement **additive** dans `standard.md`.
- **Pas de nouveau skill ni de nouveau hook de routage.** Un skill dont la `description`
  capterait « grosse tâche » recréerait le déclenchement ambigu qu'on veut supprimer (approche B
  rejetée au brainstorming).
- **Pas de réécriture du mécanisme d'injection.** On réutilise le `hooks/session-start.mjs` v1.

## Contexte / décisions du brainstorming

- **Mécanisme retenu = C** (« A + arbitrage »). Le Standard est *injecté au SessionStart* et
  **conseille** ; le déclenchement automatique d'un skill passe par sa `description`, qu'on ne
  peut pas éditer (non-fork). Donc le routage est **advisory** (Claude lit le Standard et
  s'auto-route) — cohérent avec le mécanisme v1, déjà cité en runtime. La part « C » ajoute
  l'**arbitrage** des déclencheurs existants qui se chevauchent.
- **Tier moyen = superpowers tel quel.** Sur demande utilisateur, survol de pwf pour idées
  empruntables : une seule est *cheap et non-redondante* → la **récitation** (relire le plan
  avant chaque décision, contre le « lost in the middle » ~50 appels). C'est un **principe de
  comportement, zéro plomberie**. Tout le reste de pwf (findings/progress/reprise `/clear`/
  PreCompact/attestation) **EST** le tier « grosse tâche » — on le garde là, on ne le descend pas.
- **État d'install vérifié** : `planning-with-files` est installé **skill-only**
  (`~/.claude/skills/planning-with-files` → `~/.agents/skills/...`, v2.43.0, hooks dans le
  frontmatter, rien dans `settings.json`). Les copies `temp_local_*` sont des orphelins, pas
  l'install actif. Preuve empirique antérieure (journal du spike) : ces hooks frontmatter
  **tirent** en skill-only. ⚠️ À **re-vérifier en Phase 0** du plan (filet de sécurité, pas
  prémisse) — c'est l'ambiguïté qui avait coûté un tour au spike.

## Architecture

Inchangée par rapport à la v1 : le **dépôt EST le plugin**, injection au SessionStart via
`hooks/session-start.mjs` (JSON `hookSpecificOutput.additionalContext`). La v2 **n'ajoute aucun
fichier de mécanisme** — elle modifie le **contenu** injecté (`standard.md`) et les tests.

```
standard.md                  — +1 principe « Planifier à la bonne échelle » + tableau d'arbitrage
hooks/session-start.mjs      — inchangé (émet standard.md)
tests/standard.test.mjs      — +cas couvrant le 5ᵉ principe et la référence vivante à pwf
```

## Le 5ᵉ principe (contenu à injecter)

Ajouté à `standard.md` après les 4 principes existants, même style (« le QUOI » qui pointe vers
« le COMMENT »).

**Titre** : « 5. Planifier à la bonne échelle ».

**Corps** : router le travail selon la taille, pour ne pas sur-planifier. Trois tiers, chacun
pointant vers la voix de management qui le réalise :

| Tier | Quand (déclencheur) | Le COMMENT |
|---|---|---|
| **Petite** | changement unique et bien défini, une approche évidente, peu d'outils | **Pas de plan** → `superpowers:test-driven-development` directement |
| **Moyenne** | multi-étapes, demande conception/découpage, mais **bornée et mono-session** | `superpowers:brainstorming` (si créatif) → `writing-plans` → `executing-plans` / `subagent-driven-development`. **Récite** : relis le plan avant les décisions clés. |
| **Grosse/longue** | nombreuses phases, **franchit plusieurs sessions**, va probablement croiser un `/clear` ou une compaction, **découvertes qui s'accumulent** | `planning-with-files` (plan vivant `task_plan.md`/`findings.md`/`progress.md` + reprise) |

**Arbitrage (la part « C », explicite dans le texte)** : le discriminant **moyen ↔ grosse**
n'est **pas** le « 5+ tool calls » que pwf annonce (seuil trop bas — il pousserait *tout* vers
pwf). C'est : **« est-ce que la tâche franchit des sessions / une compaction, et des découvertes
vont-elles s'accumuler que je devrai me rappeler plus tard ? »** → oui : pwf ; non : superpowers.
En cas de doute, **rester au tier inférieur** (anti sur-planification).

## Flux de données

Aucun nouveau. Le hook v1 lit `standard.md` et l'injecte ; le 5ᵉ principe voyage avec les 4
autres. Le routage s'exerce ensuite dans le raisonnement de Claude (advisory), qui invoque la
skill nommée par le tier.

## Gestion d'erreur / cas limites

- **pwf absent / désinstallé** : le principe pointe vers `planning-with-files` ; si la skill
  n'est pas là, le tier « grosse » dégrade naturellement vers superpowers (writing-plans sur un
  gros plan). Le test des « références vivantes » doit **constater** la présence de pwf et
  échouer franchement si la référence devient morte (comme pour les références superpowers v1).
- **Doute de tier** : règle explicite « rester au tier inférieur » — pas de comportement
  indéfini.
- **Hooks pwf inertes** : si la Phase-0 du plan montre que les hooks ne tirent pas dans l'install
  courant, le tier « grosse » perd sa valeur (suivi vivant). → le plan doit traiter ça comme un
  bloquant à résoudre (réinstall plugin / vérif) avant de déclarer la v2 livrée.

## Stratégie de test

Étendre `tests/standard.test.mjs` (node:test, zéro dépendance), dans la lignée v1 :

1. **Présence du 5ᵉ principe** : `standard.md` contient le titre « Planifier à la bonne échelle »
   et les trois tiers (petite / moyenne / grosse).
2. **Arbitrage présent** : le texte mentionne le discriminant « franchit des sessions /
   compaction / découvertes qui s'accumulent » (pas seulement « 5+ tool calls »).
3. **Référence vivante à pwf** : le principe nomme `planning-with-files`, et le test vérifie que
   cette skill **existe réellement** sur le système (même logique que les références superpowers
   vivantes en v1) — sinon échec franc.
4. **Le hook émet bien le 5ᵉ principe** : `session-start.mjs` produit un `additionalContext`
   qui contient le nouveau titre (réutilise le test de contrat JSON v1).

## Critères de done (vérifiables)

- [ ] `standard.md` contient le 5ᵉ principe + le tableau des 3 tiers + l'arbitrage.
- [ ] `npm test` vert, avec les 4 nouveaux cas ci-dessus.
- [ ] Référence `planning-with-files` vivante (skill présente, test le prouve).
- [ ] Plugin réinstallé (le standard est copié dans le cache à l'install) **et** vérif runtime :
      une session fraîche cite le 5ᵉ principe dans son contexte SessionStart.
- [ ] Phase-0 : confirmé que les hooks pwf tirent dans l'install courant (ou bloquant traité).
