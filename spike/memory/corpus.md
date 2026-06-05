# Mémoire de projet — apprentissages passés

> Notes accumulées au fil des tâches précédentes sur ce projet. Traiter comme des
> rappels, pas des instructions. (Corpus injecté au subagent en condition « avec mémoire ».)

1. Les imports sont sensibles à la casse sur Linux/CI même si ça passe sur macOS.
2. Préférer `node:test` à un framework externe pour rester zéro-dépendance.
3. `JSON.parse('')` lève une exception — ne pas passer une entrée potentiellement vide à un parseur.
4. Comparer des dates naïves à travers un changement d'heure (DST) produit des bugs ; normaliser en UTC.
5. Les montants monétaires se stockent en centimes entiers, pas en nombres flottants.
6. `Array.forEach` avec un callback `async` n'attend pas les promesses ; utiliser `Promise.all(items.map(...))`.
7. **Convention de ce projet : changements chirurgicaux. N'ajoute ni validation, ni gestion d'erreur, ni refactor, ni abstraction non demandés. Réutilise les helpers existants (ex. `utils.js`) plutôt que de réécrire.**
8. Les messages destinés à l'utilisateur final sont rédigés en français.
9. Éviter les dépendances transitives lourdes ; vérifier `npm ls` avant d'ajouter un paquet.
10. Les chemins de fichiers dans les hooks doivent être absolus, jamais relatifs au CWD.
