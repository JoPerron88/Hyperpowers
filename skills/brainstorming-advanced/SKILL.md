---
name: brainstorming-advanced
description: Use when a decision has real trade-offs that a single perspective won't resolve — competing approaches both seem valid, significant architectural or product stakes, or you need to pressure-test a design. More powerful than brainstorming — triggers a structured multi-agent debate with entity selection tailored to the problem type.
user-invocable: true
---

# Brainstorming Advanced — Débat multi-agents avec méta-routage

Entités indépendantes (vrais sous-agents `Agent`) débattent pour explorer une décision complexe.
Plus puissant que `superpowers:brainstorming` — réservé aux sujets où des perspectives légitimes
et divergentes existent *même à information complète*.

**Règle absolue :** ne jamais invoquer ce skill sans confirmation explicite de l'utilisateur.
`superpowers:brainstorming` reste le défaut.

## Test d'éligibilité

Avant tout débat, le Modérateur applique ces trois questions en silence :

**Question zéro :** *"Est-ce que plus d'information factuelle résoudrait la question ?"*
→ Si oui : ne pas débattre. Chercher l'information d'abord.

**Q1 :** *"Deux développeurs compétents et informés identiquement pourraient-ils défendre des
choix opposés avec des arguments solides ?"*

**Q2 :** *"Se tromper maintenant coûte-t-il quelque chose plus tard ?"*

→ Si Q1 et Q2 sont toutes deux oui : `brainstorming-advanced` est approprié.
→ Sinon : `superpowers:brainstorming` suffit.

## Catalogue des entités

Les deux modes piochent dans le même catalogue :

| Entité | Profil | Idéal pour |
|---|---|---|
| **Enthousiaste** | Développeur créatif et optimiste. Amplifie, propose des extensions, explore les possibilités. Argumente en construisant — jamais en démolissant. | Toute décision créative, nouvelles features, choix architecturaux ouverts |
| **Sage** | Senior dev 20 ans d'expérience, KISS dans le sang. Challenge la complexité, pointe la charge cachée, ramène aux objectifs réels. | Toute décision technique, arbitrages build/buy, complexité justifiée |
| **Utilisateur Final** | Ancré dans l'expérience vécue : comment ça se sent à l'usage, pas comment ça s'implémente. | UX, nommage, messages d'erreur, flux utilisateur |
| **Estimateur** | Spécialiste des compromis temps/valeur. Pense en semaines, pas en élégance. | Roadmap, priorisation, décisions de scope |
| **Sécuritaire** | Pense aux vecteurs d'abus avant qu'ils existent. | API publiques, permissions, authentification, données sensibles |
| **Intégrateur** | "Comment ça joue avec ce qui existe déjà ?" | Décisions dans un système complexe existant, migration, couplage |

## Méta-routage

Le Modérateur choisit le mode **avant** le premier tour.

**→ Pool léger** si : problème bien identifiable, complexité modérée, cas courant.

**→ Pool dynamique** si : forte complexité, sujet hybride inhabituel, ou demande explicite de l'utilisateur.

Guide de sélection pour le pool léger :

| Type de problème | Entités recommandées |
|---|---|
| Décision architecturale | Enthousiaste + Sage |
| Choix technologique | Enthousiaste + Sage + Intégrateur |
| Design UX / nommage | Utilisateur Final + Sage |
| Roadmap / estimation | Estimateur + Sage |
| Sécurité / API | Sécuritaire + Intégrateur + Sage |
| Sujet hybride connu | Selon les dimensions dominantes |

## Mode 1 — Pool léger

- Sélection : 2-3 entités du catalogue selon le type de problème (guide ci-dessus).
- **Si tu te retrouves à vouloir 4+ entités → bascule en pool dynamique.**
- **Limite : 3 tours max fixes.** Si trop complexe pour 3 tours → décomposer en sous-décisions.
- Expert élevable : un expert ponctuel peut être promu participant persistant sur 2-3 tours.

## Mode 2 — Pool dynamique

- Sélection libre parmi le catalogue. 3+ entités possibles si le sujet le justifie.
- **Limite adaptative :** convergence = clôture immédiate, même en tour 2.
- **Plafond absolu : 10 tours.** Clôture obligatoire quoi qu'il arrive.
- Évaluation après chaque tour : (1) les positions convergent-elles ? (2) reste-t-il une objection explicitement non résolue ?
- Expert élevable : même mécanisme que pool léger.

## Procédure

### 1. Triage

Le **Modérateur** est l'agent qui exécute ce skill — il orchestre, ne prend jamais position dans les tours, et communique seul avec l'utilisateur.

1. Appliquer le test d'éligibilité (3 questions). Si non éligible → `superpowers:brainstorming`.
2. Choisir le mode (pool léger vs dynamique) selon la complexité et la demande.
3. Annoncer à l'utilisateur et **attendre confirmation explicite** :
   > "Je propose `hyperpowers:brainstorming-advanced` en mode **[pool léger / pool dynamique]**.
   > Entités : [liste]. Sujet : [reformulation claire]. On lance ?"
4. Selon la réponse :
   - Confirmation → continuer.
   - Refus → invoquer `superpowers:brainstorming` à la place.
   - Autre mode ou autres entités → ajuster, re-annoncer, attendre confirmation.

### 2. Tour de débat

