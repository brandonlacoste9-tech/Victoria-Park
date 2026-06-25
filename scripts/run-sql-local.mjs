#!/usr/bin/env node
/** Run SQL file using DATABASE_URL from web/.env.local */
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sqlFile = process.argv[2];
if (!sqlFile) {
  console.error("Usage: node scripts/run-sql-local.mjs <sql-file>");
  process.exit(1);
}

const envText = readFileSync(join(__dirname, "../web/.env.local"), "utf8");
const dbUrl = envText.match(/^DATABASE_URL=(.+)$/m)?.[1]?.trim();
if (!dbUrl) {
  console.error("Missing DATABASE_URL in web/.env.local");
  process.exit(1);
}

const sql = readFileSync(sqlFile, "utf8");
const client = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  await client.query(sql);
  console.log(`OK: ${sqlFile}`);
} catch (err) {
  console.error(err.message);
  process.exit(1);
} finally {
  await client.end();
}