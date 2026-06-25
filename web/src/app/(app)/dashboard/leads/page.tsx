import { LeadForm } from "@/components/dashboard/lead-form";
import { LeadsList } from "@/components/dashboard/leads-list";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import { requireOnboardedContext } from "@/lib/auth/get-business-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function LeadsPage() {
  const ctx = await requireOnboardedContext();
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createSupabaseServerClient();

  let leads: Parameters<typeof LeadsList>[0]["leads"] = [];

  if (true) {
    leads = [
      {
        id: "lead_1",
        contact_name: "Isabella Dupont",
        contact_phone: "+15145550198",
        source: "AI Assistant - After Hours Call",
        pipeline_stage: "new",
        notes: "Interested in CoolSculpting Elite for abdomen. Budget is flexible. Requested callback tomorrow morning.",
        captured_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        metadata: { treatment: "CoolSculpting", location_preference: "Westmount" }
      },
      {
        id: "lead_2",
        contact_name: "Sophie Tremblay",
        contact_phone: "+14505550123",
        source: "Website AI Chat",
        pipeline_stage: "contacted",
        notes: "Asking about BBL HERO recovery time. Has an upcoming wedding in 3 months.",
        captured_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
        metadata: { treatment: "BBL HERO", location_preference: "Laval" }
      },
      {
        id: "lead_3",
        contact_name: "Marc-Antoine Leblanc",
        contact_phone: "+18195550876",
        source: "AI Assistant - Missed Call",
        pipeline_stage: "new",
        notes: "Hair loss consultation. Wants to know pricing for PRP treatments.",
        captured_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        metadata: { treatment: "PRP Hair", location_preference: "Gatineau" }
      }
    ] as typeof leads;
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,320px)_1fr] lg:items-start">
        <LeadForm dict={t} />
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold text-[var(--foreground)]">
            {t.dashboard.nav.leads}
          </h1>
          <div className="mt-6">
            <LeadsList dict={t} leads={leads} locale={locale} />
          </div>
        </div>
      </div>
    </div>
  );
}