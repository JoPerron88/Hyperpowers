# Hyperpowers

Plugin Claude Code qui fusionne le **standard de qualité** d'Andrej Karpathy avec le **process**
de superpowers, en une seule voix. Au SessionStart, il injecte `standard.md` : les 4 garde-fous
(penser avant · simplicité · chirurgical · piloté par objectif) recadrés pour **pointer vers**
les skills superpowers qui les réalisent — au lieu de doublonner leur philosophie.

## Installation

1. Installer ce dépôt comme plugin via `/plugin` (marketplace local ou chemin du dépôt).
2. **Désinstaller le plugin karpathy autonome** (`andrej-karpathy-skills`) via `/plugin` :
   son contenu vit désormais dans `standard.md` (source unique). Sans ça, doublon temporaire.
3. Garder **superpowers** installé tel quel (non modifié).
4. Redémarrer Claude Code, puis vérifier que le standard apparaît dans le bloc de contexte
   SessionStart.

## Tester

```bash
npm test
```

Valide : `standard.md` présent et complet, références superpowers vivantes, manifeste JSON
valide, et que le hook émet bien le standard.

## Portée

v1 = noyau comportemental seulement. La couche mémoire (mempalace) est écartée (voir le spike
`spike/RESULTS.md`, verdict rouge) ; planning-with-files est différé (voir
`spike/roles-scorecard.md`).
