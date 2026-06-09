# Design — Glue inter-skills (v1 : première arête + filet de test)

**Date :** 2026-06-08
**Processus :** brainstorming-advanced (pool léger — Sage + Intégrateur + Enthousiaste, 2 tours)
**Décision :** Option A — arête vivante + filet de test de cohérence

---

## Contexte

La promesse centrale d'Hyperpowers est la **symbiose inter-skills** : faire en sorte que des
skills se composent mieux entre eux. C'est le cœur jamais encore implémenté du projet (FinalGoal).

Le débat a tranché à l'unanimité contre un **orchestrateur actif** (un mécanisme central qui
enchaîne les skills) : il serait une « fausse autorité » puisque Hyperpowers **ne contrôle pas**
le déclenchement des skills (c'est le runtime Claude Code qui décide via le champ `description`).

→ La glue est **déclarative** : pointeurs croisés markdown entre skills + descriptions disjointes,
le tout **vérifié par un test** (sinon la glue déclarative se dégrade en pointeurs morts).

Le « bus de contexte » (artefacts partagés que les skills se transmettent) reste un **horizon
émergent** : il se construira arête par arête, jamais décrété. Une arête vivante prouve le graphe.

## Découverte (writing-skills, RED) : l'arête comportementale est déjà vivante

La spec prévoyait initialement de **durcir une arête** (brainstorming-advanced → writing-plans :
passer le chemin de la spec). Le cycle `writing-skills` (Iron Law : pas d'édition sans baseline
qui échoue) a **réfuté** ce besoin :

- **Baseline 1** (brainstorming → writing-plans) : un subagent frais a **spontanément** passé le
  chemin de la spec à writing-plans, instruit de « la lire en premier » et de « ne pas rouvrir le
  débat ». ✅ Vert.
- **Baseline 2** (brainstorming → décisions tranchées) : sur une demande de re-débattre un sujet
  déjà tranché et documenté (« forker superpowers »), le subagent s'est arrêté à la Question Zéro
  du test d'éligibilité, a **refusé de débattre** et a remonté l'info depuis les docs. ✅ Vert.

**Conclusion :** le comportement de symbiose (passage d'artefact + garde-fou anti-relitige) émerge
déjà de Claude + des skills existants. Aucune édition de skill n'est justifiée (Iron Law + YAGNI).
Les deux transcripts baseline **sont** la preuve visible que la symbiose fonctionne.

→ **Choix utilisateur (2026-06-08) : v1 = le filet de test seul.** En substance c'est l'Option C
du débat, mais re-cadrée : on ne livre pas « zéro symbiose visible » — on livre la **garantie
anti-régression** d'une symbiose déjà prouvée vivante.

## Décision : v1 = filet de test de cohérence inter-skills

Deux tests dans `tests/standard.test.mjs` :

**Test A — Pointeurs morts.** Scanner tous les `skills/*/SKILL.md`. Ne matcher que les références
**préfixées** (`superpowers:X` ou `hyperpowers:Y`) — sans ambiguïté des pointeurs réels, ce qui
évite les faux positifs sur une mention en passant. Pour chaque référence, vérifier qu'elle existe :
- `superpowers:X` → présent dans le cache superpowers installé (réutiliser la logique du test
  « références vivantes » déjà présent pour `standard.md`) ;
- `hyperpowers:Y` → présent dans `skills/` du dépôt.

**Test B — Anti-chevauchement (déterministe, pas sémantique).** Un fichier de déclaration liste
les **paires de skills déclarées disjointes** (ex. `conseil` / `brainstorming-advanced`) avec, pour
chacune, la **phrase de démarcation exacte** attendue dans une des deux descriptions. Pour chaque
paire, le test vérifie que cette phrase est **présente** dans la description de l'un des deux skills.
On vérifie la **présence d'un marqueur textuel explicite**, pas une comparaison sémantique.

Raffinement (vs un simple nom de skill) : le marqueur est la phrase de démarcation, pas le nom —
sinon `brainstorming-advanced` satisferait trivialement le test en contenant « brainstorming » dans
sa propre description. La phrase de démarcation prouve que la frontière est réellement tracée.

**Fichier de déclaration des paires :** `skills/disjoint-pairs.json` — tableau d'objets
`{ "skills": [a, b], "boundaryMarker": "<phrase>" }`. Format minimal, zéro-dépendance. Maintenu à la
main quand une nouvelle frontière est établie.

Exemple :
```json
[
  {
    "skills": ["conseil", "brainstorming-advanced"],
    "boundaryMarker": "use brainstorming for that"
  }
]
```

## Ce qui est explicitement HORS scope v1

- **Câblage de toutes les arêtes** (conseil→session-handoff, newproject→brainstorming, etc.) :
  attendre d'observer que la première arête paie. Le bus reste émergent.
- **Bus de contexte formalisé** (schéma, contrat de format, ordre garanti) : voisinage de la
  boucle mémoire (spike rouge) — on ne le décrète pas.
- **Analyse sémantique des descriptions** : trop fragile. Le test B vérifie des marqueurs textuels.

## Critère de succès

- Les deux tests passent au vert sur l'état actuel du dépôt (toutes les références sont vivantes,
  la paire conseil/brainstorming-advanced a son marqueur de frontière).
- Le test devient un **garde-fou** : renommer un skill ou casser une frontière déclarée fait
  passer le test au rouge.

## Traçage FinalGoal

Cap = symbiose inter-skills + qualité du code. Cette décision **sert directement le cap** : elle
livre la première composition inter-skills observable, avec un filet de test qui garantit la
qualité (pas de pointeurs morts, pas de chevauchements ambigus).

## Prochaines étapes

1. ~~`superpowers:writing-skills` pour durcir l'arête~~ — **fait, conclu sans édition** : les
   baselines RED sont verts, aucune édition justifiée (voir section Découverte).
2. `superpowers:writing-plans` pour planifier l'implémentation des deux tests + `disjoint-pairs.json`
   en TDD. **C'est le seul livrable de code de la v1.**
