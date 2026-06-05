import { test } from "node:test";
import assert from "node:assert/strict";
import { itemTotal, cartTotal } from "./cart.js";

test("itemTotal multiplie le prix en centimes par la quantité", () => {
  assert.equal(itemTotal({ priceCents: 250, qty: 3 }), 750);
});

test("cartTotal additionne le total de tous les articles", () => {
  const items = [
    { priceCents: 250, qty: 3 },
    { priceCents: 100, qty: 2 },
  ];
  assert.equal(cartTotal(items), 950);
});
