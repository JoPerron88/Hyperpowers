# Spec — Routage writing-skills dans brainstorming-advanced

**Date :** 2026-06-08
**Statut :** validé par l'utilisateur (post-brainstorming-advanced)

---

## But

Combler le gap de composition documenté en session : après un `brainstorming-advanced` dont le
livrable est un skill ou plugin, rien ne guide automatiquement vers `superpowers:writing-skills`.
L'utilisateur doit le savoir ou l'oublier.

---

## Décision (Option A)

Enrichir la section **"5. Suite"** de `skills/brainstorming-advanced/SKILL.md` avec une branche
conditionnelle sur le type de livrable.

## Périmètre

- **Modifié :** `skills/brainstorming-advanced/SKILL.md` (owned hyperpowers) — section "5. Suite"
- **Non modifié :** `superpowers:brainstorming` (non owned), `superpowers:writing-skills` (non owned)

## Gap restant (accepté)

- `brainstorming` (simple, superpowers) a le même gap — hors périmètre, outil personnel.
- Invocation directe de writing-skills sans brainstorming : couvert par le mécanisme pull natif
  (description de writing-skills). Pas d'action nécessaire.

---

## Changement exact

**Avant (section "5. Suite", dernière étape) :**
```
- [ ] Invoquer `superpowers:writing-plans`
```

**Après :**
```
- [ ] Si le livrable est un **skill ou plugin** → invoquer `superpowers:writing-skills` en premier
  (puis `superpowers:writing-plans` si des tests ou scripts sont à implémenter)
- [ ] Sinon → invoquer `superpowers:writing-plans` directement
```

## Détection du livrable

Claude infère du contexte du débat et du choix de l'utilisateur si le livrable est un skill ou
plugin. Signaux : mots-clés "skill", "plugin", "SKILL.md", "command", livrable nommé dans la
spec ou le choix. Si ambiguïté → Claude demande.

---

## Ce qui NE change PAS

- Le comportement actuel de brainstorming-advanced pour les livrables non-skill (code, architecture, UX) reste identique.
- La section "Suite" garde toutes ses étapes existantes (raffinement, spec, review utilisateur).
- `superpowers:writing-plans` reste l'étape suivante pour les livrables code.
