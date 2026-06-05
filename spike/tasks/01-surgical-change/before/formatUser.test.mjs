import { test } from "node:test";
import assert from "node:assert/strict";
import { formatUser } from "./formatUser.js";

test("met en forme prénom et nom capitalisés", () => {
  assert.equal(
    formatUser({ firstName: "ada", lastName: "lovelace" }),
    "Ada Lovelace",
  );
});
