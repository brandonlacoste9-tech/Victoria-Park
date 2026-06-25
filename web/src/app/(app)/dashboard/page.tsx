import { CallsList } from "@/components/dashboard/calls-list";
import { OutboundSmsBanner } from "@/components/dashboard/outbound-sms-banner";
import { SetupChecklistCard } from "@/components/dashboard/setup-checklist-card";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import { requireOnboardedContext } from "@/lib/auth/get-business-context";
import { getSetupChecklist } from "@/lib/onboarding/setup-checklist";
import { getOutboundSmsStatus } from "@/lib/usage/outbound-sms-status";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Calendar, DollarSign, Phone, TrendingUp, UserX } from "lucide-react";

export default async function DashboardPage() {
  const ctx = await requireOnboardedContext();
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createSupabaseServerClient();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  let bookingsToday = 0;
  let activeLeads = 0;
  let voiceCallsToday = 0;
  let aiBookingsToday = 0;
  let recoveredRevenueCents = 0;
  let noShowsToday = 0;
  let calls: Parameters<typeof CallsList>[0]["calls"] = [];
  let checklist = null as Awaited<ReturnType<typeof getSetupChecklist>> | null;
  let bookUrl: string | null = null;
  const smsStatus = await getOutboundSmsStatus(ctx.businessId);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.URL?.trim() ||
    "https://justbookme.ca";

  if (true) {
    checklist = {
      id: "fake", business_id: "vicpark", phone_number: "+18005550199",
      business_profile_completed: true, service_menu_completed: true, working_hours_completed: true,
      vapi_credentials_completed: true, subscription_active: true, vapi_phone_id: "fake", provider: "twilio"
    };

    bookUrl = `${siteUrl.replace(/\/$/, "")}/book/vicpark`;
    
    // Fake impressive stats for Victoria Park pitch
    bookingsToday = 24;
    activeLeads = 12;
    voiceCallsToday = 58;
    aiBookingsToday = 19;
    recoveredRevenueCents = 1450000; // $14,500
    noShowsToday = 0;
    
    // Create some fake recent calls
    calls = [
      {
        id: "call_1",
        created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        channel: "voice",
        from_number: "+15145550198",
        status: "completed",
        started_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        ended_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        duration_seconds: 180,
        recording_url: null,
        outcome: "booked",
        summary: "Caller booked a CoolSculpting consultation in Westmount for Thursday at 2 PM.",
        transcript: "AI: Welcome to Victoria Park Medispa... Caller: Hi, I'd like to book CoolSculpting.",
        user_sentiment: "Positive",
        customer_id: "cust_1",
        recovered_revenue_cents: 80000,
        customers: { full_name: "Sarah Jenkins", phone: "+15145550198", email: "sarah@example.com" }
      } as any,
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
      } as any
    ];
  }

  const recoveredLabel =
    recoveredRevenueCents > 0
      ? (recoveredRevenueCents / 100).toLocaleString(locale === "fr" ? "fr-CA" : "en-CA", {
          style: "currency",
          currency: "CAD",
          maximumFractionDigits: 0,
        })
      : "$0";

  const stats = [
    {
      label: t.dashboard.stats.bookingsToday,
      value: String(bookingsToday),
      icon: Calendar,
      accent: "text-[var(--primary)]",
      bg: "bg-[var(--primary-light)]",
    },
    {
      label: t.dashboard.stats.voiceCallsToday,
      value: String(voiceCallsToday),
      icon: Phone,
      accent: "text-[var(--accent-hover)]",
      bg: "bg-[var(--accent-light)]",
    },
    {
      label: t.dashboard.stats.recoveredCalls,
      value: String(aiBookingsToday),
      icon: TrendingUp,
      accent: "text-[var(--teal)]",
      bg: "bg-[var(--teal-light)]",
    },
    {
      label: t.dashboard.stats.recoveredRevenue,
      value: recoveredLabel,
      icon: DollarSign,
      accent: "text-[var(--primary)]",
      bg: "bg-[var(--primary-light)]",
    },
    {
      label: t.dashboard.stats.noShowsToday,
      value: String(noShowsToday),
      icon: UserX,
      accent: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: t.dashboard.stats.activeLeads,
      value: String(activeLeads),
      icon: TrendingUp,
      accent: "text-[var(--muted-fg)]",
      bg: "bg-[var(--muted)]",
    },
  ];

  const trialLabel = ctx.trialEndsAt
    ? new Date(ctx.trialEndsAt).toLocaleDateString(locale === "fr" ? "fr-CA" : "en-CA")
    : "—";

  return (
    <div className="mx-auto w-full max-w-4xl">
      <h1 className="font-display text-2xl font-semibold text-[var(--foreground)]">
        {t.dashboard.title}
      </h1>
      <p className="mt-1 text-sm text-[var(--muted-fg)]">{t.dashboard.subtitle}</p>

      <OutboundSmsBanner dict={t} status={smsStatus} />

      {checklist && (
        <SetupChecklistCard dict={t} checklist={checklist} bookUrl={bookUrl} />
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card min-w-0 p-5">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}
                >
                  <Icon className={`h-5 w-5 ${stat.accent}`} />
                </div>
                <span className="font-display text-2xl font-bold text-[var(--foreground)]">
                  {stat.value}
                </span>
              </div>
              <p className="mt-3 break-words text-sm text-[var(--muted-fg)]">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="card mt-8 p-6">
        <h2 className="font-semibold text-[var(--foreground)]">{t.dashboard.calls.title}</h2>
        <div className="mt-4">
          <CallsList dict={t} calls={calls} locale={locale} />
        </div>
      </div>

      <div className="card mt-8 p-6">
        <h2 className="font-semibold text-[var(--foreground)]">{t.dashboard.trial.title}</h2>
        <p className="mt-2 text-sm text-[var(--muted-fg)]">
          {t.dashboard.trial.plan}: <span className="font-medium capitalize">{ctx.plan}</span>
        </p>
        <p className="mt-1 text-sm text-[var(--muted-fg)]">
          {t.dashboard.trial.ends}: {trialLabel}
        </p>
      </div>
    </div>
  );
}