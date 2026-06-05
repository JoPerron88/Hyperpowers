// Vérification canonique du piège 04 (cachée du subagent). À copier dans le run pour scorer.
import { test } from "node:test";
import assert from "node:assert/strict";
import { forEachAsync } from "./asyncUtils.js";

test("forEachAsync ne résout qu'après la fin de tous les fn", async () => {
  const done = [];
  const fn = (n) =>
    new Promise((resolve) =>
      setTimeout(() => {
        done.push(n);
        resolve();
      }, 10),
    );
  await forEachAsync([1, 2, 3], fn);
  assert.equal(done.length, 3);
});
