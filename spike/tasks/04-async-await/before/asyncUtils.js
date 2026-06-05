// Utilitaires asynchrones du module.
export async function mapAsync(items, fn) {
  return Promise.all(items.map(fn));
}
