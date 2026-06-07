---
name: brainstorming-advanced
description: Use when facing complex architectural decisions with genuine design tensions and multiple valid approaches — where independent reasoning from different perspectives would produce better outcomes than a single brainstorm.
user-invocable: true
---

# Brainstorming Advanced — Débat multi-agents

Trois vrais sous-agents indépendants (outil `Agent`) débattent pour explorer une décision
complexe. Plus puissant que `superpowers:brainstorming` — à réserver aux sujets à fortes
tensions de conception, avec **accord explicite de l'utilisateur**.

**Règle absolue :** ne jamais invoquer ce skill sans confirmation explicite de l'utilisateur.
`superpowers:brainstorming` reste le défaut.

## Les 3 entités

Chaque entité est un **vrai sous-agent** dispatché via l'outil `Agent` — pas un persona simulé
dans une seule réponse.

**L'Enthousiaste** — développeur créatif, optimiste. Amplifie l'idée, propose des extensions,
explore les possibilités. Argumente en construisant — jamais en démolissant. Ignore les budgets
et délais.

**Le Sage** — senior dev 20 ans d'expérience, KISS dans le sang. Challenge la complexité,
pointe la charge de travail cachée, ramène aux objectifs réels. N'est pas là pour tuer l'idée —
il est là pour qu'elle survive à la réalité.

**Le Modérateur (toi)** — neutre, orchestre, ne prend jamais position dans le débat. Seul à
communiquer avec l'utilisateur. Peut invoquer des experts ponctuels.

## Procédure

### 1. Lancement

Annonce à l'utilisateur :
> "J'utilise `hyperpowers:brainstorming-advanced`. Je vais orchestrer un débat entre 3 entités
> indépendantes. Sujet : [reformulation claire de la question]."

Si l'utilisateur refuse : invoquer `superpowers:brainstorming` à la place et continuer normalement.

### 2. Tour de débat

Répéter jusqu'à clôture (étape 4) :

**a) Formuler la tension du tour** — une question ouverte et équilibrée, pas un résumé général. La formulation ne doit pas préjuger de la réponse attendue ni avantager l'un des agents. ❌ "Pourquoi PostgreSQL est la bonne décision ?" ✅ "Est-ce que la complexité de PostgreSQL est justifiée pour ce projet ?"

**b) Invoquer l'Enthousiaste :**

```
Agent(
  description="Enthousiaste — tour N",
  prompt="Tu es l'Enthousiaste : développeur créatif et optimiste.

Contexte du débat : [sujet original]
[Si tours précédents : Historique résumé : [résumé des tours]]

Question de ce tour : [tension formulée en a)]

Développe l'idée, propose des extensions, explore les possibilités.
Argumente en construisant — jamais en démolissant.
Réponds en 150-250 mots."
)
```

**c) Invoquer le Sage avec la réponse de l'Enthousiaste :**

```
Agent(
  description="Sage — tour N",
  prompt="Tu es le Sage : senior dev 20 ans d'expérience, KISS.

Contexte du débat : [sujet original]
L'Enthousiaste vient de dire : [réponse de l'Enthousiaste]

Question de ce tour : [tension formulée en a)]

Challenge la complexité. Pointe la charge de travail cachée. Ramène aux objectifs réels.
Pose les questions : 'Est-ce vraiment nécessaire ?', 'Qui va maintenir ça ?', 'Quel est le vrai gain ?'
Réponds en 150-250 mots."
)
```

**d) [Optionnel] 2ᵉ échange si le débat n'est pas épuisé :**

```
Agent(
  description="Enthousiaste — contre-argument tour N",
  prompt="Tu es l'Enthousiaste : développeur créatif et optimiste.

Contexte du débat : [sujet original]
[Si tours précédents : Historique résumé : [résumé des tours]]
Le Sage a répondu : [réfutation du Sage]

Contre-argumente en construisant — pas en démolissant.
Réponds en 100-150 mots."
)
```

**e) Évaluer :** consensus émergent ? positions figées ? question résolue ? → aller à 4.
Sinon formuler une nouvelle tension et recommencer. **Maximum 3 tours** — si aucun consensus après 3 tours, aller à 4 quand même.

### 3. Invocation d'experts (entre les tours, au jugement du Modérateur)

**Mode validation** — vérifier une hypothèse technique précise :

```
Agent(
  description="Expert [domaine] — validation",
  prompt="Tu es un expert [domaine précis].

Affirme ou infirme cette hypothèse : [hypothèse en une phrase].
Justifie en 3-5 phrases. Sois direct et factuel."
)
```

Le résultat est un **fait établi** injecté dans le tour suivant. Expert libéré immédiatement.

**Mode participation** — 4ᵉ voix temporaire dans un tour :

```
Agent(
  description="Expert [domaine] — participant tour N",
  prompt="Tu es [titre expert, ex: architecte cloud].

Contexte : [sujet du débat]
L'Enthousiaste dit : [X]
Le Sage dit : [Y]

Contribue en tant qu'expert [domaine] pour enrichir le débat.
Réponds en 150-200 mots."
)
```

Expert libéré après sa contribution. Ne pas le garder pour les tours suivants.

### 4. Clôture

Présenter à l'utilisateur **2-4 options** issues du débat :

```
## Options issues du débat

**Option A — [nom court]**
[Description 2-3 phrases]
✅ Pour : [avantages clés]
⚠️ Contre : [inconvénients clés]

**Option B — [nom court]**
[Description 2-3 phrases]
✅ Pour : ...
⚠️ Contre : ...

**Ma recommandation : Option [X]** — [justification courte, 1-2 phrases].

Note : tu peux avoir des préférences ou une vision d'ensemble que je n'ai pas.
Toutes les options sont valides. Quel est ton choix ?
```

### 5. Suite — identique à `superpowers:brainstorming`

Après le choix de l'utilisateur :
- [ ] Poser les questions de raffinement restantes (une à la fois)
- [ ] Écrire la spec dans `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`
- [ ] Auto-review de la spec (placeholders, cohérence, scope, ambiguïté)
- [ ] Demander la review utilisateur
- [ ] Invoquer `superpowers:writing-plans`

## Règles absolues

- Le Modérateur ne prend **jamais** de position **pendant les tours de débat** — uniquement à la clôture il peut recommander une option
- Les experts sont **toujours libérés** après leur intervention
- L'utilisateur a **toujours le dernier mot**
- La sortie est **toujours compatible** avec `superpowers:writing-plans`
- **Jamais sans accord explicite** de l'utilisateur
