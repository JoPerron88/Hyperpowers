// tests/standard.test.mjs — smoke-tests du noyau comportemental Hyperpowers.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

test("standard.md existe et n'est pas vide", () => {
  const p = join(root, "standard.md");
  assert.ok(existsSync(p), "standard.md manquant");
  assert.ok(readFileSync(p, "utf8").trim().length > 0);
});

test("standard.md contient les 4 principes", () => {
  const c = readFileSync(join(root, "standard.md"), "utf8");
  for (const titre of [
    "Réfléchir avant de coder",
    "Simplicité d'abord",
    "Changements chirurgicaux",
    "Piloté par objectif",
  ]) {
    assert.ok(c.includes(titre), `principe manquant : ${titre}`);
  }
});

function installedSuperpowersSkills() {
  const base = join(
    homedir(),
    ".claude/plugins/cache/claude-plugins-official/superpowers",
  );
  assert.ok(
    existsSync(base),
    "superpowers non installé — impossible de valider les références",
  );
  const names = new Set();
  for (const v of readdirSync(base)) {
    const skillsDir = join(base, v, "skills");
    if (!existsSync(skillsDir)) continue;
    for (const s of readdirSync(skillsDir)) names.add(s);
  }
  return names;
}

test("toutes les skills superpowers citées dans standard.md existent", () => {
  const c = readFileSync(join(root, "standard.md"), "utf8");
  const refs = [...c.matchAll(/superpowers:([a-z-]+)/g)].map((m) => m[1]);
  assert.ok(refs.length >= 4, "trop peu de références superpowers");
  const installed = installedSuperpowersSkills();
  for (const r of refs) {
    assert.ok(installed.has(r), `référence morte : superpowers:${r}`);
  }
});
