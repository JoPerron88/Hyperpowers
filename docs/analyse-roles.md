# Analyse #6 — Les rôles d'équipe : que remplace réellement ce skill ?

> Réalisée le 2026-06-05. Lentille : un skill améliore Claude Code — un développeur
> propulsé par LLM. Une équipe logicielle a plusieurs rôles. Question : **lesquels la
> fusion des 4 endosse-t-elle, et lesquels te laisse-t-elle ?**
> Court par discipline (cf. #5) : un long texte sur « trop de managers » performerait le mal.

---

## Les rôles d'une équipe de dev (compressé)

- **Produit** : Product Owner (quoi/pourquoi, faut-il le construire), UX/Designer.
- **Ingénierie** : Architecte/Tech Lead (design, arbitrages), **Développeur (celui qui tape le code)**.
- **Qualité** : QA/testeur indépendant (cherche ce que le dev n'a pas vu), Reviewer (goût, standards).
- **Ops** : DevOps/SRE, Sécurité.
- **Coordination** : Chef de projet (suivi, déblocage).
- **Savoir** : Mémoire institutionnelle / doc (« pourquoi a-t-on fait X il y a 2 ans »), Expert domaine.

En **solo amateur**, tous ces rôles s'effondrent sur une personne (toi) + un LLM. La valeur
d'un skill = **restaurer un rôle manquant**.

---

## Qui joue quoi : les 4 atterrissent tous *autour* du développeur

| Source | Rôle endossé |
|---|---|
| **superpowers** | **Tech Lead + Chef de projet** (design, plan, séquence, checkpoints) |
| **planning-with-files** | **Chef de projet** (suivi de phases, progrès, ne pas perdre le fil) |
| **karpathy** | **Reviewer** (le goût : « est-ce sur-compliqué ? chirurgical ») |
| **mempalace** | **Mémoire institutionnelle** (se souvenir à travers le temps) |

**Le constat central** : **le seul « doer » — celui qui tape réellement le code — c'est le
LLM lui-même.** Aucun des 4 n'est le développeur. La fusion **entoure un seul développeur de
trois voix de management/qualité (tech lead, chef de projet, reviewer) et d'un archiviste.**

*(Précision : la subagent-driven-development de superpowers* orchestre *le « faire » — elle
n'ajoute pas un second développeur.)*

---

## Ce que ça fait à l'antithèse #5 (objection D)

L'objection D disait « trois des quatre gouvernent le même métier ». La lentille des rôles
**nuance et durcit** à la fois :
- **Nuance** : tech-lead, chef de projet et reviewer sont des rôles *réellement distincts* —
  pas de la pure redondance.
- **Durcit** : **aucune vraie équipe ne donne trois managers à un seul développeur.**
  Conclusion honnête → **consolider les voix de management** ; la **mémoire** (mempalace) est
  le seul rôle vraiment à part.

---

## Le vrai sujet : les rôles que personne ne couvre

C'est ici que se cache la valeur — les rôles que la fusion **ne** remplit pas, et que **toi
(solo, amateur) es contraint de jouer** :

- **Product Owner** — décider *quoi* construire et *si ça doit exister*. superpowers *extrait*
  une spec mais présuppose que l'humain est le PO.
- **QA adversariale indépendante** — les tests TDD (superpowers) sont écrits par
  l'implémenteur : ils **héritent de ses angles morts**. Personne ne cherche *contre* lui.
- **UX/Designer** et **Expert domaine** — absents.
- **DevOps/Sécurité** — quasi rien (au-delà du merge final).

---

## La punchline

Le rôle le plus cruellement absent est le **Product Owner** — la fonction qui *force à
livrer et à valider*. Et son absence **explique exactement pourquoi ce projet a cinq analyses
et zéro ligne de code.**

La lentille des rôles ne fait pas que décrire l'équipe : elle **explique la pathologie**
diagnostiquée en #5. Tu as réuni autour du développeur-LLM trois managers (qui adorent
planifier, cadrer, critiquer) et un archiviste — mais **personne dans cette équipe n'a pour
travail de dire « assez analysé, on expédie et on regarde si ça marche ».** Ce rôle, c'est
toi. Il n'a pas encore parlé.

---

## Ce que ça implique

Le jugement produit, la vraie QA, et « la mémoire aide-t-elle vraiment » sont précisément les
choses **qu'on ne peut pas faire exister par l'analyse** — elles n'apparaissent qu'à l'usage.
La lentille des rôles converge donc exactement là où l'antithèse pointait :

➡️ **Le coup évident n'est pas une analyse #7. C'est la sonde** : endosser le rôle de Product
Owner, installer les 4, faire **une vraie tâche**, et observer qui, dans cette « équipe »,
tient réellement son rôle — et qui n'est que du bruit en contexte.

---

## Prochaine étape

Décision de Product Owner (toi) : déclencher la sonde, ou non. Pas d'autre analyse tant que
celle-ci n'a pas converti une inférence en constat.
