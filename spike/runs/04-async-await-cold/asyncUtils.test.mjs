import { test } from "node:test";
import assert from "node:assert/strict";
import { mapAsync, forEachAsync } from "./asyncUtils.js";

test("mapAsync applique fn et attend toutes les promesses", async () => {
  const out = await mapAsync([1, 2, 3], async (n) => n * 2);
  assert.deepEqual(out, [2, 4, 6]);
});

test("forEachAsync exécute fn en séquence et attend la fin de tous les appels", async () => {
  const events = [];
  await forEachAsync([1, 2, 3], async (n) => {
    events.push(`start-${n}`);
    await new Promise((resolve) => setTimeout(resolve, n === 1 ? 20 : 1));
    events.push(`end-${n}`);
  });
  // L'ordre prouve la séquence : chaque appel se termine avant le suivant.
  assert.deepEqual(events, [
    "start-1",
    "end-1",
    "start-2",
    "end-2",
    "start-3",
    "end-3",
  ]);
});
