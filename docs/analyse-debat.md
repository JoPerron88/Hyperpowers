# Analyse #5 — Débat : un défenseur vs un sceptique

> Réalisée le 2026-06-05. Stress-test dialectique de tout le projet Hyperpowers
> (analyses #1 à #4). Deux professionnels expérimentés débattent en profondeur,
> de façon constructive. Le but n'est pas que la défense gagne : c'est que les
> coups qui portent **fassent évoluer le design**.

## Les deux interlocuteurs

- **Élodie Tran (Défense)** — architecte logiciel senior, a mis des pipelines
  multi-agents en production, power-user Claude Code, autrice de skills. Croit à la
  vision « couches qui se renforcent ». Pragmatique-optimiste.
- **Marcus Holloway (Sceptique)** — ingénieur principal *LLM systems*, ex-infra. A vu
  le cimetière des frameworks d'agents de la vague AutoGPT. Obsédé par les evals et le
  coût en tokens. Cynique mais honnête : il change d'avis devant une preuve.

---

## Conversation 1 — La prémisse & l'architecture

**Marcus :** Commençons par le début. Tu as installé quatre outils qui se marchent
partiellement dessus, tu as constaté des frictions, et ta solution c'est… un cinquième
outil pour gérer les quatre. Tu ne résous pas un problème, tu en crées un que tu
t'apprêtes à maintenir. Le *baseline* honnête, c'est : installe les quatre, laisse-les
coexister, et vis avec. 80 % de la valeur pour 5 % de l'effort.

**Élodie :** Sauf que « coexister » ne te donne rien des trois choses qui comptent. En
coexistence, tu as deux modèles de plan qui s'ignorent, `Stop`/`PreCompact` qui tirent
deux fois, et — le pire — `progress.md` de planning-with-files qui est jeté à la fin de
chaque tâche pendant que mempalace dort juste à côté avec exactement les outils pour le
garder. La coexistence laisse la valeur sur la table.

**Marcus :** Ou bien la valeur n'y est pas. Tu présupposes que la coordination vaut son
coût. Mais admettons l'architecture : au moins tu as eu raison de rejeter le fork. Forker
quatre projets — dont une app Python de 300 Mo — pour un usage perso, ce serait du
suicide de maintenance.

**Élodie :** D'accord là-dessus. Conductor = fine couche d'orchestration, les quatre
restent à jour depuis l'amont. C'est la seule forme défendable.

**Marcus :** « Défendable » si et seulement si les jointures livrent vraiment. Tout ton
projet repose sur deux jointures et une thèse. Démolissons-les une par une.

> **Ce qui tient :** Conductor > fork, et > coexistence *à condition* que les jointures
> livrent. La prémisse n'est pas acquise — elle est mise en gage sur la suite.

---

## Conversation 2 — Les hooks, le budget de contexte, le coût permanent

**Marcus :** Le coût d'abord, parce qu'il est *permanent* et *inconditionnel*. mempalace
publie 19 à 29 définitions d'outils MCP dans le prompt de **chaque** session, qu'on touche
à la mémoire ce jour-là ou non. planning-with-files réinjecte le plan à **chaque** appel
d'outil quand il est actif. Et tu fais tourner un runtime Python + ChromaDB + un modèle
d'embedding de 300 Mo. Tout ça pour un outil dont l'étoile polaire est… la qualité du
code. Tu paies une taxe de mémoire long terme sur chaque tour pour un bénéfice que tu
récoltes une fois par mois.

**Élodie :** La taxe est réelle, je ne la nie pas. Mais elle est gérable : injection PwF
*throttlée* — `Write|Edit` et `Bash`, pas `Read|Grep` — mempalace en arrière-plan only
sauf wake-up explicite, et un seul hook coordinateur au lieu du double-fire. Le tool-list
MCP, oui, c'est un coût fixe ; c'est le prix d'avoir une vraie mémoire plutôt qu'un
fichier de notes.

**Marcus :** « Gérable » est une promesse, pas une mesure. Tu as quatre docs d'analyse et
zéro chiffre sur le coût réel en tokens d'un tour typique avec les quatre actifs. Tu
throttles à l'aveugle.

**Élodie :** Touché. Le budget exact doit être mesuré, pas postulé. Mais note que le
throttling et le hook unique *suppriment* les pires postes ; le résidu, c'est le tool-list
MCP, qui est le coût assumé de la décision « mempalace pleinement ».

> **Ce qui change :** le coût en contexte doit être **mesuré** avant d'être déclaré
> acceptable. Le tool-list MCP est un coût fixe assumé — à garder en vue.

---

## Conversation 3 — La boucle mémoire, et la thèse non validée

**Marcus :** Maintenant le cœur. Ta thèse, répétée dans l'analyse #3 : « la qualité se
bonifie dans le temps via la mémoire ». C'est joli. C'est aussi **non démontré**. Tu
cites le 96,6 % R@5 de mempalace comme s'il prouvait quelque chose. Il prouve une seule
chose : que mempalace *retrouve* le bon souvenir. Il ne dit **rien** sur le fait que
retrouver une erreur passée *améliore le code futur*. Entre « le rappel marche » et « le
rappel améliore le code », il y a un gouffre, et tu l'as franchi sans preuve.

**Élodie :** …C'est juste. Le 96,6 % est une métrique de *retrieval*, pas de qualité de
code. Je dois le concéder : « la qualité se bonifie via la mémoire » est une **hypothèse**,
pas un résultat. C'est le pari du projet, pas son acquis.

**Marcus :** Merci de le dire. Parce que tout le reste en dépend. Et il y a pire : la
distillation. Qui décide qu'un apprentissage est « durable » ? Si c'est l'agent en fin de
tâche, tu vas remplir le graphe de connaissances de bruit auto-félicitant. Garbage-in, et
ton wake-up empoisonne les sessions futures avec de fausses leçons. Une mémoire qui se
trompe est pire que pas de mémoire : elle est *confiante*.

**Élodie :** D'accord, et il y a même un angle sécurité : promouvoir du contenu non-fiable
(résultats web dans `findings.md`) vers une mémoire permanente, c'est de l'injection de
prompt à effet retard. La parade existe en partie — délimiteurs `===PLAN DATA===`,
attestation SHA-256 de PwF — mais elle n'a jamais été pensée pour la *promotion* vers
mempalace. Le schéma de distillation est le vrai risque ouvert. Les primitifs
(`kg_add`, `diary_write`, `add_drawer`) existent ; la *politique* de ce qu'on y met,
non.

**Marcus :** Donc on est d'accord : la pièce maîtresse repose sur une hypothèse non testée
et sur un composant non conçu. Ce n'est pas un détail, c'est la fondation.

> **Ce qui change :** la thèse mémoire→qualité passe de **postulat à hypothèse à valider**.
> La distillation (qualité + sécurité) est le composant le plus risqué et le moins défini.

---

## Conversation 4 — Les deux modèles de plan (Jointure #1)

**Marcus :** La jointure « deux plans à deux altitudes » est élégante sur le papier. En
pratique, tu vas avoir un agent qui doit tenir cohérents une *recette* statique dans
`docs/superpowers/plans/` et un *tracker* mince `task_plan.md` qui pointe dessus. Deux
sources, une dérive garantie. Et superpowers a déjà `subagent-driven-development` qui suit
les tâches via les cases `- [ ]`. Tu ajoutes un second système de suivi par-dessus un qui
existe.

**Élodie :** La différence est précise : la recette superpowers ne survit pas à la
compaction — elle n'est pas réinjectée. Le tracker PwF, si, via le hook. C'est une *ancre
d'attention* qui résiste au reset de contexte, exactement ce qui manque à superpowers seul.
Le tracker ne duplique pas la recette, il la *référence* et garde l'agent orienté quand le
contexte se vide.

**Marcus :** Concédé en partie — l'ancre anti-compaction est un vrai apport. Mais la
cohérence recette↔tracker reste une charge cognitive que tu imposes à l'agent à chaque
tour. Ça ne casse pas l'architecture, mais ce n'est pas « gratuit » comme tu l'écris.

**Élodie :** Accepté : la jointure #1 tient, mais son coût de cohérence est réel et doit
être minimisé (tracker le plus mince possible, recette lue à la demande seulement).

> **Ce qui tient :** la jointure #1 survit au débat — l'ancre anti-compaction est un apport
> réel que la coexistence ne donne pas. Coût de cohérence à minimiser.

---

## Conversation 5 — karpathy, redondance, et le fardeau de maintenance

**Marcus :** karpathy. Tu proposes de le « fusionner dans le noyau comportemental référencé
par superpowers ». Or superpowers interdit *explicitement* qu'on réécrive son contenu
calibré sans evals. Et soyons honnêtes : des garde-fous comportementaux en prose, c'est le
type d'instruction le plus facilement ignoré par un modèle sous charge. Tu ajoutes une voix
qui répète ce que superpowers dit déjà.

**Élodie :** Nuance : je ne touche pas à superpowers. karpathy vit dans *notre* couche.
Et puisque c'est de la prose MIT minuscule et stable, le plus propre est de l'**inliner** —
intégrer le texte directement — ce qui *retire une source* de la surface de contrat. Coût
de maintenance nul, redondance assumée comme rappel d'étoile polaire.

**Marcus :** Soit. Mais ça m'amène au point qui me dérange le plus, et ce n'est pas un
détail technique. **Qui maintient tout ça ?** Le contexte est clair : un utilisateur solo,
non-développeur. Tu lui proposes une couche de coordination au-dessus de quatre dépendances
qui bougent — dont planning-with-files, qui a cassé *son propre* frontmatter deux fois
(`---`→`===`) et publie des dizaines de releases. Ton « smoke-test à l'update » suppose
quelqu'un capable de lire un diff de hook shell et de réparer un adaptateur. Pour un
non-dev, c'est un tapis roulant qui finira par le larguer. Ça ne menace pas un *détail* de
Conductor — ça menace **l'adoption des quatre d'un coup**.

**Élodie :** … C'est l'argument le plus fort que tu aies sorti. Je ne peux pas le réfuter
en l'état. La réponse honnête n'est pas « le smoke-test suffit » — c'est que **le
déploiement doit changer**. On ne câble pas les quatre dès le jour un. On y va par paliers.

> **Ce qui change :** inliner karpathy (−1 source). Et surtout : le fardeau de maintenance
> sur un solo non-dev **interdit l'adoption simultanée des quatre** → déploiement par
> paliers (voir synthèse).

---

## Conversation 6 — La valeur réelle, YAGNI, et « zéro ligne de code »

**Marcus :** Alors récapitulons. Pour un utilisateur solo dont l'objectif déclaré est la
*qualité du code*, le chemin le plus court, c'est : le `CLAUDE.md` de karpathy + le TDD de
superpowers. Ça livre de la qualité **aujourd'hui**, zéro hook, zéro runtime, zéro
maintenance. Tout le reste — la mémoire long terme, le framework de planification, la
boucle — c'est un beau projet d'ingénierie qui sert *le projet lui-même*, pas forcément ton
code.

**Élodie :** Le différenciateur, c'est précisément la mémoire qui compose. Sans elle, la
qualité plafonne : tu refais les mêmes erreurs de projet en projet. karpathy+TDD te donne
un *niveau* de qualité ; la boucle mémoire vise une *pente* ascendante.

**Marcus :** « Vise ». Encore une hypothèse. Et c'est là mon vrai coup : **cinq documents
d'analyse, zéro ligne de code.** La question « est-ce que se souvenir des erreurs améliore
le code » est *mesurable*. Un spike d'un après-midi : prends dix tâches, fais-en cinq avec
une mémoire d'erreurs pré-chargée et cinq sans, compare les diffs et les reprises. Tu
débats depuis cinq tours d'une question qui se tranche par l'expérience. Pourquoi
analyser encore ?

**Élodie :** … Parce que c'est plus confortable d'analyser que de risquer un test qui me
donnerait tort. Tu as raison. Le prochain artefact ne doit pas être une 6ᵉ analyse. Ça
doit être le spike.

> **Ce qui change :** le verdict a des dents — la suite n'est pas plus d'analyse, c'est une
> **mesure**. La thèse centrale est testable et n'a pas été testée.

---

## Synthèse — qui a marqué, et ce que le projet doit changer

**Coups du sceptique qui coûtent la thèse (pas juste des questions déjà ouvertes) :**

1. **La thèse mémoire→qualité est non validée.** Le 96,6 % est du *retrieval*, pas une
   preuve d'amélioration du code. → On la **rétrograde de thèse à hypothèse**, et on la
   teste avant de bâtir la boucle complète. *(Révise le cadrage de l'analyse #3.)*
2. **Le fardeau sur un solo non-dev interdit l'adoption des quatre d'un coup.** → Le
   déploiement passe de « bundle des quatre » à **paliers**. *(Révise l'hypothèse implicite
   de packaging des analyses #3/#4.)*
3. **Cinq analyses, zéro code.** → Le prochain pas est un **spike mesurable**, pas une 6ᵉ
   analyse.

**Ce que la défense a tenu :**

- Conductor > fork (maintenance) **et** > coexistence (les jointures livrent une valeur
  réelle : ancre anti-compaction de la jointure #1, et le câblage mémoire que personne
  d'autre ne fait — *si* la thèse tient).
- Inliner karpathy résout proprement sa redondance et réduit la surface de contrat.
- Le throttling + hook unique suppriment les pires coûts de contexte (le résidu MCP étant
  un choix assumé).

**Verdict net :** Conductor est la bonne *forme*, mais le projet a été **sur-analysé par
rapport à sa base de preuves**. La symbiose vaut d'être construite — *progressivement et
sous condition de preuve*, pas en bloc sur la foi d'une hypothèse.

**Déploiement par paliers (la vraie feuille de route révisée) :**

| Palier | Quoi | Condition de passage au suivant |
|---|---|---|
| **0** | karpathy (inliné) + superpowers TDD | qualité de base en place, zéro maintenance |
| **1** | + planning-with-files quand les tâches sont longues | l'ancre anti-compaction prouve son utilité |
| **2** | + mempalace **et le spike** mémoire→qualité | le spike valide que le rappel d'erreurs améliore le code |
| **3** | + la boucle de distillation complète + smoke-test de contrat | seulement si palier 2 est concluant |

**Questions ouvertes révisées :**
- Le spike : protocole exact (combien de tâches, quelles métriques de « qualité » — reprises,
  lignes touchées hors-scope, bugs réintroduits ?).
- Le schéma de distillation (qualité + sécurité anti-injection) — à concevoir *si* le spike
  passe.
- Le budget de contexte mesuré d'un tour avec la stack active.

---

## Prochaine étape (non commencée)

Ce débat ne tranche pas seul : il **recommande un spike** avant tout design détaillé. À toi
de réagir — accepter le déploiement par paliers et le spike, ou défendre l'adoption en bloc.
Pas d'implémentation tant que tu n'as pas tranché.
