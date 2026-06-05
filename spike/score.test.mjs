// spike/score.test.mjs — tests du scoreur du spike (lignes changées, suite de tests).
import { test } from "node:test";
import assert from "node:assert/strict";
import { countChangedLines } from "./score.mjs";
import { mkdtempSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

function fixture(beforeText, afterText) {
  const root = mkdtempSync(join(tmpdir(), "score-"));
  const a = join(root, "before"); const b = join(root, "after");
  mkdirSync(a); mkdirSync(b);
  writeFileSync(join(a, "f.js"), beforeText);
  writeFileSync(join(b, "f.js"), afterText);
  return { a, b };
}

test("countChangedLines compte les lignes ajoutées/modifiées", () => {
  const { a, b } = fixture("line1\n", "line1\nline2\nline3\n");
  assert.equal(countChangedLines(a, b), 2);
});
