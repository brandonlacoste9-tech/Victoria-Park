import type { PlanId } from "@/lib/stripe/plans";

export type UsageMetric = "bookings" | "sms" | "voiceMinutes" | "staff";

export type PlanLimits = {
  bookings: number | null;
  sms: number | null;
  voiceMinutes: number | null;
  staff: number | null;
};

const LIMITS: Record<PlanId | "trial", PlanLimits> = {
  trial: { bookings: null, sms: 1000, voiceMinutes: 500, staff: 5 },
  starter: { bookings: 100, sms: 200, voiceMinutes: 100, staff: 1 },
  pro: { bookings: null, sms: 1000, voiceMinutes: 500, staff: 5 },
  premium: { bookings: null, sms: 5000, voiceMinutes: 2500, staff: null },
};

export function getPlanLimits(plan: string): PlanLimits {
  if (plan === "starter" || plan === "pro" || plan === "premium") {
    return LIMITS[plan];
  }
  return LIMITS.trial;
}

export function usagePercent(used: number, limit: number | null): number | null {
  if (limit === null || limit <= 0) return null;
  return Math.min(100, Math.round((used / limit) * 100));
}