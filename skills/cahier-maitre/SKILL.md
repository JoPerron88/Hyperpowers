---
name: cahier-maitre
description: Use when the user wants to record a project event, decision, or progress update in the master project log ("note dans le cahier", "mets ça dans le cahier", "ajoute une entrée au cahier", or any request to log recent project events for human tracking).
user-invocable: true
---

# Cahier maître — log séquentiel narratif

## Overview

Log séquentiel d'avancement de projet, **commité dans le repo**, destiné à l'humain.
Distinct de `session-handoff/HANDOFF.md` (snapshot écrasé à chaque session) et de
`.claude/JOURNAL.md` (journal privé local, non commité, orienté IA).

## Procédure

### 1. Dériver l'auteur

Exécuter :

    git config user.name

Si la commande échoue ou retourne vide : utiliser `"Auteur inconnu"`.

### 2. Résumer les événements clés

Sans lire `CAHIER.md`, résumer en **2-3 lignes** les événements clés de la session courante :
avancées notables, problèmes rencontrés, décisions prises. Ton narratif court — carnet de
chantier, pas rapport. Pas de liste à puces imposée.

Si l'utilisateur a précisé le contenu à noter, l'utiliser directement.

### 3. Formater l'entrée

    ## YYYY-MM-DD — <auteur>

    <résumé 2-3 lignes>

Date = date du jour au format ISO (`YYYY-MM-DD`).

### 4. Prepend dans CAHIER.md

Utiliser un prepend Bash pour éviter de lire l'intégralité du fichier :

    # Remplacer DATE, AUTEUR et RESUME par les valeurs réelles avant d'exécuter.

    # Si CAHIER.md existe :
    { printf '## DATE — AUTEUR\n\nRESUME\n\n'; cat "CAHIER.md"; } > "/tmp/cahier_tmp" \
      && mv "/tmp/cahier_tmp" "CAHIER.md"

    # Si CAHIER.md n'existe pas :
    printf '## DATE — AUTEUR\n\nRESUME\n' > "CAHIER.md"

Adapter le chemin selon la racine du projet courant.

### 5. Confirmer

Une ligne : `Entrée ajoutée dans CAHIER.md.`

Proposer `git add CAHIER.md` + commit si le contexte s'y prête.

## Règles

- **Ne pas lire `CAHIER.md` pour écrire** — le prepend Bash évite ce coût en tokens.
- **Ne jamais réécrire les entrées existantes.**
- **2-3 lignes maximum** par entrée.
- `CAHIER.md` est à la **racine du repo**, commité dans git — le proposer à l'utilisateur si
  non commité.

## Erreurs courantes

| Erreur | Correction |
|---|---|
| Lire `CAHIER.md` avant d'écrire | Ne jamais lire — le prepend ne le requiert pas |
| Entrée trop longue (paragraphe complet) | 2-3 lignes max — c'est un carnet, pas un rapport |
| Appender en bas du fichier | Toujours prepend — le plus récent doit être en haut |
| Créer `CAHIER.md` ailleurs qu'à la racine | Toujours à la racine du repo |
| Commiter `CAHIER.md` sans proposer à l'utilisateur | Proposer, ne jamais commiter en douce |
