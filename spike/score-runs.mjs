// Score les 12 runs : lignes changées + détection de piège (verify caché pour 02-05, rubrique sinon).
import { countChangedLines } from "./score.mjs";
import { spawnSync } from "node:child_process";
import { copyFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const tasks = [
  "01-surgical-change",
  "02-date-format",
  "03-preserve-code",
  "04-async-await",
  "05-money-cents",
  "06-yagni-greenfield",
];
const verifyTasks = new Set([
  "02-date-format",
  "03-preserve-code",
  "04-async-await",
  "05-money-cents",
]);

console.log("tâche\tcond\tlignes\tpiège");
for (const t of tasks) {
  for (const c of ["cold", "memory"]) {
    const before = `tasks/${t}/before`;
    const run = `runs/${t}-${c}`;
    const lines = countChangedLines(before, run); // avant toute copie de verify
    let trap = "rubrique";
    if (verifyTasks.has(t)) {
      const dest = join(run, "verify.test.mjs");
      copyFileSync(`tasks/${t}/verify.test.mjs`, dest);
      const r = spawnSync("node", ["--test", "verify.test.mjs"], {
        cwd: run,
        encoding: "utf8",
      });
      rmSync(dest);
      trap = r.status === 0 ? "non" : "OUI";
    }
    console.log(`${t}\t${c}\t${lines}\t${trap}`);
  }
}
