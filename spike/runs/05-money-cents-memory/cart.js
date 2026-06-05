// Panier : les montants sont en centimes entiers.
export function itemTotal(item) {
  return item.priceCents * item.qty;
}

export function cartTotal(items) {
  return items.reduce((total, item) => total + itemTotal(item), 0);
}
