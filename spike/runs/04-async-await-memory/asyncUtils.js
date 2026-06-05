// Utilitaires asynchrones du module.
export async function mapAsync(items, fn) {
  return Promise.all(items.map(fn));
}

export async function forEachAsync(items, fn) {
  for (const item of items) {
    await fn(item);
  }
}
