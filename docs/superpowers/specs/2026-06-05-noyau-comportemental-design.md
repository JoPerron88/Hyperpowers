# Spec — Hyperpowers v1 : le noyau comportemental fusionné

> Conçu le 2026-06-05 (skill `superpowers:brainstorming`). Fait suite au spike : la couche
> mémoire est **écartée** (Sonde 2 rouge) et pwf **conditionnel** (Sonde 1). Cette v1 ne
> concerne que la fusion **karpathy + superpowers**.

## Objectif

Supprimer le doublon comportemental karpathy ↔ superpowers (conflit 🟠 de `analyse-conflits.md`)
en faisant **une seule voix** : karpathy devient **le standard de qualité** (le QUOI), injecté
au SessionStart, qui **pointe vers** les skills superpowers (le COMMENT) au lieu de re-sermonner
en parallèle. C'est la première brique de l'architecture « Conductor » : une fine coordination,
sans forker l'amont.

Tranche deux « à définir » du `CLAUDE.md` : **livrable = plugin**, **langage = Node**.

## Non-objectifs (explicitement hors v1)

- Pas de couche mémoire (mempalace) — écartée par le spike, « on y reviendra ».
- Pas de planning-with-files — conditionnel, différé.
- Pas d'orchestrateur de cycle de tâche, pas de hook coordinateur Stop/PreCompact.
- Pas de fork de superpowers — il reste installé tel quel.

## Architecture

Le **dépôt `Hyperpowers` EST le plugin**. Aucune autre cible.

```
.claude-plugin/plugin.json   — métadonnées du plugin
hooks/hooks.json             — un hook SessionStart unique
standard.md                  — LE contenu injecté (source unique du standard)
tests/standard.test.mjs      — smoke-tests (node:test, zéro dépendance)
package.json                 — type:module, script test = node --test
README.md                    — quoi / pourquoi / installation + désinstallation karpathy
```

### Mécanisme « une seule voix »

`hooks/hooks.json` déclare un **SessionStart** qui exécute `cat ${CLAUDE_PLUGIN_ROOT}/standard.md`.
C'est le procédé déjà utilisé par superpowers ; les deux injections coexistent à **deux altitudes
complémentaires** :

- **superpowers** (inchangé) = LE PROCESSUS.
- **Hyperpowers/standard.md** = LE STANDARD, qui **nomme** la skill superpowers réalisant chaque
  principe. Donc karpathy cadre et délègue au lieu de doublonner.

Deux hooks SessionStart distincts tirent tous les deux (pas de conflit technique) ; la cohérence
vient du **contenu** de `standard.md` qui se positionne explicitement par rapport à superpowers.

## Contenu de `standard.md` (définitif, pas un placeholder)

```markdown
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
```

~30 lignes — le coût « toujours actif » reste bas. Skills nommées (toutes existantes) :
`brainstorming`, `test-driven-development`, `subagent-driven-development`, `executing-plans`,
`verification-before-completion`.

## `hooks/hooks.json`

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          { "type": "command", "command": "cat \"${CLAUDE_PLUGIN_ROOT}/standard.md\"" }
        ]
      }
    ]
  }
}
```

## `.claude-plugin/plugin.json`

```json
{
  "name": "hyperpowers",
  "description": "Le standard de qualité de code (penser avant, simplicité, chirurgical, piloté par objectif) injecté au SessionStart, qui délègue le process aux skills superpowers. Fusionne karpathy dans une seule voix.",
  "version": "0.1.0",
  "author": "Jonathan Perron"
}
```

## Dé-duplication

- **Désinstaller le plugin karpathy autonome** (`andrej-karpathy-skills`) via `/plugin` —
  étape manuelle de l'utilisateur, documentée dans le README. Son contenu ne vit plus qu'ici.
- superpowers reste installé, **non modifié**.

## Tests & vérification (surface de contrat — leçon du spike)

`tests/standard.test.mjs` (Node, zéro-dép) :
1. `standard.md` existe, non vide, contient les 4 titres de principes.
2. **Références vivantes** : chaque `superpowers:<skill>` citée dans `standard.md` correspond à
   une skill réellement installée (résolution contre `~/.claude/plugins/cache/.../skills/` et
   `~/.claude/skills/`). Échoue si une référence est morte.
3. `plugin.json` et `hooks/hooks.json` parsent comme JSON valide ; `hooks.json` déclare bien un
   `SessionStart`.
4. Smoke-test : exécuter la commande du hook (`cat standard.md`) et vérifier qu'elle émet les
   4 principes.

**Vérif empirique post-install** (non automatisable) : redémarrer Claude Code, confirmer que
l'injection Hyperpowers apparaît au SessionStart — comme on a validé le hook pwf.

## Risques / points ouverts

- **Coût permanent** : injection à chaque session, y compris non-codage (choix « toujours-on »
  assumé). Mitigation : `standard.md` court.
- **Deux injections SessionStart** : si l'ordre d'affichage prêtait à confusion, replier vers un
  unique mini-rappel pointant vers une skill chargée à la demande (option « les deux, coordonnés »
  écartée pour l'instant).
- **Désinstallation karpathy manuelle** : si l'utilisateur oublie, doublon temporaire (plugin +
  injection). Le README le met en gros.
```
