# Résultats du spike mémoire — kill-test « la mémoire améliore-t-elle le code ? »

Exécuté le 2026-06-05. 12 runs = 6 tâches × {à froid, avec mémoire}, **subagents frais**
(agents de codage vanilla, sans superpowers/karpathy ; seule variable = le corpus mémoire).
Aucun subagent n'a vu `TRAP.md`, `verify.test.mjs` ni `key.md`.

## Tableau des runs

| Tâche | Cond. | Tests | Lignes chg. | Piège touché | Réutilisation / note |
|---|---|---|---|---|---|
| 01-surgical-change | froid  | vert | 13 | **non** | réutilise `capitalize` ; +1 test dédié |
| 01-surgical-change | mémoire| vert |  8 | **non** | réutilise `capitalize` ; test existant mis à jour |
| 02-date-format     | froid  | vert | 10 | **non** | réutilise `formatDate` (JJ/MM/AAAA) |
| 02-date-format     | mémoire| vert | 10 | **non** | réutilise `formatDate` |
| 03-preserve-code   | froid  | vert |  3 | **non** | `normalize('NFD')` conservé |
| 03-preserve-code   | mémoire| vert |  5 | **non** | `normalize('NFD')` conservé |
| 04-async-await     | froid  | vert | 27 | **non** | `for`+`await` séquentiel correct |
| 04-async-await     | mémoire| vert | 17 | **non** | `for...of`+`await` (plus minimal) |
| 05-money-cents     | froid  | vert | 18 | **non** | centimes entiers ; +2 tests |
| 05-money-cents     | mémoire| vert | 14 | **non** | réutilise `itemTotal` ; +1 test |
| 06-yagni-greenfield| froid  | vert | 17 | **non** | `return n % 2 === 0` minimal |
| 06-yagni-greenfield| mémoire| vert | 17 | **non** | `return n % 2 === 0` minimal |

**Pièges touchés : 0/12** (0/6 à froid, 0/6 avec mémoire). **Tests : 12/12 verts.**

## Lecture vs seuil pré-enregistré

> Seuil (`README.md`) : mémoire utile si, **sur les tâches où le run à froid dégrade la
> qualité**, l'oracle **divise ce taux par ≥2 sans casser de tests**. Sinon → **rouge, on arrête**.

- **Le bras à froid n'a dégradé la qualité sur AUCUNE tâche** : 0 piège touché, code de prod
  chirurgical et réutilisant l'existant dans les deux bras. Les écarts de lignes (01, 04, 05)
  sont du **verbiage de test** (un test de plus), pas du code de prod hors-scope — vérifié en
  lisant chaque fichier source.
- Donc le **dénominateur du seuil est vide** : il n'y a pas de dégradation à froid que la
  mémoire pourrait diviser par 2.
- C'est exactement le cas prévu par l'**anti-trucage #4** du design : *« si les runs à froid
  ne tombent pas dans un piège réaliste, c'est le résultat — le modèle n'a pas besoin de cette
  mémoire ».*

## Verdict : 🔴 ROUGE (décisif au sens du kill-test)

**Sur cette batterie, une mémoire-oracle (rappel parfait) n'apporte aucun gain de qualité de
code mesurable** : le bras à froid produisait déjà du code propre, chirurgical et sans piège.
→ **On n'investit pas maintenant dans la boucle mémoire** (mempalace reste différé / écarté
pour cet objectif). L'hypothèse centrale d'Hyperpowers (« se souvenir améliore le code »)
**n'est pas soutenue** par ce test.

### Honnêteté sur la portée (ce que le rouge ne dit PAS)
- Ce n'est **pas** « la mémoire nuit ». La mémoire a légèrement **réduit** les lignes sur 3/6
  tâches (plus minimal) — effet réel mais marginal et non lié à l'évitement d'un piège.
- Le rouge est tiré par un **bras témoin déjà excellent** : ces tâches résolvables à froid +
  un modèle capable (subagents Claude) ne stumblent pas sur ces classes de piège. Une batterie
  à pièges plus durs, ou un modèle plus faible, pourrait donner un autre résultat — **non testé
  ici**. Le kill-test n'a jamais visé l'universalité ; il visait à décider s'il faut investir
  **maintenant**. Réponse : non.
- n petit (1 run par cellule), pas de « itérations jusqu'au vert » (proportionnalité, analyse #5).

### Confounder reconnu : les prompts à froid n'étaient pas « mémoire-naïfs »
De la guidance s'est glissée dans les specs/le préambule des deux bras :
- **Préambule commun** : « Effectue exactement la tâche suivante, **rien de plus** » ≈ note #13
  (YAGNI) — remise au bras témoin sur **toutes** les tâches (affaiblit surtout le piège 06).
- **02 froid** : « formatée selon **la convention du projet** » ≈ note #11 (format de date).
- **04 froid** : la spec énonce le comportement async correct (« en séquence… ne résout qu'à la
  fin ») → piège quasi inatteignable.
Conséquence : « le modèle n'a pas besoin de cette mémoire » est **trop fort**. Le constat exact,
et **plus robuste**, est : *un énoncé de tâche correct + un générique « fais exactement ça, rien
de plus » portent déjà ce que la note mémoire apporterait → un système de mémoire dédié n'ajoute
rien **par-dessus un prompting décent**.* Cela défend le rouge contre l'objection « ton témoin
n'était que Claude capable ». Ce n'est **pas** une raison de re-jouer (la pré-enregistration rend
ce rouge décisif ; re-jouer avec des pièges plus durs = la boucle de biais de confirmation que
l'analyse #5 a déjà fermée).

## Méthode / reproductibilité
- Scoreur : `spike/score.mjs` (`countChangedLines`, `runTests`), construit en TDD (Sonde 1).
- Scoring des runs : `spike/score-runs.mjs` (lignes + verify caché pour 02-05).
- Copies de travail : `spike/runs/<tâche>-<cond>/`.
