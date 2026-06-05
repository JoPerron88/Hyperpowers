# Analyse #5 — L'antithèse

> Réalisée le 2026-06-05. Rôle assumé : l'avocat du diable. Méthode : *steelman puis
> frappe* — j'accorde à chaque cible sa version la plus forte, puis j'attaque où ça tient
> vraiment. Critique intellectuelle, pas démolition. Les objections sont rangées du plus
> important (le projet, le processus) au moins (les repos pris un par un).
>
> **Contrainte que ce doc s'impose** : il doit être le plus court des cinq. Un antithèse
> bavarde qui dénonce le bavardage se réfute elle-même.

---

## Objection 0 — la seule qui compte vraiment

**Cinq analyses, ~700 lignes de prose, zéro ligne de code. Un README d'un mot.**

Les outils mêmes qu'on encense condamneraient cet état : karpathy (« penser avant — mais
*looper jusqu'au but* »), planning-with-files (« ne planifie pas indéfiniment, *exécute* »),
superpowers (le design débouche sur l'implémentation). On a produit le contraire : de
l'analyse qui appelle de l'analyse. Les framings successifs (« la meilleure analyse de ta
vie », « la meilleure symbiose ») **récompensent l'élaboration, pas la livraison.**

Pire : **tout est inféré, rien n'est observé.** Chaque conflit, chaque synergie des analyses
#1–#4 a été *lu dans le code*, jamais *constaté en usage*. Je n'ai jamais lancé mempalace,
jamais vu le double hook `Stop` se déclencher, jamais mesuré la taxe de contexte. J'ai
présenté des inférences avec l'assurance de constats.

---

## Remise en question du projet (le cœur)

**A. La ligne de base n'a jamais été comparée.** L'alternative la moins chère n'a jamais été
sur la table : **un seul bon `CLAUDE.md`** (les principes karpathy + « écris l'important dans
des fichiers ») **+ le `/plan` natif de Claude Code + des notes manuelles, sans mempalace.**
Pour un usage perso non-dev sur petites tâches, c'est plausiblement **~80 % de la valeur pour
~1 % du coût et de la maintenance.** Tout le projet présuppose que la fusion vaut le coup sans
jamais se mesurer au quasi-rien.

**B. « Conductor » s'effondre peut-être en « Forge ».** La synthèse #3 exige de *dédupliquer*
le double `Stop`/`PreCompact` et de *brider* l'injection par appel d'outil de PwF. Or si
Claude Code exécute **tous** les hooks correspondants sans préséance ni suppression entre
plugins — ce que les configs livrées suggèrent — on **ne peut pas** faire ça depuis une couche
externe fine : il faudrait éditer/forker les configs de hook de PwF et mempalace. La couche
mince redevient alors le **fork** qu'on avait rejeté. *(À vérifier en exécutant : c'est le
risque architectural critique, et le plus facile à tester.)*

**C. « La qualité se bonifie » est infalsifiable.** On ne peut pas observer l'erreur *évitée*
grâce au rappel mémoire — le contrefactuel est invisible. Une étoile polaire qu'on ne peut
mesurer ne peut être ni optimisée ni validée. Le bénéfice-titre du projet est, tel qu'énoncé,
invérifiable.

**D. Trois des quatre gouvernent le même métier.** superpowers, planning-with-files *et*
karpathy veulent tous régir *comment* l'agent travaille. Ce n'est pas un empilement propre de
couches — c'est une **autorité qui se chevauche**. Lecture honnête : tu as probablement besoin
d'**un seul** de {superpowers, planning-with-files} + de la mémoire, **pas des deux**. Ça
attaque la prémisse « fusionner 4 » à la racine.

**E. Le projet viole sa propre étoile polaire.** L'objectif déclaré est simplicité / YAGNI /
chirurgical. Le projet est l'inverse : fusionner 4 outils, 5 analyses, une couche
d'orchestration… pour obtenir une discipline que deux des quatre fournissent déjà seuls.

