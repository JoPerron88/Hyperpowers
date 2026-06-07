#!/usr/bin/env node
// Génère AGENTS.md (Codex + Mistral Vibe) depuis standard.md + skills/*/SKILL.md.
// Usage : npm run build:agents
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

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

const output = `<!-- AUTO-GÉNÉRÉ — ne pas éditer directement -->
<!-- Source : standard.md + skills/*/SKILL.md -->
<!-- Régénérer : npm run build:agents -->

${standard}

---

## Skills disponibles

${skills}
`;

writeFileSync(join(root, "AGENTS.md"), output);
console.log("AGENTS.md généré (" + output.length + " caractères).");
