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

## Priorité
Process d'abord (brainstorming/debugging décident l'approche), implémentation ensuite.
