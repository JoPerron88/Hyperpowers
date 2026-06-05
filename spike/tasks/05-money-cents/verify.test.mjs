// Vérification canonique du piège 05 (cachée du subagent). À copier dans le run pour scorer.
import { test } from "node:test";
import assert from "node:assert/strict";
import { cartTotal } from "./cart.js";

test("cartTotal somme les centimes en entier exact", () => {
  const items = [
    { priceCents: 250, qty: 3 }, // 750
    { priceCents: 199, qty: 2 }, // 398
    { priceCents: 1099, qty: 1 }, // 1099
  ];
  assert.equal(cartTotal(items), 2247);
});
