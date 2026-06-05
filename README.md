# Hyperpowers

Plugin Claude Code qui fusionne le **standard de qualité** d'Andrej Karpathy avec le **process**
de superpowers, en une seule voix. Au SessionStart, il injecte `standard.md` : les 4 garde-fous
(penser avant · simplicité · chirurgical · piloté par objectif) recadrés pour **pointer vers**
les skills superpowers qui les réalisent — au lieu de doublonner leur philosophie.

## Installation

Ce dépôt est à la fois un **marketplace** (`.claude-plugin/marketplace.json`) et le **plugin**
qu'il publie (`source: "./"`). Dans Claude Code :

1. Ajouter le marketplace : `/plugin marketplace add JoPerron88/Hyperpowers`
   (ou, en local, `/plugin marketplace add /home/jonathanp/Documents/Hyperpowers`).
2. Installer le plugin : `/plugin install hyperpowers@hyperpowers`.
3. **Désinstaller le plugin karpathy autonome** (`andrej-karpathy-skills`) via `/plugin` :
   son contenu vit désormais dans `standard.md` (source unique). Sans ça, doublon temporaire.
4. Garder **superpowers** installé tel quel (non modifié).
5. **Redémarrer** Claude Code, puis vérifier que le standard apparaît dans le bloc de contexte
   SessionStart (les 4 principes).

## Tester

```bash
npm test
```

Valide : `standard.md` présent et complet, références superpowers vivantes, manifestes
(`plugin.json`, `marketplace.json`) valides, et que le hook émet bien le contrat
`hookSpecificOutput.additionalContext` de Claude Code contenant les 4 principes.

## Portée

v1 = noyau comportemental seulement. La couche mémoire (mempalace) est écartée (voir le spike
`spike/RESULTS.md`, verdict rouge) ; planning-with-files est différé (voir
`spike/roles-scorecard.md`).
