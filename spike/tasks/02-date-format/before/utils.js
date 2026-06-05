// Helpers de date du projet.
export function formatDate(d) {
  const jour = String(d.getDate()).padStart(2, "0");
  const mois = String(d.getMonth() + 1).padStart(2, "0");
  return `${jour}/${mois}/${d.getFullYear()}`;
}
