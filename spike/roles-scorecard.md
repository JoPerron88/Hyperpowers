# Fiche de rôles — Sonde 1 (tâche : construire le scoreur `score.mjs`)

Observation réelle du déroulé des Tasks 1.1–1.2 (TDD, inline pour voir les outils live).
Pour chaque rôle : interventions concrètes, valeur, coût en contexte, verdict.

## superpowers (Tech Lead + Chef de projet)
- **Interventions** : bootstrap `using-superpowers` injecté au SessionStart (obligatoire).
  Invocations explicites : `executing-plans` (cadre de process : « revoir le plan d'abord,
  suivre les étapes, s'arrêter si bloqué ») et `test-driven-development` (a piloté le cycle
  RED→GREEN). `brainstorming` NON utilisé (conception déjà faite, plan pré-écrit).
- **Valeur** : oui, modeste mais réelle. TDD a forcé la vérification du RED *pour la bonne
  raison* deux fois — `ERR_MODULE_NOT_FOUND` (Task 1.1) puis `SyntaxError: no export named
  runTests` (Task 1.2). C'est exactement la discipline « tu testes la bonne chose ».
  executing-plans a donné une structure légère sans rien réinventer.
- **Coût contexte** : élevé en fixe. Le bootstrap SessionStart (bloc using-superpowers +
  EXTREMELY_IMPORTANT) est lourd ; chaque `Skill` invoquée réinjecte un gros bloc (la skill
  TDD fait ~200 lignes). Ce coût est payé que la tâche soit petite ou grande.
- **Verdict** : **mérite sa place** sur une vraie tâche de code (TDD a attrapé les bons
  échecs). Le bootstrap reste un coût fixe à amortir sur des tâches plus grosses.

## planning-with-files (Chef de projet)
- **Interventions** : **aucune**. Skill non déclenchée — le plan directeur
  (`docs/superpowers/plans/...`) jouait déjà le rôle de tracker « chef de projet ». Choix
  délibéré de ne pas sur-outiller le suivi (karpathy : simplicité) face aux relances
  répétées du harnais (« use TaskCreate »). task_plan.md / findings.md / progress.md
  auraient dupliqué le plan existant.
- **Valeur** : nulle observée sur cette tâche (non déclenchée ; aurait fait doublon).
- **Coût contexte** : ses hooks sont **globaux** (se déclenchent dans toutes les sessions) ;
  injection potentielle par appel d'outil. Sur cette tâche : pas de manifestation visible
  mais coût latent permanent.
- **Verdict** : **bruit net** pour une tâche courte avec plan pré-existant. Le fichier de plan
  remplit déjà la voix « chef de projet ». Redondant ici → candidat à couper sur tâches
  courtes (cf. analyse #6 : consolidation des voix de management).

## karpathy (Reviewer)
- **Interventions** : oui, concrètes. A informé deux décisions chirurgicales — consolider les
  imports (`{ countChangedLines, runTests }` en une ligne ; `{ execFileSync, spawnSync }` en
  une ligne) au lieu des lignes d'import dupliquées du plan (DRY/surgical). A renforcé le refus
  de sur-outiller le tracking quand le harnais poussait TaskCreate.
- **Valeur** : oui, modeste mais réelle — la consolidation des imports est une amélioration
  concrète *sur le plan tel qu'écrit*, traçable à « simplicité/chirurgical ». Biais code-minimal
  aligné avec un scoreur déjà minimal (aucune option/gestion d'erreur spéculative).
- **Coût contexte** : ~nul. Une seule skill prose (~50 lignes), zéro hook, chargée une fois.
- **Verdict** : **mérite sa place** — meilleur ratio valeur/coût des trois. Cleanups concrets à
  coût quasi nul.

## Résultat de la tâche
- **Tests verts** : oui (2/2, sortie propre).
- **Lignes hors-scope** : ~0. Le scoreur est exactement la spec du plan — pas d'options, pas de
  gestion d'erreur non demandée, pas de configurabilité. Le seul écart au plan est une
  *simplification* (imports consolidés), pas un ajout.
- **Constat global** :
  - **karpathy (reviewer)** = meilleur rapport coût/valeur (coût quasi nul, cleanups concrets) → garder.
  - **superpowers (TDD + process)** = mérite sa place (a attrapé les échecs pour la bonne raison),
    mais bootstrap = coût fixe lourd → garder, amortir sur des tâches plus grosses.
  - **planning-with-files** = non déclenchée, aurait fait doublon avec le plan → **bruit net sur
    tâche courte**. À couper / à ne déclencher que sur tâches longues sans plan pré-écrit.
  - Recommandation pour le Conductor : la voix « chef de projet » est saturée par le couple
    (plan statique + tracker). Une seule suffit selon la longueur de la tâche.
