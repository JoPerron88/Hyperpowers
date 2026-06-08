---
name: project-reference
description: Use when the user wants to generate or refresh an exhaustive project reference document ("génère la référence projet", "documente le projet", "crée project-reference", or any request for comprehensive project documentation).
user-invocable: true
---

# Project Reference — document de référence exhaustif

## Overview

Génère `docs/project-reference.md` : document de référence exhaustif du projet courant,
destiné à tout lecteur qui veut comprendre le projet en profondeur sans explorer le code.
Invocable à la demande — pas automatique. Refresh = réécriture complète.

Distinct de :
- `CLAUDE.md` — prescriptif pour agents (comportements, commandes)
- `session-handoff/HANDOFF.md` — snapshot d'état courant (éphémère)
- `CAHIER.md` — log séquentiel narratif (journal)
- `README.md` — présentation publique externe

## Procédure

### 1. Lire les sources (dans l'ordre)

1. `CLAUDE.md` — décisions stables, conventions
2. `README.md` — présentation externe
3. `session-handoff/HANDOFF.md` — état courant (si présent)
4. Structure des dossiers :

       find . -not -path '*/\.*' -not -path '*/node_modules/*' | head -80

5. 3-5 fichiers les plus significatifs : point d'entrée, fichier principal, config clé

### 2. Poser une question unique à l'utilisateur

> "Y a-t-il des décisions importantes non documentées que tu veux capturer ?"

Attendre la réponse, l'intégrer au document.

### 3. Rédiger `docs/project-reference.md` en une passe

    # Référence projet — <nom>
    > Généré le YYYY-MM-DD.

    ## Table des matières
    ...

    ## 1. Pourquoi ce projet
    [Problème résolu, contexte, objectif — 1-3 paragraphes]

    ## 2. Décisions non-évidentes
    [Choix technologiques/architecturaux avec le pourquoi.]

    ## 3. Structure du projet
    [Arborescence commentée — rôle de chaque dossier/fichier clé en 1 ligne.]

    ## 4. Contraintes et invariants du code
    [Règles non-évidentes : ordre d'init, modules qui ne se connaissent pas,
    invariants critiques. Chemins + 1 ligne d'intention — pas de snippets.]

    ## 5. Flux de travail
    [Voir `CLAUDE.md` pour les commandes. Cycle : lancer, tester, contribuer.]

    ## 6. Zones actives et fragiles
    [Ce qui est en chantier, ce qui est fragile, points d'attention.]

## Règles

- **Liens, pas duplication** — si l'info est dans `CLAUDE.md` ou `README.md`, lien.
- **Pas de snippets de code** — chemins + 1 ligne d'intention suffisent.
- **Refresh = réécriture complète** — pas de patch incrémental.
- **Invocation manuelle uniquement** — jamais automatique.
- **Ne pas dériver vers CLAUDE.md** — pas d'instructions comportementales dans ce document.

## Erreurs courantes

| Erreur | Correction |
|---|---|
| Dupliquer le contenu de CLAUDE.md | Lien vers CLAUDE.md, pas résumé |
| Insérer des snippets de code | Chemin du fichier + 1 ligne d'intention max |
| Patch incrémental sur refresh | Réécrire entièrement — cohérence interne garantie |
| Générer sans poser la question | Toujours poser la question unique avant de rédiger |
| Dériver vers des instructions pour agents | Ce document est pour humains — prescriptif appartient à CLAUDE.md |
