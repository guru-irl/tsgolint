#!/usr/bin/env node
// Lints one directory (src/ by default) with one oxlint binary, one config and the
// same disable comments, swapping only the oxlint-tsgolint version, and reports
// which comments still apply.
import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import path from "node:path";

const versions = ["0.25.0", "7.0.2001", "7.0.2002", "7.0.2003"];
const dir = process.argv[2] ?? "src";
const files = readdirSync(dir).filter((f) => f.endsWith(".ts")).sort();
// Set OXLINT_BIN to try another oxlint build, for example a local build of a fix.
const oxlint = process.env.OXLINT_BIN ?? path.resolve("node_modules/.bin/oxlint");
const args = ["--type-aware", "--report-unused-disable-directives", "--format", "unix", dir];

function lint(version) {
  const tsgolint = path.resolve(`node_modules/tsgolint-${version}/bin/tsgolint.js`);
  const result = spawnSync(oxlint, args, {
    encoding: "utf8",
    env: { ...process.env, OXLINT_TSGOLINT_PATH: tsgolint },
  });
  return `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
}

function status(output, file) {
  const lines = output.split("\n").filter((line) => line.startsWith(`${dir}/${file}:`));
  if (lines.length === 0) return output.includes("Error running tsgolint") ? "crash" : "ok";
  const finding = lines.some((line) => line.includes("[Error/typescript("));
  const unused = lines.some((line) => line.includes("Unused eslint-disable directive"));
  return finding && unused ? "IGNORED" : "other";
}

const version = spawnSync(oxlint, ["--version"], { encoding: "utf8" }).stdout.trim();
const outputs = Object.fromEntries(versions.map((v) => [v, lint(v)]));
const width = Math.max(...files.map((f) => f.length)) + 2;

console.log(`${dir}/ with oxlint ${version.replace(/^Version:\s*/, "")}; only oxlint-tsgolint changes.\n`);
console.log("file".padEnd(width) + versions.map((v) => v.padEnd(10)).join(""));
for (const file of files) {
  console.log(file.padEnd(width) + versions.map((v) => status(outputs[v], file).padEnd(10)).join(""));
}
console.log("\nIGNORED: the finding is reported and the disable comment above it is reported as unused.");
const latest = versions.at(-1);
console.log(`\nOutput with oxlint-tsgolint ${latest}:\n${outputs[latest]}`);
