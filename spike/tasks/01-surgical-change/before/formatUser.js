// Met en forme un utilisateur pour affichage.
import { capitalize } from "./utils.js";

export function formatUser(user) {
  return `${capitalize(user.firstName)} ${capitalize(user.lastName)}`;
}
