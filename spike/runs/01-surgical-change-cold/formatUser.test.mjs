import { test } from "node:test";
import assert from "node:assert/strict";
import { formatUser } from "./formatUser.js";

test("met en forme prénom et nom capitalisés", () => {
  assert.equal(
    formatUser({ firstName: "ada", lastName: "lovelace", city: "londres" }),
    "Ada Lovelace — Londres",
  );
});

test("capitalise la ville de l'utilisateur", () => {
  assert.equal(
    formatUser({ firstName: "grace", lastName: "hopper", city: "new york" }),
    "Grace Hopper — New york",
  );
});
