# Design — v5 Fondations Symbiose

**Date :** 2026-06-08
**Processus :** brainstorming-advanced (pool léger — Sage + Intégrateur + Enthousiaste, 2 tours)
**Décision :** Option B + C

---

## Contexte

Le chantier initialement appelé "v5 marketplace curé" visait à référencer superpowers et
planning-with-files dans le `marketplace.json` d'Hyperpowers pour débloquer la symbiose
inter-skills.

## Révision conceptuelle (issue du débat)

Le marketplace.json n'est pas le bon lieu pour la symbiose. Faits établis :

- Le runtime Claude Code **ne résout pas automatiquement les dépendances** entre plugins.
- `plugin.json` ne supporte aucun champ `dependencies`.
- Le marketplace.json est un **registre de distribution** (contrat machine), pas un
  gestionnaire de paquets.
- Re-lister superpowers/planning-with-files dans le marketplace Hyperpowers crée de la
  **dette de maintenance** (sha épinglés qui vieillissent) sans valeur ajoutée — ces plugins
  sont déjà disponibles via leurs sources canoniques.

**Conclusion :** le marketplace.json reste à une seule entrée (`hyperpowers` lui-même).
La "distro curée" ne passe pas par le registre, elle se manifeste dans les skills eux-mêmes.

**Renommage :** "v5 marketplace curé" → **"v5 Fondations Symbiose"**.

---

## Décision : Option B + C

### Option B — Vérifications dans les skills existants

Chaque skill Hyperpowers qui délègue à superpowers ou planning-with-files **vérifie en
ouverture** si la dépendance est accessible. Si elle manque, le skill affiche immédiatement
la commande d'installation et s'arrête.

**Principe :** onboarding distribué — l'utilisateur reçoit l'instruction au moment exact
où il en a besoin, pas en avance.

Skills concernés (ceux qui citent explicitement superpowers ou pwf dans leur SKILL.md) :
- À identifier lors de l'implémentation (scan des skills pour références croisées).

Format de vérification (à définir lors de l'implémentation — voir contrainte ci-dessous).

### Option C — Skill `hyperpowers:check-dependencies`

Un skill dédié qui :
1. Liste les plugins requis par Hyperpowers (superpowers, planning-with-files).
2. Vérifie leur présence (mécanisme à définir).
3. Affiche les commandes d'installation manquantes.

Utilisable depuis OUTILLAGE.md comme point d'entrée diagnostic.

---

## Contrainte d'implémentation clé

**Le mécanisme de vérification de présence d'un plugin dans un skill est à concevoir.**
Un skill Claude Code est un fichier markdown — il ne peut pas exécuter de commande shell
directement. Les options :

1. **Vérification déclarative dans le prompt** : le skill demande à Claude de vérifier
   si la skill cible est disponible avant de l'invoquer (via l'outil `Skill`).
2. **Check via un script** : un script Node appelé depuis le skill (si le runtime le permet).
3. **Check passif** : le skill tente d'invoquer la dépendance et gère l'échec proprement.

Cette contrainte doit être résolue en premier lors du plan d'implémentation.

---

## Ce qui ne change pas

- `marketplace.json` : inchangé (une seule entrée, hyperpowers).
- OUTILLAGE.md : reste le guide d'installation principal — source unique fiable.
- Les plugins upstream (superpowers, planning-with-files) : non forkés, non modifiés.

---

## Prochaines étapes

1. `superpowers:writing-plans` pour planifier l'implémentation de B + C.
2. Scanner les skills existants pour identifier ceux qui citent superpowers/pwf → liste
   des points d'entrée pour l'option B.
3. Concevoir le mécanisme de vérification (contrainte clé ci-dessus).
4. Implémenter `check-dependencies` en premier (C) — c'est le bloc réutilisable par B.
