# Hyperpowers — Le Standard de qualité (injecté au SessionStart)

> Ceci est LE STANDARD : à quoi ressemble du bon code. superpowers fournit LE PROCESSUS qui
> l'atteint. Une seule voix : quand un principe ci-dessous nomme une skill superpowers, cette
> skill est le COMMENT — invoque-la, ne ré-improvise pas le principe. Les instructions de
> l'utilisateur priment toujours sur ce standard.

## 1. Réfléchir avant de coder
Expliciter les hypothèses ; si plusieurs interprétations existent, les présenter au lieu d'en
choisir une en silence ; si une approche plus simple existe, le dire. Si quelque chose est
flou : s'arrêter, nommer le flou, demander.
→ Process : `superpowers:brainstorming` avant tout travail créatif.

## 2. Simplicité d'abord (YAGNI)
Le minimum qui résout le problème, rien de spéculatif : pas d'options/config/abstraction non
demandées, pas de gestion d'erreur pour des cas impossibles.
→ Déjà imposé par `superpowers:test-driven-development` (code minimal pour passer le test).
  N'énonce pas la règle deux fois — applique TDD.

## 3. Changements chirurgicaux
Ne toucher que ce qui trace directement à la demande. Pas de refactor adjacent, pas de
nettoyage de code non demandé, adopter le style existant. Ne retirer que les orphelins que TES
changements créent.
→ Tenu pendant l'exécution : `superpowers:subagent-driven-development` ou
  `superpowers:executing-plans`.

## 4. Piloté par objectif
Transformer la tâche en critères vérifiables et boucler jusqu'au vert (« corrige le bug » →
« écris un test qui le reproduit, puis fais-le passer »).
→ `superpowers:test-driven-development` (rouge→vert) puis
  `superpowers:verification-before-completion` (preuve avant de déclarer terminé).

## 5. Planifier à la bonne échelle
Router le travail selon la taille de la tâche, pour ne pas sur-planifier. Trois niveaux, chacun
pointe vers la voix de management qui le réalise :

- **Petite** — changement unique et bien défini, une approche évidente, peu d'outils :
  **pas de plan**. → `superpowers:test-driven-development` directement.
- **Moyenne** — multi-étapes, demande conception/découpage, mais bornée et mono-session :
  → `superpowers:brainstorming` (si créatif), puis `superpowers:writing-plans`, puis
  `superpowers:executing-plans` / `superpowers:subagent-driven-development`.
  **Récite** : relis le plan avant chaque décision clé (contre le « lost in the middle »).
- **Grosse / longue** — nombreuses phases, franchit plusieurs sessions, va probablement croiser
  un `/clear` ou une compaction, découvertes qui s'accumulent :
  → `planning-with-files` (plan vivant `task_plan.md`/`findings.md`/`progress.md` + reprise).

Arbitrage moyen ↔ grosse : le discriminant n'est PAS le « 5+ tool calls » qu'annonce
planning-with-files (seuil trop bas — il pousserait tout vers pwf et sur-planifierait), mais :
« la tâche franchit-elle des sessions / une compaction, et des découvertes vont-elles s'accumuler
que je devrai me rappeler plus tard ? » Oui → pwf ; non → superpowers. En cas de doute,
**rester au tier inférieur**.

## Priorité
Process d'abord (brainstorming/debugging décident l'approche), implémentation ensuite.