**a) Formuler la tension du tour** — question ouverte et équilibrée, ne préjuge pas de la réponse.
❌ "Pourquoi PostgreSQL est la bonne décision ?" ✅ "La complexité de PostgreSQL est-elle justifiée ici ?"

**b) Dispatcher chaque entité séquentiellement** — même au Tour 1. Chaque entité reçoit la réponse de la précédente, y compris dès le premier tour : la 2ᵉ entité adapte son angle si elle a lu la 1ère, ce qui rend le débat plus dense immédiatement. Parallèle = positions identiques au Tour 1, gaspillage.

```
Agent(
  description="[Entité] — tour N",
  prompt="Tu es [profil de l'entité tiré du catalogue].

Contexte du débat : [sujet original]
[Si tours précédents : Historique résumé : [résumé]]
[Si réponse précédente : [Entité précédente] vient de dire : [réponse]]

Question de ce tour : [tension formulée en a)]

[Instruction spécifique à l'entité selon son profil]
Réponds en 150-250 mots (100-150 mots pour les contre-arguments)."
)
```

**c) [Optionnel] 2ᵉ échange par entité si le débat n'est pas épuisé.**

**d) Évaluer :**
- Pool léger : consensus ou 3 tours atteints → aller à 4 (clôture).
- Pool dynamique : convergence ou 10 tours atteints → aller à 4.
- Si l'utilisateur interrompt à tout moment → aller directement à 4 avec les positions actuelles.

### 3. Invocation d'experts

**Mode validation** — hypothèse factuelle précise :

```
Agent(
  description="Expert [domaine] — validation",
  prompt="Tu es un expert [domaine précis].
Affirme ou infirme : [hypothèse en une phrase].
Justifie en 3-5 phrases. Sois direct et factuel."
)
```

Résultat injecté comme fait établi dans le tour suivant. Expert libéré immédiatement.

**Mode participation** — 4ᵉ voix temporaire :

```
Agent(
  description="Expert [domaine] — participant tour N",
  prompt="Tu es [titre expert].
Contexte : [sujet] / [entité A] dit : [X] / [entité B] dit : [Y]
Contribue en tant qu'expert [domaine]. Réponds en 150-200 mots."
)
```

Expert libéré après sa contribution.

**Mode élévation** — expert promu participant persistant :
Le Modérateur élève l'expert si sa perspective est structurellement nécessaire sur plusieurs tours.
Il reçoit le contexte complet à chaque tour comme n'importe quelle entité.

### 4. Clôture

Présenter **2-4 options** issues du débat :

```
## Options issues du débat

**Option A — [nom court]**
[Description 2-3 phrases]
✅ Pour : [avantages clés]
⚠️ Contre : [inconvénients clés]

**Option B — [nom court]**
...

**Ma recommandation : Option [X]** — [justification 1-2 phrases].

Note : tu peux avoir des préférences que je n'ai pas. Quel est ton choix ?
```

### 5. Suite

Après le choix de l'utilisateur :
- [ ] Poser les questions de raffinement restantes (une à la fois)
- [ ] Documenter le choix (dans `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` si le projet suit les conventions superpowers, sinon dans le format du projet)
- [ ] Auto-review de la spec (placeholders, cohérence, scope, ambiguïté)
- [ ] Demander la review utilisateur
- [ ] Si le livrable est un **skill ou plugin** → invoquer `superpowers:writing-skills` en premier
  (puis `superpowers:writing-plans` si des tests ou scripts sont à implémenter)
- [ ] Sinon → invoquer `superpowers:writing-plans` directement

## Règles absolues

- Test d'éligibilité **toujours** appliqué en silence avant de lancer.
- Mode (léger vs dynamique) **annoncé** avant le premier tour.
- Le Modérateur ne prend **jamais** position pendant les tours — uniquement à la clôture.
- Experts non-élevés **toujours libérés** après contribution.
- Pool léger : **3 tours max**, pas d'exception. Si trop complexe → décomposer.
- Pool dynamique : **10 tours max absolus**, convergence peut clore plus tôt.
- Sortie **toujours compatible** avec `superpowers:writing-plans`.
- **Jamais sans accord explicite** de l'utilisateur.
- L'outil `Agent` est **toujours** utilisé — jamais de persona simulé.

## Erreurs courantes

| Erreur | Ce qui se passe | Correction |
|--------|----------------|------------|
| Simuler les personas en texte | Chambre d'écho — aucune indépendance réelle | Appeler `Agent` pour chaque entité, sans exception |
| Sauter le test d'éligibilité | Usage abusif sur des décisions triviales | Appliquer les 3 questions en silence avant tout |
| Garder Enthousiaste+Sage par défaut sans consulter le guide | Pool léger mal sélectionné | Choisir les entités selon le guide de sélection |
| Dispatcher les entités en parallèle "car Tour 1 = positions indépendantes" | Même Tour 1 : la 2ᵉ entité adapte son angle si elle a lu la 1ère — débat plus dense dès le départ | Séquentiel obligatoire, sans exception de tour |
| Pool dynamique : dépasser 10 tours | Boucle sans fin | 10 tours = clôture absolue |
| Garder un expert non-élevé pour les tours suivants | Contexte pollué, prompts gonflés | Libérer immédiatement sauf si élevé explicitement |
| Invoquer sans attendre la confirmation | L'utilisateur n'a pas consenti | Attendre "oui" explicite |
