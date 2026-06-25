import { CallsList } from "@/components/dashboard/calls-list";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import { requireOnboardedContext } from "@/lib/auth/get-business-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function CallsPage() {
  const ctx = await requireOnboardedContext();
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createSupabaseServerClient();

  let calls: Parameters<typeof CallsList>[0]["calls"] = [];

  if (true) {
    calls = [
      {
        id: "call_1",
        created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        channel: "voice",
        from_number: "+15145550198",
        status: "completed",
        started_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        ended_at: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
        duration_seconds: 145,
        recording_url: null,
        outcome: "booked",
        summary: "Patient called to book a Morpheus8 treatment. Confirmed appointment for next Tuesday at 2 PM.",
        transcript: "AI: Welcome to Victoria Park Medispa... Caller: Hi, I'd like to book Morpheus8.",
        user_sentiment: "Positive",
        customer_id: "cust_1",
        recovered_revenue_cents: 80000,
        customers: { full_name: "Sarah Jenkins", phone: "+15145550198", email: "sarah@example.com" }
      } as unknown as typeof calls[0],
      {
        id: "call_2",
        created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        channel: "voice",
        from_number: "+14505550123",
        status: "completed",
        started_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        ended_at: new Date(Date.now() - 1000 * 60 * 43).toISOString(),
        duration_seconds: 120,
        recording_url: null,
        outcome: "booked",
        summary: "Caller inquired about Botox pricing and booked an appointment in Laval.",
        transcript: "AI: Welcome to Victoria Park Medispa... Caller: How much is Botox?",
        user_sentiment: "Neutral",
        customer_id: "cust_2",
        recovered_revenue_cents: 40000,
        customers: { full_name: "Michael Tremblay", phone: "+14505550123", email: "michael@example.com" }
      } as unknown as typeof calls[0]
    ];
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <h1 className="font-display text-2xl font-semibold text-[var(--foreground)]">
        {t.dashboard.nav.calls}
      </h1>
      <p className="mt-1 text-sm text-[var(--muted-fg)]">{t.dashboard.calls.historySubtitle}</p>
      <div className="mt-6">
        <CallsList dict={t} calls={calls} locale={locale} />
      </div>
    </div>
  );
}