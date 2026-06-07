# Design — `hyperpowers:brainstorming-advanced`
> Date : 2026-06-07 · Statut : approuvé

## Objectif

Un skill de brainstorming alternatif à `superpowers:brainstorming`, plus puissant pour les
décisions architecturales avec de vraies tensions de conception. Repose sur 3 vrais sous-agents
indépendants (outil `Agent`) qui débattent, avec invocation ponctuelle d'experts. Le workflow
de sortie est identique à `superpowers:brainstorming` (spec → `writing-plans`).

## Positionnement

- `superpowers:brainstorming` reste **le défaut** pour tout travail créatif.
- `hyperpowers:brainstorming-advanced` est **opt-in** : Claude peut le *suggérer* pour les sujets
  complexes, jamais l'utiliser sans accord explicite de l'utilisateur.
- `standard.md` (principe 1) est étendu d'une ligne pour documenter cette suggestion possible.

## Placement

- Fichier : `skills/brainstorming-advanced/SKILL.md` dans le repo Hyperpowers
- Identifiant : `hyperpowers:brainstorming-advanced`
- `user-invocable: true`

## Les 3 personas (sous-agents réels)

### Enthousiaste
Développeur créatif, optimiste. Rôle : amplifier l'idée, proposer des extensions, explorer les
possibilités. Contraintes : argumente et contre-argumente en construisant, jamais en démolissant ;
ne connaît pas les budgets ni les délais.

### Le Sage
Senior dev 20 ans d'expérience, KISS dans le sang. Rôle : challenger la complexité, pointer la
charge de travail cachée, ramener aux objectifs réels. N'est pas là pour tuer l'idée — il est là
pour qu'elle survive à la réalité. Arguments types : « est-ce vraiment nécessaire ? »,
« qui va maintenir ça ? », « quel est le vrai gain ? »

### Le Modérateur
Neutre, observe le débat, ne prend pas de position propre. Seul à communiquer avec l'utilisateur.

**Pouvoirs :**
- Lance les tours de débat, décide quand clore
- Invoque des experts ponctuels (deux modes, voir ci-dessous)
- Présente les options finales avec recommandations nuancées
- Laisse la décision finale à l'utilisateur

## Mécanique de débat

### Flux d'un tour
1. Modérateur formule la question/tension du tour
2. **Enthousiaste** répond (voit la question + historique des tours précédents)
3. **Sage** voit la réponse de l'Enthousiaste et réagit
4. **Enthousiaste** contre-argumente si le Modérateur juge un 2ᵉ échange utile (optionnel)
5. Modérateur reçoit tous les outputs et évalue

### Clôture
Le Modérateur clôt quand il détecte :
- Consensus émergent entre les deux
- Positions figées (débat circulaire sans progression)
- Question résolue suffisamment pour décider

Il présente alors **2-4 options** issues du débat avec une recommandation explicite
(« je pencherais vers X parce que… »). L'utilisateur fait le choix final — il peut avoir des
préférences ou une vision d'ensemble que le Modérateur n'a pas.

## Invocation d'experts

Le Modérateur peut invoquer des experts entre les tours (architecte, ingénieur, expert domaine,
etc.) selon deux modes :

**Mode validation (C)** — vérification d'hypothèse
> Modérateur → question ciblée → Expert répond (confirme/infirme + justification) → Expert libéré.
> Résultat injecté dans le tour suivant comme fait établi.

**Mode participation (B)** — 4ᵉ voix temporaire
> Expert rejoint un tour, interagit avec Enthousiaste et Sage, puis est libéré avant que le
> Modérateur synthétise.

Les experts sont toujours libérés après leur intervention pour ne pas consommer de contexte inutile.

## Sortie (compatible superpowers:brainstorming)

À l'issue du débat et des décisions utilisateur :
1. Spec écrite dans `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`
2. Spec commitée dans git
3. Transition vers `superpowers:writing-plans`

Le workflow aval est identique à `superpowers:brainstorming` — aucune friction pour la suite.

## Modification de standard.md

Principe 1, ajouter après la ligne `→ superpowers:brainstorming` :

```
Pour les décisions architecturales avec de vraies tensions de conception,
`hyperpowers:brainstorming-advanced` peut être **suggéré** — jamais utilisé sans accord
explicite de l'utilisateur.
```

## Ce qui n'est PAS dans scope

- Aucun script Node.js d'orchestration (approches B/C écartées)
- Pas de modification du trigger par défaut de `superpowers:brainstorming`
- Pas de fork de superpowers
