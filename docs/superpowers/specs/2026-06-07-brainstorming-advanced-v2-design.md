# Spec — brainstorming-advanced v2 : méta-routage pool léger / pool dynamique

**Date :** 2026-06-07
**Statut :** Approuvée

---

## Problème

La v1 de `brainstorming-advanced` utilise deux entités fixes (Enthousiaste + Sage) pour tous
les types de sujets. Cette paire est bien calibrée pour les décisions architecturales, mais
inadaptée aux sujets UX, produit, estimation ou sécurité. De plus, le skill n'a pas de critère
d'éligibilité explicite — l'utilisateur ne sait pas quand l'invoquer plutôt que
`superpowers:brainstorming`.

---

## Solution

Ajouter un **méta-routage** : le Modérateur évalue brièvement la requête, applique le test
d'éligibilité (3 questions), puis choisit entre deux modes de débat selon la complexité et
la demande de l'utilisateur :

- **Pool léger** — 6 entités nommées, le Modérateur en sélectionne 2-3, 3 tours max fixes.
- **Pool dynamique** — sélection libre parmi les mêmes entités + possibilité d'extension,
  limite adaptative basée sur la convergence, 10 tours max absolus.

---

## Test d'éligibilité (commun aux deux modes)

Avant tout débat, le Modérateur pose trois questions en silence :

**Question zéro** : *"Est-ce que plus d'information factuelle résoudrait la question ?"*
→ Si oui : pas de débat. Chercher l'information d'abord.

**Q1** : *"Deux développeurs compétents et informés identiquement pourraient-ils défendre des
choix opposés avec des arguments solides ?"*

**Q2** : *"Se tromper maintenant coûte-t-il quelque chose plus tard ?"*

→ Si Q1 et Q2 sont toutes deux oui : `brainstorming-advanced` est approprié.
→ Sinon : `superpowers:brainstorming` suffit.

---

## Catalogue d'entités

Les deux modes piochent dans le même catalogue de 6 entités nommées :

| Entité | Profil | Idéal pour |
|---|---|---|
| **Enthousiaste** | Développeur créatif et optimiste. Amplifie, propose des extensions, explore les possibilités. Argumente en construisant — jamais en démolissant. | Toute décision créative, nouvelles features, choix architecturaux ouverts |
| **Sage** | Senior dev 20 ans d'expérience, KISS dans le sang. Challenge la complexité, pointe la charge cachée, ramène aux objectifs réels. | Toute décision technique, arbitrages build/buy, complexité justifiée |
| **Utilisateur Final** | Ancré dans l'expérience vécue : comment ça se sent à l'usage, pas comment ça s'implémente. | UX, nommage, messages d'erreur, flux utilisateur |
| **Estimateur** | Spécialiste des compromis temps/valeur. Pense en semaines, pas en élégance. | Roadmap, priorisation, décisions de scope, découpage de tâches |
| **Sécuritaire** | Pense aux vecteurs d'abus avant qu'ils existent. | API publiques, permissions, authentification, données sensibles |
| **Intégrateur** | "Comment ça joue avec ce qui existe déjà ?" | Décisions dans un système existant complexe, migration, couplage |

---

## Mode 1 — Pool léger

**Quand l'utiliser :** sujet bien identifiable, complexité modérée, cas courant.

**Sélection :** le Modérateur choisit 2-3 entités du catalogue selon le type de problème.
Guide de sélection :

| Type de problème | Entités recommandées |
|---|---|
| Décision architecturale | Enthousiaste + Sage |
| Choix technologique | Enthousiaste + Sage + Intégrateur |
| Design UX / nommage | Utilisateur Final + Sage |
| Roadmap / estimation | Estimateur + Sage |
| Sécurité / API | Sécuritaire + Intégrateur + Sage |
| Sujet hybride connu | Selon les dimensions dominantes |

**Limite :** 3 tours max fixes. Si le problème est trop complexe pour 3 tours → décomposer en
sous-décisions, chacune débattue séparément.

**Expert elevation :** un expert ponctuel peut être élevé en participant persistant (présent sur
2-3 tours) à la discrétion du Modérateur si le sujet le justifie.

---

## Mode 2 — Pool dynamique

**Quand l'utiliser :** forte complexité, sujet hybride inhabituel, ou demande explicite de
l'utilisateur ("je veux le mode dynamique").

