// tests/standard.test.mjs — smoke-tests du noyau comportemental Hyperpowers.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";
import { execFileSync } from "node:child_process";

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

test("plugin.json est un JSON valide avec name=hyperpowers", () => {
  const m = JSON.parse(
    readFileSync(join(root, ".claude-plugin/plugin.json"), "utf8"),
  );
  assert.equal(m.name, "hyperpowers");
  assert.ok(m.description && m.description.length > 0);
});

test("hooks.json déclare un SessionStart non vide", () => {
  const h = JSON.parse(readFileSync(join(root, "hooks/hooks.json"), "utf8"));
  assert.ok(Array.isArray(h.hooks.SessionStart), "SessionStart manquant");
  assert.ok(h.hooks.SessionStart.length > 0);
});

test("la commande du hook SessionStart émet le contrat additionalContext de Claude Code", () => {
  const h = JSON.parse(readFileSync(join(root, "hooks/hooks.json"), "utf8"));
  const cmd = h.hooks.SessionStart[0].hooks[0].command;
  const resolved = cmd.replaceAll("${CLAUDE_PLUGIN_ROOT}", root);
  const out = execFileSync("sh", ["-c", resolved], { encoding: "utf8" });
  // Claude Code attend du JSON : hookSpecificOutput.additionalContext (pas du stdout brut).
  const parsed = JSON.parse(out);
  assert.equal(parsed.hookSpecificOutput.hookEventName, "SessionStart");
  const ctx = parsed.hookSpecificOutput.additionalContext;
  for (const titre of [
    "Réfléchir avant de coder",
    "Simplicité d'abord",
    "Changements chirurgicaux",
    "Piloté par objectif",
  ]) {
    assert.ok(ctx.includes(titre), `principe absent du contexte injecté : ${titre}`);
  }
});

test("marketplace.json déclare le plugin hyperpowers à la racine", () => {
  const mk = JSON.parse(
    readFileSync(join(root, ".claude-plugin/marketplace.json"), "utf8"),
  );
  assert.ok(Array.isArray(mk.plugins) && mk.plugins.length >= 1);
  const p = mk.plugins.find((x) => x.name === "hyperpowers");
  assert.ok(p, "plugin hyperpowers absent du marketplace");
  assert.equal(p.source, "./");
});
