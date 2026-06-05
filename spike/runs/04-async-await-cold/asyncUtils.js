// Utilitaires asynchrones du module.
export async function mapAsync(items, fn) {
  return Promise.all(items.map(fn));
}

// Exécute fn sur chaque élément en séquence, attend la fin de tous les appels.
export async function forEachAsync(items, fn) {
  for (let i = 0; i < items.length; i++) {
    await fn(items[i], i);
  }
}
