# Spec — skill conseil v2 : structure en couches + Racine conditionnelle
Date : 2026-06-08 | Méthode : brainstorming-advanced pool léger (3 entités, 2 tours)

## Décision

Remplacer les instructions de volume du skill `conseil` par une structure imposée en couches.

## Changements au skill

### Entité principale — remplacer les instructions de volume

Avant :
```
[Entité principale : répondre en 200-300 mots]
```

Après :
```
Structure ta réponse en 3 sections obligatoires :
- **Verdict** (1 phrase tranchée : "ça tient" / "ça dérive" / "mauvais cap" — pas de nuance)
- **Signal** (1-3 constats factuels ancrés dans le contexte lu — cite une section spécifique)
- **Contrainte** (la chose la plus bloquante que tu vois — une seule)

Si ta Contrainte révèle un blocage structurel ou récurrent dans CE projet (pas générique),
OU si l'utilisateur a dit "analyse en profondeur" dans sa demande :
ajoute une 4e section **Racine** — une phrase qui relie la Contrainte à la dynamique propre
de ce projet. Pas une généralité — quelque chose qu'on ne pourrait pas écrire pour un autre projet.
```

### Entités secondaires — remplacer les instructions de volume

Avant :
```
[Entité secondaire : répondre en 50-80 mots, passe courte]
```

Après :
```
Réagis uniquement à ce que [entité précédente] vient de dire : accord, désaccord, ou angle mort.
1-3 phrases, ancré dans le contexte. Pas de nouvelle analyse depuis zéro.
```

### Format du livrable — ajouter la section Racine (optionnelle)

```markdown
## [Entité principale] — voix principale
**Verdict :** [1 phrase]
**Signal :** [1-3 constats ancrés]
**Contrainte :** [la plus bloquante]
**Racine :** [si déclenchée — 1 phrase ancrée dans ce projet]

## [Entité 2] — réaction
[1-3 phrases : accord / désaccord / angle mort sur la voix principale]

## [Entité 3] — réaction
[1-3 phrases : accord / désaccord / angle mort]
```

## Logique de déclenchement de la Racine

Double déclencheur :
1. **Auto** — l'entité principale juge que sa Contrainte révèle un blocage structurel ou récurrent
   propre à CE projet (pas une généralité réutilisable ailleurs)
2. **Forcé** — l'utilisateur inclut "analyse en profondeur" dans sa demande

## Rationale

- Les instructions de volume ("200-300 mots") pilotent la forme sans piloter le contenu → padding
- Structure imposée force le signal : verdict tranchée + constats ancrés + une seule contrainte
- Entités secondaires qui "recommencent l'analyse" = redondance → forcer la réaction à la précédente
- Racine permanente = bruit sur 80% des cas → conditionnel sur blocage structurel réel ou demande explicite
