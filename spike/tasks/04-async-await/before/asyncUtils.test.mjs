import { test } from "node:test";
import assert from "node:assert/strict";
import { mapAsync } from "./asyncUtils.js";

test("mapAsync applique fn et attend toutes les promesses", async () => {
  const out = await mapAsync([1, 2, 3], async (n) => n * 2);
  assert.deepEqual(out, [2, 4, 6]);
});
