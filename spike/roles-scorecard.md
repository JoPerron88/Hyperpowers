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
> ⚠️ **Écart de protocole** : le plan exigeait les 3 rôles *actifs*. pwf n'a **pas été activé**
> (je n'ai ni invoqué la skill ni créé `task_plan.md`/`.planning/`). J'ai donc roulé **2 rôles
> sur 3**. Ci-dessous : ce qui est *mesuré* vs ce qui reste *non testé* — pas de verdict garde/coupe.

- **Activation** : non. Skill non invoquée ; aucun fichier de plan créé. Choix initial de ne pas
  sur-outiller le suivi (karpathy : simplicité) face aux relances du harnais (« use TaskCreate » —
  qui est le task-tool du harnais, **pas** pwf).
- **Coût contexte — MESURÉ** : les hooks pwf sont globaux et **ont bien fait feu** cette session,
  mais **tous gated** sur l'existence d'un `task_plan.md`/`.planning/` (sinon `exit 0` silencieux).
  Vérifié : ni `task_plan.md` ni `.planning/` ne sont présents dans le repo → **chaque hook a
  no-op, zéro sortie de contexte**. Coût quasi nul cette session. (Correction : ma 1re version
  affirmait « injection par appel d'outil » — c'est **faux**, le `PreToolUse` n'injecte que si un
  fichier de plan existe.)
- **Valeur — NON TESTÉE** : pwf jamais activé → **aucune observation** de l'aide qu'aurait apportée
  son tracking. Je ne peux ni confirmer ni infirmer sa valeur ici.
- **Hypothèse (non un constat)** : avec un plan directeur statique déjà présent, le tracker pwf
  *semble* redondant sur la voix « chef de projet ». À **tester en l'activant réellement** (créer
  `task_plan.md`, le laisser piloter) avant tout verdict garde/coupe — cf. analyse #6.

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
  - **planning-with-files** = **non activé → pas de verdict**. Mesuré : coût quasi nul (hooks
    no-op faute de `task_plan.md`). Non testé : sa valeur. Sonde n=2/3 rôles. À réactiver
    réellement pour trancher (hypothèse : redondant avec le plan statique sur tâche courte).
  - Recommandation pour le Conductor : **provisoire**, conditionnée à une reprise de la sonde
    pwf. L'hypothèse — la voix « chef de projet » saturée par (plan statique + tracker) — n'est
    pas encore un constat.

## Limites de la sonde (à garder en tête)
- **n=1, tâche pré-scriptée** : le plan dictait le code ; le « tech-lead/reviewer » avait peu de
  latitude. Inhérent au design choisi.
- **karpathy** : son apport observé (consolidation d'imports) est un cleanup ordinaire, pas une
  prise de sur-complexité spectaculaire. Valeur réelle mais modeste, à ne pas surinterpréter.
- **pwf** : 1 rôle sur 3 non exercé (écart de protocole ci-dessus).
