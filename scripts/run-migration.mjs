import { readFileSync } from "fs";

const projectRef = process.argv[2];
const sqlFile = process.argv[3];
const token = process.env.SUPABASE_ACCESS_TOKEN;

if (!projectRef || !sqlFile || !token) {
  console.error("Usage: SUPABASE_ACCESS_TOKEN=... node run-migration.mjs <project-ref> <sql-file>");
  process.exit(1);
}

const sql = readFileSync(sqlFile, "utf8");
const res = await fetch(
  `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  }
);

const text = await res.text();
if (!res.ok) {
  console.error(`Failed (${res.status}):`, text);
  process.exit(1);
}

console.log(`OK: ${sqlFile}`);
if (text) console.log(text);