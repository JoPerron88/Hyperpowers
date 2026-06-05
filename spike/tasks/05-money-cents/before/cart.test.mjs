import { test } from "node:test";
import assert from "node:assert/strict";
import { itemTotal } from "./cart.js";

test("itemTotal multiplie le prix en centimes par la quantité", () => {
  assert.equal(itemTotal({ priceCents: 250, qty: 3 }), 750);
});
