#!/usr/bin/env node
// Hook SessionStart : injecte standard.md via le contrat additionalContext de Claude Code.
// (Claude Code attend du JSON hookSpecificOutput.additionalContext, pas du stdout brut.)
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const pluginRoot =
  process.env.CLAUDE_PLUGIN_ROOT ??
  join(dirname(fileURLToPath(import.meta.url)), "..");

const standard = readFileSync(join(pluginRoot, "standard.md"), "utf8");

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: standard,
    },
  }),
);
