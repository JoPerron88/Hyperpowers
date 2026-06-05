// spike/score.mjs — scoreur du spike : mesure les lignes changées entre deux dossiers.
import { execFileSync, spawnSync } from "node:child_process";

// Lignes ajoutées + supprimées entre deux dossiers (via git diff --no-index).
export function countChangedLines(beforeDir, afterDir) {
  let out = "";
  try {
    out = execFileSync(
      "git",
      ["diff", "--no-index", "--numstat", beforeDir, afterDir],
      { encoding: "utf8" },
    );
  } catch (e) {
    // git diff --no-index sort 1 quand il y a des différences : c'est normal.
    out = e.stdout ?? "";
  }
  let total = 0;
  for (const line of out.trim().split("\n").filter(Boolean)) {
    const [added, deleted] = line.split("\t");
    total += (Number(added) || 0) + (Number(deleted) || 0);
  }
  return total;
}

// true si `node --test` sort 0 dans le dossier donné.
export function runTests(dir) {
  const r = spawnSync("node", ["--test"], { cwd: dir, encoding: "utf8" });
  return r.status === 0;
}
