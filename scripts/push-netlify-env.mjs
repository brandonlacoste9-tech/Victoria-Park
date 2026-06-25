#!/usr/bin/env node
/**
 * Push env vars from web/.env.local to Netlify.
 * Requires: NETLIFY_AUTH_TOKEN (Personal access token from app.netlify.com/user/applications)
 * Optional: NETLIFY_SITE_ID or NETLIFY_SITE_NAME (default: resilient-khapse-ecd31c)
 *
 * Usage: node scripts/push-netlify-env.mjs
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENV_FILE = join(__dirname, "../web/.env.local");
const API = "https://api.netlify.com/api/v1";

const VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_CALENDLY_URL",
];

const token = process.env.NETLIFY_AUTH_TOKEN?.trim();
if (!token) {
  console.error("Missing NETLIFY_AUTH_TOKEN. Get one at https://app.netlify.com/user/applications");
  process.exit(1);
}

function parseEnvFile(path) {
  const out = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^\s*([^#=]+)=(.*)$/);
    if (m) out[m[1].trim()] = m[2].trim();
  }
  return out;
}

async function api(path, opts = {}) {
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...opts.headers,
    },
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    throw new Error(`${opts.method ?? "GET"} ${path} → ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

async function getSiteId() {
  if (process.env.NETLIFY_SITE_ID) return process.env.NETLIFY_SITE_ID;
  const name = process.env.NETLIFY_SITE_NAME ?? "resilient-khapse-ecd31c";
  const sites = await api("/sites");
  const site = sites.find((s) => s.name === name || s.ssl_url?.includes(name));
  if (!site) throw new Error(`Site not found: ${name}`);
  return site.id;
}

async function setEnvVar(accountId, siteId, key, value) {
  const existing = await api(`/accounts/${accountId}/env?search=${encodeURIComponent(key)}`);
  const found = existing?.find?.((e) => e.key === key);

  const body = {
    key,
    scopes: ["builds", "functions", "runtime"],
    values: [
      { value, context: "all" },
    ],
    is_secret: key.includes("SECRET") || key.includes("SERVICE_ROLE"),
    site_ids: [siteId],
  };

  if (found) {
    await api(`/accounts/${accountId}/env/${key}`, { method: "PUT", body: JSON.stringify(body) });
    console.log(`Updated ${key}`);
  } else {
    await api(`/accounts/${accountId}/env`, { method: "POST", body: JSON.stringify(body) });
    console.log(`Created ${key}`);
  }
}

async function main() {
  const local = parseEnvFile(ENV_FILE);
  const siteId = await getSiteId();
  const site = await api(`/sites/${siteId}`);
  const accountId = site.account_id;

  console.log(`Site: ${site.name} (${siteId})`);
  console.log(`Account: ${accountId}`);

  for (const key of VARS) {
    const value = local[key];
    if (!value) {
      console.log(`Skip ${key} (not in .env.local)`);
      continue;
    }
    await setEnvVar(accountId, siteId, key, value);
  }

  console.log("\nDone. Trigger redeploy:");
  console.log(`  curl -X POST -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" ${API}/sites/${siteId}/builds`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});