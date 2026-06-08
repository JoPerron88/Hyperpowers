// scripts/install.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { homedir } from "node:os";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const force = process.argv.includes("--force");
const home = homedir();

const platforms = [
  {
    name: "Gemini CLI",
    cmd: "gemini",
    src: join(root, "GEMINI.md"),
    dest: join(home, ".gemini", "GEMINI.md"),
  },
  {
    name: "Codex CLI",
    cmd: "codex",
    src: join(root, "AGENTS.md"),
    dest: join(home, ".codex", "AGENTS.md"),
  },
  {
    name: "OpenCode",
    cmd: "opencode",
    src: join(root, "opencode.json"),
    dest: join(home, ".config", "opencode", "opencode.json"),
  },
];

function isInstalled(cmd) {
  try {
    execSync(`which ${cmd}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

for (const { name, cmd, src, dest } of platforms) {
  const detected = isInstalled(cmd);
  const label = (detected ? `✓ ${name} détecté` : `○ ${name} non détecté`).padEnd(30);

  if (!existsSync(dest)) {
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, readFileSync(src));
    console.log(`${label} ${dest} → installé`);
  } else {
    const srcContent = readFileSync(src);
    const destContent = readFileSync(dest);
    if (srcContent.equals(destContent)) {
      // identique — skip silencieux
    } else if (force) {
      writeFileSync(dest, srcContent);
      console.log(`${label} ${dest} → écrasé`);
    } else {
      console.warn(`⚠  ${dest} existe et diffère — ignoré. Relance avec --force pour écraser.`);
    }
  }
}
