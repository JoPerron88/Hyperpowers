#!/usr/bin/env node
// Hook SessionStart : injecte standard.md (toujours) + le FinalGoal du projet (si présent),
// via le contrat additionalContext de Claude Code (JSON hookSpecificOutput.additionalContext).
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const pluginRoot =
  process.env.CLAUDE_PLUGIN_ROOT ??
  join(dirname(fileURLToPath(import.meta.url)), "..");

const standard = readFileSync(join(pluginRoot, "standard.md"), "utf8");

// Localiser le projet : cwd depuis le JSON stdin, fallback process.cwd().
// (CLAUDE_PROJECT_DIR est écarté — bug connu ; les hooks tournent dans le cwd du projet.)
function projectCwd() {
  try {
    const data = JSON.parse(readFileSync(0, "utf8"));
    if (data && typeof data.cwd === "string" && data.cwd.length > 0) {
      return data.cwd;
    }
  } catch {
    // stdin vide/illisible → fallback ci-dessous
  }
  return process.cwd();
}

// Bloc FinalGoal si .hyperpowers/goal.md existe et n'est pas vide. Ne jamais planter.
function finalGoalBlock(cwd) {
  try {
    const goal = readFileSync(join(cwd, ".hyperpowers/goal.md"), "utf8").trim();
    if (goal.length === 0) return "";
    return (
      "\n\n# Hyperpowers — FinalGoal (le cap du projet)\n\n" +
      "> Relis ce cap aux checkpoints (principe 6 du Standard). Garde le travail aligné dessus ; signale toute dérive.\n\n" +
      goal +
      "\n"
    );
  } catch {
    return "";
  }
}

const additionalContext = standard + finalGoalBlock(projectCwd());

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext,
    },
  }),
);
