---
name: check-dependencies
description: Use when you need to verify that the plugins required by Hyperpowers are installed (superpowers and planning-with-files), or when a skill fails to invoke one of these dependencies and you need to diagnose what is missing.
user-invocable: true
---

# check-dependencies — Vérification des dépendances Hyperpowers

Hyperpowers délègue à deux plugins externes : **superpowers** et **planning-with-files**.
Ce skill vérifie leur présence dans le cache local et donne les commandes d'installation
si l'une d'elles manque.

## Procédure

1. Lis `~/.claude/plugins/installed_plugins.json` :

   ```bash
   cat ~/.claude/plugins/installed_plugins.json
   ```

2. Dans le JSON retourné, cherche les clés commençant par `superpowers@` et
   `planning-with-files@` dans l'objet `plugins`.

3. Affiche le rapport avec ce format :

   ```
   ## Dépendances Hyperpowers

   | Plugin              | Statut       | Version |
   |---------------------|--------------|---------|
   | superpowers         | ✅ installé  | vX.Y.Z  |
   | planning-with-files | ❌ manquant  | —       |
   ```

4. Pour chaque dépendance manquante, affiche la commande d'installation :

### superpowers manquant

```
/plugin marketplace add claude-plugins-official
/plugin install superpowers@claude-plugins-official
```

### planning-with-files manquant

```
/plugin marketplace add OthmanAdi/planning-with-files
/plugin install planning-with-files@planning-with-files
```

5. Si les deux sont présents, conclure :

   > ✅ Toutes les dépendances Hyperpowers sont installées.
