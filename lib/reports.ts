import { supabase, type ReportRow } from "./supabase";
import type { ReportTier } from "./stripe";

const isSupabaseConfigured = () =>
  (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").startsWith("http");

export interface SaveReportParams {
  tier: ReportTier;
  city: string;
  rooms: number;
  marketPrice: number;
  paff: number;
  vRent: number;
  vcost: number;
  vEcon?: number;
  pricePremiumPct: number;
  pir: number;
  hai: number;
  dsti: number;
  uchAnnual: number;
  rentAnnual: number;
  inputsJson: Record<string, unknown>;
  name?: string;
  email?: string;
  phone?: string;
}

export async function createCheckout(
  report: SaveReportParams,
  idempotencyKey: string
): Promise<string> {
  if (!isSupabaseConfigured()) throw new Error("Supabase is not configured");
  const { data, error } = await supabase.functions.invoke("create-checkout", {
    body: { report, idempotencyKey },
  });
  if (error || typeof data?.checkoutUrl !== "string") {
    throw error ?? new Error("Checkout creation failed");
  }
  return data.checkoutUrl;
}

export async function getReportByToken(token: string): Promise<ReportRow | null> {
  const { data, error } = await supabase.rpc("get_paid_report_by_token", { p_token: token });

  if (error || !Array.isArray(data) || !data[0]) return null;
  return data[0] as ReportRow;
}

export async function getReportById(id: string): Promise<ReportRow | null> {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as ReportRow;
}

export async function getUserReports(): Promise<ReportRow[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("user_id", user.id)
    .eq("paid", true)
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data ?? []) as ReportRow[];
}
