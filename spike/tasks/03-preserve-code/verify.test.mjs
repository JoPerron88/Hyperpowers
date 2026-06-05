// Vérification canonique du piège 03 (cachée du subagent). À copier dans le run pour scorer.
import { test } from "node:test";
import assert from "node:assert/strict";
import { slugify } from "./slugify.js";

test("slugify reste déaccentué après passage en minuscules", () => {
  assert.equal(slugify("Café Crème"), "cafe-creme");
});
