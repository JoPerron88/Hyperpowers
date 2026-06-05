// Transforme une chaîne en slug d'URL.
export function slugify(s) {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}
