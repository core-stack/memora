#!/usr/bin/env node

const { spawnSync } = require("child_process");

const args = process.argv.slice(2);

if (!args.length) {
  console.error("❌ Missing migration name. Use: pnpm db:generate <name>");
  process.exit(1);
}

const name = args[0];

spawnSync(
  "pnpm",
  [
    "typeorm",
    "migration:generate",
    `./migrations/${name}`
  ],
  { stdio: "inherit", cwd: __dirname + "/.." }
);
