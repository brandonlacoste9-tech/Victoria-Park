import { redirect } from "next/navigation";

export type BusinessContext = {
  userId: string;
  email: string;
  businessId: string;
  businessName: string;
  plan: string;
  trialEndsAt: string | null;
  onboardingCompleted: boolean;
  defaultLanguage: string;
};

export async function getBusinessContext(): Promise<BusinessContext | null> {
  // Hardcoded demo context to bypass Supabase so the dashboard works instantly for the pitch
  return {
    userId: "demo-user-123",
    email: "ceo@vicpark.com",
    businessId: "vicpark-demo",
    businessName: "Victoria Park Medispa",
    plan: "concierge",
    trialEndsAt: null,
    onboardingCompleted: true,
    defaultLanguage: "en",
  };
}

export async function requireBusinessContext(): Promise<BusinessContext> {
  const ctx = await getBusinessContext();
  if (!ctx) redirect("/login");
  return ctx;
}

export async function requireOnboardedContext(): Promise<BusinessContext> {
  const ctx = await requireBusinessContext();
  if (!ctx.onboardingCompleted) redirect("/onboarding");
  return ctx;
}