---

## Remise en question des 4 (le support, pas l'événement)

- **superpowers** — efficacité **non prouvée** (≠ réfutée). Aucun dossier eval/benchmark ;
  ses tests vérifient que les skills *se déclenchent*, jamais qu'ils *améliorent le code*.
  La méthodo la plus utilisée des quatre est la moins evidence-based, et s'impose par
  injection coercitive (« you MUST… not negotiable »).
- **planning-with-files** — son benchmark (96,7 % vs 6,7 %) **isole « structure vs aucune
  structure », pas « ce skill vs une alternative ».** N'importe quel cadre battrait le
  baseline nu. Le churn (40+ releases, frontmatter cassé 2×) est un signe de *thrashing*,
  pas seulement un coût de maintenance.
- **mempalace** — 96,6 % R@5 mesure le **rappel**, pas l'**utilité** : un haut rappel ne dit
  rien sur le fait que la mémoire injectée *améliore* la sortie (ou la *dégrade* via du stale).
  Le verbatim-éternel est aussi un passif. Runtime lourd + 19–29 outils MCP en contexte
  permanent. (Les 14 mentions impostor/malware/expire : drapeau jaune dans les deux sens —
  vraie usurpation *ou* urgence fabriquée.)
- **karpathy** — **67 lignes** de prose mises au même rang qu'un moteur mémoire de 300 Mo.
  Bon conseil, mais aucun mécanisme : « ça marche *si* tu vois moins de diffs ». Foi, pas mesure.

---

## Remise en question des analyses — et de cette consultation même

Le narrateur n'est pas fiable. On m'a demandé « le meilleur » et « la meilleure symbiose » —
des cadrages **biaisés vers la confirmation** ; j'ai livré des synthèses enthousiastes. J'ai
**répété les benchmarks (#1) comme du marketing** sans interroger ce qu'ils mesurent — la
faute de rigueur que je reproche maintenant aux repos.

Et l'advisor consulté à chaque étape **n'est pas une validation indépendante** : il a vu mon
transcript, co-construit le design, validé l'architecture qu'il m'aide à présent à attaquer.
Rien de ce qu'il « confirme » ne confirme quoi que ce soit. **Seule l'exécution réelle des
quatre, une fois, tranche.**

---

## Ce qui survit à la critique

- Le **diagnostic des conflits** (#2) tient : double hook, deux formats de plan, taxe de
  contexte sont réels *dans le code* — reste à voir s'ils mordent *en usage*.
- La **boucle mémoire** (#3, jointure #2) reste l'idée la plus originale, *si* la mémoire
  s'avère nette-positive — ce qui est précisément non démontré (objection C).
- karpathy comme **simple `CLAUDE.md`** est défendable — ce qui renforce l'objection A, pas le
  projet.

---

## La bifurcation honnête (pas de synthèse — ce sera #6)

Deux chemins, et l'objection 0 désigne le bon :

1. **Continuer à analyser** — confortable, et exactement la pathologie diagnostiquée.
2. **Une sonde minimale** — installer les 4, faire **une seule vraie tâche**, et *observer* :
   le double `Stop` se déclenche-t-il ? la taxe de contexte est-elle mesurable ? un rappel
   mémoire sert-il vraiment ? les formats de plan se télescopent-ils ? Cela convertit la plus
   grosse inférence en constat.

Falsifiabilité — ce qui tuerait chaque objection :
- **A** meurt si une vraie tâche montre la pile complète battant `CLAUDE.md`+`/plan` d'une
  marge qui vaut le coût.
- **B** meurt si Claude Code expose une préséance/suppression de hooks inter-plugins.
- **C** meurt si on instrumente un rappel mémoire empêchant réellement une erreur répétée.
- **D** meurt si une tâche réclame distinctement superpowers **et** planning-with-files.

Tant qu'aucune de ces preuves n'existe, le projet repose sur une foi raisonnée — pas sur des
constats.
