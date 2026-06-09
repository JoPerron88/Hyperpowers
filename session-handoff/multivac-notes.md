# Notes de conception — « Multivac » (assistant personnel futur)
> Notes vivantes pour reprendre la conception de Multivac. Rattaché à la section
> « Ce qui était prévu ensuite » de `HANDOFF.md` (bullets « Multivac » + « Expansion des rôles »).
> Statut : **pré-brainstorming** — rien n'est tranché, aucune ligne de code. Tout passe par
> `superpowers:brainstorming` (ou `brainstorming-advanced`) avant implémentation.

## Pourquoi ce fichier
La conception de Multivac s'est amorcée par une question sur les « entités » de `conseil` et
`brainstorming-advanced` : comment ces rôles sont-ils stockés, et comment les nommer correctement ?
Les réponses ci-dessous sont les **fondations factuelles** sur lesquelles construire les rôles de
Multivac. Conversation source : session 8 (2026-06-09).

## Q1 — Où sont « stockées » les entités des skills actuels ?

**Réponse : en texte inline dans le `SKILL.md` de chaque skill. Aucun fichier dédié par entité,
aucun dossier `references/`.**

- **`conseil`** → `skills/conseil/SKILL.md`. 3 entités décrites à deux endroits : un tableau
  `Entité | Rôle | Question centrale` (Stratège / Guide / Relecteur) + un bloc « Profils des
  entités » (2-3 phrases de personnalité chacune).
- **`brainstorming-advanced`** → `skills/brainstorming-advanced/SKILL.md`. 6 entités dans un
  « Catalogue des entités » (`Entité | Profil | Idéal pour`) :

  | Entité | Profil (résumé) |
  |---|---|
  | Enthousiaste | dev créatif/optimiste, amplifie, construit |
  | Sage | senior 20 ans, KISS, challenge la complexité |
  | Utilisateur Final | ancré dans le vécu d'usage |
  | Estimateur | compromis temps/valeur, pense en semaines |
  | Sécuritaire | vecteurs d'abus avant qu'ils existent |
  | Intégrateur | « comment ça joue avec l'existant ? » |

**Au déclenchement** : le texte du profil est injecté tel quel dans le prompt du sous-agent
(`Agent(prompt="Tu es [profil de l'entité tiré du catalogue]. …")`). La « personnalité » observée
est donc **en partie émergente** : le profil n'est qu'une amorce de 1-3 phrases, le sous-agent
l'étoffe à l'exécution. Ce sont des **briefs courts volontairement minces** (choix YAGNI assumé du
projet, pas un oubli).

## Q2 — Quel est le vrai nom de ces « entités » ? (vocabulaire Claude Code)

| Mot | Ce que ça désigne vraiment |
|---|---|
| **`Agent`** | Le **nom de l'outil** qui lance l'instance (anciennement `Task`). Le verbe, pas la chose. |
| **Sous-agent** (*subagent*) | Le **nom correct de la chose lancée** : une instance Claude **isolée**, avec sa **propre fenêtre de contexte**, qui exécute un prompt et ne renvoie que son **message final**. C'est ce que les entités *sont* réellement. |
| **Entité** | Mot **propre aux skills** Hyperpowers — désigne le **rôle** joué par un sous-agent (Stratège, Sage…). Abstraction de domaine, **pas** un terme technique Claude Code. |

Formulation propre : **« Les entités sont des rôles assignés à des sous-agents, instanciés via
l'outil Agent. »**

**Deux types de sous-agents** (distinction clé pour Multivac) :
- **Sous-agent ad-hoc** ← *cas actuel des entités.* Créé à la volée en passant un prompt custom à
  l'outil `Agent`. Rien n'est enregistré ; existe le temps de l'appel. → c'est pourquoi les profils
  vivent inline dans le `SKILL.md`.
- **Sous-agent défini / « custom agent »** : agent **réutilisable** déclaré dans
  `.claude/agents/<nom>.md` (frontmatter `name`, `description`, `tools`, `model`). Claude Code le
  connaît par son nom et peut le **router automatiquement**.

## Implications retenues pour la conception de Multivac

1. **Choix structurant à trancher en brainstorming** : les rôles de Multivac doivent-ils rester des
   *briefs inline ad-hoc* (comme aujourd'hui — simple, YAGNI) ou devenir des **entités riches**
   (rôle + capacités + personnalité + exemples) sorties dans des fichiers dédiés
   (`skills/<skill>/references/entites/<nom>.md`), voire promues en **agents définis**
   (`.claude/agents/`, réutilisables/routables hors d'un seul skill) ?
2. **Le pont entre les deux mondes** = passer de « rôle inline » à « sous-agent enregistré ». Ça
   reste, au sens Claude Code, des **sous-agents** — juste persistés et nommés.
3. **Garde-fou** : l'expansion est un **changement de conception**, pas une retouche. Elle doit
   **prouver sa valeur** (réutilisation réelle, routage, richesse nécessaire) avant d'être faite —
   sinon le brief mince actuel reste le bon défaut. Vérifier aussi l'alignement **FinalGoal**
   (qualité du code, outil personnel simple).

## Prochaine action
Lancer `superpowers:brainstorming` sur Multivac (intention, besoin, périmètre) — et si la question
« rôles inline vs entités riches vs agents définis » se révèle une vraie tension de conception,
basculer sur `hyperpowers:brainstorming-advanced`.
