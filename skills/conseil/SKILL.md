---
name: conseil
description: Use when the user wants to evaluate, review, or get a long-term perspective on an existing project or decision — not to explore options (use brainstorming for that), but to get a structured assessment from multiple expert perspectives on what already exists or is in progress. Triggers include "revois mon projet", "analyse mon architecture", "plan long terme", "est-ce que ça tient", "consulte la firm".
---

# Skill conseil — Mini firm conseil personnelle

Une mini firm de développement conseil personnelle : trois experts invoqués via l'outil `Agent`
pour analyser, réviser, ou planifier à grande échelle. Distinct de `brainstorming-advanced` :
la firm **lit ce qui existe**, brainstorming **explore l'espace des possibles**.

## Règle absolue

**Jamais de réponse en texte direct.** Toujours les 3 entités via l'outil `Agent`. Toujours un
fichier livrable dans `firm/`. Toujours une mise à jour de `firm/index.md`.

Si tu te retrouves à penser "une réponse directe suffit" ou "c'est overkill" — c'est exactement
quand ce skill s'applique. Invoque les 3 entités.

## Les 3 entités de la firm

| Entité | Rôle | Question centrale |
|--------|------|-------------------|
| **Stratège** | Vision, cap, plans long terme | "Construit-on la bonne chose ?" |
| **Guide** | Accompagnement pour non-développeur | "Comment traverser sans se perdre ?" |
| **Relecteur** | Revue de livrable, dérive silencieuse | "Ça tient la route ?" |

### Entité principale selon le type de demande

| Type de demande | Entité principale |
|-----------------|-------------------|
| "Revois mon architecture / mon projet" | Relecteur |
| "Plan long terme / roadmap / analyse" | Stratège |
| "Est-ce que mon approche tient ?" | Relecteur |
| "J'ai un doute, explique-moi" | Guide |
| Demande mixte ou ambiguë | Stratège |

Les deux entités secondaires font une **passe courte** (1-2 lignes chacune).

## Protocole d'exécution

### 1. Lire le contexte (ordre fixe)

```
1. session-handoff/HANDOFF.md       ← source de vérité principale
   → Si date > 7 jours OU flou : alerter, ne pas halluciner
2. firm/index.md                    ← historique consultations (si existe)
3. firm/sessions/<dernière>.md      ← session précédente uniquement
4. CLAUDE.md (Décisions de base)    ← seulement si HANDOFF.md insuffisant
```

Ne pas lire : `CAHIER.md`, `.claude/JOURNAL.md`, `docs/` (trop verbeux).

### 2. Question initiale (si nécessaire)

Si le contexte est suffisant → commencer directement.
Si un élément essentiel manque → poser **une seule question**.

### 3. Invoquer les 3 entités séquentiellement

Dispatcher dans l'ordre : entité principale en premier, puis les deux secondaires.
Chaque entité reçoit la réponse de la précédente.

```
Agent(
  description="[Entité] — consultation [date]",
  prompt="Tu es [profil de l'entité].

Contexte du projet : [résumé du HANDOFF.md]
[Si firm/index.md existe : Consultations précédentes : [résumé]]
[Si entité précédente : [Entité précédente] vient de dire : [réponse]]

Demande de l'utilisateur : [demande]

[Entité principale : répondre en 200-300 mots]
[Entité secondaire : répondre en 50-80 mots, passe courte]"
)
```

**Profils des entités :**
- **Stratège** : Vision d'ensemble, priorités, risques stratégiques. Pose la question "construit-on la bonne chose ?" avant de parler du comment. Pense en mois, pas en sprints.
- **Guide** : Traducteur entre ambitions et réalité d'un non-développeur. Reformule, simplifie, protège contre la complexité accidentelle. Parle d'impact et de risque, pas de jargon technique.
- **Relecteur** : Recul critique sur ce qui a été livré. Signale les incohérences, les dérives silencieuses, ce qui ne répond plus au besoin initial. Lit entre les lignes.

### 4. Produire le livrable

Créer `firm/sessions/YYYY-MM-DD-<slug>.md` :

```markdown
# [Titre de la consultation]
Date : YYYY-MM-DD | Entité principale : [Stratège / Guide / Relecteur]

## [Entité principale] — voix principale
[3-4 lignes]

## [Entité 2] — passe courte
[1-2 lignes]

## [Entité 3] — passe courte
[1-2 lignes]

## Décision / cap retenu
[1-2 lignes — omis si consultation sans décision]

## Tensions non résolues
[optionnel — une ligne si un point reste ouvert]
```

Si deux consultations le même jour : `YYYY-MM-DD-<slug>-2.md`.

### 5. Mettre à jour firm/index.md (prepend)

Le dossier `firm/` est à la **racine du projet courant** (là où se trouve `CLAUDE.md`).

Si `firm/index.md` n'existe pas encore, le créer :
```markdown
# Firm — index des consultations
| Date | Titre | Entité principale | Décision/cap |
|------|-------|-------------------|--------------|
| YYYY-MM-DD | [titre] | [entité principale] | [décision/cap] |
```

Si `firm/index.md` existe, prepend une ligne de tableau sous l'en-tête :
```markdown
| YYYY-MM-DD | [titre] | [entité principale] | [décision/cap] |
```

### 6. Lien vers cahier-maitre

Si `CAHIER.md` existe, ajouter une ligne (prepend) :
```
[date] — Consultation firm: [titre]
```

## Erreurs courantes

| Erreur | Correction |
|--------|------------|
| Répondre en texte direct "parce que c'est plus rapide" | Toujours les 3 entités via Agent |
| Ne pas créer de fichier firm/ | Toujours écrire le livrable, même courte consultation |
| Dispatcher les entités en parallèle | Séquentiel obligatoire — chaque entité lit la précédente |
| Halluciner le contexte si HANDOFF.md est périmé | Alerter explicitement, demander une mise à jour |
| Confondre avec brainstorming-advanced | Firm = lit l'existant ; brainstorming = explore les options |
