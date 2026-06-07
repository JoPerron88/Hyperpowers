// tests/session-handoff.test.mjs — smoke-test structurel du skill session-handoff.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const skillPath = join(root, "skills/session-handoff/SKILL.md");

test("le skill session-handoff existe", () => {
  assert.ok(existsSync(skillPath), "skills/session-handoff/SKILL.md manquant");
});

test("le SKILL.md a un frontmatter valide (name, description, user-invocable)", () => {
  const c = readFileSync(skillPath, "utf8");
  const m = c.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(m, "frontmatter délimité par --- absent");
  const fm = m[1];
  assert.match(fm, /^name:\s*session-handoff\s*$/m, "name: session-handoff absent");
  assert.match(fm, /^description:\s*\S.+$/m, "description non vide absente");
  assert.match(fm, /^user-invocable:\s*true\s*$/m, "user-invocable: true absent");
});
