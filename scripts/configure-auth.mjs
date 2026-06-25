import { readFileSync } from "fs";

const projectRef = process.argv[2] ?? "ulbfaxhsbbckotcbmslk";
const siteUrl = process.argv[3] ?? "https://resilient-khapse-ecd31c.netlify.app";
const token = process.env.SUPABASE_ACCESS_TOKEN;

if (!token) {
  console.error("Set SUPABASE_ACCESS_TOKEN");
  process.exit(1);
}

const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/config/auth`, {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    site_url: siteUrl,
    uri_allow_list: `${siteUrl}/**,http://localhost:3000/**`,
  }),
});

const text = await res.text();
if (!res.ok) {
  console.error(`Auth config failed (${res.status}):`, text);
  process.exit(1);
}

console.log("Auth URLs updated:", siteUrl);
console.log(text);