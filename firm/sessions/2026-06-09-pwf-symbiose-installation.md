# « Ai-je mal installé pwf ? » — symbiose superpowers ↔ planning-with-files
Date : 2026-06-09 | Entité principale : Relecteur

## Relecteur — voix principale
**Verdict :** Ça tient — l'installation de pwf est bonne ; ce que tu prends pour une « mauvaise
installation » est un malentendu sur ce que « symbiose » signifie dans ce projet.

**Signal :**
- L'installation du plugin pwf est **correcte** : `installed_plugins.json` confirme
  `planning-with-files@planning-with-files` **v2.43.0** présent — exactement la cible prescrite par
  `check-dependencies` et `OUTILLAGE.md` (source `github.com/OthmanAdi/planning-with-files`). Les
  62 tests verts du HANDOFF en dépendent. Rien de cassé côté installation.
- La « symbiose » n'a jamais été un **câblage**, par décision assumée : le seul lien Hyperpowers→pwf
  vit dans `standard.md` principe 5 (routage déclaratif « grosse tâche → pwf »). `hooks/hooks.json`
  ne déclare qu'un `SessionStart` qui injecte le Standard — **zéro hook ne touche pwf, zéro pont de
  données**. C'est la décision session 6 (« le runtime ne résout pas les dépendances ; la symbiose
  passe par les skills »). Niveau réel d'intégration = *routage + diagnostic*, et c'est voulu.
- Une vraie fusion des deux systèmes de plan est documentée comme un **piège**, pas comme un objectif
  manqué : `docs/analyse-conflits.md` §6-B décrit le seul mode d'échec — lancer un plan superpowers
  ET un `/plan` pwf dans la même tâche → deux plans en parallèle, pwf réinjectant le sien à chaque
  appel d'outil. Le projet l'**évite** délibérément en gardant pwf dormant. Mieux câbler les deux
  ferait *empirer* la situation.

**Contrainte :** Le mot « symbiose » dans ta tête (deux outils fusionnés qui se parlent) ne
correspond pas à la symbiose réellement construite (un routage qui désigne le bon outil selon la
taille de tâche, en gardant les deux systèmes étanches). Tant que ce décalage de définition n'est
pas explicité **dans le repo**, chaque session rouvrira le même soupçon de « mal installé » — alors
que rien n'est à réparer côté machine.

**Racine :** Hyperpowers s'est défini par négations successives — « pas un fork » (modèle C) → « pas
un marketplace curé » (session 6) → « pas un orchestrateur » (session 7). Trois fois, la symbiose a
été retirée du registre et des hooks pour devenir purement déclarative ; tu cherches aujourd'hui un
câblage concret que tes propres décisions ont méthodiquement vidé de toute substance runtime — la
symbiose existe, mais elle est devenue *invisible* à force d'être déclarative.

## Stratège — réaction
D'accord avec le verdict. Angle mort : le **risque de récidive**. Tant que le décalage de définition
n'est pas écrit dans le repo (Standard ou cahier), le doute « mal installé » se re-paiera à chaque
session — c'est une **dette de clarté, pas une dette technique**, et elle coûtera plus cher dans six
mois quand le contexte de la session 6 sera oublié. Priorité du mois : ajouter au Standard un encart
« Ce que symbiose veut dire ici (et ce qu'elle ne veut PAS dire) » qui transforme trois décisions de
négation en une affirmation positive. **Cap inchangé** : ne pas re-câbler le runtime sous la pression
du malentendu.

## Guide — réaction
D'accord — pour un non-développeur, la pire dette n'est pas dans le code, c'est dans la tête : le
doute « j'ai mal installé » revient gratuitement à chaque session et coûte du **stress, pas des
bugs**. Seule nuance : l'encart doit être en langage d'**impact** (« symbiose = le bon outil choisi
pour toi selon la taille de la tâche », et non « routage vs fusion »), sinon on remplace un jargon
par un autre. Et surtout : ne toucher à rien dans le runtime — la réponse est **une phrase à
écrire, pas une ligne de code à changer**.

## Décision / cap retenu
pwf est **bien installé** (v2.43.0) — rien à réparer. Le vrai livrable est documentaire : écrire,
dans le Standard (et/ou le cahier), une définition **positive et en langage d'impact** de ce que
« symbiose » veut dire dans Hyperpowers (le bon outil routé selon la taille de tâche, deux systèmes
étanches volontairement), pour stopper la récidive du soupçon. Le câblage runtime reste hors-cap.

## Tensions non résolues
Où loger l'encart : dans `standard.md` (visible au SessionStart, donc relu à chaque session — fort
contre la récidive, mais alourdit l'injection) ou dans le `README`/cahier (léger, mais pas relu
automatiquement). À trancher avant rédaction.
