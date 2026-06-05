// Panier : les montants sont en centimes entiers.
export function itemTotal(item) {
  return item.priceCents * item.qty;
}
