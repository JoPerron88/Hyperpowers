// tests/standard.test.mjs — smoke-tests du noyau comportemental Hyperpowers.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  readFileSync,
  existsSync,
  readdirSync,
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  rmSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir, tmpdir } from "node:os";
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

function planningWithFilesInstalled() {
  // pwf peut être installé en skill (~/.claude/skills) ou en plugin (cache marketplace).
  if (existsSync(join(homedir(), ".claude/skills/planning-with-files/SKILL.md"))) {
    return true;
  }
  const cache = join(homedir(), ".claude/plugins/cache");
  if (!existsSync(cache)) return false;
  for (const mk of readdirSync(cache)) {
    for (const pl of safeReaddir(join(cache, mk))) {
      for (const ver of safeReaddir(join(cache, mk, pl))) {
        if (
          existsSync(
            join(cache, mk, pl, ver, "skills", "planning-with-files", "SKILL.md"),
          )
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

function safeReaddir(dir) {
  try {
    return readdirSync(dir);
  } catch {
    return [];
  }
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

test("plugin.json est un JSON valide avec name=hyperpowers et author objet", () => {
  const m = JSON.parse(
    readFileSync(join(root, ".claude-plugin/plugin.json"), "utf8"),
  );
  assert.equal(m.name, "hyperpowers");
  assert.ok(m.description && m.description.length > 0);
  // Claude Code exige author = objet { name }, pas une chaîne (sinon install rejetée).
  assert.equal(typeof m.author, "object");
  assert.ok(m.author.name && m.author.name.length > 0);
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
  const out = execFileSync("sh", ["-c", resolved], { encoding: "utf8", input: "" });
  // Claude Code attend du JSON : hookSpecificOutput.additionalContext (pas du stdout brut).
  const parsed = JSON.parse(out);
  assert.equal(parsed.hookSpecificOutput.hookEventName, "SessionStart");
  const ctx = parsed.hookSpecificOutput.additionalContext;
  for (const titre of [
    "Réfléchir avant de coder",
    "Simplicité d'abord",
    "Changements chirurgicaux",
    "Piloté par objectif",
    "Planifier à la bonne échelle",
    "Garder le cap",
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

test("standard.md contient le 5ᵉ principe et ses 3 tiers", () => {
  const c = readFileSync(join(root, "standard.md"), "utf8");
  assert.ok(c.includes("Planifier à la bonne échelle"), "titre du 5ᵉ principe absent");
  for (const tier of ["Petite", "Moyenne", "Grosse"]) {
    assert.ok(c.includes(tier), `tier manquant : ${tier}`);
  }
  assert.ok(c.includes("Récite"), "idée de récitation (empruntée à pwf) absente");
});

test("standard.md explicite l'arbitrage des déclencheurs (pas seulement 5+ tool calls)", () => {
  const c = readFileSync(join(root, "standard.md"), "utf8");
  assert.ok(c.includes("5+ tool calls"), "le seuil pwf à arbitrer n'est pas nommé");
  assert.ok(
    c.includes("rester au tier inférieur"),
    "la règle anti sur-planification (doute → tier inférieur) est absente",
  );
});

test("standard.md cite planning-with-files et la skill existe (référence vivante)", () => {
  const c = readFileSync(join(root, "standard.md"), "utf8");
  assert.ok(c.includes("planning-with-files"), "référence à planning-with-files absente");
  assert.ok(
    planningWithFilesInstalled(),
    "planning-with-files non installé — référence morte (installer la skill/plugin pwf)",
  );
});

test("standard.md contient le 6ᵉ principe (Garder le cap)", () => {
  const c = readFileSync(join(root, "standard.md"), "utf8");
  assert.ok(c.includes("Garder le cap"), "titre du 6ᵉ principe absent");
  assert.ok(c.includes(".hyperpowers/goal.md"), "chemin du fichier de cap absent");
  assert.ok(c.includes("relis"), "consigne de récitation (relis) absente");
});

const hookPath = join(root, "hooks/session-start.mjs");
const standardContent = readFileSync(join(root, "standard.md"), "utf8");

function runHook(input) {
  const out = execFileSync("node", [hookPath], { input, encoding: "utf8" });
  return JSON.parse(out).hookSpecificOutput.additionalContext;
}

test("le hook injecte le FinalGoal quand .hyperpowers/goal.md existe", () => {
  const dir = mkdtempSync(join(tmpdir(), "hp-goal-"));
  try {
    mkdirSync(join(dir, ".hyperpowers"));
    const goal = "Logiciel de prise de notes assisté par IA.";
    writeFileSync(join(dir, ".hyperpowers/goal.md"), goal);
    const ctx = runHook(JSON.stringify({ cwd: dir, hook_event_name: "SessionStart" }));
    assert.ok(ctx.startsWith(standardContent), "le standard doit rester injecté en tête");
    assert.ok(ctx.includes(goal), "le contenu du FinalGoal doit être injecté");
    assert.ok(ctx.length > standardContent.length, "un bloc doit être ajouté au standard");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("le hook reste dormant quand .hyperpowers/goal.md est absent", () => {
  const dir = mkdtempSync(join(tmpdir(), "hp-nogoal-"));
  try {
    const ctx = runHook(JSON.stringify({ cwd: dir, hook_event_name: "SessionStart" }));
    assert.equal(ctx, standardContent, "sans cap, additionalContext = standard verbatim");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("le hook ne plante pas si stdin est vide (fallback process.cwd())", () => {
  const ctx = runHook("");
  assert.ok(
    ctx.includes("Réfléchir avant de coder"),
    "le standard doit être injecté même sans stdin",
  );
});

test("brainstorming-advanced skill existe et a un frontmatter valide", () => {
  const skillPath = join(root, "skills/brainstorming-advanced/SKILL.md");
  const content = readFileSync(skillPath, "utf8");
  assert.ok(content.startsWith("---"), "SKILL.md doit commencer par frontmatter YAML");
  assert.ok(content.includes("name: brainstorming-advanced"), "name requis");
  assert.ok(content.includes("description:"), "description requise");
  assert.ok(content.includes("user-invocable: true"), "user-invocable requis");
});

test("standard.md mentionne brainstorming-advanced comme option opt-in", () => {
  const content = readFileSync(join(root, "standard.md"), "utf8");
  assert.ok(
    content.includes("brainstorming-advanced"),
    "standard.md doit mentionner brainstorming-advanced",
  );
  assert.ok(
    content.includes("accord explicite"),
    "standard.md doit préciser que l'accord utilisateur est requis",
  );
});

test("newproject skill existe et a un frontmatter valide", () => {
  const skillPath = join(root, "skills/newproject/SKILL.md");
  const content = readFileSync(skillPath, "utf8");
  assert.ok(content.startsWith("---"), "SKILL.md doit commencer par frontmatter YAML");
  assert.ok(content.includes("name: newproject"), "name requis");
  assert.ok(content.includes("description:"), "description requise");
  assert.ok(content.includes("user-invocable: true"), "user-invocable requis");
});

test("newproject skill décrit les 3 artefacts obligatoires", () => {
  const content = readFileSync(join(root, "skills/newproject/SKILL.md"), "utf8");
  assert.ok(content.includes("CLAUDE.md"), "artefact CLAUDE.md requis");
  assert.ok(content.includes(".hyperpowers/goal.md"), "artefact goal.md requis");
  assert.ok(content.includes("git init"), "artefact git init requis");
});

test("newproject skill mentionne brainstorming comme option en phase 2", () => {
  const content = readFileSync(join(root, "skills/newproject/SKILL.md"), "utf8");
  assert.ok(
    content.includes("superpowers:brainstorming"),
    "option brainstorming requise en phase 2",
  );
});

test("newproject skill décrit le débat de phase 3 avec Enthousiaste et Sage", () => {
  const content = readFileSync(join(root, "skills/newproject/SKILL.md"), "utf8");
  assert.ok(content.includes("Enthousiaste"), "agent Enthousiaste requis dans le débat");
  assert.ok(content.includes("Sage"), "agent Sage requis dans le débat");
});

test("newproject skill contient une section erreurs courantes", () => {
  const content = readFileSync(join(root, "skills/newproject/SKILL.md"), "utf8");
  assert.ok(content.includes("Erreurs courantes"), "section erreurs courantes requise");
});

test("newproject skill précise le contexte à passer au Tour 2 du débat", () => {
  const content = readFileSync(join(root, "skills/newproject/SKILL.md"), "utf8");
  assert.ok(content.includes("Tour 2"), "référence au Tour 2 requise");
  assert.ok(
    content.includes("Tour 1"),
    "contexte du Tour 1 doit être mentionné pour le Tour 2",
  );
});

test("newproject description ne résume pas le workflow (CSO)", () => {
  const content = readFileSync(join(root, "skills/newproject/SKILL.md"), "utf8");
  const frontmatter = content.split("---")[1];
  assert.ok(
    !frontmatter.includes("Guides through"),
    "description ne doit pas résumer le workflow (CSO — piège de déclenchement)",
  );
});

test("GEMINI.md existe et référence standard.md via @-include", () => {
  const content = readFileSync(join(root, "GEMINI.md"), "utf8");
  assert.ok(content.includes("@standard.md"), "@-include de standard.md requis");
});

test("opencode.json est valide et inclut standard.md", () => {
  const config = JSON.parse(readFileSync(join(root, "opencode.json"), "utf8"));
  assert.ok(Array.isArray(config.instructions), "instructions doit être un tableau");
  assert.ok(
    config.instructions.includes("standard.md"),
    "standard.md doit être dans instructions",
  );
});

test("AGENTS.md existe et contient le standard (généré)", () => {
  const content = readFileSync(join(root, "AGENTS.md"), "utf8");
  assert.ok(content.includes("AUTO-GÉNÉRÉ"), "en-tête AUTO-GÉNÉRÉ requis");
  assert.ok(content.includes("Réfléchir avant de coder"), "contenu standard requis");
});

test("AGENTS.md est synchronisé avec les sources (pas de staleness)", () => {
  const standard = readFileSync(join(root, "standard.md"), "utf8");
  const skillsDir = join(root, "skills");
  const skills = readdirSync(skillsDir)
    .filter((name) => existsSync(join(skillsDir, name, "SKILL.md")))
    .sort()
    .map((name) => {
      const content = readFileSync(join(skillsDir, name, "SKILL.md"), "utf8");
      return `### ${name}\n\n${content}`;
    })
    .join("\n\n---\n\n");
  const expected =
    `<!-- AUTO-GÉNÉRÉ — ne pas éditer directement -->\n` +
    `<!-- Source : standard.md + skills/*/SKILL.md -->\n` +
    `<!-- Régénérer : npm run build:agents -->\n\n` +
    `${standard}\n\n---\n\n## Skills disponibles\n\n${skills}\n`;
  const actual = readFileSync(join(root, "AGENTS.md"), "utf8");
  assert.equal(actual, expected, "AGENTS.md obsolète — régénérer avec : npm run build:agents");
});

test("scripts/install.mjs existe et déclare les 3 plateformes et --force", () => {
  const path = join(root, "scripts", "install.mjs");
  assert.ok(existsSync(path), "scripts/install.mjs doit exister");
  const content = readFileSync(path, "utf8");
  assert.ok(content.includes("--force"), "flag --force requis");
  assert.ok(content.includes("GEMINI.md"), "Gemini CLI requis");
  assert.ok(content.includes("AGENTS.md"), "Codex requis");
  assert.ok(content.includes("opencode.json"), "OpenCode requis");
});

test("package.json contient le script install-configs", () => {
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  assert.ok(pkg.scripts?.["install-configs"], "script install-configs requis");
});

test("gemini-extension.json existe et déclare name=hyperpowers et contextFileName=GEMINI.md", () => {
  const ext = JSON.parse(readFileSync(join(root, "gemini-extension.json"), "utf8"));
  assert.equal(ext.name, "hyperpowers");
  assert.equal(ext.contextFileName, "GEMINI.md");
});

test(".opencode/plugins/hyperpowers.js existe et référence standard.md et HYPERPOWERS_STANDARD", () => {
  const content = readFileSync(join(root, ".opencode/plugins/hyperpowers.js"), "utf8");
  assert.ok(content.includes("standard.md"), "doit lire standard.md");
  assert.ok(content.includes("HYPERPOWERS_STANDARD"), "guard d'injection requis");
  assert.ok(content.includes("experimental.chat.messages.transform"), "hook requis");
});

test(".codex-plugin/plugin.json est valide et déclare name=hyperpowers", () => {
  const p = JSON.parse(readFileSync(join(root, ".codex-plugin/plugin.json"), "utf8"));
  assert.equal(p.name, "hyperpowers");
  assert.ok(p.skills, "skills path requis");
});

test(".cursor-plugin/plugin.json est valide et déclare name=hyperpowers", () => {
  const p = JSON.parse(readFileSync(join(root, ".cursor-plugin/plugin.json"), "utf8"));
  assert.equal(p.name, "hyperpowers");
});

test("references/gemini-tools.md existe et contient un tableau de mapping", () => {
  const content = readFileSync(join(root, "references/gemini-tools.md"), "utf8");
  assert.ok(content.includes("read_file"), "mapping Read → read_file requis");
  assert.ok(content.includes("run_shell_command"), "mapping Bash requis");
});

test("references/codex-tools.md existe et contient un tableau de mapping", () => {
  const content = readFileSync(join(root, "references/codex-tools.md"), "utf8");
  assert.ok(content.includes("spawn_agent"), "mapping Task → spawn_agent requis");
  assert.ok(content.includes("multi_agent"), "note multi_agent requise");
});

test("GEMINI.md inclut references/gemini-tools.md", () => {
  const content = readFileSync(join(root, "GEMINI.md"), "utf8");
  assert.ok(content.includes("@references/gemini-tools.md"), "@-include references requis");
});

test("brainstorming-advanced SKILL.md contient le test d'éligibilité et les deux modes", () => {
  const content = readFileSync(join(root, "skills/brainstorming-advanced/SKILL.md"), "utf8");
  assert.ok(content.includes("information factuelle"), "question zéro requise");
  assert.ok(content.includes("pool léger"), "mode pool léger requis");
  assert.ok(content.includes("pool dynamique"), "mode pool dynamique requis");
});

test("brainstorming-advanced SKILL.md contient les 6 entités du catalogue", () => {
  const content = readFileSync(join(root, "skills/brainstorming-advanced/SKILL.md"), "utf8");
  for (const entity of ["Enthousiaste", "Sage", "Utilisateur Final", "Estimateur", "Sécuritaire", "Intégrateur"]) {
    assert.ok(content.includes(entity), `entité manquante : ${entity}`);
  }
});

test("brainstorming-advanced SKILL.md limite pool léger à 3 tours et pool dynamique à 10 tours", () => {
  const content = readFileSync(join(root, "skills/brainstorming-advanced/SKILL.md"), "utf8");
  assert.ok(content.includes("3 tours"), "limite 3 tours pool léger requise");
  assert.ok(content.includes("10 tours"), "limite 10 tours pool dynamique requise");
});

test("brainstorming-advanced SKILL.md contient le mécanisme d'élévation d'expert", () => {
  const content = readFileSync(join(root, "skills/brainstorming-advanced/SKILL.md"), "utf8");
  assert.ok(content.includes("élév"), "mécanisme d'élévation requis (élevé/élévation/élevable)");
});

test("brainstorming-advanced SKILL.md frontmatter description commence par 'Use when' et distingue du brainstorming simple", () => {
  const content = readFileSync(join(root, "skills/brainstorming-advanced/SKILL.md"), "utf8");
  const frontmatter = content.match(/^---\n([\s\S]+?)\n---/)?.[1] ?? "";
  assert.ok(frontmatter.length > 0, "frontmatter absent");
  assert.ok(frontmatter.includes("Use when"), "description doit commencer par 'Use when' (CSO)");
  assert.ok(
    frontmatter.includes("multi-agent") || frontmatter.includes("debate") || frontmatter.includes("pressure-test"),
    "description doit distinguer du brainstorming simple"
  );
});

test("cahier-maitre skill existe et a un frontmatter valide", () => {
  const skillPath = join(root, "skills/cahier-maitre/SKILL.md");
  const content = readFileSync(skillPath, "utf8");
  assert.ok(content.startsWith("---"), "SKILL.md doit commencer par frontmatter YAML");
  assert.ok(content.includes("name: cahier-maitre"), "name requis");
  assert.ok(content.includes("description:"), "description requise");
  assert.ok(content.includes("user-invocable: true"), "user-invocable requis");
});

test("cahier-maitre description commence par 'Use when' (CSO)", () => {
  const content = readFileSync(join(root, "skills/cahier-maitre/SKILL.md"), "utf8");
  const frontmatter = content.match(/^---\n([\s\S]+?)\n---/)?.[1] ?? "";
  assert.ok(frontmatter.length > 0, "frontmatter absent");
  assert.ok(frontmatter.includes("Use when"), "description doit commencer par 'Use when' (CSO)");
});

test("cahier-maitre skill cible CAHIER.md avec insertion en haut du fichier", () => {
  const content = readFileSync(join(root, "skills/cahier-maitre/SKILL.md"), "utf8");
  assert.ok(content.includes("CAHIER.md"), "doit cibler CAHIER.md");
  assert.ok(
    content.includes("prepend") || content.includes("haut du fichier"),
    "insertion en tête du fichier requise"
  );
});

test("cahier-maitre skill dérive l'auteur via git config user.name", () => {
  const content = readFileSync(join(root, "skills/cahier-maitre/SKILL.md"), "utf8");
  assert.ok(content.includes("git config user.name"), "auteur via git config requis");
});

test("session-handoff mentionne CAHIER.md comme étape optionnelle", () => {
  const content = readFileSync(join(root, "skills/session-handoff/SKILL.md"), "utf8");
  assert.ok(
    content.includes("CAHIER.md"),
    "session-handoff doit mentionner CAHIER.md (intégration optionnelle cahier-maitre)"
  );
});
