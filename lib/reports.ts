import { supabase, type ReportRow } from "./supabase";
import type { ReportTier } from "./stripe";

const isSupabaseConfigured = () =>
  (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").startsWith("http");

function generateToken(): string {
  return Math.random().toString(36).slice(2, 10) +
         Math.random().toString(36).slice(2, 10);
}

export interface SaveReportParams {
  tier: ReportTier;
  city: string;
  rooms: number;
  marketPrice: number;
  paff: number;
  vRent: number;
  vcost: number;
  pricePremiumPct: number;
  pir: number;
  hai: number;
  dsti: number;
  uchAnnual: number;
  rentAnnual: number;
  inputsJson: Record<string, unknown>;
}

export async function saveReport(params: SaveReportParams): Promise<string> {
  // במצב פיתוח ללא Supabase — מחזיר ID מדומה
  if (!isSupabaseConfigured()) {
    return "demo-" + generateToken();
  }

  const { data: { user } } = await supabase.auth.getUser();

  const shareToken = generateToken();

  const { data, error } = await supabase
    .from("reports")
    .insert({
      user_id: user?.id ?? null,
      tier: params.tier,
      city: params.city,
      rooms: params.rooms,
      market_price: params.marketPrice,
      paff: params.paff,
      v_rent: params.vRent,
      v_cost: params.vcost,
      price_premium_pct: params.pricePremiumPct,
      pir: params.pir,
      hai: params.hai,
      dsti: params.dsti,
      uch_annual: params.uchAnnual,
      rent_annual: params.rentAnnual,
      inputs_json: params.inputsJson,
      share_token: shareToken,
      paid: false,
      stripe_session_id: null,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id as string;
}

export async function markReportPaid(
  reportId: string,
  stripeSessionId: string
): Promise<void> {
  const { error } = await supabase
    .from("reports")
    .update({ paid: true, stripe_session_id: stripeSessionId })
    .eq("id", reportId);

  if (error) throw error;
}

export async function getReportByToken(token: string): Promise<ReportRow | null> {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("share_token", token)
    .single();

  if (error) return null;
  return data as ReportRow;
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
