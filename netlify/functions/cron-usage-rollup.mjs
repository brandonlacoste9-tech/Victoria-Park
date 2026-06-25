/** Daily usage counter refresh — invokes Next.js API route. */
export default async (req) => {
  const { next_run } = await req.json().catch(() => ({}));
  const base = (process.env.URL || process.env.DEPLOY_PRIME_URL || "https://justbookme.ca").replace(
    /\/$/,
    ""
  );
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    console.error("[cron-usage-rollup] CRON_SECRET not set");
    return;
  }

  const res = await fetch(`${base}/api/cron/usage-rollup`, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  const body = await res.text();
  console.log(`[cron-usage-rollup] ${res.status} next_run=${next_run ?? "?"}`);
  if (!res.ok) console.error(body);
};

export const config = {
  schedule: "0 11 * * *",
};