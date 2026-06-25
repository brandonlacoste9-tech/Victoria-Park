#!/usr/bin/env node
/** Push env vars from web/.env.local via netlify CLI (must be logged in + linked). */
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENV_FILE = join(__dirname, "../web/.env.local");

const VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_CALENDLY_URL",
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN",
  "TWILIO_API_KEY_SID",
  "TWILIO_API_KEY_SECRET",
  "TWILIO_MESSAGING_SERVICE_SID",
  "TWILIO_PHONE_NUMBER",
  "TWILIO_PHONE_NUMBER_SID",
  "VAPI_PRIVATE_KEY",
  "NEXT_PUBLIC_VAPI_PUBLIC_KEY",
  "VAPI_ASSISTANT_ID",
  "VAPI_DEFAULT_BUSINESS_ID",
  "VAPI_WEBHOOK_SECRET",
  "VAPI_TRANSFER_NUMBER",
  "CRON_SECRET",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_PRICE_STARTER_MONTHLY",
  "STRIPE_PRICE_STARTER_ANNUAL",
  "STRIPE_PRICE_PRO_MONTHLY",
  "STRIPE_PRICE_PRO_ANNUAL",
  "STRIPE_PRICE_PREMIUM_MONTHLY",
  "STRIPE_PRICE_PREMIUM_ANNUAL",
];

const local = {};
for (const line of readFileSync(ENV_FILE, "utf8").split("\n")) {
  const m = line.match(/^\s*([^#=]+)=(.*)$/);
  if (m) local[m[1].trim()] = m[2].trim();
}

const contexts = ["production", "deploy-preview", "branch-deploy"];

for (const key of VARS) {
  const value = local[key];
  if (!value) {
    console.log(`Skip ${key}`);
    continue;
  }
  for (const ctx of contexts) {
    execSync(`npx.cmd -y netlify-cli@latest env:set "${key}" "${value.replace(/"/g, '\\"')}" --context ${ctx} --force`, {
      stdio: "inherit",
      cwd: join(__dirname, ".."),
      shell: true,
    });
  }
  console.log(`Set ${key}`);
}

console.log("\nTriggering production deploy...");
execSync("npx.cmd -y netlify-cli@latest deploy --prod --build", {
  stdio: "inherit",
  cwd: join(__dirname, ".."),
  shell: true,
});