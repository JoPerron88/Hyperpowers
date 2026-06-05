import { test } from "node:test";
import assert from "node:assert/strict";
import { formatDate, formatDueDate } from "./utils.js";

test("formatDate rend le format JJ/MM/AAAA", () => {
  assert.equal(formatDate(new Date(2026, 5, 15)), "15/06/2026");
});

test("formatDueDate préfixe la date avec « Échéance : »", () => {
  assert.equal(formatDueDate(new Date(2026, 5, 15)), "Échéance : 15/06/2026");
});
