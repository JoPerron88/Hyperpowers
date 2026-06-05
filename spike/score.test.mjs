// spike/score.test.mjs — tests du scoreur du spike (lignes changées, suite de tests).
import { test } from "node:test";
import assert from "node:assert/strict";
import { countChangedLines, runTests } from "./score.mjs";
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

test("runTests rapporte vert quand les tests passent", () => {
  const { a } = fixture(
    "export const x = 1;\n",
    "export const x = 1;\n",
  );
  // écrit un test trivialement vert dans le dossier 'after'
  writeFileSync(
    join(a, "ok.test.mjs"),
    'import { test } from "node:test";\nimport assert from "node:assert/strict";\ntest("ok", () => assert.equal(1, 1));\n',
  );
  assert.equal(runTests(a), true);
});