**Sélection :** le Modérateur sélectionne librement parmi le catalogue, peut combiner plus de
3 entités, peut définir une entité ad hoc si aucune du catalogue ne correspond exactement.

**Limite adaptative :** le Modérateur évalue après chaque tour :
1. Les positions convergent-elles réellement ?
2. Reste-t-il des objections explicitement non résolues ?

Si convergence claire → clôture immédiate, même en tour 2.
Sinon → tour suivant.
**Plafond absolu : 10 tours.** Au-delà, clôture obligatoire quoi qu'il arrive.

**Expert elevation :** même mécanisme que pool léger.

---

## Procédure complète

### 1. Triage (nouveau — avant le lancement)

Le Modérateur :
1. Applique le test d'éligibilité (3 questions). Si non éligible → `superpowers:brainstorming`.
2. Évalue la complexité et la demande de l'utilisateur.
3. Annonce le mode choisi :
   > "J'utilise `hyperpowers:brainstorming-advanced` en mode **[pool léger / pool dynamique]**.
   > Entités sélectionnées : [liste]. Sujet : [reformulation claire]."
4. Si l'utilisateur préfère l'autre mode ou une autre combinaison d'entités : ajuster avant de commencer.

### 2. Tour de débat

Identique à la v1, mais avec les entités sélectionnées (pas nécessairement Enthousiaste et Sage).

Pour chaque entité, le prompt de dispatch précise :
- Son profil complet (tiré du catalogue)
- Le contexte et l'historique résumé des tours précédents
- La tension du tour (question ouverte et équilibrée)
- La contrainte de mots (150-250 mots pour le premier passage, 100-150 mots pour les
  contre-arguments)

L'ordre des entités dans un tour : le Modérateur choisit librement, mais doit s'assurer que
chaque entité reçoit la réponse de la précédente dans son prompt (pas de parallélisme —
séquentiel pour que les réponses se construisent).

### 3. Invocation d'experts ponctuels

Identique à la v1 :
- **Mode validation** : affirme/infirme une hypothèse factuelle, libéré immédiatement.
- **Mode participation** : 4ᵉ voix temporaire sur un tour, libéré après.
- **Mode élévation** (nouveau) : expert ponctuel promu participant persistant par le Modérateur
  si sa perspective est structurellement nécessaire sur plusieurs tours. Il reçoit le contexte
  complet à chaque tour comme n'importe quelle entité.

### 4. Évaluation de convergence (pool dynamique uniquement)

Après chaque tour, le Modérateur évalue en silence :
- Les positions se rapprochent-elles ? (au moins une entité a concédé ou nuancé)
- Reste-t-il une objection explicitement nommée et non résolue ?

Si convergence → aller à 5 (clôture). Sinon → formuler une nouvelle tension et continuer.

### 5. Clôture

Identique à la v1 : présenter 2-4 options avec Pour/Contre, recommandation, laisser le choix
à l'utilisateur.

### 6. Suite

Identique à la v1 : questions de raffinement → spec → review → `superpowers:writing-plans`.

---

## Règles absolues (mises à jour)

- Le test d'éligibilité est **toujours** appliqué en silence avant de lancer le débat.
- Le mode (léger vs dynamique) est **annoncé** avant le premier tour.
- Le Modérateur ne prend **jamais** position pendant les tours — uniquement à la clôture.
- Les experts ponctuels non-élevés sont **toujours libérés** après leur contribution.
- Pool léger : **3 tours max**, pas d'exception. Si trop complexe → décomposer.
- Pool dynamique : **10 tours max absolus**, convergence peut clore plus tôt.
- La sortie est **toujours compatible** avec `superpowers:writing-plans`.
- **Jamais sans accord explicite** de l'utilisateur.

---

## Ce qui ne change pas

- L'outil `Agent` est **toujours** utilisé pour chaque entité — jamais de persona simulé.
- Le Modérateur est le seul à communiquer avec l'utilisateur.
- Le skill ne s'invoque pas lui-même sans confirmation explicite de l'utilisateur.

---

## Périmètre

**Dans le scope :**
- Mettre à jour `skills/brainstorming-advanced/SKILL.md` avec la nouvelle procédure
- Tests structurels dans `tests/standard.test.mjs`

**Hors scope :**
- Modifier les autres skills (`brainstorming`, `writing-plans`, etc.)
- Ajouter de nouvelles entités au-delà des 6 du catalogue (extension future si besoin)
- Automatiser la sélection d'entités (le Modérateur reste le décideur)
