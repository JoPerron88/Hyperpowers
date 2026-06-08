# Spec — Skill `project-reference`

**Date :** 2026-06-08
**Statut :** validé par l'utilisateur (post-brainstorming-advanced)

---

## But

Générer à la demande un document de référence exhaustif d'un projet — qu'il soit terminé ou en
cours. But : une personne lit `docs/project-reference.md` et comprend le projet en profondeur,
sans avoir besoin d'explorer le code.

Distinct de :
- `CLAUDE.md` — prescriptif pour agents (comportements, commandes)
- `session-handoff/HANDOFF.md` — snapshot d'état courant (éphémère)
- `CAHIER.md` — log séquentiel narratif (journal)
- `README.md` — présentation publique externe

---

## Décision (Option A)

Skill autonome `project-reference`, invocable manuellement par l'utilisateur. Claude seul
rédige en une passe. Pas de mode multi-agents pour l'instant (YAGNI — outil personnel).

---

## Nom du skill et du fichier

- **Skill :** `project-reference` (hyperpowers)
- **Fichier produit :** `docs/project-reference.md` (racine du repo cible)
- **Refresh :** réécriture complète — même commande crée ou rafraîchit

---

## Procédure du skill

### Ce que Claude lit (dans l'ordre)

1. `CLAUDE.md` — décisions stables, conventions
2. `README.md` — présentation externe
3. `session-handoff/HANDOFF.md` — état courant et historique récent (si présent)
4. Structure des dossiers (`find . -type f | head -60` ou équivalent)
5. 3-5 fichiers les plus significatifs (point d'entrée, fichier principal, config clé)

### Question unique à l'utilisateur

> "Y a-t-il des décisions importantes non documentées que tu veux capturer dans ce document ?"

Intégrer la réponse avant de rédiger.

### Structure du document produit

```markdown
# Référence projet — <nom>
> Généré le YYYY-MM-DD. Lire de bout en bout pour comprendre le projet.

## Table des matières
[liens vers chaque section]

## 1. Pourquoi ce projet
[Problème résolu, contexte, objectif en 1-3 paragraphes]

## 2. Décisions non-évidentes
[Choix technologiques, architecturaux — avec le POURQUOI. Ce que quelqu'un pourrait
remettre en question sans connaître le contexte.]

## 3. Structure du projet
[Arborescence commentée — chaque dossier/fichier clé avec son rôle en 1 ligne.
Relations entre les pièces.]

## 4. Contraintes et invariants du code
[Règles non-évidentes à la lecture du code : ordre d'init, modules qui ne se
connaissent pas, invariants critiques. Pas de snippets — chemins + 1 ligne d'intention.]

## 5. Flux de travail
[Liens vers CLAUDE.md pour les commandes. Résumé du cycle : comment lancer,
tester, contribuer.]

## 6. Zones actives et fragiles
[Ce qui est en chantier, ce qui est fragile, ce sur quoi faire attention.]
```

---

## Règles

- **Liens, pas duplication** — si l'info est dans CLAUDE.md ou README.md, lien vers là-bas.
- **Pas de snippets de code** — chemins + 1 ligne d'intention suffisent.
- **Refresh = réécriture complète** — pas de patch incrémental.
- **Invocation manuelle uniquement** — le skill ne se déclenche pas automatiquement.
- **Pas de drift vers CLAUDE.md** — si une section devient prescriptive pour les agents,
  elle appartient à CLAUDE.md, pas à project-reference.

---

## Ce qui NE change PAS

- `CLAUDE.md`, `HANDOFF.md`, `CAHIER.md`, `README.md` — non modifiés par ce skill.
- Mode multi-agents — non implémenté (ajout possible si projet > ~100 fichiers).
