import { test } from "node:test";
import assert from "node:assert/strict";
import { mapAsync, forEachAsync } from "./asyncUtils.js";

test("mapAsync applique fn et attend toutes les promesses", async () => {
  const out = await mapAsync([1, 2, 3], async (n) => n * 2);
  assert.deepEqual(out, [2, 4, 6]);
});

test("forEachAsync exécute fn en séquence et attend toutes les promesses", async () => {
  const ordre = [];
  await forEachAsync([1, 2, 3], async (n) => {
    await new Promise((resolve) => setTimeout(resolve, (4 - n) * 5));
    ordre.push(n);
  });
  assert.deepEqual(ordre, [1, 2, 3]);
});
