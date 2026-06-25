import { CustomersList } from "@/components/dashboard/customers-list";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import { requireOnboardedContext } from "@/lib/auth/get-business-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function CustomersPage() {
  const _ctx = await requireOnboardedContext();
  const locale = await getLocale();
  const t = getDictionary(locale);
  const _supabase = await createSupabaseServerClient();

  let customers: Parameters<typeof CustomersList>[0]["customers"] = [];

  if (true) {
    customers = [
      {
        id: "cust_1",
        full_name: "Sarah Jenkins",
        phone: "+15145550198",
        email: "sarah.jenkins@example.com",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString() // 30 days ago
      },
      {
        id: "cust_2",
        full_name: "Michael Tremblay",
        phone: "+14505550123",
        email: "michael.t@example.com",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString() // 12 days ago
      },
      {
        id: "cust_3",
        full_name: "Emilie Bouchard",
        phone: "+15145550999",
        email: "emilie.b@example.com",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() // 5 days ago
      },
      {
        id: "cust_4",
        full_name: "Jessica Côté",
        phone: "+18195550444",
        email: "jess.cote@example.com",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() // 2 days ago
      }
    ] as typeof customers;
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <h1 className="font-display text-2xl font-semibold text-[var(--foreground)]">
        {t.dashboard.nav.customers}
      </h1>
      <p className="mt-1 text-sm text-[var(--muted-fg)]">{t.dashboard.customers.subtitle}</p>
      <div className="mt-6">
        <CustomersList dict={t} customers={customers} locale={locale} />
      </div>
    </div>
  );
}