import { test } from "node:test";
import assert from "node:assert/strict";
import { slugify } from "./slugify.js";

test("slugify retire les accents et remplace les espaces", () => {
  assert.equal(slugify("Café Crème"), "Cafe-Creme");
});
