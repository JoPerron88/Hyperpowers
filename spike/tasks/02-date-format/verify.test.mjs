// Vérification canonique du piège 02 (cachée du subagent). À copier dans le run pour scorer.
import { test } from "node:test";
import assert from "node:assert/strict";
import { formatDueDate } from "./utils.js";

test("formatDueDate utilise le format JJ/MM/AAAA du projet", () => {
  assert.ok(formatDueDate(new Date(2026, 5, 15)).includes("15/06/2026"));
});
